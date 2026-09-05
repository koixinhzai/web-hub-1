<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import PlaceholderPhoto from '../components/PlaceholderPhoto.vue'
import { getSpa } from '../api/spas'

const route = useRoute()
const spa = ref(null)
const loading = ref(true)
const notFound = ref(false)

watchEffect(async () => {
  loading.value = true
  notFound.value = false
  spa.value = null
  try {
    spa.value = await getSpa(route.params.id)
  } catch (err) {
    notFound.value = true
  } finally {
    loading.value = false
  }
})

const mainImage = computed(
  () => spa.value?.images?.find((i) => i.isPrimary) || spa.value?.images?.[0] || null
)

// info-grid: các dòng cố định (Location/City part/Home visit/Price range)
// dựng từ field riêng của spa (dùng lại ở panel khác nên không đưa vào bảng
// thông tin tự do), nối với các dòng tự do admin nhập (spa.info) -- nhãn và
// giá trị lấy thẳng từ DB, dòng nào không có dữ liệu thì tự động không hiện.
const fixedInfoRows = computed(() => {
  if (!spa.value) return []
  const rows = []
  const location = [spa.value.city, spa.value.country].filter(Boolean).join(' / ')
  if (location) rows.push({ label: 'Location', value: location })
  if (spa.value.cityPart) rows.push({ label: 'City part', value: spa.value.cityPart })
  rows.push({ label: 'Home visit', value: spa.value.homeVisit ? 'Yes' : 'No' })
  if (spa.value.priceRange) rows.push({ label: 'Price range', value: spa.value.priceRange })
  return rows
})
const infoRows = computed(() => [
  ...fixedInfoRows.value,
  ...(spa.value?.info || []).filter((row) => row.label && row.value),
])
// Khi spa chưa có ảnh upload nào, giữ nguyên hành vi cũ: hiển thị 6 ảnh minh hoạ theo seed.
const thumbImages = computed(() => (spa.value?.images?.length ? spa.value.images : null))

// Tuỳ chọn cho popup xem ảnh (v-viewer/ViewerJS): bật navbar để dễ chuyển ảnh,
// giữ toolbar mặc định (đã có nút prev/next hai bên) và cho đóng bằng phím Esc.
const viewerOptions = {
  navbar: true,
  toolbar: true,
  title: false,
  movable: true,
  loop: true,
  keyboard: true,
}
</script>

<template>
  <div class="page-body">
    <div class="container">
      <p v-if="loading" class="not-found">Đang tải...</p>

      <div v-else-if="notFound || !spa" class="not-found">
        <p>Không tìm thấy hồ sơ này.</p>
        <router-link to="/">← Quay về trang chủ</router-link>
      </div>

      <div v-else class="detail-grid">
        <!-- Gallery -->
        <div class="gallery" v-viewer="viewerOptions">
          <div class="gallery-main">
            <div class="badge-stack">
              <span v-if="spa.badges.isNew" class="badge-pill badge-new">NEW</span>
              <span v-if="!spa.badges.verified" class="badge-pill badge-unverified">UNVERI<br />FIED</span>
              <span v-if="spa.badges.independent" class="badge-pill badge-independent">INDEPE<br />NDENT</span>
            </div>
            <div class="ribbon-vip">VIP</div>
            <PlaceholderPhoto :seed="spa.id + '-main'" :src="mainImage?.url" rounded />
            <div v-if="spa.badges.top" class="corner-top">TOP</div>
          </div>
          <div class="gallery-thumbs">
            <template v-if="thumbImages">
              <div class="thumb" v-for="img in thumbImages" :key="img.id">
                <PlaceholderPhoto :seed="spa.id + '-' + img.id" :src="img.url" rounded />
              </div>
            </template>
            <template v-else>
              <div class="thumb" v-for="n in 6" :key="n">
                <PlaceholderPhoto :seed="spa.id + '-' + n" rounded />
              </div>
            </template>
          </div>
        </div>

        <!-- Main column -->
        <div class="detail-main">
          <section class="panel info-panel">
            <h1 class="spa-title">{{ spa.name.toUpperCase() }}</h1>
            <div class="last-seen">Last seen online: today</div>
            <p class="bio">{{ spa.bio }}</p>

            <div class="info-grid">
              <div class="info-row" v-for="row in infoRows" :key="row.label">
                <span class="k">{{ row.label }}:</span><span class="v">{{ row.value }}</span>
              </div>
            </div>
          </section>

          <section class="panel contact-panel">
            <h2 class="panel-title">CONTACT</h2>
            <div class="contact-row">
              <span class="k">Cell phone:</span>
              <span class="phone">📞 {{ spa.phone }}</span>
              <button class="btn-show-phone">SHOW PHONE</button>
              <span class="verified-tag" v-if="spa.badges.verified">✔ Verified</span>
              <span class="chat-icon">💬</span>
              <span class="chat-icon">✈️</span>
            </div>
            <div class="contact-row"><span class="k">Country:</span> <span class="v">{{ spa.country }}</span></div>
            <div class="contact-row"><span class="k">City:</span> <span class="v">{{ spa.city }}</span></div>

            <button class="btn-contact">✉ CONTACT THIS SPA</button>

            <div class="contact-actions">
              <button>+ ADD TO FAVORITES</button>
              <button>★ ADD REVIEW</button>
              <button>⚑ REPORT ISSUE</button>
            </div>

            <div class="warning">
              ⚠ Please make payments directly at the facility only after completing your treatment session. Do not make advance payments via gift cards, e-wallets, or bank transfers to anyone. Please report any suspicious profiles to the administrator.
            </div>
          </section>

          <div class="detail-bottom">
            <div class="bottom-left">
              <section class="panel">
                <h2 class="panel-title">STUDIO ADDRESS</h2>
                <div class="map-box">
                  <div class="map-grid"></div>
                  <div class="map-pin">📍</div>
                  <div class="map-label">{{ spa.cityPart }}, {{ spa.city }}</div>
                </div>
              </section>

              <section class="panel">
                <h2 class="panel-title">WORKING TIME</h2>
                <div class="working-badge">{{ spa.workingHours }}</div>
              </section>

              <section class="panel">
                <h2 class="panel-title">RATES</h2>
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>At Studio</th>
                      <th>Home Visit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="r in spa.rates" :key="r.time">
                      <td>{{ r.time }}</td>
                      <td>{{ r.studio }} EUR</td>
                      <td>{{ r.home ? r.home + ' EUR' : '✕' }}</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <section class="panel">
                <h2 class="panel-title">REVIEWS</h2>
                <p v-if="!spa.reviewsCount" class="muted">No reviews yet. Be the first and</p>
                <p v-else class="muted">{{ spa.reviewsCount }} reviews</p>
                <button class="btn-black">★ ADD REVIEW</button>
              </section>
            </div>

            <div class="bottom-right">
              <section class="panel">
                <h2 class="panel-title">SERVICES</h2>
                <table class="data-table services-table">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Included</th>
                      <th>Extra</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="s in spa.services" :key="s.name">
                      <td :class="{ extra: !s.included }">{{ s.name }}</td>
                      <td class="center">
                        <span v-if="s.included" class="check">✔</span>
                        <span v-else class="cross">✕</span>
                      </td>
                      <td class="price">
                        <span v-if="!s.included">{{ s.extra }} EUR</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  padding: 60px 0;
  text-align: center;
}

.not-found a {
  color: var(--red);
  font-weight: 700;
}

.detail-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  align-items: start;
}

@media (max-width: 860px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

.gallery-main {
  position: relative;
  aspect-ratio: 1 / 1.05;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.corner-top {
  position: absolute;
  bottom: 14px;
  left: -34px;
  background: #e0a800;
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.5px;
  padding: 3px 36px;
  transform: rotate(-45deg);
}

.gallery-thumbs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-top: 6px;
}

.gallery-thumbs .thumb {
  aspect-ratio: 1 / 1;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.detail-main {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
}

.panel {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 16px 18px;
}

.panel-title {
  color: var(--red);
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.4px;
  margin: 0 0 12px;
}

.spa-title {
  color: var(--red);
  font-size: 19px;
  font-weight: 800;
  margin: 0 0 4px;
}

.last-seen {
  color: var(--text-muted);
  font-size: 12px;
  margin-bottom: 10px;
}

.bio {
  font-size: 14px;
  margin: 0 0 14px;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 24px;
  border-top: 1px solid var(--border);
  padding-top: 12px;
}

@media (max-width: 560px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}

.info-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 6px 0;
  border-bottom: 1px dashed var(--border);
  font-size: 13px;
}

.info-row .k {
  color: var(--red);
  font-weight: 700;
}

.info-row .v {
  color: #222;
  text-align: right;
}

.contact-panel .contact-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 13px;
  padding: 6px 0;
}

.contact-row .k {
  color: var(--red);
  font-weight: 700;
  min-width: 90px;
}

.btn-show-phone {
  background: var(--red);
  color: #fff;
  border: none;
  border-radius: 3px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
}

.verified-tag {
  color: var(--green);
  font-weight: 700;
  font-size: 12px;
}

.chat-icon {
  font-size: 16px;
}

.btn-contact {
  width: 100%;
  background: var(--red);
  color: #fff;
  border: none;
  border-radius: 3px;
  padding: 12px;
  font-weight: 800;
  font-size: 14px;
  margin: 12px 0 10px;
  letter-spacing: 0.3px;
}

.btn-contact:hover {
  background: var(--red-dark);
}

.contact-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 14px;
}

.contact-actions button {
  background: var(--black);
  color: #fff;
  border: none;
  border-radius: 3px;
  padding: 9px 4px;
  font-size: 11px;
  font-weight: 700;
}

.warning {
  background: #fdecec;
  border: 1px solid #f4c2c2;
  color: var(--red-dark);
  font-size: 12px;
  line-height: 1.5;
  border-radius: 3px;
  padding: 10px 12px;
}

.detail-bottom {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 18px;
  align-items: start;
}

@media (max-width: 700px) {
  .detail-bottom {
    grid-template-columns: 1fr;
  }
}

.bottom-left,
.bottom-right {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.map-box {
  position: relative;
  height: 200px;
  border-radius: 4px;
  overflow: hidden;
  background: linear-gradient(135deg, #dfe9e2, #c9dccf);
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px);
  background-size: 26px 26px;
}

.map-pin {
  position: absolute;
  font-size: 30px;
  transform: translateY(-10px);
  filter: drop-shadow(0 3px 3px rgba(0, 0, 0, 0.25));
}

.map-label {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(255, 255, 255, 0.85);
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 700;
  color: #333;
}

.working-badge {
  display: inline-block;
  background: var(--green);
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  padding: 8px 14px;
  border-radius: 3px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table th {
  background: var(--red);
  color: #fff;
  text-align: left;
  padding: 8px 10px;
  font-size: 12px;
}

.data-table td {
  padding: 8px 10px;
  border-bottom: 1px solid var(--border);
}

.services-table td.extra {
  color: var(--red);
  font-weight: 600;
}

.services-table td.center {
  text-align: center;
}

.services-table td.price {
  text-align: right;
  color: var(--red);
  font-weight: 700;
}

.check {
  color: var(--green);
  font-weight: 800;
}

.cross {
  color: var(--red);
  font-weight: 800;
}

.muted {
  color: var(--text-muted);
  font-size: 13px;
  margin: 0 0 12px;
}

.btn-black {
  background: var(--black);
  color: #fff;
  border: none;
  border-radius: 3px;
  padding: 10px 16px;
  font-size: 12px;
  font-weight: 700;
}
</style>
