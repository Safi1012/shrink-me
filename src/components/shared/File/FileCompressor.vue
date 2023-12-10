<script setup lang="ts">
import { computed, onMounted, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useFileStore } from '@/stores/file'
import { useProgressStore } from '@/stores/progress'
import FileArea from './FileArea.vue'
import { compressPDF, compressRasterImage, compressVectorImage } from '@/utils/compression'

const { files, compressedFiles } = storeToRefs(useFileStore())
const { incrementStage, setPercentage } = useProgressStore()

watchEffect(() => {
  const progressInPercent = compressedFiles.value.length / files.value.length // e.g. 0.33
  setPercentage(progressInPercent)
})

const alreadyCompressed = computed(() => {
  return compressedFiles.value.length
})

const totalImages = computed(() => {
  return files.value.length
})

const shrinkImages = async () => {
  const pdfsToCompress: File[] = files.value.filter((file) => file.type === 'application/pdf')
  const imagesToCompress: File[] = files.value.filter((file) => file.type.includes('image'))

  for (const pdf of pdfsToCompress) {
    await compressPDF(pdf, compressedFiles)
  }

  const imageCompressionTasks = imagesToCompress.map(async (image) => {
    if (image.type === 'image/svg+xml') {
      return compressVectorImage(image, compressedFiles)
    }
    if (image.type === 'image/jpeg' || image.type === 'image/png' || image.type === 'image/webp') {
      return compressRasterImage(image, compressedFiles)
    }
  })

  try {
    await Promise.all(imageCompressionTasks)
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
    <h1 class="mb-5 text-center text-2xl font-light text-black md:mb-10 md:mt-0 md:text-5xl">
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
