# Spa Directory — Kiến trúc & Hướng dẫn deploy

## Kiến trúc

```
web_a_minh/
├── src/            Frontend Vue 3 (Home/Detail = trang public, admin/ = trang quản trị)
├── server/         Backend Node.js + Express + mysql2 (REST API)
│   ├── src/        Route, middleware, kết nối DB, schema.js (DDL tạo bảng)
│   ├── seed/seed.js  Tự tạo bảng nếu chưa có (schema.js) rồi import dữ liệu
│   │                 mock (src/data/*.js) vào MySQL
│   └── uploads/spas/ Ảnh spa được admin upload (phục vụ tại /uploads/spas/...)
└── dist/           Frontend đã build (`npm run build`), được server Express serve tĩnh khi deploy
```

Ở production, **một tiến trình Node duy nhất** (server/) vừa phục vụ REST API (`/api/*`),
vừa serve ảnh upload (`/uploads/*`), vừa serve frontend đã build (`dist/`) — không cần
web server tĩnh riêng, không cần cấu hình CORS (cùng origin).

Ở development, chạy 2 tiến trình song song: `vite` (frontend, cổng 5173) và Express
(backend, cổng 3000) — `vite.config.js` đã cấu hình proxy `/api` và `/uploads` sang
`http://localhost:3000`.

`src/data/spas.js`, `categories.js`, `countries.js` (mock cũ) vẫn còn trong repo — giờ
chỉ được `server/seed/seed.js` import làm nguồn dữ liệu seed ban đầu, **frontend không
còn import các file này nữa** (đã chuyển sang gọi API qua `src/api/*.js`).

## 1. Cài đặt lần đầu (local)

```powershell
# 1. Tạo database MySQL rỗng (không cần import schema thủ công - bước seed
#    bên dưới sẽ tự tạo toàn bộ bảng nếu chưa tồn tại)
mysql -u root -p -e "CREATE DATABASE spa_directory CHARACTER SET utf8mb4"

# 2. Cấu hình backend
cd server
copy .env.example .env
# Mở .env, điền DB_HOST/DB_USER/DB_PASSWORD/DB_NAME, JWT_SECRET,
# và ADMIN_SEED_USERNAME/EMAIL/PASSWORD (tài khoản admin đầu tiên).
npm install

# 3. Tạo bảng (nếu chưa có) + seed dữ liệu mock + tạo admin đầu tiên
npm run seed

# 4. Chạy backend (dev, tự reload khi sửa code)
npm run dev
```

Mở terminal thứ 2, cài & chạy frontend:

```powershell
cd d:\web_a_minh
npm install
npm run dev
```

Truy cập:
- Trang chính: http://localhost:5173/
- Trang admin: http://localhost:5173/admin/login (đăng nhập bằng
  `ADMIN_SEED_USERNAME` / `ADMIN_SEED_PASSWORD` đã đặt trong `server/.env`)

## 2. Build & deploy lên hosting

Giả sử hosting chạy được Node.js (VPS, Render, Railway, cPanel có Node app, ...) và có
MySQL riêng (hoặc managed MySQL).

```powershell
# Build frontend -> tạo thư mục dist/ ở gốc project
npm install
npm run build

# Cài dependency backend
cd server
npm install --omit=dev
```

Upload lên hosting **toàn bộ** các thư mục: `dist/`, `server/` (bao gồm
`server/node_modules` nếu không cài lại được trên host).
`server/uploads/spas/` phải là thư mục **ghi được** và được giữ nguyên qua các lần deploy
(ảnh admin upload lưu ở đây) — không xoá khi deploy lại.

Trên hosting:

1. Tạo database MySQL rỗng trên host (qua CLI, phpMyAdmin/Adminer nếu dùng cPanel, ...).
   Không cần import schema thủ công - bước seed ở dưới tự tạo bảng.
2. Tạo file `server/.env` (không commit file này) với thông tin DB thật của hosting +
   `JWT_SECRET` (random, dài) + `ADMIN_SEED_*`.
3. Chạy seed 1 lần để tạo bảng (nếu chưa có) + đổ dữ liệu demo + tạo admin đầu tiên:
   `cd server && npm run seed`
4. Chạy server: `node src/index.js` (hoặc `npm start` trong `server/`), cấu hình
   `PORT` theo yêu cầu của host (nhiều host tự set biến môi trường `PORT`).
5. Trỏ domain/subdomain vào tiến trình Node này (hoặc dùng PM2/systemd để giữ nó luôn
   chạy, ví dụ: `pm2 start src/index.js --name spa-directory --cwd server`).

Sau bước 4, cả trang chính, trang admin và API đều phục vụ từ cùng 1 URL (vì Express
serve `dist/` tĩnh + fallback SPA cho mọi route không phải `/api` hoặc `/uploads`).

## 3. Backup / thay đổi dữ liệu sau này

- `npm run seed` (trong `server/`) an toàn để chạy lại: dùng
  `INSERT ... ON DUPLICATE KEY UPDATE`, sẽ không tạo trùng lặp — nhưng nó UPDATE các
  bảng `spas/categories/countries` về đúng dữ liệu trong `src/data/*.js`, nên **không
  chạy lại seed sau khi đã có dữ liệu thật do admin nhập/sửa** trừ khi chỉ muốn đồng bộ
  lại phần dữ liệu demo ban đầu.
- Từ sau khi seed xong, mọi thay đổi dữ liệu nên thực hiện qua trang `/admin`.
