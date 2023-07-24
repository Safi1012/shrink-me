import { defineStore } from 'pinia'
import { ref } from 'vue'

enum Stage {
  Select = 0,
  Compress = 1,
  Export = 2
}

export const useProgressStore = defineStore('progress', () => {
  const stage = ref<Stage>(Stage.Select)
  const percentage = ref(0)
  const width = ref(0)
  const height = ref(0)
  const circumference = ref(0)

  const incrementStage = () => {
    stage.value = (stage.value + 1) % 3
  }

  const setDimensions = (w: number, h: number) => {
    width.value = w
    height.value = h
    circumference.value = w * 2 + h * 2
  }

  const setPercentage = (newPercentage: number) => {
    percentage.value = newPercentage
  }

  return {
    percentage,
    stage,
    width,
    height,
    circumference,
    incrementStage,
    setDimensions,
    setPercentage
  }
})
