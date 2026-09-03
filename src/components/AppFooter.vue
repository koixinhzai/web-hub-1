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
        © 2026 Spa Directory. Đây là trang minh hoạ giao diện, toàn bộ hồ sơ và thông tin liên hệ là dữ liệu giả lập.
      </div>
    </div>
  </footer>
</template>
