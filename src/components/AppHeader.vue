<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { listCategories } from '../api/categories'

const route = useRoute()

const categories = ref([])
listCategories()
  .then((data) => { categories.value = data })
  .catch(() => {})

const navItems = computed(() => [
  { label: 'Home', slug: null, to: { path: '/' } },
  ...categories.value.map((c) => ({
    label: c.label,
    slug: c.slug,
    to: { path: '/', query: { type: c.slug } },
  })),
])

function isActive(item) {
  return (route.query.type || null) === item.slug
}
</script>

<template>
  <header>
    <div class="top-accent"></div>

    <div class="utility-bar">
      <div class="container">
        <a href="#"><span>✉️</span> Contact</a>
        <a href="#"><span>👤</span> Create account</a>
        <input type="text" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button class="btn-login">LOGIN</button>
        <a href="#">Remind password</a>
        <div class="lang-select"><span>🇬🇧</span> EN ▾</div>
        <button class="theme-toggle" title="Toggle theme">◐</button>
      </div>
    </div>

    <nav class="nav-bar">
      <div class="container">
        <router-link
          v-for="item in navItems"
          :key="item.label"
          :to="item.to"
          :class="{ active: isActive(item) }"
        >
          {{ item.label }}
        </router-link>
      </div>
    </nav>
  </header>
</template>
