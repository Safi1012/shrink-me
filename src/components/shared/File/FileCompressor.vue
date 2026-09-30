<script setup lang="ts">
import { computed, onMounted, reactive, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useFileStore } from '@/stores/file'
import { useProgressStore } from '@/stores/progress'
import FileArea from './FileArea.vue'
import { compressPDF, compressRasterImage, compressVectorImage } from '@/utils/compression'

const { files, compressedFiles } = storeToRefs(useFileStore())
const { incrementStage, setPercentage } = useProgressStore()

// How far Ghostscript is through each PDF still being compressed (0–1), so a long PDF
// moves the progress along page by page instead of jumping once it is done
const pdfProgress = reactive(new Map<File, number>())

watchEffect(() => {
  let partiallyCompressed = 0
  for (const progress of pdfProgress.values()) partiallyCompressed += progress

  const progressInPercent =
    (compressedFiles.value.length + partiallyCompressed) / files.value.length // e.g. 0.33
  setPercentage(progressInPercent)
})

const alreadyCompressed = computed(() => {
  return compressedFiles.value.length
})

const totalImages = computed(() => {
  return files.value.length
})

const shrinkImages = async () => {
  // PDFs are queued in the Ghostscript worker, so images compress alongside them
  const compressionTasks = files.value.map(async (file) => {
    if (file.type === 'application/pdf') {
      // A finished PDF (progress 1) is counted through compressedFiles instead
      return compressPDF(file, compressedFiles, (progress) =>
        progress < 1 ? pdfProgress.set(file, progress) : pdfProgress.delete(file)
      )
    }
    if (file.type === 'image/svg+xml') {
      return compressVectorImage(file, compressedFiles)
    }
    if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp') {
      return compressRasterImage(file, compressedFiles)
    }
  })

  try {
    await Promise.all(compressionTasks)
    incrementStage()
  } catch (err) {
    console.log(err)
  }
}

onMounted(() => {
  shrinkImages()
})
</script>

<template>
  <div>
    <h1 class="mb-5 text-center text-2xl font-light text-black md:mt-0 md:mb-10 md:text-5xl">
      Shrinking...
    </h1>

    <FileArea>
      <div class="content flex h-full flex-col items-center justify-center">
        <img for="file" alt="Files icon" src="@/assets/icons/files.svg" class="h-2/5 w-auto" />
        <span class="mt-3">
          Image: &nbsp;<strong class="text-shrink-me-primary">{{ alreadyCompressed }}</strong> /
          <strong class="text-shrink-me-primary">{{ totalImages }}</strong>
        </span>
      </div>
    </FileArea>
  </div>
</template>

<style scoped>
svg {
  margin-bottom: 1em;
}
</style>
