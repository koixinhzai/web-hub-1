<script setup>
import PlaceholderPhoto from './PlaceholderPhoto.vue'

const props = defineProps({
  spa: { type: Object, required: true },
})
</script>

<template>
  <router-link :to="`/spa/${spa.id}`" class="spa-card">
    <div class="ribbon-vip">VIP</div>

    <div class="spa-card-head">{{ spa.name }}</div>

    <div class="spa-card-photo">
      <div class="badge-stack">
        <span v-if="spa.badges.isNew" class="badge-pill badge-new">NEW</span>
        <span v-if="!spa.badges.verified" class="badge-pill badge-unverified">UNVERI<br />FIED</span>
        <span v-if="spa.badges.independent" class="badge-pill badge-independent">INDEPE<br />NDENT</span>
        <span v-if="spa.badges.video" class="badge-pill badge-video">VIDEO</span>
        <span v-if="spa.badges.review" class="badge-pill badge-review">REVIEW</span>
      </div>

      <PlaceholderPhoto :seed="spa.id" :src="spa.heroImage" />

      <div v-if="spa.badges.verified" class="ribbon-verified">VERIFIED</div>
      <div v-else-if="spa.badges.top" class="ribbon-top">TOP</div>
    </div>

    <div class="spa-card-foot">
      <span class="value">{{ spa.city }}</span>
    </div>
  </router-link>
</template>
