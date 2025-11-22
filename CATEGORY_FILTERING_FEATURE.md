# 🎯 Category Filtering Feature

## ✨ Tính năng mới

Bây giờ khi bạn click vào bất kỳ collection nào (Shirts & Polos, Bottoms, Outerwear, Innerwear & Underwear, Shoes, Accessories), website sẽ **chỉ hiển thị các sản phẩm thuộc danh mục đó**.

---

## 🔧 Thay đổi kỹ thuật

### Backend Changes:

1. **Category Model** (`Category.java`)
   - Thêm field `slug` để tạo URL thân thiện
   - Ví dụ: "Shirts & Polos" → slug: "shirts-polos"

2. **Category Repository** (`CategoryRepository.java`)
   - Thêm method `findBySlug(String slug)` để tìm category theo slug

3. **Category Service** (`CategoryService.java`)
   - Thêm method `getCategoryBySlug(String slug)`

4. **Category Controller** (`CategoryController.java`)
   - Thêm endpoint mới: `GET /api/category/slug/{slug}`
   - Trả về thông tin category từ slug

### Frontend Changes:

5. **CategoryCollection.jsx**
   - Cải thiện fetch category name từ slug
   - Thêm fallback nếu API call thất bại
   - Tự động format slug thành tên đẹp

### Database:

6. **MongoDB Update Script**
   - Script Python để thêm slug cho tất cả categories có sẵn
   - File: `clothing-backend/update-categories-slug.py`

---

## 📦 Dữ liệu đã update

Các categories đã được thêm slug:

| Category Name          | Slug                   |
|------------------------|------------------------|
| Shirts & Polos         | shirts-polos           |
| Bottoms                | bottoms                |
| Outerwear              | outerwear              |
| Innerwear & Underwear  | innerwear-underwear    |
| Shoes                  | shoes                  |
| Accessories            | accessories            |

---

## 🧪 Cách test

### 1. Đảm bảo Backend và Frontend đang chạy:

**Backend:**
```powershell
cd "d:\van lang\hoc tap\java\Clothing-website-main\clothing-backend"
$env:MONGODB_URI="mongodb://localhost:27017/shopprr" ; $env:MONGODB_DATABASE="shopprr" ; $env:JWT_SECRET="MyVerySecretKeyForJWTToken2024" ; $env:CLOUDINARY_CLOUD_NAME="dtrkvoews" ; $env:CLOUDINARY_API_KEY="993661878773117" ; $env:CLOUDINARY_API_SECRET="AWpafnQ6nEPn_IQC7e8VNUJ1R2k" ; .\gradlew.bat bootRun
```

**Frontend:**
```powershell
cd "d:\van lang\hoc tap\java\Clothing-website-main\client"
npm run dev
```

### 2. Truy cập website: http://localhost:5173

### 3. Scroll xuống phần "Category List"

### 4. Click vào bất kỳ category nào:
   - Shirts & Polos
   - Bottoms
   - Outerwear
   - Innerwear & Underwear
   - Shoes
   - Accessories

### 5. Kiểm tra kết quả:
   - URL sẽ chuyển thành: `/collection/shirts-polos`, `/collection/bottoms`, etc.
   - **Chỉ những sản phẩm thuộc category đó sẽ được hiển thị**
   - Title trên trang sẽ hiển thị tên category

---

## 🔍 API Testing

Test API endpoint mới:

```bash
# Test với curl (PowerShell)
Invoke-RestMethod -Uri "http://localhost:8080/api/category/slug/shirts-polos" -Method Get | ConvertTo-Json

# Expected response:
{
  "success": true,
  "message": "Category found",
  "category": {
    "_id": "...",
    "name": "Shirts & Polos",
    "slug": "shirts-polos",
    "description": "...",
    "image": "...",
    "isActive": true
  }
}
```

---

## 🐛 Troubleshooting

### ❌ Vấn đề: Category không có sản phẩm hiển thị

**Giải pháp:**
1. Kiểm tra sản phẩm có đúng category name không:
   ```javascript
   // Trong MongoDB
   db.products.find({ category: "Shirts & Polos" })
   ```

2. Đảm bảo category name trong product **khớp chính xác** với category name trong categories collection

### ❌ Vấn đề: Backend trả về 404 khi fetch category

**Giải pháp:**
1. Chạy lại script update slug:
   ```powershell
   cd clothing-backend
   python update-categories-slug.py
   ```

2. Restart backend

### ❌ Vấn đề: Frontend hiển thị "undefined" hoặc slug thay vì tên category

**Giải pháp:**
1. Check console log (F12)
2. Xem có lỗi API call không
3. Nếu API call thất bại, component sẽ tự động format slug thành tên đẹp

---

## 📊 Flow diagram

```
User clicks category
        ↓
Navigate to /collection/{slug}
        ↓
Frontend fetches category by slug
        ↓
GET /api/category/slug/{slug}
        ↓
Backend returns category info
        ↓
Frontend filters products by category name
        ↓
Display filtered products
```

---

## 🚀 Next Steps (Tùy chọn)

1. **Thêm breadcrumb navigation:**
   - Home > Collection > {Category Name}

2. **Thêm category filter sidebar:**
   - Cho phép filter nhiều categories cùng lúc

3. **Thêm sort options:**
   - Price: Low to High
   - Price: High to Low
   - Newest First
   - Most Popular

4. **Thêm empty state:**
   - Hiển thị message đẹp khi category không có sản phẩm

---

**✅ Feature đã hoạt động! Giờ khách hàng có thể dễ dàng tìm sản phẩm theo danh mục!**
