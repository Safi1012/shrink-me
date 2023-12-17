<template>
  <div v-if="compressedImages || savedBytes.value">
    <p class="inline-flex flex-row items-end justify-center text-[#9b9b9b]">
      Shrink Me compressed
      <IOdometer
        :value="compressedImages"
        class="rgba(#48bfcd, 0.5) mx-2 text-3xl font-normal leading-[0.8em] text-[rgba(72,191,205,0.5)]"
      ></IOdometer>
      files
    </p>

    <p
      v-if="innerWidth >= 992"
      class="inline-flex flex-row items-end justify-center text-[#9b9b9b]"
    >
      &nbsp;and saved
      <IOdometer
        :value="savedBytes.value"
        format="( ddd),dd"
        class="mx-2 text-3xl font-normal leading-[0.8em] text-[rgba(72,191,205,0.5)]"
      />
      {{ savedBytes.symbol }}
      of storage
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDatabase, onValue, ref as firebaseRef } from 'firebase/database'
import IOdometer from 'vue3-odometer'
import 'odometer/themes/odometer-theme-default.css'
import { filesize } from 'filesize'

defineProps<{ innerWidth: number }>()

const compressedImages = ref(0)
const savedBytes = ref({ value: 0, symbol: '' })

onMounted(() => {
  const counterRef = firebaseRef(getDatabase(), '/')

  onValue(counterRef, (snapshot) => {
    const data = snapshot.val()
    const file = filesize(data.savedBytes, { round: 2, output: 'object' })

    compressedImages.value = data.compressedImages
    savedBytes.value = {
      symbol: file.symbol,
      value: Number(file.value)
    }
  })
})
</script>

<style scoped>
.odometer.odometer-theme-default {
  line-height: 0.9em;
}
</style>
