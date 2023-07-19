import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useImageStore = defineStore('image', () => {
  const images = ref<File[]>()
  const compressedImages = ref<HTMLImageElement[]>()

  return { images, compressedImages }
})
