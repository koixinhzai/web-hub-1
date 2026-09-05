<script setup>
import { ref } from 'vue'
import { listCountries } from '../api/countries'

const europe = ref([])
listCountries()
  .then((data) => {
    europe.value = data.europe
  })
  .catch(() => {})

const openSections = ref({ europe: true })

function toggle(section) {
  openSections.value[section] = !openSections.value[section]
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-search">
      <input type="text" placeholder="Search" />
      <button>🔍</button>
    </div>

    <div class="sidebar-heading">EUROPE</div>
    <div class="country-row" v-for="c in europe" :key="c.name">
      <!-- <button class="country-toggle">+</button> -->
      <img
        class="country-flag"
        :src="`https://flagcdn.com/24x18/${c.code}.png`"
        :srcset="`https://flagcdn.com/48x36/${c.code}.png 2x`"
        :alt="c.name"
        :title="c.name"
        width="24"
        height="18"
        loading="lazy"
      />
      <a href="#" class="country-name">{{ c.name }}</a>
      <span class="country-count">({{ c.count }})</span>
    </div>
  </aside>
</template>
