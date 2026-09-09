<script setup>
// Auto-playing "photo gallery" slider: shows `visibleCount` services at a
// time and continuously glides to the right, revealing more of `items` one
// by one. The item list is rendered twice back-to-back and the scroll offset
// wraps around after exactly one full list-width, so once the tail is
// reached it rolls straight back into the same first item -- no jump cut,
// no pause, the loop just keeps completing.
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import PlaceholderPhoto from './PlaceholderPhoto.vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  // How many cards fit in the visible strip at once.
  visibleCount: { type: Number, default: 4 },
  // Cap how many of `items` feed the slider (keeps the DOM light -- the
  // track renders this many nodes twice over for the seamless loop).
  maxItems: { type: Number, default: 16 },
  // Glide speed in pixels/second.
  speed: { type: Number, default: 45 },
})

const GAP = 16

const wrapperEl = ref(null)
const trackEl = ref(null)
const itemWidth = ref(0)
const paused = ref(false)

const slides = computed(() => props.items.slice(0, props.maxItems))
// Duplicated so the track always has a second copy ready to slide into view
// as the first copy scrolls out -- that second copy is what makes wrapping
// the offset back to 0 look like a continuation instead of a reset.
const loopSlides = computed(() => (slides.value.length ? [...slides.value, ...slides.value] : []))

let resizeObserver = null
let rafId = null
let lastTime = null
let offset = 0

function measure() {
  if (!wrapperEl.value) return
  const available = wrapperEl.value.clientWidth - GAP * (props.visibleCount - 1)
  itemWidth.value = Math.max(0, available / props.visibleCount)
}

function step(now) {
  if (lastTime == null) lastTime = now
  const dt = (now - lastTime) / 1000
  lastTime = now

  const setWidth = (itemWidth.value + GAP) * slides.value.length
  if (!paused.value && setWidth > 0) {
    offset += props.speed * dt
    if (offset >= setWidth) offset -= setWidth // wraps back to the start, seamlessly
    if (trackEl.value) trackEl.value.style.transform = `translateX(-${offset}px)`
  }
  rafId = requestAnimationFrame(step)
}

// A shorter or filtered list (e.g. switching category) changes setWidth --
// resetting the offset avoids stalling mid-way through a now-nonexistent tail.
watch(slides, () => { offset = 0 })

onMounted(() => {
  measure()
  resizeObserver = new ResizeObserver(measure)
  resizeObserver.observe(wrapperEl.value)
  rafId = requestAnimationFrame(step)
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
  if (resizeObserver) resizeObserver.disconnect()
})
</script>

<template>
  <div
    v-if="slides.length"
    ref="wrapperEl"
    class="auto-slider"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
  >
    <div ref="trackEl" class="auto-slider-track">
      <router-link
        v-for="(spa, i) in loopSlides"
        :key="`${spa.id}-${i}`"
        :to="`/spa/${spa.id}`"
        class="auto-slider-item"
        :style="{ width: itemWidth + 'px' }"
      >
        <PlaceholderPhoto :seed="spa.id" :src="spa.heroImage" />
        <div class="auto-slider-caption">
          <span class="name">{{ spa.name }}</span>
          <span v-if="spa.city" class="city">{{ spa.city }}</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.auto-slider {
  width: 100%;
  overflow: hidden;
  margin-bottom: 18px;
  border-radius: 4px;
}

.auto-slider-track {
  display: flex;
  gap: 16px;
  will-change: transform;
}

.auto-slider-item {
  position: relative;
  flex: 0 0 auto;
  aspect-ratio: 3 / 4;
  border-radius: 4px;
  overflow: hidden;
  background: var(--card-bg);
  border: 1px solid var(--border);
  display: block;
}

.auto-slider-caption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  padding: 8px 10px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
  color: #fff;
}

.auto-slider-caption .name {
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.auto-slider-caption .city {
  font-size: 11px;
  opacity: 0.85;
}
</style>
