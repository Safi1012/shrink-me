<script setup lang="ts">
import { nextTick, ref, shallowRef, watch } from 'vue'

// Rolls each digit to its new value like a mechanical counter. The roll and the styles are
// ported from HubSpot's Odometer and its default theme (MIT, credited on the credits page)

const props = withDefaults(
  defineProps<{
    value: number
    /** The locale's decimal and grouping separators */
    separators?: { decimal: string; group: string }
  }>(),
  { separators: () => ({ decimal: '.', group: ',' }) }
)

type Token = { kind: 'digit'; frames: number[] } | { kind: 'mark'; char: string }

const DECIMALS = 2
// A digit shows at most this many values on its way, so the roll stays readable (the
// original derives it from 2s at 30fps and 2 frames per value, which floors to 29)
const MAX_FRAMES = 29
// Each further digit that needs sampling rolls through proportionally more values
const SPEEDBOOST = 0.5

const round = (value: number) => Math.round(value * 10 ** DECIMALS) / 10 ** DECIMALS

const fractionalDigits = (value: number) => value.toString().split('.')[1]?.length ?? 0

// Frames of every digit, least significant first, with grouping commas and the decimal point
const layout = (columns: number[][], fractionCount: number): Token[] => {
  const tokens: Token[] = []

  columns.forEach((frames, index) => {
    const wholeIndex = index - fractionCount
    if (wholeIndex === 0 && fractionCount) {
      tokens.push({ kind: 'mark', char: props.separators.decimal })
    }
    if (wholeIndex > 0 && wholeIndex % 3 === 0) {
      tokens.push({ kind: 'mark', char: props.separators.group })
    }
    tokens.push({ kind: 'digit', frames })
  })

  return tokens.reverse()
}

const staticTokens = (value: number) => {
  const [whole, fraction = ''] = value.toString().split('.')
  const digits = [...(whole + fraction)].reverse().map((digit) => [Number(digit)])
  return layout(digits, fraction.length)
}

// The values each digit rolls through between two numbers, e.g. 98 → 103 rolls the
// tens through 9, 10 (shown as 0) and the hundreds through 0, 1
const rollingTokens = (from: number, to: number) => {
  const fractionCount = Math.max(fractionalDigits(from), fractionalDigits(to))
  const start = Math.round(from * 10 ** fractionCount)
  const end = Math.round(to * 10 ** fractionCount)
  const digitCount = Math.max(String(Math.max(start, end)).length, fractionCount + 1)

  const columns: number[][] = []
  let boosted = 0

  for (let place = digitCount - 1; place >= 0; place--) {
    const first = Math.trunc(start / 10 ** place)
    const last = Math.trunc(end / 10 ** place)
    const distance = last - first
    const frames: number[] = []

    if (Math.abs(distance) > MAX_FRAMES) {
      const step = distance / (MAX_FRAMES + MAX_FRAMES * boosted * SPEEDBOOST)
      for (let current = first; distance > 0 ? current < last : current > last; current += step) {
        frames.push(Math.round(current))
      }
      if (frames[frames.length - 1] !== last) frames.push(last)
      boosted++
    } else {
      const direction = Math.sign(distance) || 1
      for (let current = first; current !== last + direction; current += direction) {
        frames.push(current)
      }
    }

    const digits = frames.map((frame) => Math.abs(frame % 10))
    // Rolling down starts on the last value and moves back to the first
    columns.unshift(end < start ? digits.reverse() : digits)
  }

  return layout(columns, fractionCount)
}

const root = ref<HTMLElement | null>(null)
const tokens = shallowRef(staticTokens(round(props.value)))
const direction = ref<'up' | 'down' | null>(null)
const rolling = ref(false)
// Every roll gets fresh elements, so a ribbon never animates back from where the last one ended
const generation = ref(0)
let current = round(props.value)

watch(
  () => round(props.value),
  async (target) => {
    if (target === current) return

    tokens.value = rollingTokens(current, target)
    generation.value++
    direction.value = target > current ? 'up' : 'down'
    rolling.value = false
    current = target

    // Lay the ribbons out at their starting position first, so the move to the end is animated
    await nextTick()
    if (current !== target) return
    void root.value?.offsetHeight
    rolling.value = true
  }
)

// e.g. after switching the language, a roll in progress picks them up once it settles
watch(
  () => props.separators,
  () => {
    if (!direction.value) tokens.value = staticTokens(current)
  }
)

const settle = () => {
  if (!direction.value) return
  tokens.value = staticTokens(current)
  generation.value++
  direction.value = null
  rolling.value = false
}
</script>

<template>
  <span
    ref="root"
    dir="ltr"
    class="rolling-number"
    :class="[direction && `is-${direction}`, { 'is-rolling': rolling }]"
    @transitionend="settle"
  >
    <!-- dir: the digits are laid out one by one, so a right-to-left page would reverse them -->
    <span :key="generation" class="inside">
      <template v-for="(token, index) in tokens" :key="index">
        <span v-if="token.kind === 'mark'">{{ token.char }}</span>
        <span v-else class="digit">
          <span class="spacer">8</span>
          <span class="window">
            <span class="ribbon">
              <span v-for="(frame, i) in token.frames" :key="i" class="value">{{ frame }}</span>
            </span>
          </span>
        </span>
      </template>
    </span>
  </span>
</template>

<style scoped>
.rolling-number {
  display: inline-block;
  position: relative;
  vertical-align: middle;
  font-family: 'Helvetica Neue', sans-serif;
}

.inside {
  display: block;
}

.digit {
  display: inline-block;
  position: relative;
  vertical-align: middle;
}

/* Every digit is as wide as an 8, so the number doesn't wobble while it rolls */
.spacer {
  display: inline-block;
  vertical-align: middle;
  visibility: hidden;
}

.window {
  display: block;
  position: absolute;
  inset: 0;
  overflow: hidden;
  text-align: left;
}

.ribbon {
  display: block;
  backface-visibility: hidden;
}

.value {
  display: block;
  text-align: center;
  transform: translateZ(0);
}

/* Taken out of the flow, so moving the ribbon by its full height lands on the last value */
.is-up .value:last-child,
.is-down .value:last-child {
  position: absolute;
}

.is-up .ribbon {
  transition: transform 2s;
}

.is-up.is-rolling .ribbon {
  transform: translateY(-100%);
}

.is-down .ribbon {
  transform: translateY(-100%);
}

.is-down.is-rolling .ribbon {
  transition: transform 2s;
  transform: translateY(0);
}
</style>
