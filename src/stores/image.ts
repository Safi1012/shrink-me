import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useImageStore = defineStore('image', () => {
  const images = ref<File[]>([])
  const compressedImages = ref<File[]>([])

  const setImages = (files: FileList) => {
    images.value = Object.keys(files)
      .map((key) => files[key])
      .filter((file) => file.type.match(/image.*(png|jpg|jpeg|webp|svg)/))
  }

  return { images, compressedImages, setImages }
})
