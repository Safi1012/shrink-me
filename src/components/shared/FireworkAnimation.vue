<script setup lang="ts">
import anime from 'animejs/lib/anime.es.js'
import { onMounted, ref, watchEffect } from 'vue'
import { useElementBounding, type UseElementBoundingReturn } from '@vueuse/core'

const props = defineProps<{
  drawArea: HTMLElement
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)

const numberOfParticles = 40
const colors = ['#05BED4', '#12E2FA', '#43E9FC', '#74EFFE', '#A7F5FF']
const render = anime({
  duration: Infinity,
  update: () => {
    ctx.value?.clearRect(0, 0, canvas.value?.width || 0, canvas.value?.height || 0)
  }
})

const getRandomPos = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const executeAnimation = (xPosition: number, yPosition: number) => {
  render.play()
  animateParticles(xPosition, yPosition)
}

const displayFireworks = ({ left, width, height, top }: UseElementBoundingReturn) => {
  const fileAreaPosition = {
    x_min: left.value,
    x_max: left.value + width.value,
    y_min: top.value,
    y_max: top.value + height.value
  }

  const xPos1 = getRandomPos(fileAreaPosition.x_min, fileAreaPosition.x_max)
  const yPos1 = getRandomPos(fileAreaPosition.y_min, fileAreaPosition.y_max)

  const xPos2 = getRandomPos(fileAreaPosition.x_min, fileAreaPosition.x_max)
  const yPos2 = getRandomPos(fileAreaPosition.y_min, fileAreaPosition.y_max)

  const xPos3 = getRandomPos(fileAreaPosition.x_min, fileAreaPosition.x_max)
  const yPos3 = getRandomPos(fileAreaPosition.y_min, fileAreaPosition.y_max)

  setTimeout(() => {
    executeAnimation(xPos1, yPos1)
  }, 250)

  setTimeout(() => {
    executeAnimation(xPos2, yPos2)
  }, 500)

  setTimeout(() => {
    executeAnimation(xPos3, yPos3)
  }, 750)
}

watchEffect(() => {
  const elementBounding = useElementBounding(props.drawArea)

  if (elementBounding.width.value > 0 && elementBounding.height.value > 0) {
    displayFireworks(elementBounding)
  }
})

const setCanvasSize = () => {
  if (!canvas.value) return

  canvas.value.width = window.innerWidth * 2
  canvas.value.height = window.innerHeight * 2
  canvas.value.style.width = `${window.innerWidth}px`
  canvas.value.style.height = `${window.innerHeight}px`
  canvas.value.getContext('2d')?.scale(2, 2)
}

const setParticuleDirection = (p) => {
  const angle = (anime.random(0, 360) * Math.PI) / 180
  const value = anime.random(50, 180)
  const radius = [-1, 1][anime.random(0, 1)] * value
  return {
    x: p.x + radius * Math.cos(angle),
    y: p.y + radius * Math.sin(angle)
  }
}

const createParticule = (x: number, y: number) => {
  const p: anime.AnimeParams = {}

  p.x = x
  p.y = y
  p.color = colors[anime.random(0, colors.length - 1)]
  p.radius = anime.random(16, 32)
  p.endPos = setParticuleDirection(p)
  p.draw = () => {
    if (ctx.value) {
      ctx.value.beginPath()
      ctx.value.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true)
      ctx.value.fillStyle = p.color
      ctx.value.fill()
    }
  }
  return p
}

const createCircle = (x: number, y: number) => {
  const p: anime.AnimeAnimParams = {}

  p.x = x
  p.y = y
  p.color = '#FFF'
  p.radius = 0.1
  p.alpha = 0.5
  p.lineWidth = 6
  p.draw = () => {
    if (ctx.value) {
      ctx.value.globalAlpha = p.alpha
      ctx.value.beginPath()
      ctx.value.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true)
      ctx.value.lineWidth = p.lineWidth
      ctx.value.strokeStyle = p.color
      ctx.value.stroke()
      ctx.value.globalAlpha = 1
    }
  }
  return p
}

const renderParticle = (anim: anime.AnimeInstance) => {
  for (let i = 0; i < anim.animatables.length; i++) {
    ;(anim.animatables[i].target as any).draw()
  }
}

const animateParticles = (x: number, y: number) => {
  const circle = createCircle(x, y)
  const particles = []
  for (let i = 0; i < numberOfParticles; i++) {
    particles.push(createParticule(x, y))
  }

  anime
    .timeline()
    .add({
      targets: particles,
      x(p: any) {
        return p.endPos.x
      },
      y(p: any) {
        return p.endPos.y
      },
      radius: 0.1,
      duration: anime.random(1200, 1800),
      easing: 'easeOutExpo',
      update: renderParticle
    })
    .add({
      targets: circle,
      radius: anime.random(80, 160),
      lineWidth: 0,
      alpha: {
        value: 0,
        easing: 'linear',
        duration: anime.random(600, 800)
      },
      duration: anime.random(1200, 1800),
      easing: 'easeOutExpo',
      update: renderParticle,
      offset: 0
    })
}

onMounted(() => {
  if (canvas.value) {
    ctx.value = canvas.value.getContext('2d')
  }
  setCanvasSize()
})
</script>

<template>
  <canvas ref="canvas" class="absolute left-0 top-0 h-full w-full"></canvas>
</template>
