# 🛍️ CLOTHING WEBSITE - VELOURA

Website bán quần áo thời trang với React Frontend và Spring Boot Backend.

---

## 📖 HƯỚNG DẪN SETUP TỪ ĐẦU (Cho người mới)

### **1️⃣ Giải nén & Mở Project**
- Tải và giải nén source code
- Mở folder trong VS Code

### **2️⃣ Cài đặt MongoDB**
- Tải MongoDB Community Server từ: https://www.mongodb.com/try/download/community
- Cài đặt với cấu hình mặc định
- Khởi động MongoDB service:
  ```powershell
  net start MongoDB
  ```

### **3️⃣ Thêm Assets (Hình ảnh)**
- Tải images/assets từ video hướng dẫn YouTube
- Đặt vào folder: `client/src/assets/`

### **4️⃣ Cài đặt Dependencies**

**Backend (Java Spring Boot):**
```powershell
cd "d:\van lang\hoc tap\java\Clothing-website-main\clothing-backend"
.\gradlew.bat build
```

**Frontend (React + Vite):**
```powershell
cd "d:\van lang\hoc tap\java\Clothing-website-main\client"
npm install
```

### **5️⃣ Cấu hình môi trường (Tùy chọn)**
- Tạo tài khoản miễn phí trên:
  - **MongoDB Atlas** (nếu muốn dùng cloud database)
  - **Cloudinary** (nếu muốn upload ảnh lên cloud)
  - **Stripe** (nếu muốn tích hợp thanh toán)
- Cập nhật thông tin trong file `.env` hoặc command line

---

## 🚀 CÁCH CHẠY WEBSITE

### **TERMINAL 1 - BACKEND (Spring Boot):**
```powershell
cd "d:\van lang\hoc tap\java\Clothing-website-main\clothing-backend" ; $env:MONGODB_URI="mongodb://localhost:27017/shopprr" ; $env:MONGODB_DATABASE="shopprr" ; $env:JWT_SECRET="MyVerySecretKeyForJWTToken2024" ; $env:CLOUDINARY_CLOUD_NAME="dtrkvoews" ; $env:CLOUDINARY_API_KEY="993661878773117" ; $env:CLOUDINARY_API_SECRET="AWpafnQ6nEPn_IQC7e8VNUJ1R2k" ; .\gradlew.bat bootRun
```

### **TERMINAL 2 - FRONTEND (React + Vite):**
```powershell
cd "d:\van lang\hoc tap\java\Clothing-website-main\client" ; npm run dev
```

---

## 📋 HƯỚNG DẪN CHẠY CHI TIẾT

### **Bước 1: Khởi động Backend**
1. Trong VS Code, nhấn `` Ctrl + ` `` để mở Terminal
2. Copy và paste **LỆNH TERMINAL 1** ở trên
3. Nhấn Enter
4. Đợi đến khi thấy: `Started ClothingBackendApplication in X.XXX seconds`
5. Thấy `80% EXECUTING` là **ĐÚNG** - Backend đang chạy!
   - ⚠️ **ĐỪNG ĐÓNG** terminal này!

### **Bước 2: Khởi động Frontend**
1. Nhấn nút **+** ở góc phải trên Terminal (hoặc `Ctrl+Shift+5`)
2. Copy và paste **LỆNH TERMINAL 2** ở trên
3. Nhấn Enter
4. Đợi đến khi thấy: `Local: http://localhost:5173/`
   - ⚠️ **ĐỪNG ĐÓNG** terminal này!

### **Bước 3: Mở Website**
1. Mở trình duyệt (Chrome, Edge, Firefox...)
2. Truy cập: **http://localhost:5173**
3. Website sẽ hiển thị! 🎉

---

## 🔐 TÀI KHOẢN ĐĂNG NHẬP

### 👑 **ADMIN** (Quản trị viên)
- Email: `admin@veloura.com`
- Password: `admin123`
- Quyền: Quản lý toàn bộ hệ thống

### 👤 **CUSTOMER** (Khách hàng)
- Email: `john.anderson@example.com`
- Password: `password123`
- Quyền: Mua sắm, xem đơn hàng

---

## 🛑 DỪNG WEBSITE

**Cách 1:** Nhấn `Ctrl+C` trong mỗi terminal
**Cách 2:** Click icon 🗑️ (Kill Terminal) ở góc phải trên

### Dừng tất cả Java processes (nếu cần):
```powershell
Get-Process -Name java -ErrorAction SilentlyContinue | Stop-Process -Force
```

---

## 💾 DATABASE

### **MongoDB:** `shopprr` (localhost:27017)
### **Collections:**
- ✅ `users` - Người dùng (Admin, Customer)
- ✅ `products` - Sản phẩm
- ✅ `categories` - Danh mục sản phẩm
- ✅ `orders` - Đơn hàng
- ✅ `reviews` - Đánh giá sản phẩm
- ✅ `blogs` - Bài viết blog
- ✅ `testimonials` - Phản hồi khách hàng
- ✅ `contacts` - Liên hệ

---

## ⚙️ CÔNG NGHỆ SỬ DỤNG

### **Backend:**
- ☕ **Spring Boot** 3.5.7
- ☕ **Java** 21
- 🍃 **MongoDB** (NoSQL Database)
- 🐘 **Gradle** (Build tool)
- 🔐 **JWT** (Authentication)
- 📦 **Lombok** (Reduce boilerplate)
- 🌐 **Port:** 8080

### **Frontend:**
- ⚛️ **React** 19.1.0
- ⚡ **Vite** 6.3.5 (Fast build tool)
- 🎨 **TailwindCSS** (Styling)
- 📡 **Axios** (HTTP client)
- 🔄 **React Router** (Navigation)
- 🍞 **React Hot Toast** (Notifications)
- 📊 **Recharts** (Charts for admin)
- 🌐 **Port:** 5173

---

## ❌ XỬ LÝ LỖI THƯỜNG GẶP

### **🔴 Lỗi: Port 8080 đã được sử dụng**
```powershell
# Kill tất cả Java processes
Get-Process -Name java -ErrorAction SilentlyContinue | Stop-Process -Force
```

### **🔴 Lỗi: Port 5173 đã được sử dụng**
```powershell
# Kill tất cả Node processes
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### **🔴 Lỗi: MongoDB không chạy**
```powershell
# Khởi động MongoDB service
net start MongoDB
```

### **🔴 Lỗi: Cannot connect to MongoDB**
1. Kiểm tra MongoDB đang chạy:
   ```powershell
   Get-Service MongoDB
   ```
2. Nếu chưa chạy, start service:
   ```powershell
   net start MongoDB
   ```

### **🔴 Lỗi: Gradle build failed**
```powershell
# Clean và rebuild
cd "d:\van lang\hoc tap\java\Clothing-website-main\clothing-backend"
.\gradlew.bat clean build
```

### **🟢 Kiểm tra Backend có chạy không:**
```powershell
Test-NetConnection localhost -Port 8080
```

### **🟢 Kiểm tra Frontend có chạy không:**
```powershell
Test-NetConnection localhost -Port 5173
```

### **🟢 Kiểm tra MongoDB có chạy không:**
```powershell
Test-NetConnection localhost -Port 27017
```

---

## 💡 LƯU Ý QUAN TRỌNG

- ✅ Backend hiển thị `80% EXECUTING` là **BÌNH THƯỜNG** - nghĩa là đang chạy
- ✅ **ĐỪNG ĐÓNG** 2 terminal khi website đang chạy
- ✅ Backend khởi động mất ~30-40 giây
- ✅ Frontend khởi động mất ~5-10 giây
- ✅ Nhấn `Ctrl+Shift+R` trong browser để hard refresh (xóa cache)
- ✅ Nếu sửa code Backend, cần restart terminal Backend
- ✅ Nếu sửa code Frontend, Vite tự động reload (Hot Module Replacement)

---

## 📁 CẤU TRÚC DỰ ÁN

```
Clothing-website-main/
├── 📂 client/                      # React Frontend
│   ├── public/                    # Static files
│   ├── src/
│   │   ├── assets/               # Images, icons
│   │   ├── components/           # React components
│   │   │   ├── admin/           # Admin components
│   │   │   ├── Blog.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ...
│   │   ├── pages/               # Pages
│   │   │   ├── admin/          # Admin pages
│   │   │   │   ├── AddProduct.jsx
│   │   │   │   ├── List.jsx
│   │   │   │   ├── Orders.jsx
│   │   │   │   ├── ListCustomer.jsx
│   │   │   │   └── Report.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Collection.jsx
│   │   │   └── ...
│   │   ├── context/            # Context API (Global state)
│   │   │   └── ShopContext.jsx
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── package.json           # Dependencies
│   ├── vite.config.js         # Vite configuration
│   └── tailwind.config.js     # TailwindCSS config
│
├── 📂 clothing-backend/           # Spring Boot Backend
│   ├── src/
│   │   ├── main/java/com/shopprr/clothing_backend/
│   │   │   ├── controller/    # REST API endpoints
│   │   │   │   ├── OrderController.java
│   │   │   │   ├── ProductController.java
│   │   │   │   ├── UserController.java
│   │   │   │   └── ...
│   │   │   ├── service/       # Business logic
│   │   │   │   ├── OrderService.java
│   │   │   │   ├── ProductService.java
│   │   │   │   ├── UserService.java
│   │   │   │   └── ...
│   │   │   ├── model/        # Data models (MongoDB documents)
│   │   │   │   ├── Order.java
│   │   │   │   ├── Product.java
│   │   │   │   ├── User.java
│   │   │   │   └── ...
│   │   │   ├── repository/   # MongoDB repositories
│   │   │   │   ├── OrderRepository.java
│   │   │   │   ├── ProductRepository.java
│   │   │   │   ├── UserRepository.java
│   │   │   │   └── ...
│   │   │   ├── dto/         # Data Transfer Objects
│   │   │   ├── config/      # Configuration classes
│   │   │   └── ClothingBackendApplication.java
│   │   └── main/resources/
│   │       └── application.properties
│   ├── build.gradle          # Gradle dependencies
│   ├── gradlew.bat          # Gradle wrapper (Windows)
│   └── settings.gradle      # Gradle settings
│
├── 📄 README.md               # File này - Hướng dẫn đầy đủ
├── 📄 Setup Guide.txt        # (Đã được gộp vào README)
└── 📄 CHAY-WEB.txt          # (Đã được gộp vào README)
```

---

## 🎯 TÍNH NĂNG CHÍNH

### **🛍️ Khách hàng (Customer):**
- ✅ Xem danh sách sản phẩm với phân trang
- ✅ Tìm kiếm sản phẩm theo tên
- ✅ Lọc sản phẩm theo danh mục
- ✅ Xem chi tiết sản phẩm
- ✅ Thêm sản phẩm vào giỏ hàng
- ✅ Cập nhật số lượng trong giỏ hàng
- ✅ Xóa sản phẩm khỏi giỏ hàng
- ✅ Đặt hàng (COD - Cash on Delivery)
- ✅ Xem lịch sử đơn hàng
- ✅ Theo dõi trạng thái đơn hàng
- ✅ Đánh giá sản phẩm
- ✅ Đăng nhập / Đăng ký
- ✅ Cập nhật thông tin cá nhân
- ✅ Liên hệ qua form

### **👑 Quản trị viên (Admin):**
- ✅ **Quản lý sản phẩm:**
  - Thêm sản phẩm mới (với upload ảnh)
  - Sửa thông tin sản phẩm
  - Xóa sản phẩm
  - Xem danh sách sản phẩm
- ✅ **Quản lý đơn hàng:**
  - Xem tất cả đơn hàng
  - Cập nhật trạng thái đơn hàng (Pending → Packing → Shipped → Delivered)
  - Xóa đơn hàng
- ✅ **Quản lý khách hàng:**
  - Xem danh sách khách hàng
  - Thêm khách hàng mới
  - Sửa thông tin khách hàng
  - Xóa khách hàng
- ✅ **Báo cáo & Thống kê:**
  - Tổng doanh thu
  - Tổng số đơn hàng
  - Tổng số khách hàng
  - Tổng số sản phẩm
  - Biểu đồ doanh thu theo tháng (Bar Chart)
  - Biểu đồ doanh thu theo danh mục (Pie Chart)
  - Danh sách đơn hàng gần nhất
  - Sản phẩm bán chạy nhất

### **📝 Tính năng khác:**
- ✅ Blog posts
- ✅ Testimonials (Phản hồi khách hàng)
- ✅ Contact form
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Dark/Light mode ready
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications

---

## 🔒 BẢO MẬT

- 🔐 **JWT Authentication** - Token-based authentication
- 🍪 **HTTP-only Cookies** - Secure cookie storage
- 🔑 **BCrypt Password Hashing** - Secure password encryption
- 🛡️ **CORS Protection** - Cross-Origin Resource Sharing
- ✅ **Input Validation** - Server-side validation
- 🚫 **XSS Protection** - Prevent Cross-Site Scripting

---

## 🌐 API ENDPOINTS

### **👤 User APIs:**
```
POST   /api/user/register       # Đăng ký
POST   /api/user/login          # Đăng nhập
POST   /api/user/logout         # Đăng xuất
GET    /api/user/authenticated  # Kiểm tra đăng nhập
POST   /api/user/update         # Cập nhật thông tin
POST   /api/user/delete         # Xóa user
GET    /api/user/list-all       # Lấy danh sách user (Admin)
```

### **🛍️ Product APIs:**
```
GET    /api/product/list        # Lấy danh sách sản phẩm
GET    /api/product/single      # Lấy chi tiết sản phẩm
POST   /api/product/add         # Thêm sản phẩm (Admin)
POST   /api/product/update      # Cập nhật sản phẩm (Admin)
POST   /api/product/delete      # Xóa sản phẩm (Admin)
POST   /api/product/remove      # Xóa sản phẩm (Admin - alias)
```

### **📦 Order APIs:**
```
POST   /api/order/cod           # Đặt hàng COD
POST   /api/order/userorders    # Lấy đơn hàng của user
POST   /api/order/list          # Lấy tất cả đơn hàng (Admin)
POST   /api/order/status        # Cập nhật trạng thái (Admin)
```

### **🛒 Cart APIs:**
```
POST   /api/cart/add            # Thêm vào giỏ
POST   /api/cart/update         # Cập nhật giỏ hàng
GET    /api/cart/get            # Lấy giỏ hàng
```

### **📝 Category APIs:**
```
GET    /api/category/list       # Lấy danh sách danh mục
```

---

## 🐛 DEBUG & TROUBLESHOOTING

### **Kiểm tra logs Backend:**
- Xem terminal đang chạy Backend
- Log sẽ hiển thị tất cả API requests
- Ví dụ: `Securing POST /api/order/list`

### **Kiểm tra logs Frontend:**
- Mở Console trong trình duyệt (F12)
- Tab "Console" sẽ hiển thị errors/warnings
- Tab "Network" sẽ hiển thị API calls

### **Debug MongoDB:**
```powershell
# Connect to MongoDB shell
mongosh

# Chọn database
use shopprr

# Xem collections
show collections

# Xem users
db.users.find().pretty()

# Xem products
db.products.find().pretty()

# Xem orders
db.orders.find().pretty()
```

---

## 📚 TÀI LIỆU THAM KHẢO

- **Spring Boot:** https://spring.io/projects/spring-boot
- **React:** https://react.dev/
- **Vite:** https://vitejs.dev/
- **TailwindCSS:** https://tailwindcss.com/
- **MongoDB:** https://www.mongodb.com/docs/
- **Recharts:** https://recharts.org/

---

## 🤝 HỖ TRỢ

- 💬 Nếu cần trợ giúp, hãy liên hệ qua:
  - Email: support@veloura.com
  - Video tutorial trên YouTube
- 📖 Đọc kỹ README này trước khi hỏi
- 🐛 Report bugs qua GitHub Issues

---

## 📝 GHI CHÚ PHIÊN BẢN

### Version 1.0.0 (Current)
- ✅ Hoàn thành tất cả tính năng cơ bản
- ✅ Admin panel đầy đủ chức năng
- ✅ Report & Analytics với biểu đồ
- ✅ Responsive design
- ✅ Authentication & Authorization
- ✅ MongoDB integration
- ✅ REST API hoàn chỉnh

---

**🎉 Chúc bạn code vui vẻ và thành công! 🚀**

---

*📅 Last Updated: November 20, 2025*
*👨‍💻 Developed with ❤️ using Spring Boot & React*
- Email: `staff@veloura.com`
- Password: `password123`

### 👤 **CUSTOMER**
- Email: `john.anderson@example.com`
- Password: `password123`

---

## 🛑 DỪNG WEBSITE

- Nhấn `Ctrl+C` trong terminal đang chạy
- Hoặc click icon 🗑️ (Kill Terminal)

---

## 💾 DATABASE

### **MongoDB:** `shopprr` (localhost:27017)
### **Collections:**
- ✅ `blogs`
- ✅ `categories`
- ✅ `contacts`
- ✅ `orders`
- ✅ `products`
- ✅ `reviews`
- ✅ `testimonials`
- ✅ `users`

---

## ⚙️ CÔNG NGHỆ SỬ DỤNG

### **Backend:**
- Spring Boot 3.5.7
- Java 21
- MongoDB
- Gradle
- Port: 8080

### **Frontend:**
- React 19.1.0
- Vite 6.3.5
- TailwindCSS
- Axios
- Port: 5173

---

## ❌ XỬ LÝ LỖI

### **Lỗi: Port 8080 đã được sử dụng**
```powershell
Get-Process -Name java -ErrorAction SilentlyContinue | Stop-Process -Force
```

### **Lỗi: Port 5173 đã được sử dụng**
```powershell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### **Lỗi: MongoDB không chạy**
```powershell
net start MongoDB
```

### **Kiểm tra Backend có chạy không:**
```powershell
Test-NetConnection localhost -Port 8080
```

### **Kiểm tra Frontend có chạy không:**
```powershell
Test-NetConnection localhost -Port 5173
```

---

## 💡 LƯU Ý QUAN TRỌNG

- ✅ Backend hiển thị `80% EXECUTING` là **BÌNH THƯỜNG** - nghĩa là đang chạy
- ✅ **ĐỪNG ĐÓNG** 2 terminal khi website đang chạy
- ✅ Backend khởi động ~30-40 giây
- ✅ Frontend khởi động ~5 giây
- ✅ Nhấn `Ctrl+Shift+R` trong browser để hard refresh

---

## 📁 CẤU TRÚC DỰ ÁN

```
Clothing-website-main/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Pages
│   │   └── context/         # Context API
│   └── package.json
├── clothing-backend/         # Spring Boot Backend
│   ├── src/
│   │   ├── main/java/       # Java source code
│   │   └── main/resources/  # Configuration
│   ├── build.gradle         # Gradle config
│   └── gradlew.bat         # Gradle wrapper
└── README.md               # File này
```

---

## 🎯 TÍNH NĂNG

- ✅ Xem danh sách sản phẩm
- ✅ Xem chi tiết sản phẩm
- ✅ Tìm kiếm và lọc sản phẩm
- ✅ Giỏ hàng
- ✅ Đặt hàng
- ✅ Đăng nhập / Đăng ký
- ✅ Quản lý đơn hàng (Admin)
- ✅ Quản lý sản phẩm (Admin)
- ✅ Reviews & Testimonials
- ✅ Blog
- ✅ Contact form

---

**Chúc bạn code vui vẻ! 🎉**