import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFileStore = defineStore('file', () => {
  const files = ref<File[]>([])
  const compressedFiles = ref<File[]>([])

  const setFiles = (fileList: FileList) => {
    files.value = Object.keys(fileList)
      .map((key) => fileList[key as any])
      .filter((file) => file.type.match(/image.*(png|jpg|jpeg|webp|svg|pdf)|application\/pdf/))
  }

  const resetFiles = () => {
    files.value = []
    compressedFiles.value = []
  }

  return { files, compressedFiles, setFiles, resetFiles }
})
