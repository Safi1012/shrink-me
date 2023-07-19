import { defineStore } from 'pinia'
import { ref } from 'vue'

enum Stage {
  Select = 0,
  Compress = 1,
  Export = 2
}

export const useProgressStore = defineStore('progress', () => {
  const percentage = ref(0)
  const stage = ref<Stage>(Stage.Select)
  const width = ref(0)
  const height = ref(0)
  const circumference = ref(0)

  return { percentage, stage, width, height, circumference }
})
