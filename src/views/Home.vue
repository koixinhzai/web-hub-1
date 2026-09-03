<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from '../components/AppSidebar.vue'
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

watchEffect(async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await listSpas({ category: activeSlug.value || undefined, pageSize: 100 })
    spas.value = res.data
  } catch (err) {
    error.value = err.message || 'Không tải được danh sách.'
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
          <FilterBar />

          <p v-if="loading" class="empty-state">Đang tải...</p>
          <p v-else-if="error" class="empty-state">{{ error }}</p>
          <div v-else-if="spas.length" class="card-grid">
            <SpaCard v-for="spa in spas" :key="spa.id" :spa="spa" />
          </div>
          <p v-else class="empty-state">Chưa có dữ liệu cho danh mục này.</p>
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
