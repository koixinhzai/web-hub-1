// Rewired ở Phase 4: `/api/categories` của web_hub là danh mục dùng chung
// cho cả 3 site, nên lọc lại chỉ giữ những category thực sự có ít nhất 1
// business thuộc site1 (tính bằng cách quét danh sách business của site1) —
// tránh header/trang chủ hiện nhầm category của site 2/3.
import { apiFetch, adminDeprecated } from './client'

const SITE_CODE = 'site1'

export async function listCategories() {
  const [all, res] = await Promise.all([
    apiFetch('/api/categories'),
    apiFetch(`/api/businesses?site=${SITE_CODE}&pageSize=100`),
  ])
  const usedSlugs = new Set()
  for (const b of res.items) {
    for (const c of b.categories || []) usedSlugs.add(c.slug)
  }
  return all
    .filter((c) => usedSlugs.has(c.slug))
    .map((c) => ({ id: c.id, slug: c.slug, label: c.label, title: c.title, sortOrder: c.sortOrder }))
}

// Admin cũ (src/admin/) sẽ bị gỡ ở Phase 5 — không rewire các thao tác ghi.
export const createCategory = adminDeprecated
export const updateCategory = adminDeprecated
export const deleteCategory = adminDeprecated
