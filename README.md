# VIP Spa Directory (Vue 3 + Vite + Express + MySQL)

Website "danh bạ dịch vụ" spa/massage trị liệu. Dữ liệu được lưu trong MySQL và
phục vụ qua REST API (Node.js/Express); có trang quản trị `/admin` để CRUD toàn bộ
dữ liệu. Nội dung là dữ liệu giả lập, không dùng thông tin thật.

**Xem [DEPLOY.md](./DEPLOY.md) để biết cách cài đặt lần đầu (tạo DB, seed dữ liệu,
chạy backend) và các bước deploy lên hosting.**

## Chạy dự án (sau khi đã setup backend theo DEPLOY.md)

```bash
npm install
npm run dev
```

Mở http://localhost:5173 (yêu cầu backend đang chạy ở cổng 3000, xem `server/`).

## Cấu trúc

- `src/views/Home.vue` — trang chủ: sidebar quốc gia, thanh filter, lưới thẻ spa
  (gọi API `GET /api/spas`).
- `src/views/Detail.vue` — trang chi tiết: gallery ảnh, thông tin, box liên hệ,
  bản đồ, giờ làm việc, bảng giá, bảng dịch vụ, đánh giá (gọi API `GET /api/spas/:id`).
- `src/api/` — lớp gọi REST API từ frontend.
- `src/admin/` — trang quản trị `/admin` (đăng nhập + CRUD spas/categories/countries/admins).
- `src/data/` — dữ liệu mock gốc, nay chỉ được `server/seed/seed.js` dùng làm nguồn
  seed dữ liệu ban đầu vào MySQL.
- `server/` — backend Node.js/Express/mysql2 (REST API + serve ảnh upload + serve
  frontend build khi production).
- `server/src/schema.js` — DDL tạo toàn bộ bảng MySQL, tự chạy khi `npm run seed`
  (chỉ cần tạo sẵn database rỗng, không cần import schema thủ công).
- `src/components/PlaceholderPhoto.vue` — ảnh minh hoạ dạng gradient + icon, dùng
  làm fallback khi spa chưa có ảnh upload thật.
