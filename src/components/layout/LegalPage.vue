<script setup lang="ts">
import PageFooter from '@/components/layout/PageFooter.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import { useEventListener } from '@vueuse/core'
import { nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'

const props = defineProps<{
  title: string
  contentsLabel: string
  lang?: string
  /** Changes whenever the content is swapped, so the table of contents is rebuilt */
  contentKey?: string
}>()

type TocEntry = { id: string; number?: string; label: string }

const content = useTemplateRef<HTMLElement>('content')
const toc = ref<TocEntry[]>([])
const activeId = ref('')

// Below the fixed header, with some room so a heading counts as reached a bit early
const ACTIVE_OFFSET = 140

let sections: HTMLElement[] = []

// Built from the rendered headings, so every page only has to write its sections once
const buildToc = () => {
  sections = [...(content.value?.querySelectorAll<HTMLElement>('section[id]') ?? [])]

  toc.value = sections.map((section) => {
    const heading = section.querySelector('h2')
    const number = heading?.querySelector('.number')?.textContent?.trim()
    const label = heading?.querySelector('.title')?.textContent ?? heading?.textContent
    return { id: section.id, number, label: label?.trim() ?? section.id }
  })
  updateActive()
}

// The last section whose top has scrolled past the header, or the last one at the page end
const updateActive = () => {
  const atEnd = window.innerHeight + window.scrollY >= document.body.scrollHeight - 4
  const reached = sections.filter((s) => s.getBoundingClientRect().top <= ACTIVE_OFFSET)
  const active = atEnd ? sections[sections.length - 1] : reached[reached.length - 1]
  activeId.value = (active ?? sections[0])?.id ?? ''
}

useEventListener('scroll', updateActive, { passive: true })
onMounted(buildToc)
watch(
  () => props.contentKey,
  () => nextTick(buildToc)
)
</script>

<template>
  <PageHeader />
  <main :lang="lang" class="legal-page">
    <div class="band">
      <div class="band-inner">
        <h1>{{ title }}</h1>
        <slot name="band" />
      </div>
      <svg class="shore" viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 48V22C160 4 320 0 480 14s320 34 480 26 320-30 480-26v34z" />
      </svg>
    </div>

    <div class="body" :class="{ 'has-toc': toc.length > 1 }">
      <nav v-if="toc.length > 1" class="toc" :aria-label="contentsLabel">
        <p class="toc-label">{{ contentsLabel }}</p>
        <ol>
          <li v-for="entry in toc" :key="entry.id">
            <a
              :href="`#${entry.id}`"
              :class="{ active: entry.id === activeId }"
              :aria-current="entry.id === activeId ? 'location' : undefined"
              ><span v-if="entry.number" class="toc-number">{{ entry.number }}</span
              >{{ entry.label }}</a
            >
          </li>
        </ol>
      </nav>

      <div ref="content" class="legal-content">
        <slot />
      </div>
    </div>
  </main>
  <PageFooter />
</template>

<style scoped>
@reference "@/index.css";

.legal-page {
  --ink: #3d4a4c;
  --muted: #6f8184;
  --mist: #eef7f8;
  --line: #d9e8ea;
  padding-top: 72px;
  background: var(--color-white);
  color: var(--ink);
}

.band {
  position: relative;
  background: var(--color-shrink-me-secondary);
  color: var(--color-white);
}

.band-inner {
  max-width: 64rem;
  margin: 0 auto;
  padding: 4rem 1rem 5rem;
}

h1 {
  font-size: clamp(2.25rem, 7vw, 4.25rem);
  font-weight: 300;
  line-height: 1.1;
  letter-spacing: -0.02em;
  /* "Datenschutzerklärung" is wider than a phone */
  hyphens: auto;
  overflow-wrap: break-word;
}

.shore {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2.5rem;
  fill: var(--color-white);
}

.body {
  max-width: 64rem;
  margin: 0 auto;
  padding: 3rem 1rem 6rem;
}

.toc {
  display: none;
}

@media (min-width: 992px) {
  .band-inner {
    padding: 5.5rem 2rem 6.5rem;
  }

  .body {
    padding: 4rem 2rem 8rem;
  }

  .body.has-toc {
    display: grid;
    grid-template-columns: 14rem minmax(0, 40rem);
    gap: 4rem;
  }

  .toc {
    display: block;
    position: sticky;
    top: 104px;
    align-self: start;
    max-height: calc(100vh - 128px);
    overflow-y: auto;
  }
}

.toc-label {
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-shrink-me-secondary);
}

.toc ol {
  list-style: none;
  padding: 0;
  border-left: 1px solid var(--line);
}

.toc a {
  display: flex;
  gap: 0.5rem;
  margin-left: -1px;
  padding: 0.35rem 0 0.35rem 1rem;
  border-left: 2px solid transparent;
  font-size: 0.875rem;
  font-weight: 300;
  line-height: 1.4;
  color: var(--muted);
  transition:
    color 150ms,
    border-color 150ms;
}

.toc-number {
  min-width: 1.25rem;
  color: var(--color-shrink-me-primary);
  font-weight: 300;
  font-variant-numeric: tabular-nums;
}

.toc a:hover {
  color: var(--color-shrink-me-secondary);
}

.toc a.active {
  border-left-color: var(--color-shrink-me-primary);
  color: var(--color-shrink-me-secondary);
  font-weight: 600;
}

a:focus-visible {
  outline: 2px solid var(--color-shrink-me-primary);
  outline-offset: 2px;
  border-radius: 2px;
}
</style>

<style>
/* Slot content is rendered in the parent's scope, so the prose styles can't be scoped */
@reference "@/index.css";

.legal-content {
  /* Also a readable line length on a page without a table of contents */
  max-width: 40rem;
  font-size: 1.0625rem;
  line-height: 1.7;
}

.legal-content > :first-child {
  margin-top: 0;
}

.legal-content section {
  scroll-margin-top: 104px;
  margin-top: 3.5rem;
}

.legal-content section:first-child {
  margin-top: 0;
}

.legal-content h2 {
  display: flex;
  gap: 0.75rem;
  align-items: baseline;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--color-shrink-me-secondary);
}

.legal-content h2 .number {
  font-weight: 300;
  color: var(--color-shrink-me-primary);
  font-variant-numeric: tabular-nums;
}

.legal-content h3 {
  margin: 2rem 0 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-shrink-me-secondary);
}

.legal-content p {
  margin-bottom: 1rem;
  font-size: inherit;
  text-align: left;
}

.legal-content ul,
.legal-content ol {
  margin-bottom: 1rem;
  padding-left: 1.25rem;
  font-weight: 300;
}

.legal-content li {
  margin-bottom: 0.5rem;
  padding-left: 0.25rem;
}

.legal-content li::marker {
  color: var(--color-shrink-me-primary);
}

.legal-content strong {
  font-size: inherit;
  font-weight: 600;
}

.legal-content a {
  font-size: inherit;
  font-weight: 400;
  color: var(--color-shrink-me-secondary);
  text-decoration: underline;
  text-decoration-color: var(--color-shrink-me-primary);
  text-decoration-thickness: 1px;
  text-underline-offset: 0.2em;
  overflow-wrap: anywhere;
}

.legal-content a:hover {
  text-decoration-thickness: 2px;
}

.legal-content a:focus-visible {
  outline: 2px solid var(--color-shrink-me-primary);
  outline-offset: 2px;
  border-radius: 2px;
}

/* A block of text that must stand out, e.g. the right to object */
.legal-content .callout {
  margin: 1.5rem 0;
  padding: 1.25rem 1.5rem;
  border-left: 3px solid var(--color-shrink-me-primary);
  border-radius: 0 6px 6px 0;
  background: #eef7f8;
}

.legal-content .callout h3 {
  margin-top: 0;
}

.legal-content .callout p:last-child {
  margin-bottom: 0;
}

.legal-content .lead {
  font-size: 1.1875rem;
  line-height: 1.6;
}

.legal-content .note {
  font-size: 0.9375rem;
  color: #6f8184;
}
</style>
