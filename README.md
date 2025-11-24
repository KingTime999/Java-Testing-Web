# 🛍️ CLOTHING WEBSITE - VELOURA

Fashion clothing e-commerce website with React Frontend and Spring Boot Backend.

---

## 📖 SETUP GUIDE FROM SCRATCH (For Beginners)

### **1️⃣ Extract & Open Project**
- Download and extract source code
- Open folder in VS Code

### **2️⃣ Install MongoDB**
- Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
- Install with default configuration
- Start MongoDB service:
  ```powershell
  net start MongoDB
  ```

### **3️⃣ Add Assets (Images)**
- Download images/assets from YouTube tutorial video
- Place in folder: `client/src/assets/`

### **4️⃣ Install Dependencies**

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

### **5️⃣ Environment Configuration (Optional)**
- Create free accounts on:
  - **MongoDB Atlas** (if you want to use cloud database)
  - **Cloudinary** (if you want to upload images to cloud)
  - **Stripe** (if you want to integrate payment)
- Update information in `.env` file or command line

---

## 🚀 HOW TO RUN THE WEBSITE

### **TERMINAL 1 - BACKEND (Spring Boot):**
```powershell
cd "d:\van lang\hoc tap\java\Clothing-website-main\clothing-backend" ; $env:MONGODB_URI="mongodb://localhost:27017/shopprr" ; $env:MONGODB_DATABASE="shopprr" ; $env:JWT_SECRET="MyVerySecretKeyForJWTToken2024" ; $env:CLOUDINARY_CLOUD_NAME="dtrkvoews" ; $env:CLOUDINARY_API_KEY="993661878773117" ; $env:CLOUDINARY_API_SECRET="AWpafnQ6nEPn_IQC7e8VNUJ1R2k" ; .\gradlew.bat bootRun
```

### **TERMINAL 2 - FRONTEND (React + Vite):**
```powershell
cd "d:\van lang\hoc tap\java\Clothing-website-main\client" ; npm run dev
```

---

## 📋 DETAILED RUNNING GUIDE

### **Step 1: Start Backend**
1. In VS Code, press `` Ctrl + ` `` to open Terminal
2. Copy and paste **TERMINAL 1 COMMAND** above
3. Press Enter
4. Wait until you see: `Started ClothingBackendApplication in X.XXX seconds`
5. Seeing `80% EXECUTING` is **CORRECT** - Backend is running!
   - ⚠️ **DO NOT CLOSE** this terminal!

### **Step 2: Start Frontend**
1. Click **+** button on top right of Terminal (or `Ctrl+Shift+5`)
2. Copy and paste **TERMINAL 2 COMMAND** above
3. Press Enter
4. Wait until you see: `Local: http://localhost:5173/`
   - ⚠️ **DO NOT CLOSE** this terminal!

### **Step 3: Open Website**
1. Open browser (Chrome, Edge, Firefox...)
2. Navigate to: **http://localhost:5173**
3. Website will display! 🎉

---

## 🔐 LOGIN ACCOUNTS

### 👑 **ADMIN** (Administrator)
- Email: `admin@veloura.com`
- Password: `admin123`
- Access: Full system management

### 👤 **CUSTOMER**
- Email: `john.anderson@example.com`
- Password: `password123`
- Access: Shopping, view orders

---

## 🛑 STOP WEBSITE

**Method 1:** Press `Ctrl+C` in each terminal
**Method 2:** Click 🗑️ icon (Kill Terminal) on top right

### Stop all Java processes (if needed):
```powershell
Get-Process -Name java -ErrorAction SilentlyContinue | Stop-Process -Force
```

---

## 💾 DATABASE

### **MongoDB:** `shopprr` (localhost:27017)
### **Collections:**
- ✅ `users` - Users (Admin, Customer)
- ✅ `products` - Products
- ✅ `categories` - Product categories
- ✅ `orders` - Orders
- ✅ `reviews` - Product reviews
- ✅ `blogs` - Blog posts
- ✅ `testimonials` - Customer testimonials
- ✅ `contacts` - Contact messages

---

## ⚙️ TECHNOLOGY STACK

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

## ❌ TROUBLESHOOTING

### **🔴 Error: Port 8080 already in use**
```powershell
# Kill all Java processes
Get-Process -Name java -ErrorAction SilentlyContinue | Stop-Process -Force
```

### **🔴 Error: Port 5173 already in use**
```powershell
# Kill all Node processes
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### **🔴 Error: MongoDB not running**
```powershell
# Start MongoDB service
net start MongoDB
```

### **🔴 Error: Cannot connect to MongoDB**
1. Check if MongoDB is running:
   ```powershell
   Get-Service MongoDB
   ```
2. If not running, start service:
   ```powershell
   net start MongoDB
   ```

### **🔴 Error: Gradle build failed**
```powershell
# Clean and rebuild
cd "d:\van lang\hoc tap\java\Clothing-website-main\clothing-backend"
.\gradlew.bat clean build
```

### **🟢 Check if Backend is running:**
```powershell
Test-NetConnection localhost -Port 8080
```

### **🟢 Check if Frontend is running:**
```powershell
Test-NetConnection localhost -Port 5173
```

### **🟢 Check if MongoDB is running:**
```powershell
Test-NetConnection localhost -Port 27017
```

---

## 💡 IMPORTANT NOTES

- ✅ Backend showing `80% EXECUTING` is **NORMAL** - it means it's running
- ✅ **DO NOT CLOSE** 2 terminals while website is running
- ✅ Backend startup takes ~30-40 seconds
- ✅ Frontend startup takes ~5-10 seconds
- ✅ Press `Ctrl+Shift+R` in browser to hard refresh (clear cache)
- ✅ If you modify Backend code, need to restart Backend terminal
- ✅ If you modify Frontend code, Vite auto-reloads (Hot Module Replacement)

---

## 📁 PROJECT STRUCTURE

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
├── 📄 README.md               # This file - Complete guide
├── 📄 Setup Guide.txt        # (Merged into README)
└── 📄 CHAY-WEB.txt          # (Merged into README)
```

---

## 🎯 MAIN FEATURES

### **🛍️ Customer:**
- ✅ View product list with pagination
- ✅ Search products by name
- ✅ Filter products by category
- ✅ View product details
- ✅ Add products to cart
- ✅ Update quantity in cart
- ✅ Remove products from cart
- ✅ Place order (COD - Cash on Delivery)
- ✅ View order history
- ✅ Track order status
- ✅ Review products
- ✅ Login / Register
- ✅ Update profile information
- ✅ Contact via form

### **👑 Admin:**
- ✅ **Product Management:**
  - Add new product (with image upload)
  - Edit product information
  - Delete product
  - View product list
- ✅ **Order Management:**
  - View all orders
  - Update order status (Pending → Packing → Shipped → Delivered)
  - Delete order
- ✅ **Customer Management:**
  - View customer list
  - Add new customer
  - Edit customer information
  - Delete customer
- ✅ **Reports & Analytics:**
  - Total revenue
  - Total orders
  - Total customers
  - Total products
  - Monthly revenue chart (Bar Chart)
  - Revenue by category chart (Pie Chart)
  - Recent orders list
  - Best-selling products

### **📝 Other Features:**
- ✅ Blog posts
- ✅ Testimonials
- ✅ Contact form
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Dark/Light mode ready
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications