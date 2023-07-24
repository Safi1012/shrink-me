<script setup lang="ts">
import { useImageStore } from '@/stores/image'
import { useProgressStore } from '@/stores/progress'
import { ref } from 'vue'
import FileArea from './FileArea.vue'

const { setImages } = useImageStore()
const { incrementStage } = useProgressStore()
const isDragAreaActive = ref(false)

const onDragEnter = () => {
  isDragAreaActive.value = true
}

const onDragLeave = () => {
  isDragAreaActive.value = false
}

const onDrop = (e: DragEvent) => {
  const files = e.dataTransfer?.files

  if (files) {
    setImages(files)
  }
  isDragAreaActive.value = false
  navigateToNextStage()
}

const onInputChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files

  if (files) {
    setImages(files)
  }
  navigateToNextStage()
}

const navigateToNextStage = () => {
  incrementStage()
}
</script>

<template>
  <div>
    <h1 class="mb-5 text-center text-2xl font-light text-black md:mb-10 md:mt-0 md:text-5xl">
      Shrink your images
    </h1>

    <FileArea>
      <form
        xmlns="http://www.w3.org/1999/xhtml"
        class="form-area flex h-full w-full flex-col items-center justify-center"
        @dragenter.prevent="onDragEnter"
        @dragover.prevent
        @drop.prevent="(e) => onDrop"
        @dragleave.prevent="onDragLeave"
      >
        <input
          id="file"
          class="absolute z-[-1] h-full w-full cursor-pointer overflow-hidden opacity-0"
          type="file"
          name="files[]"
          multiple
          accept=".png,.jpg,.jpeg,.webp,.svg"
          @change="(e) => onInputChange"
        />
        <label
          class="area z-[-1] flex h-full w-full flex-col items-center justify-center hover:cursor-pointer"
          for="file"
        >
          <img
            v-if="isDragAreaActive"
            for="file"
            alt="Files icon"
            src="@/assets/icons/files-fill.svg"
            class="h-2/5 w-auto"
          />
          <img
            v-else
            for="file"
            alt="Files icon"
            src="@/assets/icons/files.svg"
            class="h-2/5 w-auto"
          />

          <span class="area-text mt-3 text-center leading-[1.7em]">
            <span class="hidden sm:block">Drag and Drop<br /></span>
            <strong>JPG</strong>, <strong>PNG</strong>, <strong>WEBP</strong> & <strong>SVG</strong>
          </span>
        </label>
      </form>
    </FileArea>

    <form
      class="form-select relative m-auto mt-[-2em] block h-[2.5em] w-[6em] rounded-[3px] bg-shrink-me-primary text-base text-white shadow-[0_6px_30px_0_#adadadfa] transition-shadow duration-[0.3s] ease-[ease-in-out] hover:shadow-[0_2px_10px_0_#adadadfa]"
    >
      <input
        id="fileButton"
        class="absolute z-[-1] h-[0.001em] w-[0.001em] overflow-hidden opacity-0"
        type="file"
        name="files[]"
        multiple
        accept=".png,.jpg,.jpeg,.webp,.svg"
        @change="onInputChange"
      />
      <label
        for="fileButton"
        class="flex h-full items-center justify-center font-semibold hover:cursor-pointer"
      >
        <span class="text-white">Select</span>
      </label>
    </form>
  </div>
</template>

<style scoped>
input:focus + label {
  outline: 1px dotted #000;
  outline: -webkit-focus-ring-color auto 5px;
}

strong {
  color: #48bfcd;
}

svg {
  margin-bottom: 1em;
}
</style>
