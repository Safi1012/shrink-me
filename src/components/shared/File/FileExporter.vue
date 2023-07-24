<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useImageStore } from '@/stores/image'
import { storeToRefs } from 'pinia'
import JSZip from 'jszip'
import FileArea from './FileArea.vue'
import { useProgressStore } from '@/stores/progress'

const { images, compressedImages } = storeToRefs(useImageStore())
const { resetProgress } = useProgressStore()
const { resetImages } = useImageStore()

const fileArea = ref<typeof FileArea | null>(null)
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
  return images.value.length === 1
    ? 'Image was already optimized 🤓'
    : 'Images were already optimized 🤓'
})

const exportImages = () => {
  if (totalSavedBytes.value === 0) return

  const zip = new JSZip()

  compressedImages.value.forEach((image) => {
    zip.file(image.name, image)
  })

  zip.generateAsync({ type: 'blob' }).then((content) => {
    let downloadUrl
    let fileName

    if (compressedImages.value.length === 1) {
      downloadUrl = window.URL.createObjectURL(compressedImages.value[0])
      fileName = compressedImages.value[0].name
    } else {
      downloadUrl = window.URL.createObjectURL(content)
      fileName = 'CompressedImages_ShrinkMe.zip'
    }

    if (download.value) {
      download.value.href = downloadUrl
      download.value.target = '_blank'
      download.value.download = fileName
    }

    url.value = downloadUrl

    // this.displayFireworks()
  })

  // ENABLE WHEN DONE
  // increment values in Firebase
  // fetch("https://shrinkme.app/.netlify/functions/increment", {
  //   method: "POST",
  //   body: JSON.stringify({
  //     compressedImages: compressedImages.value.length,
  //     savedBytes: totalSavedBytes.value,
  //   }),
  //   headers: { "Content-Type": "application/json" },
  // });
}

// const getRandomInt = (min: number, max: number) => {
//       return Math.floor(Math.random() * (max - min + 1)) + min;
//     }

// const displayFireworks = () => {
//   if (!fileArea.value) return

//       const rect = fileArea.value.$el.getBoundingClientRect();
//       const fileAreaPosition = {
//         x_min: rect.left,
//         x_max: rect.left + rect.width,
//         y_min: rect.top,
//         y_max: rect.top + rect.height,
//       };
//       const xPos1 = getRandomInt(
//         fileAreaPosition.x_min,
//         fileAreaPosition.x_max
//       );
//       const yPos1 = getRandomInt(
//         fileAreaPosition.y_min,
//         fileAreaPosition.y_max
//       );

//       const xPos2 = getRandomInt(
//         fileAreaPosition.x_min,
//         fileAreaPosition.x_max
//       );
//       const yPos2 = getRandomInt(
//         fileAreaPosition.y_min,
//         fileAreaPosition.y_max
//       );

//       const xPos3 = getRandomInt(
//         fileAreaPosition.x_min,
//         fileAreaPosition.x_max
//       );
//       const yPos3 = getRandomInt(
//         fileAreaPosition.y_min,
//         fileAreaPosition.y_max
//       );

//       setTimeout(() => {
//         this.bus.$emit("displayFireworks", xPos1, yPos1);
//       }, 250);

//       setTimeout(() => {
//         this.bus.$emit("displayFireworks", xPos2, yPos2);
//       }, 500);

//       setTimeout(() => {
//         this.bus.$emit("displayFireworks", xPos3, yPos3);
//       }, 750);
//     }

const resetFileManagerComponentData = () => {
  resetProgress()
  resetImages()
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
    compressedImages.value.length === 1
      ? compressedImages.value[0].name
      : 'CompressedImages_ShrinkMe.zip'
  link.href = url.value

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const handleDownloadClick = () => {
  userPressedSave.value = true
  exportImages()
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

const shareImages = () => {
  const files = compressedImages.value.map(
    (blob) => new File([blob], blob.name, { type: blob.type })
  )

  if (navigator.canShare && navigator.canShare({ files })) {
    navigator
      .share({
        files,
        title: 'Compressed Images',
        text: 'Your compressed Images from Shrink Me'
      })
      .then(() => console.log('Share was successful.'))
      .catch((error) => console.log('Sharing failed', error))
  } else {
    console.log("Your system doesn't support sharing files.")
  }
}

onMounted(() => {
  totalOriginalSizeInBytes.value = images.value.reduce(
    (accumulator, currentValue) => accumulator + currentValue.size,
    0
  )
  totalCompressedSizeInBytes.value = compressedImages.value.reduce(
    (accumulator, currentValue) => accumulator + currentValue.size,
    0
  )
  totalSavedBytes.value = totalOriginalSizeInBytes.value - totalCompressedSizeInBytes.value

  exportImages()
})
</script>

<template>
  <div class="outer">
    <div class="container">
      <h1>{{ resultTitle }}</h1>
      <!-- <Fireworks :bus="bus" /> -->

      <FileArea ref="fileArea">
        <div class="content">
          <icon
            for="file"
            icon="icon-files"
            :original="true"
            height="40%"
            width="auto"
            stroke-dasharray="0"
          />
          <span v-if="totalSavedBytes === 0">{{ resultSubtitle }}</span>
          <span v-else
            >You saved <strong>{{ totalSavedSize }}</strong> (-{{ totalSavedPercentage }}%)
            &nbsp;🎉</span
          >
        </div>
      </FileArea>

      <a v-if="totalSavedBytes === 0" id="myButton" @click="resetFileManagerComponentData"
        >Select New</a
      >
      <a
        v-else-if="isDownloadAttributeSupported()"
        id="myButton"
        ref="download"
        href="#"
        @click="handleDownloadClick"
      >
        SAVE
      </a>
      <!-- iOS Safari fallback, IE -->
      <button v-else ref="download" type="submit" @click="downloadFiles">SAVE</button>

      <button
        v-if="getMobileOperatingSystem() === 'Android'"
        class="retry share"
        @click="shareImages"
      >
        <icon
          class="icon-share"
          icon="icon-share"
          :original="true"
          height="55%"
          width="55%"
          stroke-dasharray="0"
        />
      </button>
    </div>

    <button v-if="userPressedSave" class="retry" @click="resetFileManagerComponentData">
      <icon
        class="icon-retry"
        for="file"
        icon="icon-more"
        :original="true"
        height="80%"
        width="80%"
        stroke-dasharray="0"
      />
    </button>
  </div>
</template>
