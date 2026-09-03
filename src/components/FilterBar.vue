<script setup>
const filters = [
  'Experience',
  'Specialty',
  'Rates',
  'Treatment',
  'Home Visit',
  'Session Length',
  'Certification',
  'Services',
  'Nationality',
  'Languages',
  'Preferences',
]

const checks = [
  { label: 'WITH REVIEWS', count: 214 },
  { label: 'VERIFIED', count: 1732 },
  { label: 'NEWCOMERS', count: 96 },
  { label: 'WITH VIDEOS', count: 1188 },
  { label: 'TOP RATED', count: 58 },
  { label: 'INDEPENDENT', count: 2540 },
  { label: 'SEEN LAST WEEK', count: 903 },
  { label: 'DUO SESSION', count: 41 },
  { label: 'COUPLE MASSAGE', count: 19 },
]
</script>

<template>
  <div class="filter-bar">
    <div class="filter-row">
      <button class="filter-btn" v-for="f in filters" :key="f">
        {{ f }} <span class="caret">▾</span>
      </button>
    </div>
    <div class="filter-checks">
      <label class="filter-check" v-for="c in checks" :key="c.label">
        <input type="checkbox" />
        {{ c.label }} ({{ c.count }})
      </label>
    </div>
  </div>
</template>
