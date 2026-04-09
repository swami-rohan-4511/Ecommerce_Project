# 🚀 QUICK START GUIDE - 5 MINUTES

Get your E-commerce backend running in 5 minutes!

---

## **STEP 1: Install Dependencies** (2 minutes)

```bash
cd backend
npm install
```

Wait for installation to complete...

---

## **STEP 2: Create MySQL Database** (1 minute)

### **Option A: Command Line (Fastest)**

```bash
mysql -u root -p
```

Then copy-paste in MySQL shell:

```sql
CREATE DATABASE ecommerce_db;
USE ecommerce_db;
SOURCE database/schema.sql;
```

### **Option B: MySQL Workbench**

1. Right-click "Schemas" → "Create Schema"
2. Name: `ecommerce_db` → Apply
3. File → Open → Select `database/schema.sql`
4. Execute (Ctrl+Shift+Enter)

---

## **STEP 3: Configure .env** (1 minute)

Edit `backend/.env`:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=ecommerce_db

JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

API_PREFIX=/api/v1
```

Replace `your_password_here` with your actual MySQL password.

---

## **STEP 4: Start Server** (1 minute)

```bash
npm run dev
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

## **STEP 5: Test API** (Immediate!)

### Option A: Browser (Easiest)
```
Open: http://localhost:5000/api/v1/health
```

### Option B: PowerShell
```powershell
Invoke-WebRequest http://localhost:5000/api/v1/health -Method Get
```

### Option C: Git Bash / Linux / Mac
```bash
curl http://localhost:5000/api/v1/health
```

### Option D: Postman
1. Create GET request
2. URL: `http://localhost:5000/api/v1/health`
3. Click Send

---

## ✅ DONE!

You should see:
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

## 🆘 PROBLEMS?

### **MySQL Connection Error**
```
Error: connect ECONNREFUSED
```
→ Make sure MySQL is running (`mysql -u root -p` should work)

### **Database Not Found**
```
Error: ER_BAD_DB_NAME
```
→ Run: `CREATE DATABASE ecommerce_db;`

### **Access Denied**
```
Error: ER_ACCESS_DENIED_FOR_USER
```
→ Check DB_PASSWORD in .env matches your MySQL password

### **Port Already in Use**
```
Error: EADDRINUSE :::5000
```
→ Change PORT in .env to 5001, 5002, etc.

---

## 📂 What You Now Have

✅ Express server running on port 5000
✅ MySQL database with 5 tables
✅ 4 sample users ready
✅ 5 sample products
✅ 3 sample orders
✅ Health check API endpoint working
✅ Clean MVC architecture
✅ Full documentation

---

## 🎯 Next Steps

1. **Read Full Docs**
   - `README.md` - Complete reference
   - `API-REFERENCE.md` - Quick examples
   - `SETUP-CHECKLIST.md` - Verification checklist
   - `PROJECT-SUMMARY.md` - Visual overview

2. **Explore Database**
   ```sql
   USE ecommerce_db;
   SELECT * FROM users;
   SELECT * FROM products;
   SELECT * FROM orders;
   ```

3. **Try API Examples**
   - Check `API-REFERENCE.md` section "Request Examples"
   - Test different endpoints
   - Check response format

4. **Ready for Phase 2?**
   - User registration
   - User login
   - Authentication
   - (Confirm when ready!)

---

## 💡 TIPS

- Keep server running (`npm run dev`) in terminal
- Open new terminal for MySQL commands
- Check `.env` file if connection fails
- Console shows detailed errors and logs
- Press Ctrl+C to stop server

---

## 📊 Database Overview

```
5 TABLES:
├── roles (3 roles: admin, vendor, customer)
├── users (4 sample users)
├── products (5 sample products)
├── orders (3 sample orders)
└── order_items (4 line items)
```

---

**Total Setup Time: ~5 minutes**

**Status: ✅ Live & Ready**

**Next Phase: User Management** (awaiting confirmation)

---

Need help? Check ERRORS section or README.md
