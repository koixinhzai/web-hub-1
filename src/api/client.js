// Thin fetch wrapper. Dùng đường dẫn "/api/..." (đã có sẵn tiền tố /api ở từng
// hàm gọi trong api/spas.js, categories.js, countries.js):
//  - dev: Vite proxy /api và /uploads sang server Express (xem vite.config.js)
//  - production (Phase 5): site này deploy static, tách domain khỏi web_hub's
//    server — set VITE_API_BASE_URL (vd "https://api.yourdomain.com", KHÔNG có
//    "/api" ở cuối) lúc build để trỏ tuyệt đối sang API thật, xem DEPLOY.md.
//    Để trống (mặc định) thì giữ nguyên hành vi tương đối như cũ.
const API_ORIGIN = import.meta.env.VITE_API_BASE_URL || ''
const TOKEN_KEY = 'spa_admin_token'

// business_images.url / businesses.hero_image trả về từ web_hub là đường dẫn
// tương đối "/uploads/..." khi ảnh do admin upload (đã lưu trên đĩa server),
// nhưng là URL tuyệt đối "https://..." khi là ảnh stock/demo từ mock data gốc.
// Cần quy về tuyệt đối theo đúng origin của API để hiển thị đúng khi 2 domain
// khác nhau (xem API_ORIGIN ở trên).
export function resolveImageUrl(url) {
  if (!url) return url
  if (/^https?:\/\//i.test(url)) return url
  return `${API_ORIGIN}${url}`
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

// Phase 4 (rewire sang web_hub API): trang admin cũ (src/admin/) sẽ bị gỡ bỏ
// ở Phase 5 khi admin mới (web_hub/admin) đã thay thế hoàn toàn, nên các hàm
// ghi dữ liệu (create/update/delete/upload) không được rewire sang API mới —
// chỉ trả lỗi rõ ràng nếu lỡ còn ai mở admin cũ, thay vì crash im lặng.
export function adminDeprecated() {
  throw new ApiError(
    'This admin feature has moved to the new admin site (web_hub/admin) and no longer works here.',
    410
  )
}

export async function apiFetch(path, { method = 'GET', body, isForm = false, auth = false } = {}) {
  const headers = {}
  if (!isForm && body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_ORIGIN}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
  })

  let data = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = null
    }
  }

  if (!res.ok) {
    throw new ApiError(data?.error || `Request failed (${res.status})`, res.status)
  }
  return data
}
