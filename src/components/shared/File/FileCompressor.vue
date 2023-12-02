<script setup lang="ts">
import { computed, onMounted, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useFileStore } from '@/stores/file'
import Compressor from 'compressorjs'
import { useProgressStore } from '@/stores/progress'
import FileArea from './FileArea.vue'
import compressSVGs from '@/utils/svgCompressor'
import { ghostScriptToPDF } from '@/ghostscript/background'

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

const loadPDFData = (response: { pdfDataURL: string; url: string }, filename: string) => {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', response.pdfDataURL)
    xhr.responseType = 'arraybuffer'
    xhr.onload = function () {
      window.URL.revokeObjectURL(response.pdfDataURL)
      const blob = new Blob([xhr.response], { type: 'application/pdf' })
      const pdf = new File([blob], filename, { type: blob.type })

      resolve(pdf)
    }
    xhr.send()
  })
}

const shrinkImages = async () => {
  const pdfsToCompress: File[] = files.value.filter((file) => file.type === 'application/pdf')
  const imagesToCompress: File[] = files.value.filter((file) => file.type.includes('image'))

  for (const pdf of pdfsToCompress) {
    const url = window.URL.createObjectURL(pdf)
    const dataObject = { psDataURL: url, fileName: pdf.name }

    await new Promise((resolve) => {
      ghostScriptToPDF(
        dataObject,
        (element) => {
          loadPDFData(element, pdf.name).then((pdf) => {
            compressedFiles.value.push(pdf as File)
            resolve(pdf)
          })
        },
        (...args) => console.log('Progress:', JSON.stringify(args)),
        (element) => {
          console.log('Status Update:', JSON.stringify(element))
        }
      )
    })
  }

  const imageCompressionTasks = imagesToCompress.map(async (image) => {
    return new Promise<File>((resolve, reject) => {
      if (image.name.includes('.svg') && image.type === 'image/svg+xml') {
        compressSVGs(image)
          .then((result) => {
            compressedFiles.value.push(result as File)
            resolve(result as File)
          })
          .catch((err) => {
            console.log(err)
            reject(err)
          })
      }

      if (
        image.name.includes('.png') ||
        image.name.includes('.jpg') ||
        image.name.includes('.jpeg') ||
        image.name.includes('.webp')
      ) {
        new Compressor(image, {
          quality: 0.6,
          success(result) {
            compressedFiles.value.push(result as File)
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
