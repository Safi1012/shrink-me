<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useFileStore } from '@/stores/file'
import { storeToRefs } from 'pinia'
import JSZip from 'jszip'
import { useProgressStore } from '@/stores/progress'
import { addToCounter } from '@/counter'
import { uniqueName } from '@/utils/files'
import FileArea from './FileArea.vue'

const { files, compressedFiles } = storeToRefs(useFileStore())
const { resetProgress } = useProgressStore()
const { resetFiles } = useFileStore()

const download = ref<HTMLAnchorElement | null>(null)
const url = ref('')
const userPressedSave = ref(false)
const totalOriginalSizeInBytes = ref(0)
const totalCompressedSizeInBytes = ref(0)
const totalSavedBytes = ref(0)

const totalSavedSize = computed(() => {
  const savedKb = totalSavedBytes.value / 1024

  if (savedKb >= 1024) {
    return `${(savedKb / 1024).toFixed(1)} MB`
  }
  return `${savedKb.toFixed(1)} KB`
})

const totalSavedPercentage = computed(() => {
  return Math.floor((totalSavedBytes.value / totalOriginalSizeInBytes.value) * 100)
})

const resultTitle = computed(() => {
  return totalSavedBytes.value === 0 ? 'Done!' : 'Success!'
})

const resultSubtitle = computed(() => {
  return files.value.length === 1
    ? 'File was already optimized 🤓'
    : 'Files were already optimized 🤓'
})

const exportFiles = () => {
  if (totalSavedBytes.value === 0) return

  const zip = new JSZip()
  const names = new Set<string>()

  compressedFiles.value.forEach((file) => {
    zip.file(uniqueName(file.name, names), file)
  })

  zip.generateAsync({ type: 'blob' }).then((content) => {
    let downloadUrl
    let fileName

    if (compressedFiles.value.length === 1) {
      downloadUrl = window.URL.createObjectURL(compressedFiles.value[0])
      fileName = compressedFiles.value[0].name
    } else {
      downloadUrl = window.URL.createObjectURL(content)
      fileName = 'CompressedFiles_ShrinkMe.zip'
    }

    if (download.value) {
      download.value.href = downloadUrl
      download.value.target = '_blank'
      download.value.download = fileName
    }

    url.value = downloadUrl
  })
}

const updateCounter = () => {
  addToCounter({
    compressedImages: compressedFiles.value.length,
    savedBytes: Math.max(0, totalSavedBytes.value)
  })
}

const resetFileManagerComponentData = () => {
  resetProgress()
  resetFiles()
}

const isDownloadAttributeSupported = () => {
  const safari = (window as any).safari
  const anchorElement = document.createElement('a')

  return typeof anchorElement.download !== 'undefined' && !safari
}

const downloadFiles = () => {
  const link = document.createElement('a')
  userPressedSave.value = true

  link.download =
    compressedFiles.value.length === 1
      ? compressedFiles.value[0].name
      : 'CompressedFiles_ShrinkMe.zip'
  link.href = url.value

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const handleDownloadClick = () => {
  userPressedSave.value = true
  exportFiles()
}

const getMobileOperatingSystem = () => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return 'Windows Phone'
  }

  if (/android/i.test(userAgent)) {
    return 'Android'
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return 'iOS'
  }

  return 'unknown'
}

const shareFiles = () => {
  const files = compressedFiles.value.map(
    (blob) => new File([blob], blob.name, { type: blob.type })
  )

  if (navigator.canShare && navigator.canShare({ files })) {
    navigator
      .share({
        files,
        title: 'Compressed Files',
        text: 'Your compressed Files from Shrink Me'
      })
      .then(() => console.log('Share was successful.'))
      .catch((error) => console.log('Sharing failed', error))
  } else {
    console.log("Your system doesn't support sharing files.")
  }
}

onMounted(() => {
  totalOriginalSizeInBytes.value = files.value.reduce((acc, curr) => acc + curr.size, 0)
  totalCompressedSizeInBytes.value = compressedFiles.value.reduce((acc, curr) => acc + curr.size, 0)
  totalSavedBytes.value = totalOriginalSizeInBytes.value - totalCompressedSizeInBytes.value

  updateCounter()
  exportFiles()
})
</script>

<template>
  <div class="outer flex flex-col items-end">
    <div class="container flex flex-col content-center justify-center">
      <h1 class="mb-5 text-center text-2xl font-light text-black md:mt-0 md:mb-10 md:text-5xl">
        {{ resultTitle }}
      </h1>

      <FileArea>
        <div class="content flex h-full flex-col items-center justify-center">
          <img for="file" alt="Files icon" src="@/assets/icons/files.svg" class="h-[40%] w-auto" />
          <span v-if="totalSavedBytes === 0" class="mt-3">{{ resultSubtitle }}</span>
          <span v-else class="mt-3"
            >You saved
            <strong class="font-semibold text-shrink-me-primary">{{ totalSavedSize }}</strong> (-{{
              totalSavedPercentage
            }}%) &nbsp;🎉</span
          >
        </div>
      </FileArea>

      <a
        v-if="totalSavedBytes === 0"
        id="myButton"
        class="relative m-auto mt-[-2em] inline-block cursor-pointer rounded-[3px] border-0 bg-shrink-me-primary px-[0.75em] py-[0.6em] text-base tracking-wider text-white shadow-[0_6px_30px_0_#adadadfa] transition-shadow duration-300 ease-[ease-in-out] hover:cursor-pointer hover:shadow-[0_2px_10px_0_#adadadfa]"
        @click="resetFileManagerComponentData"
        >Select New</a
      >
      <a
        v-else-if="isDownloadAttributeSupported()"
        id="myButton"
        ref="download"
        class="relative m-auto mt-[-2em] inline-block cursor-pointer rounded-[3px] border-0 bg-shrink-me-primary px-[0.75em] py-[0.6em] text-base tracking-wider text-white shadow-[0_6px_30px_0_#adadadfa] transition-shadow duration-300 ease-[ease-in-out] hover:cursor-pointer hover:shadow-[0_2px_10px_0_#adadadfa]"
        href="#"
        @click="handleDownloadClick"
      >
        SAVE
      </a>
      <!-- iOS Safari fallback, IE -->
      <button v-else ref="download" class="relative" type="submit" @click="downloadFiles">
        SAVE
      </button>

      <button
        v-if="getMobileOperatingSystem() === 'Android'"
        class="retry share relative z-2 m-auto mt-[-2.7em] mr-auto ml-[-1.25em] flex h-[2.7em] w-[2.7em] cursor-pointer items-center justify-center rounded-[3px] border-0 bg-shrink-me-primary p-0 px-[0.75em] py-[0.6em] text-base tracking-wider text-white shadow-[0_6px_30px_0_#c7c7c7fa] transition-shadow duration-300 ease-[ease-in-out] hover:cursor-pointer hover:shadow-[0_2px_10px_0_#adadadfa]"
        @click="shareFiles"
      >
        <img
          for="file"
          alt="Files icon more"
          src="@/assets/icons/share.svg"
          class="icon-share my-0 mr-[0.125em] ml-0 h-[55%] w-[55%]"
        />
      </button>
    </div>

    <button
      v-if="userPressedSave"
      class="retry z-2 m-auto mt-[-2.7em] mr-[-1.25em] flex h-[2.7em] w-[2.7em] cursor-pointer items-center justify-center rounded-[50%] border-0 bg-shrink-me-primary p-0 px-[0.75em] py-[0.6em] text-base tracking-wider text-white shadow-[0_6px_30px_0_#c7c7c7fa] transition-shadow duration-300 ease-[ease-in-out] hover:cursor-pointer hover:shadow-[0_2px_10px_0_#adadadfa]"
      @click="resetFileManagerComponentData"
    >
      <img
        for="file"
        alt="Files icon more"
        src="@/assets/icons/more.svg"
        class="icon-retry m-0 h-8 w-8 max-w-none"
      />
    </button>
  </div>
</template>

<style scoped>
svg {
  margin-bottom: 1em;
}

.retry {
  animation-delay: 1.5s;
  animation-fill-mode: forwards;
}
</style>
