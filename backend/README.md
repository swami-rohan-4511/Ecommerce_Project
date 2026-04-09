# E-Commerce Backend - Project Setup & Database Design

## 📋 Overview

Production-level E-commerce REST API built with Node.js (Express) and MySQL. Follows clean architecture (MVC pattern) with scalable, maintainable code structure.

---

## 🏗️ Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js           # MySQL connection pool setup
│   ├── controllers/
│   │   └── healthController.js   # Business logic for endpoints
│   ├── models/
│   │   └── (User, Product, Order models - to be implemented)
│   ├── routes/
│   │   └── healthCheck.js        # API routes
│   ├── middleware/
│   │   └── (Auth, validation middleware - to be implemented)
│   ├── utils/
│   │   ├── apiResponse.js        # Standard API response format
│   │   ├── apiError.js           # Custom error handler
│   │   └── jwt.js                # JWT token utilities
│   └── index.js                  # Main Express server entry point
├── database/
│   └── schema.sql                # MySQL database schema with initial data
├── package.json                  # Dependencies and scripts
├── .env                          # Environment variables (database config, JWT secret)
├── .gitignore                    # Git ignore patterns
└── README.md                     # This file
```

---

## 🗄️ Database Schema

### **Entity Relationship Diagram (ERD)**

```
┌──────────────┐
│    ROLES     │
├──────────────┤
│ role_id (PK) │1
│ role_name    │────────────┐
│ description  │            │
└──────────────┘            │ M
                            │
                       ┌────────────┐
                       │   USERS    │
                       ├────────────┤
                       │ user_id(PK)│M
                       │ role_id(FK)│────────────────┐
                       │ email      │                │
                       │ password   │                │ 1
                       │ address    │────┐           │
                       └────────────┘    │     ┌──────────────┐
                            │            │     │   PRODUCTS   │
                            │            │     ├──────────────┤
                            │            └────→│ product_id(PK)
                            │                  │ created_by(FK)
                            │                  │ price        │
                            │                  │ stock        │
                            │                  └──────────────┘
                            │ 1                       │ M
                            │                         │
                            │              ┌─────────────────┐
                            │              │  ORDER_ITEMS    │
                            │              ├─────────────────┤
                            │              │order_item_id(PK)│
                            └─────────────→│ order_id(FK)    │
                                  M        │ product_id(FK)  │
                                           │ quantity        │
                            ┌──────────────┤ unit_price      │
                            │              └─────────────────┘
                     ┌──────────────┐
                     │   ORDERS     │
                     ├──────────────┤
                     │ order_id (PK)│
                     │ user_id (FK) │
                     │ total_amount │
                     │ order_status │
                     └──────────────┘
```

### **Table Details**

#### **1. ROLES**
| Column | Type | Constraint | Purpose |
|--------|------|-----------|---------|
| role_id | INT | PK, AUTO_INCREMENT | Unique role identifier |
| role_name | VARCHAR(50) | UNIQUE, NOT NULL | Role name (admin/vendor/customer) |
| description | VARCHAR(255) | NULL | Role description |
| created_at | TIMESTAMP | DEFAULT CURRENT | Record creation time |
| updated_at | TIMESTAMP | ON UPDATE | Record update time |

**Sample Data:**
```
- admin: Full system access
- vendor: Product management access
- customer: Shopping access only
```

---

#### **2. USERS**
| Column | Type | Constraint | Purpose |
|--------|------|-----------|---------|
| user_id | INT | PK, AUTO_INCREMENT | Unique user identifier |
| role_id | INT | FK → roles | User role association |
| first_name | VARCHAR(100) | NOT NULL | User first name |
| last_name | VARCHAR(100) | NOT NULL | User last name |
| email | VARCHAR(255) | UNIQUE, NOT NULL, INDEX | User email (login) |
| password_hash | VARCHAR(255) | NOT NULL | Encrypted password |
| phone_number | VARCHAR(20) | NULL | User contact number |
| address | VARCHAR(500) | NULL | Physical address |
| city | VARCHAR(100) | NULL | City |
| state | VARCHAR(100) | NULL | State/Province |
| postal_code | VARCHAR(20) | NULL | Postal code |
| country | VARCHAR(100) | NULL | Country |
| is_active | BOOLEAN | DEFAULT TRUE, INDEX | Account status |
| last_login | TIMESTAMP | NULL | Last login time |
| created_at | TIMESTAMP | DEFAULT CURRENT | Record creation |
| updated_at | TIMESTAMP | ON UPDATE | Record update |

**Indexes:**
- `idx_email` - Fast email lookups for login
- `idx_user_role` - User filtering by role
- `idx_is_active` - Active users filtering

---

#### **3. PRODUCTS**
| Column | Type | Constraint | Purpose |
|--------|------|-----------|---------|
| product_id | INT | PK, AUTO_INCREMENT | Unique product identifier |
| product_name | VARCHAR(255) | NOT NULL | Product name |
| description | TEXT | NULL | Product details |
| price | DECIMAL(10,2) | NOT NULL, INDEX | Regular price |
| discount_price | DECIMAL(10,2) | NULL | Sale price |
| stock_quantity | INT | NOT NULL | Available quantity |
| category | VARCHAR(100) | INDEX | Product category |
| brand | VARCHAR(100) | INDEX | Brand name |
| sku | VARCHAR(100) | UNIQUE, INDEX | Stock keeping unit |
| product_image_url | VARCHAR(500) | NULL | Product image URL |
| is_active | BOOLEAN | DEFAULT TRUE, INDEX | Product availability |
| rating | DECIMAL(3,2) | DEFAULT 0 | Average rating (0-5) |
| total_reviews | INT | DEFAULT 0 | Review count |
| created_by | INT | FK → users | Vendor who created |
| created_at | TIMESTAMP | DEFAULT CURRENT | Record creation |
| updated_at | TIMESTAMP | ON UPDATE | Record update |

---

#### **4. ORDERS**
| Column | Type | Constraint | Purpose |
|--------|------|-----------|---------|
| order_id | INT | PK, AUTO_INCREMENT | Unique order identifier |
| user_id | INT | FK → users | Customer who ordered |
| order_number | VARCHAR(50) | UNIQUE, INDEX | Human-readable order ID |
| total_amount | DECIMAL(12,2) | NOT NULL | Sum before discounts |
| discount_amount | DECIMAL(12,2) | DEFAULT 0 | Total discount applied |
| tax_amount | DECIMAL(12,2) | DEFAULT 0 | Tax amount |
| final_amount | DECIMAL(12,2) | NOT NULL | Total to be paid |
| order_status | ENUM | DEFAULT 'pending', INDEX | Status: pending/confirmed/shipped/delivered/cancelled/refunded |
| payment_status | ENUM | DEFAULT 'pending', INDEX | Payment status |
| payment_method | VARCHAR(50) | NULL | credit_card/debit_card/paypal/etc |
| shipping_address | VARCHAR(500) | NULL | Delivery address |
| billing_address | VARCHAR(500) | NULL | Billing address |
| notes | TEXT | NULL | Special instructions |
| created_at | TIMESTAMP | DEFAULT CURRENT, INDEX | Order date |
| updated_at | TIMESTAMP | ON UPDATE | Last update |

**Status Flow:**
```
pending → confirmed → shipped → delivered (Final)
        ↓
      cancelled/refunded
```

---

#### **5. ORDER_ITEMS**
| Column | Type | Constraint | Purpose |
|--------|------|-----------|---------|
| order_item_id | INT | PK, AUTO_INCREMENT | Unique line item ID |
| order_id | INT | FK → orders | Parent order reference |
| product_id | INT | FK → products | Product details |
| quantity | INT | NOT NULL | Items ordered |
| unit_price | DECIMAL(10,2) | NOT NULL | Price at purchase time |
| discount_per_item | DECIMAL(10,2) | DEFAULT 0 | Item-level discount |
| subtotal | DECIMAL(12,2) | NOT NULL | quantity × unit_price |
| created_at | TIMESTAMP | DEFAULT CURRENT | Record creation |

**Purpose:** Stores order line items. Keeps historical price even if product price changes.

---

## 🚀 Setup Instructions

### **Prerequisites**
- Node.js v14+ (https://nodejs.org)
- MySQL 5.7+ (https://www.mysql.com/downloads)
- npm or yarn package manager
- Postman (for API testing) - optional

### **Step 1: Install Dependencies**

```bash
cd backend
npm install
```

**Installed packages:**
- `express` - Web framework
- `mysql2` - Database driver with connection pooling
- `dotenv` - Environment variables
- `cors` - Cross-origin requests
- `helmet` - Security headers
- `morgan` - HTTP logging
- `joi` - Input validation
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `nodemon` - Auto-restart on changes (dev only)

### **Step 2: Configure MySQL Database**

#### **Option A: Using MySQL Command Line**

```bash
# Start MySQL service (Windows)
mysql -u root -p

# Inside MySQL shell:
CREATE DATABASE ecommerce_db;
USE ecommerce_db;

# Copy schema.sql content and execute OR:
SOURCE database/schema.sql;
```

#### **Option B: Using MySQL Workbench**

1. Create new schema: `ecommerce_db`
2. Open SQL Editor
3. Open file: `backend/database/schema.sql`
4. Execute all queries

### **Step 3: Configure Environment Variables**

Edit `.env` file with your MySQL credentials:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_actual_password
DB_NAME=ecommerce_db

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# API
API_PREFIX=/api/v1
```

### **Step 4: Start the Server**

#### **Development Mode (with auto-reload)**
```bash
npm run dev
```

#### **Production Mode**
```bash
npm start
```

**Expected Output:**
```
╔════════════════════════════════════════╗
║     E-Commerce Backend Server          ║
╚════════════════════════════════════════╝

✓ Server running on: http://localhost:5000
✓ Environment: development
✓ API Prefix: /api/v1
✓ Database connection successful

Available endpoints:
  - GET  /api/v1/health
```

---

## 📡 API Endpoints

### **Health Check Endpoint**

Used to verify API and database connectivity.

```
GET /api/v1/health
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "api": {
      "status": "healthy",
      "uptime": 45.234,
      "timestamp": "2026-04-09T10:30:00.000Z"
    },
    "database": {
      "status": "connected",
      "stats": {
        "total_users": 4,
        "total_products": 5,
        "total_orders": 3,
        "active_users": true
      }
    },
    "server": {
      "environment": "development",
      "version": "1.0.0",
      "memory": {
        "heapUsed": 45,
        "heapTotal": 120
      }
    }
  },
  "timestamp": "2026-04-09T10:30:00.000Z"
}
```

---

## 🧪 Testing Steps

### **Test 1: Server Startup**

```bash
# Terminal 1: Start server
npm run dev

# Check if you see:
# ✓ Server running on: http://localhost:5000
# ✓ Database connection successful
```

### **Test 2: Health Check Endpoint (Using cURL)**

```bash
# Windows PowerShell
Invoke-WebRequest -Uri "http://localhost:5000/api/v1/health" -Method Get

# Or using Git Bash / Linux / Mac
curl http://localhost:5000/api/v1/health
```

### **Test 3: Health Check Endpoint (Using Postman)**

1. Open Postman
2. Create new request:
   - **Method:** GET
   - **URL:** `http://localhost:5000/api/v1/health`
3. Click **Send**
4. Verify you see status code 200 with database statistics

### **Test 4: Verify Database Data**

```bash
# Connect to MySQL
mysql -u root -p

# Use database
USE ecommerce_db;

# Check tables
SELECT COUNT(*) FROM users;       # Should show 4
SELECT COUNT(*) FROM products;    # Should show 5
SELECT COUNT(*) FROM orders;      # Should show 3
SELECT COUNT(*) FROM roles;       # Should show 3

# View sample users
SELECT user_id, first_name, email, role_id FROM users;

# View sample products
SELECT product_id, product_name, price, stock_quantity FROM products;
```

### **Test 5: Root Endpoint**

```bash
curl http://localhost:5000
```

**Response:**
```json
{
  "message": "E-Commerce API Server",
  "version": "1.0.0",
  "status": "running",
  "docs": "/api/v1/docs"
}
```

---

## 📊 Sample Data

### **Sample Users**

| user_id | first_name | last_name | email | role | Status |
|---------|-----------|----------|-------|------|--------|
| 1 | Admin | User | admin@ecommerce.com | admin | Active |
| 2 | John | Vendor | vendor@ecommerce.com | vendor | Active |
| 3 | Alice | Customer | alice@customer.com | customer | Active |
| 4 | Bob | Customer | bob@customer.com | customer | Active |

### **Sample Products**

| product_id | Product Name | Price | Discount | Stock | Category |
|-----------|-------------|-------|----------|-------|----------|
| 1 | Wireless Headphones | $199.99 | $149.99 | 50 | Electronics |
| 2 | USB-C Cable | $29.99 | $19.99 | 200 | Accessories |
| 3 | Phone Case | $24.99 | $19.99 | 150 | Accessories |
| 4 | Laptop Stand | $79.99 | $59.99 | 75 | Office |
| 5 | Keyboard | $149.99 | $99.99 | 100 | Electronics |

### **Sample Orders**

| order_id | Order # | Customer | Amount | Status | Payment |
|---------|--------|----------|--------|--------|---------|
| 1 | ORD-20260409-001 | Alice | $274.98 | Confirmed | Completed |
| 2 | ORD-20260409-002 | Bob | $109.99 | Shipped | Completed |
| 3 | ORD-20260408-001 | Alice | $65.99 | Delivered | Completed |

---

## 🔐 Production Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong random value
- [ ] Update DB credentials with production database
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS (use nginx reverse proxy)
- [ ] Add input validation middleware
- [ ] Add authentication middleware
- [ ] Add rate limiting (prevent DDoS)
- [ ] Add request logging to file system
- [ ] Setup error monitoring (Sentry)
- [ ] Add database backup strategy
- [ ] Enable CORS only for your frontend domain

---

## 🔄 Architecture Pattern: MVC

```
Request
   ↓
Route (routes/healthCheck.js)
   ↓
Controller (controllers/healthController.js)
   ↓
Database (config/database.js)
   ↓
Response (utils/apiResponse.js)
```

**Benefits:**
- Separation of concerns
- Easy to test
- Scalable
- Maintainable

---

## 📝 Database Relationships Summary

### **Foreign Key Constraints**

1. **users.role_id** → roles.role_id
   - ON DELETE: RESTRICT (can't delete role if users exist)
   
2. **products.created_by** → users.user_id
   - ON DELETE: CASCADE (delete products if vendor deleted)
   
3. **orders.user_id** → users.user_id
   - ON DELETE: CASCADE (delete orders if user deleted)
   
4. **order_items.order_id** → orders.order_id
   - ON DELETE: CASCADE (delete items if order deleted)
   
5. **order_items.product_id** → products.product_id
   - ON DELETE: RESTRICT (can't delete product if in orders)

---

## 🧩 Next Steps (To Be Implemented)

### **Phase 2: User Management**
- [ ] User registration endpoint
- [ ] User login endpoint (with JWT)
- [ ] Get user profile
- [ ] Update user profile
- [ ] Delete user account
- [ ] Authentication middleware

### **Phase 3: Product Management**
- [ ] Get all products (with pagination/filtering)
- [ ] Get single product
- [ ] Create product (vendor only)
- [ ] Update product
- [ ] Delete product
- [ ] Search products

### **Phase 4: Order Management**
- [ ] Create order
- [ ] Get user orders
- [ ] Get order details
- [ ] Update order status
- [ ] Cancel order
- [ ] Order tracking

### **Phase 5: Payment & Checkout**
- [ ] Add to cart
- [ ] Cart management
- [ ] Checkout process
- [ ] Payment processing (Stripe/PayPal)

### **Phase 6: Advanced Features**
- [ ] Reviews & ratings
- [ ] Wishlists
- [ ] Notifications
- [ ] Admin dashboard
- [ ] Analytics

---

## 🐛 Troubleshooting

### **Connection Refused**
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution:** Ensure MySQL service is running
```bash
# Windows
net start MySQL80

# Mac
brew services start mysql

# Linux
sudo systemctl start mysql
```

### **Access Denied**
```
Error: ER_ACCESS_DENIED_FOR_USER
```
**Solution:** Check DB_USER and DB_PASSWORD in .env file

### **Database Already Exists**
```
Error: ER_DB_CREATE_EXISTS
```
**Solution:** Drop existing database
```sql
DROP DATABASE ecommerce_db;
```

### **Port Already in Use**
```
Error: listen EADDRINUSE :::5000
```
**Solution:** Change PORT in .env or kill process on port 5000
```bash
# Windows PowerShell
netstat -ano | findstr :5000
taskkill /PID {PID} /F

# Linux/Mac
lsof -i :5000
kill -9 {PID}
```

---

## 📚 File Reference

### **Configuration Files**
- `.env` - Environment variables
- `.gitignore` - Git exclusions
- `package.json` - Dependencies & scripts

### **Database**
- `database/schema.sql` - Complete MySQL schema

### **Source Code**
- `src/index.js` - Express server entry point
- `src/config/database.js` - MySQL connection pool
- `src/controllers/healthController.js` - Business logic
- `src/routes/healthCheck.js` - API routes
- `src/utils/apiResponse.js` - Response formatter
- `src/utils/apiError.js` - Error handler
- `src/utils/jwt.js` - JWT utilities

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Verify MySQL is running
3. Check .env configuration
4. Review error messages in console
5. Enable Morgan logging for request details

---

**Ready to move to Phase 2: User Management?** 
Confirm when you're ready to implement user registration, login, and authentication.
