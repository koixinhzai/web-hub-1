<script setup>
import { computed } from 'vue'

const props = defineProps({
  seed: { type: String, default: 'spa' },
  rounded: { type: Boolean, default: false },
  // Ảnh thật (upload từ trang Admin, vd /uploads/spas/xxx.jpg). Khi chưa có
  // ảnh nào được upload, component rơi về ảnh minh hoạ theo seed như cũ.
  src: { type: String, default: null },
})

const imageUrl = computed(
  () => props.src
)
</script>

<template>
  <div class="placeholder-photo" :class="{ rounded }">
    <img :src="imageUrl" :alt="seed" loading="lazy" />
  </div>
</template>

<style scoped>
.placeholder-photo {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.placeholder-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.placeholder-photo.rounded {
  border-radius: 6px;
}

.placeholder-photo.rounded img {
  border-radius: 6px;
}
</style>
