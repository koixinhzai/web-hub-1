<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from '../components/AppSidebar.vue'
import AutoSlider from '../components/AutoSlider.vue'
import FilterBar from '../components/FilterBar.vue'
import SpaCard from '../components/SpaCard.vue'
import { listSpas } from '../api/spas'
import { listCategories } from '../api/categories'

const route = useRoute()

// slug rỗng/không có => 'Trang chủ', hiển thị tất cả danh mục
const activeSlug = computed(() => route.query.type || null)

const categories = ref([])
const activeCategory = computed(
  () => categories.value.find((c) => c.slug === activeSlug.value) || { title: 'Home' }
)

const spas = ref([])
const loading = ref(true)
const error = ref('')

// SVIP-ranked services get pulled out into the AutoSlider up top; everything
// else (VIP/VIP1/VIP2 or unranked) stays in the regular grid below it.
const svipSpas = computed(() => spas.value.filter((s) => s.rankTier === 'SVIP'))
const otherSpas = computed(() => spas.value.filter((s) => s.rankTier !== 'SVIP'))

watchEffect(async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await listSpas({ category: activeSlug.value || undefined, pageSize: 100 })
    spas.value = res.data
  } catch (err) {
    error.value = err.message || 'Could not load the list.'
  } finally {
    loading.value = false
  }
})

listCategories()
  .then((data) => { categories.value = data })
  .catch(() => {})
</script>

<template>
  <div class="page-body">
    <div class="container">
      <div class="layout">
        <AppSidebar />

        <main>
          <h1 class="page-title">{{ (activeCategory.title || 'Home').toUpperCase() }}</h1>
          <AutoSlider v-if="svipSpas.length" :items="svipSpas" />
          <FilterBar />

          <p v-if="loading" class="empty-state">Loading...</p>
          <p v-else-if="error" class="empty-state">{{ error }}</p>
          <div v-else-if="otherSpas.length" class="card-grid">
            <SpaCard v-for="spa in otherSpas" :key="spa.id" :spa="spa" />
          </div>
          <p v-else-if="!spas.length" class="empty-state">No data available for this category yet.</p>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  color: var(--text-muted);
  font-size: 14px;
  padding: 30px 0;
}
</style>
