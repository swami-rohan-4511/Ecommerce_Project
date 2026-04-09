# Setup Checklist

Complete this checklist to ensure your e-commerce backend is properly configured.

## ✅ Pre-Installation

- [ ] Node.js v14+ installed (`node -v`)
- [ ] npm installed (`npm -v`)
- [ ] MySQL 5.7+ installed (`mysql --version`)
- [ ] MySQL service running
- [ ] Text editor/IDE ready (VS Code, WebStorm, etc.)

---

## ✅ Installation Phase

- [ ] Navigate to backend folder: `cd backend`
- [ ] Install dependencies: `npm install`
- [ ] Wait for all packages to download
- [ ] Verify package-lock.json created

---

## ✅ Database Setup

### Create Database
- [ ] Open MySQL command line or Workbench
- [ ] Create database: `CREATE DATABASE ecommerce_db;`
- [ ] Select database: `USE ecommerce_db;`

### Execute Schema
- [ ] Open `database/schema.sql` file
- [ ] Copy all SQL code
- [ ] Execute in MySQL
- [ ] OR use: `SOURCE database/schema.sql;`

### Verify Tables
Run these commands in MySQL:
```sql
SHOW TABLES;  -- Should show 5 tables
SELECT COUNT(*) FROM users;  -- Should show 4
SELECT COUNT(*) FROM products;  -- Should show 5
SELECT COUNT(*) FROM roles;  -- Should show 3
```

- [ ] All 5 tables created
- [ ] Sample data inserted
- [ ] No errors in execution

---

## ✅ Configuration

### .env File
- [ ] Open `.env` file in backend folder
- [ ] Update: DB_HOST (usually 'localhost')
- [ ] Update: DB_PORT (usually 3306)
- [ ] Update: DB_USER (your MySQL username)
- [ ] Update: DB_PASSWORD (your MySQL password)
- [ ] Update: DB_NAME (should be 'ecommerce_db')
- [ ] Verify JWT_SECRET is set
- [ ] Verify PORT is 5000

### File Verification
- [ ] `.env` file exists and has values
- [ ] `.gitignore` exists
- [ ] `package.json` has all dependencies
- [ ] `database/schema.sql` has SQL code
- [ ] `src/index.js` exists and is complete

---

## ✅ Server Startup

### Start Development Server
- [ ] Run: `npm run dev`
- [ ] Check console for: "✓ Server running on: http://localhost:5000"
- [ ] Check console for: "✓ Database connection successful"
- [ ] Check console for: "Available endpoints: GET /api/v1/health"

### Server Running Indicators
- [ ] No error messages in console
- [ ] No "Port already in use" error
- [ ] No "Database connection failed" error
- [ ] Console shows startup banner

---

## ✅ API Testing

### Test 1: Health Check Endpoint
```bash
curl http://localhost:5000/api/v1/health
```
- [ ] Response status code: 200
- [ ] Response contains database stats
- [ ] Shows 4 users, 5 products, 3 orders

### Test 2: Root Endpoint
```bash
curl http://localhost:5000/
```
- [ ] Response shows API info
- [ ] Returns version 1.0.0
- [ ] Status is "running"

### Test 3: Using Postman
- [ ] Create GET request to: `http://localhost:5000/api/v1/health`
- [ ] Click Send
- [ ] Verify 200 status code
- [ ] Verify response body

---

## ✅ Database Verification

### Verify Data Integrity
```sql
USE ecommerce_db;

-- Check constraints
SHOW CREATE TABLE users \G
SHOW CREATE TABLE orders \G

-- Check relationships
SELECT * FROM users LIMIT 1;
SELECT * FROM products LIMIT 1;
SELECT * FROM orders LIMIT 1;
```

- [ ] All users have valid role_id
- [ ] All products have valid created_by (user_id)
- [ ] All orders have valid user_id
- [ ] All order_items have valid order_id and product_id

---

## ✅ Code Structure Verification

### folders exist:
- [ ] `src/` folder exists
- [ ] `src/config/` exists
- [ ] `src/controllers/` exists
- [ ] `src/routes/` exists
- [ ] `src/utils/` exists
- [ ] `src/middleware/` exists
- [ ] `src/models/` exists
- [ ] `database/` folder exists

### Files exist:
- [ ] `src/index.js`
- [ ] `src/config/database.js`
- [ ] `src/controllers/healthController.js`
- [ ] `src/routes/healthCheck.js`
- [ ] `src/utils/apiResponse.js`
- [ ] `src/utils/apiError.js`
- [ ] `src/utils/jwt.js`
- [ ] `database/schema.sql`

---

## ✅ Performance Checks

### Verify Indexes
```sql
USE ecommerce_db;
SHOW INDEXES FROM users;
SHOW INDEXES FROM products;
SHOW INDEXES FROM orders;
```

- [ ] Email index exists on users
- [ ] Role index exists on users
- [ ] Product category index exists
- [ ] Order status index exists

### Check Connection Pool
- [ ] Database pool configured for 10 connections
- [ ] Connection pooling enabled in database.js
- [ ] No "too many connections" errors

---

## ✅ Security Checks

- [ ] JWT_SECRET is set (not empty)
- [ ] DB_PASSWORD is not empty
- [ ] .env file is in .gitignore
- [ ] No credentials hardcoded in code files
- [ ] Helmet security middleware enabled
- [ ] CORS configured

---

## ✅ Logging & Monitoring

- [ ] Morgan logging middleware active
- [ ] Error messages appear in console
- [ ] Database query errors logged
- [ ] Server uptime tracked
- [ ] Memory usage shown in health endpoint

---

## ✅ Documentation

- [ ] README.md exists and is comprehensive
- [ ] API-REFERENCE.md exists with examples
- [ ] Database schema documented
- [ ] Folder structure explained
- [ ] Setup instructions clear

---

## ✅ Development Environment

- [ ] nodemon installed for auto-reload
- [ ] `npm run dev` works
- [ ] Server restarts when file changes
- [ ] VSCode/IDE recognizes Node modules
- [ ] Debugging ready (can add breakpoints)

---

## ✅ Final Verification

### Complete Test Sequence
1. [ ] Stop any running server (Ctrl+C)
2. [ ] Run: `npm run dev`
3. [ ] Wait for: "✓ Server running"
4. [ ] Open browser: http://localhost:5000/api/v1/health
5. [ ] See JSON response with database stats
6. [ ] Check MySQL: `SELECT COUNT(*) FROM users;` shows 4
7. [ ] Stop server (Ctrl+C)
8. [ ] Run: `npm start` (test production mode)
9. [ ] Verify it works

---

## 🎯 Completion Status

When all items are checked:
- ✓ Backend is properly configured
- ✓ Database is ready
- ✓ Server is running successfully
- ✓ API endpoints are working
- ✓ Ready for Phase 2: User Management

---

## 🔧 Troubleshooting

If any item fails:

1. **Database Connection Failed**
   - Check .env credentials
   - Verify MySQL is running
   - Check database name

2. **Port Already in Use**
   - Change PORT in .env
   - Or kill process: `taskkill /PID {pid} /F`

3. **npm Packages Missing**
   - Run: `npm install` again
   - Delete `node_modules` and `package-lock.json`
   - Run: `npm install`

4. **Schema Error**
   - Check schema.sql syntax
   - Ensure database exists
   - Run each CREATE TABLE separately

---

**Ready for Phase 2?** ✓

Once all items are checked, you're ready to implement User Management (registration, login, profiles).

Estimated time: 20-30 minutes
Last Updated: 2026-04-09
