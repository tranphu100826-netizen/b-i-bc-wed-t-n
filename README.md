# NgonNgay — Ứng dụng đặt món ăn trực tuyến (MERN Stack)

Ứng dụng full-stack cho phép người dùng đăng ký/đăng nhập, xem nhà hàng và món ăn, tìm kiếm/lọc, thêm vào giỏ hàng, đặt hàng (có mã giảm giá), theo dõi trạng thái đơn **theo thời gian thực**, và quản trị viên quản lý người dùng/món ăn/đơn hàng/mã giảm giá.

## 🚀 Cách chạy nhanh nhất: Docker (khuyên dùng)

Nếu máy bạn từng gặp khó khăn khi cài Node.js / MongoDB / lỗi kết nối Atlas, cách này giúp bạn bỏ qua TẤT CẢ các bước đó. Chỉ cần cài **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (1 lần duy nhất), sau đó:

```bash
cp .env.example .env
docker compose up --build
```

Đợi vài phút để build xong, sau đó:
- Mở trình duyệt vào **http://localhost:5173** để dùng web
- Tạo dữ liệu mẫu (chỉ cần chạy 1 lần đầu):
  ```bash
  docker compose exec server npm run seed
  ```

Docker sẽ tự động: cài MongoDB (chạy nội bộ, không cần MongoDB Atlas, không lỗi DNS), cài Node.js, cài toàn bộ thư viện, build và chạy cả backend lẫn frontend — chỉ với các lệnh ở trên.

Dừng toàn bộ hệ thống: `docker compose down` (dữ liệu vẫn được giữ lại nhờ Docker volume, chạy `docker compose up` lại là có ngay).

---

## Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Front-end | React 18 (Vite), React Router, Axios, Socket.IO Client |
| Back-end | Node.js, Express.js, Socket.IO |
| Database | MongoDB (Mongoose) |
| Xác thực | JWT (JSON Web Token) + bcrypt |
| Log & giám sát | Winston (ghi log ra file), Morgan (log HTTP request) |
| Đóng gói | Docker, Docker Compose |
| Công cụ | VS Code, Git/GitHub, Postman |

## Cấu trúc dự án

```
food-order/
├── client/          # React - giao diện người dùng
│   ├── Dockerfile / nginx.conf
│   └── src/
│       ├── pages/         # Home, Foods, RestaurantDetail, Cart, Checkout, Orders, Favorites, Profile, Admin...
│       ├── components/    # Navbar, FoodCard, RestaurantCard, StarRating, Pagination, ProtectedRoute, ErrorBoundary
│       ├── context/       # AuthContext (JWT), CartContext, ToastContext, SocketContext (realtime)
│       └── services/api.js
├── server/          # Node.js + Express - API
│   ├── Dockerfile
│   ├── models/        # User, Restaurant, Food, Order, Review, Coupon (Mongoose schemas)
│   ├── controllers/   # Logic xử lý cho từng route
│   ├── routes/         # Định nghĩa endpoint API
│   ├── validators/     # Quy tắc validate input (express-validator) cho từng nhóm API
│   ├── middleware/     # auth (JWT), errorHandler, notFound, validate, upload (multer)
│   ├── utils/           # AppError, generateToken, paginate, logger (winston), socket (Socket.IO)
│   ├── tests/            # Bộ test Jest + Supertest
│   ├── logs/             # File log lỗi/hoạt động (tự tạo khi chạy)
│   ├── uploads/          # Ảnh đã upload (tự tạo khi chạy)
│   ├── app.js             # Cấu hình Express app (dùng chung cho server thật & test)
│   ├── server.js          # Điểm khởi chạy: kết nối DB + khởi tạo Socket.IO + lắng nghe cổng
│   └── seed.js             # Script tạo dữ liệu mẫu (kèm mã giảm giá mẫu)
├── database/        # Ghi chú cấu hình MongoDB (dùng khi KHÔNG chạy Docker)
├── docs/
│   ├── API.md                              # Tài liệu API chi tiết
│   └── NgonNgay.postman_collection.json    # Bộ sưu tập Postman sẵn dùng
├── docker-compose.yml   # Chạy toàn bộ hệ thống (Mongo + Server + Client) bằng 1 lệnh
└── README.md
```

## Chức năng chính

- ✅ Đăng ký, đăng nhập (JWT), đổi mật khẩu, cập nhật hồ sơ
- ✅ Xem danh sách nhà hàng và món ăn (có phân trang)
- ✅ Tìm kiếm, lọc món ăn theo tên / danh mục / giá, gợi ý tìm kiếm nhanh (autocomplete)
- ✅ Giỏ hàng (lưu tạm ở trình duyệt, theo từng nhà hàng)
- ✅ **Mã giảm giá** (theo % hoặc số tiền cố định, giới hạn mức giảm tối đa, đơn tối thiểu, số lượt dùng, ngày hết hạn)
- ✅ Đặt hàng, kiểm tra giờ mở/đóng cửa nhà hàng, chọn phương thức thanh toán (COD / chuyển khoản)
- ✅ **Theo dõi trạng thái đơn hàng REALTIME qua Socket.IO** (cập nhật tức thì khi admin đổi trạng thái, không cần tự làm mới trang), kèm polling dự phòng nếu mất kết nối
- ✅ **Admin nhận thông báo tức thì khi có đơn hàng mới** (không cần bấm F5)
- ✅ Hủy đơn hàng (khi còn ở trạng thái chờ/đã xác nhận)
- ✅ Đánh giá nhà hàng (sao + bình luận), món ăn yêu thích
- ✅ Upload ảnh thật cho món ăn/nhà hàng
- ✅ Trang quản trị: thống kê doanh thu/top món bán chạy, **quản lý mã giảm giá**, quản lý người dùng (khóa/cấp quyền/tìm kiếm), quản lý nhà hàng & món ăn (CRUD + upload ảnh), quản lý & cập nhật trạng thái đơn hàng, **xuất danh sách đơn hàng ra file CSV/Excel**
- ✅ Bảo mật: validate input chi tiết, chống NoSQL injection, rate-limit chống spam/brute-force, xử lý lỗi tập trung
- ✅ **Ổn định & giám sát**: ghi log lỗi ra file (Winston), endpoint `/api/health` kiểm tra tình trạng server + DB, bắt lỗi runtime không mong muốn (uncaughtException/unhandledRejection), **Error Boundary** ở frontend chống crash trắng màn hình
- ✅ Bộ test tự động (Jest + Supertest) cho các luồng chính: auth, nhà hàng/món ăn, đơn hàng, mã giảm giá
- ✅ **Đóng gói Docker** — chạy toàn bộ hệ thống (kể cả MongoDB) chỉ với 1 lệnh, không cần cài đặt thủ công

## Cài đặt & chạy thử (không dùng Docker)

Nếu bạn muốn chạy trực tiếp bằng Node.js (không qua Docker):

### 1. Yêu cầu
- Node.js ≥ 18
- MongoDB (cài local hoặc dùng MongoDB Atlas — xem `database/README.md`)

### 2. Cài đặt Back-end

```bash
cd server
npm install
cp .env.example .env     # rồi chỉnh MONGO_URI, JWT_SECRET trong file .env
npm run seed              # (tùy chọn) tạo dữ liệu mẫu + tài khoản admin + mã giảm giá mẫu
npm run dev                # chạy server tại http://localhost:5000
```

Tài khoản mẫu sau khi seed:
- Admin: `admin@foodorder.com` / `admin123`
- User: `user@foodorder.com` / `user1234`

Mã giảm giá mẫu: `CHAOMUNG10` (giảm 10%, tối đa 30k), `GIAM20K` (giảm 20k cho đơn từ 100k), `FREESHIP` (giảm 15k mọi đơn).

### 3. Cài đặt Front-end

```bash
cd client
npm install
cp .env.example .env      # đảm bảo VITE_API_URL trỏ đúng tới server
npm run dev                 # chạy tại http://localhost:5173
```

### 4. Kiểm thử API bằng Postman
Import file `docs/NgonNgay.postman_collection.json` vào Postman (File → Import). Bộ sưu tập đã có sẵn toàn bộ endpoint, biến `{{baseUrl}}`, `{{token}}` (tự động lưu sau khi gọi "Đăng nhập"). Chạy theo thứ tự: Đăng nhập (Admin) → Tạo nhà hàng → Tạo món ăn → các API còn lại.

Xem tài liệu chi tiết từng endpoint (request/response mẫu, mã lỗi) tại **[docs/API.md](docs/API.md)**.

### 5. Chạy bộ test tự động (backend)

```bash
cd server
npm install
npm test
```

Bộ test dùng **Jest + Supertest + mongodb-memory-server** (tự khởi tạo MongoDB tạm trong bộ nhớ, không ảnh hưởng tới dữ liệu thật, không cần MongoDB đang chạy sẵn). Bao phủ các luồng: đăng ký/đăng nhập, phân quyền admin, validate dữ liệu, tạo/lọc/xóa nhà hàng & món ăn, tạo/hủy/cập nhật trạng thái đơn hàng, mã giảm giá, kiểm tra quyền truy cập giữa các người dùng.

> Lưu ý: lần chạy `npm test` đầu tiên, `mongodb-memory-server` cần tải file nhị phân MongoDB (~vài chục MB) — máy chạy test cần có kết nối Internet lần đầu đó.

## Realtime hoạt động như thế nào?

Server dùng **Socket.IO**, gắn vào cùng cổng với API (`http://localhost:5000`). Khi người dùng đăng nhập, trình duyệt tự kết nối socket và "xác thực" bằng JWT để tham gia đúng "phòng" của mình:
- Khi admin đổi trạng thái đơn hàng → chỉ người đặt đơn đó nhận được thông báo tức thì (sự kiện `order:statusChanged`)
- Khi có khách đặt đơn mới → tất cả admin đang online nhận được thông báo tức thì (sự kiện `order:new`)

Nếu socket mất kết nối tạm thời (mất mạng, server restart...), trang chi tiết đơn hàng vẫn tự làm mới mỗi 20 giây làm phương án dự phòng, đảm bảo thông tin không bị "đứng hình" quá lâu.

## Danh sách API chính

Xem đầy đủ, chi tiết (kèm ví dụ request/response) tại **[docs/API.md](docs/API.md)**. Tóm tắt:

| Method | Endpoint | Mô tả | Quyền |
|---|---|---|---|
| GET | /api/health | Kiểm tra tình trạng server + DB | Public |
| POST | /api/auth/register | Đăng ký | Public |
| POST | /api/auth/login | Đăng nhập | Public |
| GET/PUT | /api/auth/me | Xem/cập nhật thông tin cá nhân | User |
| PUT | /api/auth/change-password | Đổi mật khẩu | User |
| GET | /api/users/favorites | Danh sách món yêu thích | User |
| POST | /api/users/favorites/:foodId | Toggle yêu thích món ăn | User |
| GET | /api/restaurants?search=&page=&limit= | Danh sách nhà hàng | Public |
| GET | /api/restaurants/:id | Chi tiết nhà hàng + món ăn + đánh giá | Public |
| POST/PUT/DELETE | /api/restaurants | Quản lý nhà hàng | Admin |
| GET | /api/foods/categories | Danh mục món ăn | Public |
| GET | /api/foods/suggest?q= | Gợi ý tìm kiếm nhanh | Public |
| GET | /api/foods?search=&category=&maxPrice=&page= | Danh sách món ăn (lọc) | Public |
| POST/PUT/DELETE | /api/foods | Quản lý món ăn | Admin |
| POST | /api/coupons/validate | Kiểm tra mã giảm giá trước khi đặt hàng | User |
| GET/POST/PUT/DELETE | /api/coupons | Quản lý mã giảm giá | Admin |
| POST | /api/orders | Tạo đơn hàng (có thể kèm couponCode) | User |
| GET | /api/orders/my | Đơn hàng của tôi | User |
| GET | /api/orders/:id | Chi tiết 1 đơn (theo dõi realtime) | User/Admin |
| PUT | /api/orders/:id/cancel | Hủy đơn hàng | User |
| GET | /api/orders | Tất cả đơn hàng | Admin |
| PUT | /api/orders/:id/status | Cập nhật trạng thái đơn (báo realtime cho khách) | Admin |
| POST | /api/reviews | Gửi/cập nhật đánh giá nhà hàng | User |
| GET | /api/reviews/restaurant/:id | Đánh giá của 1 nhà hàng | Public |
| POST | /api/upload | Upload ảnh (món ăn/nhà hàng) | Admin |
| GET | /api/admin/stats | Thống kê doanh thu, top món bán chạy | Admin |
| GET/PUT/DELETE | /api/admin/users | Quản lý người dùng | Admin |

## Lộ trình triển khai lên Internet (gợi ý)

**Cách 1 — Dùng Docker (đơn giản nhất):** thuê 1 VPS (DigitalOcean, Vultr...), cài Docker, copy code lên, chạy `docker compose up -d --build`. Nhớ đổi `JWT_SECRET` trong `.env` và mở port 5173/5000 trên firewall (hoặc đặt Nginx/Caddy làm reverse proxy phía trước với domain riêng + SSL).

**Cách 2 — Triển khai từng phần riêng lẻ:**
1. **Back-end**: triển khai lên Render / Railway / Fly.io (kết nối MongoDB Atlas)
2. **Front-end**: build (`npm run build`) rồi triển khai lên Vercel / Netlify
3. Cập nhật `VITE_API_URL` (client) và `CLIENT_URL` (server, để cấu hình CORS) trỏ đúng domain đã deploy
4. Lưu ý Socket.IO cần nền tảng hỗ trợ WebSocket (Render/Railway/Fly.io đều hỗ trợ; một số gói serverless như Vercel Functions KHÔNG phù hợp để chạy phần server có Socket.IO)

## Ghi chú bảo mật & ổn định khi triển khai thật
- Đổi `JWT_SECRET` thành chuỗi ngẫu nhiên, đủ dài, giữ bí mật (đã có rate-limit, helmet, chống NoSQL injection sẵn trong code)
- Không commit file `.env` lên Git (đã có trong `.gitignore` mẫu)
- Đặt `NODE_ENV=production` khi triển khai thật để ẩn chi tiết lỗi kỹ thuật (stack trace) khỏi client
- Theo dõi file `server/logs/error.log` định kỳ để phát hiện sớm lỗi hệ thống
- Gọi thử `GET /api/health` sau khi deploy để xác nhận server + kết nối DB hoạt động bình thường
- Cân nhắc thêm HTTPS (thường do nền tảng hosting như Render/Vercel tự cấp, hoặc dùng Caddy/Nginx + Let's Encrypt nếu tự host bằng Docker)
