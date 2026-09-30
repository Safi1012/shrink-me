<script setup lang="ts">
import { createTimeline, createTimer, utils, type JSAnimation } from 'animejs'
import { onMounted, ref } from 'vue'
import { useElementBounding, type UseElementBoundingReturn } from '@vueuse/core'

const props = defineProps<{
  drawArea: HTMLElement
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const elementBounding = useElementBounding(props.drawArea)

const numberOfParticles = 40
const colors = ['#05BED4', '#12E2FA', '#43E9FC', '#74EFFE', '#A7F5FF']
const render = createTimer({
  duration: Infinity,
  onUpdate: () => {
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

const setCanvasSize = () => {
  if (!canvas.value) return

  canvas.value.width = window.innerWidth * 2
  canvas.value.height = window.innerHeight * 2
  canvas.value.style.width = `${window.innerWidth}px`
  canvas.value.style.height = `${window.innerHeight}px`
  canvas.value.getContext('2d')?.scale(2, 2)
}

interface Particle {
  x: number
  y: number
  color: string
  radius: number
  endPos: { x: number; y: number }
  draw: () => void
}

interface Circle {
  x: number
  y: number
  color: string
  radius: number
  alpha: number
  lineWidth: number
  draw: () => void
}

const setParticuleDirection = (p: Pick<Particle, 'x' | 'y'>) => {
  const angle = (utils.random(0, 360) * Math.PI) / 180
  const value = utils.random(50, 180)
  const radius = [-1, 1][utils.random(0, 1)] * value
  return {
    x: p.x + radius * Math.cos(angle),
    y: p.y + radius * Math.sin(angle)
  }
}

const createParticule = (x: number, y: number) => {
  const p = {
    x,
    y,
    color: colors[utils.random(0, colors.length - 1)],
    radius: utils.random(16, 32)
  } as Particle

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
  const p = {
    x,
    y,
    color: '#FFF',
    radius: 0.1,
    alpha: 0.5,
    lineWidth: 6
  } as Circle

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

const renderParticle = (anim: JSAnimation) => {
  for (const target of anim.targets) {
    ;(target as unknown as Particle | Circle).draw()
  }
}

const animateParticles = (x: number, y: number) => {
  const circle = createCircle(x, y)
  const particles: Particle[] = []
  for (let i = 0; i < numberOfParticles; i++) {
    particles.push(createParticule(x, y))
  }

  createTimeline()
    .add(particles, {
      x: (p: object) => (p as Particle).endPos.x,
      y: (p: object) => (p as Particle).endPos.y,
      radius: 0.1,
      duration: utils.random(1200, 1800),
      ease: 'outExpo',
      onUpdate: renderParticle
    })
    .add(circle, {
      radius: utils.random(80, 160),
      lineWidth: 0,
      alpha: {
        to: 0,
        ease: 'linear',
        duration: utils.random(600, 800)
      },
      duration: utils.random(1200, 1800),
      ease: 'outExpo',
      onUpdate: renderParticle
    })
}

onMounted(() => {
  if (canvas.value) {
    ctx.value = canvas.value.getContext('2d')
  }
  setCanvasSize()
  displayFireworks(elementBounding)
})
</script>

<template>
  <canvas ref="canvas" class="absolute top-0 left-0 h-full w-full"></canvas>
</template>
