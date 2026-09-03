// Rewired ở Phase 4: gọi API hợp nhất của web_hub (`/api/businesses`, filter
// `?site=site1`) thay vì server riêng cũ, rồi map ngược sang đúng shape "spa"
// mà các component công khai (Home/Detail/SpaCard) đang dùng — nhờ vậy không
// phải sửa UI. Các hàm ghi dữ liệu (create/update/delete/upload) chỉ phục vụ
// admin cũ (sắp gỡ ở Phase 5) nên không rewire, xem `adminDeprecated`.
import { apiFetch, adminDeprecated, resolveImageUrl } from './client'

const SITE_CODE = 'site1'

// Badge key của web_hub (snake_case, seed từ site 1) -> field camelCase mà
// SpaCard.vue/Detail.vue đọc trực tiếp (spa.badges.isNew, v.v.)
const BADGE_KEY_MAP = {
  is_new: 'isNew',
  independent: 'independent',
  video: 'video',
  review: 'review',
  verified: 'verified',
  top: 'top',
}

function toBadgeObject(badges) {
  const obj = { isNew: false, independent: false, video: false, review: false, verified: false, top: false }
  for (const b of badges || []) {
    const key = BADGE_KEY_MAP[b.key]
    if (key) obj[key] = true
  }
  return obj
}

function findInfo(info, label) {
  const row = (info || []).find((i) => i.label === label)
  return row ? row.value : ''
}

// Shape rút gọn dùng cho danh sách (Home.vue / SpaCard.vue)
function mapSummary(b) {
  return {
    id: b.slug,
    name: b.name,
    city: b.city,
    country: b.country,
    badges: toBadgeObject(b.badges),
    categories: (b.categories || []).map((c) => c.slug),
    primaryImage: b.images && b.images.length ? { url: resolveImageUrl(b.images[0]) } : null,
  }
}

// Shape đầy đủ dùng cho trang chi tiết (Detail.vue)
function mapDetail(b) {
  return {
    id: b.slug,
    name: b.name,
    city: b.city,
    country: b.country,
    cityPart: b.neighborhood,
    homeVisit: !!b.homeVisit,
    priceRange: b.priceRange,
    workingHours: findInfo(b.info, 'Working hours'),
    phone: b.phone,
    bio: b.shortDescription,
    reviewsCount: b.reviewCount,
    badges: toBadgeObject(b.badges),
    categories: (b.categories || []).map((c) => c.slug),
    images: (b.images || []).map((img) => ({ id: img.id, url: resolveImageUrl(img.url), isPrimary: img.isPrimary })),
    // Bảng thông tin tự do (Gender, Experience, Specialty, ...) nhập trong
    // admin -- Detail.vue đọc thẳng nhãn + giá trị từ đây thay vì hardcode
    // từng label, nên admin đổi/thêm/xoá dòng nào cũng tự hiển thị đúng.
    // "Working hours" đã có ô riêng (workingHours ở trên) nên loại khỏi đây.
    info: (b.info || []).filter((i) => i.label !== 'Working hours'),
    rates: (b.rates || []).map((r) => ({
      id: r.id,
      time: r.timeLabel,
      studio: r.studioPrice,
      home: r.homePrice === null ? false : r.homePrice,
    })),
    services: (b.services || []).map((s) => ({
      id: s.id,
      name: s.name,
      included: !!s.included,
      extra: s.extraPrice,
    })),
  }
}

export async function listSpas(params = {}) {
  const query = new URLSearchParams()
  query.set('site', SITE_CODE)
  if (params.category) query.set('category', params.category)
  if (params.search) query.set('search', params.search)
  query.set('pageSize', String(params.pageSize || 100))
  if (params.page) query.set('page', String(params.page))
  const res = await apiFetch(`/api/businesses?${query.toString()}`)
  return { data: res.items.map(mapSummary), total: res.total, page: res.page, pageSize: res.pageSize }
}

export async function getSpa(id) {
  // `?site=` asks the server to also flatten this one site's scoped data
  // (info/badges/categories/rates/services) to top-level fields -- without
  // it the response only has `siteData` (every site at once, for the admin
  // edit form), which mapDetail() below cannot read (see spa.gender bug).
  const b = await apiFetch(`/api/businesses/${encodeURIComponent(id)}?site=${SITE_CODE}`)
  return mapDetail(b)
}

// Admin cũ (src/admin/) sẽ bị gỡ ở Phase 5 — không rewire các thao tác ghi.
export const createSpa = adminDeprecated
export const updateSpa = adminDeprecated
export const deleteSpa = adminDeprecated
export const uploadSpaImage = adminDeprecated
export const setPrimarySpaImage = adminDeprecated
export const deleteSpaImage = adminDeprecated
