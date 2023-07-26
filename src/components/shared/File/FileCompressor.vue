<script setup lang="ts">
import { computed, onMounted, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useImageStore } from '@/stores/image'
import Compressor from 'compressorjs'
import { useProgressStore } from '@/stores/progress'
import FileArea from './FileArea.vue'
import compressSVGs from '@/utils/svgCompressor'

const { images, compressedImages } = storeToRefs(useImageStore())
const { incrementStage, setPercentage } = useProgressStore()

watchEffect(() => {
  const progressInPercent = compressedImages.value.length / images.value.length // e.g. 0.33
  setPercentage(progressInPercent)
})

const alreadyCompressed = computed(() => {
  return compressedImages.value.length
})

const totalImages = computed(() => {
  return images.value.length
})

const shrinkImages = () => {
  const imageCompressionTasks = images.value.map(async (image) => {
    return new Promise<File>((resolve, reject) => {
      if (image.name.includes('.svg') && image.type === 'image/svg+xml') {
        compressSVGs(image)
          .then((result) => {
            compressedImages.value.push(result as File)
            resolve(result as File)
          })
          .catch((err) => {
            console.log(err)
            reject(err)
          })
      } else {
        new Compressor(image, {
          quality: 0.6,
          success(result) {
            compressedImages.value.push(result as File)
            resolve(result as File)
          },
          error(err) {
            console.log(err.message)
            reject(err)
          }
        })
      }
    })
  })

  Promise.all(imageCompressionTasks)
    .then(() => {
      incrementStage()
    })
    .catch((err) => {
      console.log(err)
    })
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
