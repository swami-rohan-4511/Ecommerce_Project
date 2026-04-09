# API Documentation & Quick Reference

## Quick Start Commands

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Configure MySQL
# - Create database: ecommerce_db
# - Run: database/schema.sql
# - Update .env with credentials

# 3. Start server
npm run dev

# 4. Test endpoint
curl http://localhost:5000/api/v1/health
```

---

## API Response Format

All API responses follow this standard structure:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    // Response data here
  },
  "errors": null,
  "timestamp": "2026-04-09T10:30:00.000Z"
}
```

### Success Response (2xx)
```json
{
  "statusCode": 200,
  "message": "Data retrieved successfully",
  "data": { /* actual data */ },
  "timestamp": "2026-04-09T10:30:00.000Z"
}
```

### Error Response (4xx/5xx)
```json
{
  "statusCode": 400,
  "message": "Bad Request",
  "errors": { "field": "Error details" },
  "timestamp": "2026-04-09T10:30:00.000Z"
}
```

---

## Current API Endpoints

### 1. Health Check
```
GET /api/v1/health
```
**Purpose:** Verify API and database status
**Auth:** Not required
**Response:** Server health, DB stats, memory info

---

## Request Examples

### Using cURL

#### Windows PowerShell
```powershell
$headers = @{
    "Content-Type" = "application/json"
}

Invoke-WebRequest `
    -Uri "http://localhost:5000/api/v1/health" `
    -Method Get `
    -Headers $headers
```

#### Git Bash / Linux / Mac
```bash
curl -X GET \
  http://localhost:5000/api/v1/health \
  -H 'Content-Type: application/json'
```

### Using Postman

1. **New Request**
   - Method: GET
   - URL: http://localhost:5000/api/v1/health

2. **Headers**
   - Content-Type: application/json

3. **Send** → Check response in Body tab

### Using JavaScript/Fetch

```javascript
fetch('http://localhost:5000/api/v1/health')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Using Python/Requests

```python
import requests

response = requests.get('http://localhost:5000/api/v1/health')
print(response.json())
```

---

## Database Query Examples

### Connect to MySQL
```bash
mysql -u root -p
USE ecommerce_db;
```

### Check Data
```sql
-- Count records
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'order_items', COUNT(*) FROM order_items;

-- View all users with roles
SELECT u.user_id, u.first_name, u.email, r.role_name
FROM users u
JOIN roles r ON u.role_id = r.role_id;

-- View all products
SELECT product_id, product_name, price, discount_price, stock_quantity
FROM products
ORDER BY product_id;

-- View all orders with customer names
SELECT o.order_id, o.order_number, u.first_name, o.total_amount, o.order_status
FROM orders o
JOIN users u ON o.user_id = u.user_id;

-- View order details
SELECT oi.order_item_id, p.product_name, oi.quantity, oi.unit_price, oi.subtotal
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
WHERE oi.order_id = 1;
```

---

## HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful request |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Database error |
| 503 | Unavailable | DB connection failed |

---

## Environment Variables Reference

```env
# Server
PORT                    # API port (default: 5000)
NODE_ENV               # 'development' or 'production'

# Database
DB_HOST                # MySQL server host
DB_PORT                # MySQL port (default: 3306)
DB_USER                # Database username
DB_PASSWORD            # Database password
DB_NAME                # Database name

# Security
JWT_SECRET             # Secret key for JWT tokens
JWT_EXPIRE             # Token expiration (e.g., '7d')

# API
API_PREFIX             # API route prefix
```

---

## File Structure Quick Reference

```
backend/
├── src/index.js                    # Server entry point
├── src/config/database.js          # DB connection
├── src/controllers/                # Business logic
├── src/routes/                     # API routes
├── src/models/                     # Data models (future)
├── src/middleware/                 # Custom middleware (future)
├── src/utils/                      # Utilities
├── database/schema.sql             # Database schema
├── package.json                    # Dependencies
├── .env                            # Config
└── README.md                       # Full documentation
```

---

## Scripts

### Development
```bash
npm run dev
# Starts server with nodemon auto-reload
```

### Production
```bash
npm start
# Runs server without auto-reload
```

---

## Common Issues & Solutions

### Server won't start
- [ ] Check if MySQL is running
- [ ] Verify database credentials in .env
- [ ] Check if port 5000 is available
- [ ] Look at console error message

### Database connection fails
- [ ] Verify DB_HOST, DB_USER, DB_PASSWORD in .env
- [ ] Check MySQL service is running
- [ ] Ensure ecommerce_db database exists
- [ ] Run database/schema.sql if needed

### CORS errors
- [ ] Make sure CORS middleware is enabled
- [ ] Frontend URL might not be in allowed origins

---

## Next API Endpoints to Implement

1. **Users**
   - POST /api/v1/users/register
   - POST /api/v1/users/login
   - GET /api/v1/users/:id
   - PUT /api/v1/users/:id

2. **Products**
   - GET /api/v1/products
   - GET /api/v1/products/:id
   - POST /api/v1/products
   - PUT /api/v1/products/:id

3. **Orders**
   - POST /api/v1/orders
   - GET /api/v1/orders/:id
   - GET /api/v1/users/:id/orders
   - PUT /api/v1/orders/:id

---

## Testing Checklist

- [ ] Server starts without errors
- [ ] MySQL connection successful
- [ ] Health endpoint returns 200
- [ ] Database has sample data
- [ ] All tables created correctly
- [ ] Relationships/foreign keys working
- [ ] Response format is consistent

---

Last Updated: 2026-04-09
Version: 1.0.0
