<template>
  <div v-if="compressedImages || savedBytes.value">
    <i18n-t
      keypath="home.counter.compressed"
      :plural="compressedImages"
      tag="p"
      scope="global"
      class="inline-flex flex-row items-end justify-center text-[#9b9b9b]"
    >
      <template #count>
        <RollingNumber
          :value="compressedImages"
          :separators="separators"
          class="mx-2 text-3xl font-normal text-[rgba(72,191,205,0.5)]"
        />
      </template>
    </i18n-t>

    <i18n-t
      v-if="innerWidth >= 992"
      keypath="home.counter.saved"
      tag="p"
      scope="global"
      class="ms-[0.3em] inline-flex flex-row items-end justify-center text-[#9b9b9b]"
    >
      <template #amount>
        <RollingNumber
          :value="savedBytes.value"
          :separators="separators"
          class="mx-2 text-3xl font-normal text-[rgba(72,191,205,0.5)]"
        />
      </template>
      <template #unit>{{ savedBytes.symbol }}</template>
    </i18n-t>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import RollingNumber from '@/components/shared/RollingNumber.vue'
import { filesize } from 'filesize'
import { useCounter } from '@/counter'

defineProps<{ innerWidth: number }>()

const { locale } = useI18n()
const totals = useCounter()

const compressedImages = computed(() => totals.value?.compressedImages ?? 0)

const savedBytes = computed(() => {
  if (!totals.value) return { value: 0, symbol: '' }

  const file = filesize(totals.value.savedBytes, { round: 2, output: 'object' })
  return { symbol: file.symbol, value: Number(file.value) }
})

// RollingNumber only draws Latin digits, so take the separators that go with them
const separators = computed(() => {
  // Large enough for every locale to group it (Spanish leaves four digits ungrouped)
  const parts = new Intl.NumberFormat(locale.value, { numberingSystem: 'latn' }).formatToParts(
    1234567.5
  )
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  return { decimal: part('decimal'), group: part('group') }
})
</script>

<style scoped>
.rolling-number {
  line-height: 0.9em;
}
</style>
