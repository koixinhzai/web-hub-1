// Rewired ở Phase 4: schema hợp nhất của web_hub KHÔNG có bảng countries
// riêng (đã chốt ở Phase 2 MERGE_PLAN.md) — `country` chỉ là text tự do trên
// từng business. Theo quyết định đã chọn khi làm Phase 4: giữ nguyên danh
// sách quốc gia tĩnh (flag/code/region) trong src/data/countries.js cho
// AppSidebar hiển thị đúng như cũ, nhưng tính lại `count` real-time bằng
// cách đếm business của site1 theo field `country`.
import { apiFetch, adminDeprecated } from './client'
import { europe as staticEurope } from '../data/countries'

const SITE_CODE = 'site1'

async function countBusinessesByCountry() {
  const res = await apiFetch(`/api/businesses?site=${SITE_CODE}&pageSize=100`)
  const counts = new Map()
  for (const b of res.items) {
    if (!b.country) continue
    counts.set(b.country, (counts.get(b.country) || 0) + 1)
  }
  return counts
}

function withLiveCounts(list, counts) {
  return list.map((c) => ({ ...c, count: counts.get(c.name) || 0 }))
}

export async function listCountries() {
  const counts = await countBusinessesByCountry()
  return {
    europe: withLiveCounts(staticEurope, counts),
  }
}

// Không còn bảng countries để CRUD (xem ghi chú trên) — admin cũ (src/admin/)
// sẽ bị gỡ ở Phase 5 nên không xây lại tính năng này.
export const createCountry = adminDeprecated
export const updateCountry = adminDeprecated
export const deleteCountry = adminDeprecated
