<script setup lang="ts">
import { ref } from 'vue'

type ImageType = 'compressed' | 'original'
interface HeadlineSizes {
  original: {
    [value: number]: string
  }
  compressed: {
    [value: number]: string
  }
}

const props = defineProps<{
  imageType: ImageType
  headline: string
}>()

const imageHeadline = ref('')
const defaultImage = `src/assets/images/${props.imageType}/wave_270w.jpg`
const imageSizes = [270, 480, 540, 640, 700, 810, 960, 1050, 1280]
const imageSizeHeadlines: HeadlineSizes = {
  original: {
    270: '64 Kb',
    350: '98 Kb',
    480: '176 Kb',
    540: '228 Kb',
    640: '295 Kb',
    700: '361 Kb',
    810: '492 Kb',
    960: '701 Kb',
    1050: '819 Kb',
    1280: '1,149 Kb'
  },
  compressed: {
    270: '8 Kb \u200B \u200B(-87%)',
    350: '12 Kb \u200B \u200B(-87%)',
    480: '21 Kb \u200B \u200B(-88%)',
    540: '27 Kb \u200B \u200B(-88%)',
    640: '33 Kb \u200B \u200B(-88%)',
    700: '41 Kb \u200B \u200B(-88%)',
    810: '54 Kb \u200B \u200B(-89%)',
    960: '76 Kb \u200B \u200B(-89%)',
    1050: '86 Kb \u200B \u200B(-89%)',
    1280: '119 Kb \u200B \u200B(-89%)'
  }
}

const extractNumberFromURL = (input: string): number | null => {
  const match = input.match(/_(\d+)w\.jpg$/)
  return match ? parseInt(match[1], 10) : null
}

const imgOnload = (e: Event) => {
  const loadedSize = extractNumberFromURL((e.target as HTMLImageElement).currentSrc)
  imageHeadline.value = loadedSize !== null ? imageSizeHeadlines[props.imageType][loadedSize] : ''
}

const generateSrcset = () => {
  return imageSizes
    .map((size) => {
      const src = `src/assets/images/${props.imageType}/wave_${size}w.jpg`
      return `${src} ${size}w`
    })
    .join(', ')
}
</script>

<template>
  <div
    class="grid auto-rows-[minmax(0.1em,auto)] grid-cols-[repeat(12,1fr)] justify-items-stretch gap-[0.5em_0.5em]"
  >
    <strong class="z-[1] col-[1_/_4] row-[1] ml-[1em] mt-[1em] text-white">{{
      props.headline
    }}</strong>
    <p class="z-[1] col-[5_/_12] row-[1] m-0 mt-[1em] text-right text-white md:mr-[-1.5em]">
      {{ imageHeadline }}
    </p>

    <img
      class="col-[-1_/_1] row-[-1_/_1] h-auto w-full rounded-[0.375em] shadow-[0_4px_24px_2px_hsla(0,0%,0%,0.15)]"
      :src="defaultImage"
      :srcset="generateSrcset()"
      alt="Compressed Demo Image"
      loading="lazy"
      decoding="async"
      @load="imgOnload"
    />
  </div>
</template>
