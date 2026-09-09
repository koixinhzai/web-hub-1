<script setup>
const links = [
  'VIP Spas', 'Therapists', 'Massages', 'Independent', 'Videos',
  'FAQ', 'Advertise', 'Reviews', 'Contact', 'Terms & Privacy',
  'Directory', 'Affiliate',
]
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-links">
        <a href="#" v-for="l in links" :key="l">{{ l }}</a>
      </div>
      <div class="footer-note">
        © 2026 Spa Directory. This is a UI demo site — all profiles and contact details are simulated data.
      </div>
    </div>
  </footer>
</template>
