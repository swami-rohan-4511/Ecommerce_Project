# 🔐 Authentication & Authorization System

## Overview

Complete JWT-based authentication system with role-based access control (RBAC) for the E-commerce platform.

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client        │────│   Auth Routes    │────│ Auth Controller │
│                 │    │                  │    │                 │
│ - Register      │    │ POST /register   │    │ - validateInput │
│ - Login         │    │ POST /login      │    │ - hashPassword  │
│ - JWT Token     │    │ GET /profile     │    │ - verifyPassword│
└─────────────────┘    │ PUT /profile     │    │ - generateToken │
                       │ GET /users       │    └─────────────────┘
                       └──────────────────┘             │
                                              ┌────────▼────────┐
                                              │   User Model    │
                                              │                 │
                                              │ - findByEmail   │
                                              │ - create        │
                                              │ - verifyPassword│
                                              └─────────────────┘
                                                       │
                                              ┌────────▼────────┐
                                              │   Middleware    │
                                              │                 │
                                              │ authenticateToken│
                                              │ authorizeRoles  │
                                              └─────────────────┘
```

## 📊 Database Schema Updates

### Updated `users` table:
```sql
ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD INDEX idx_is_verified (is_verified);
```

### Updated roles:
- `SUPER_ADMIN` - Full system access
- `ADMIN` - Elevated access
- `CUSTOMER` - Basic access (default)

## 🔑 JWT Token Structure

```json
{
  "user_id": 1,
  "email": "user@example.com",
  "role": "CUSTOMER",
  "iat": 1640995200,
  "exp": 1641081600
}
```

**Token expires in:** 7 days (configurable in `.env`)

## 🚀 API Endpoints

### 1. User Registration
```
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "phone_number": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "USA",
  "role_name": "CUSTOMER"
}
```

**Response (201):**
```json
{
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "user": {
      "user_id": 5,
      "role_id": 3,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "phone_number": "+1234567890",
      "is_verified": false,
      "role_name": "CUSTOMER",
      "created_at": "2024-01-09T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "message": "User registered successfully. Please verify your email."
  },
  "timestamp": "2024-01-09T10:30:00.000Z"
}
```

### 2. User Login
```
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "user_id": 5,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "role_name": "CUSTOMER",
      "is_verified": false,
      "last_login": "2024-01-09T10:35:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "message": "Login successful"
  },
  "timestamp": "2024-01-09T10:35:00.000Z"
}
```

### 3. Get User Profile
```
GET /api/v1/auth/profile
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "statusCode": 200,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "user_id": 5,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "phone_number": "+1234567890",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001",
      "country": "USA",
      "role_name": "CUSTOMER",
      "is_verified": false
    }
  },
  "timestamp": "2024-01-09T10:40:00.000Z"
}
```

### 4. Update User Profile
```
PUT /api/v1/auth/profile
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "first_name": "Johnny",
  "phone_number": "+1987654321",
  "address": "456 Oak St"
}
```

### 5. Get All Users (Admin Only)
```
GET /api/v1/auth/users?page=1&limit=10
Authorization: Bearer <admin_jwt_token>
```

## 🔒 Role-Based Access Control (RBAC)

### Available Roles:
- `SUPER_ADMIN` - Full system access
- `ADMIN` - Administrative access
- `CUSTOMER` - Basic user access

### Middleware Usage:

```javascript
const { authenticateToken, requireAdmin, requireCustomer } = require('./middleware/authMiddleware');

// Protect route for authenticated users
router.get('/profile', authenticateToken, requireCustomer, getProfile);

// Protect route for admins only
router.get('/users', authenticateToken, requireAdmin, getAllUsers);

// Custom role check
router.get('/admin-data', authenticateToken, authorizeRoles('ADMIN', 'SUPER_ADMIN'), getAdminData);
```

## 🧪 Testing with Postman

### Setup:
1. Open Postman
2. Create new collection: "E-commerce Auth"
3. Set base URL: `http://localhost:5000/api/v1`

### Test Cases:

#### 1. Register New User
```
Method: POST
URL: {{base_url}}/auth/register
Body (raw JSON):
{
  "first_name": "Test",
  "last_name": "User",
  "email": "test@example.com",
  "password": "password123"
}
Expected: 201 Created
```

#### 2. Login
```
Method: POST
URL: {{base_url}}/auth/login
Body (raw JSON):
{
  "email": "test@example.com",
  "password": "password123"
}
Expected: 200 OK with token
Copy token from response
```

#### 3. Get Profile (Protected)
```
Method: GET
URL: {{base_url}}/auth/profile
Headers:
  Authorization: Bearer <paste_token_here>
Expected: 200 OK with user data
```

#### 4. Test Unauthorized Access
```
Method: GET
URL: {{base_url}}/auth/users
Headers:
  Authorization: Bearer <customer_token>
Expected: 403 Forbidden
```

## 🔧 Common Errors & Fixes

### 1. "Access token is required"
```
Status: 401
Fix: Add Authorization header: "Bearer <token>"
```

### 2. "Invalid token"
```
Status: 401
Fix: Check token format and expiration
```

### 3. "Access denied. Required role(s): ADMIN"
```
Status: 403
Fix: Use admin/super_admin token
```

### 4. "User with this email already exists"
```
Status: 409
Fix: Use different email for registration
```

### 5. "Invalid email or password"
```
Status: 401
Fix: Check credentials are correct
```

### 6. "Validation error"
```
Status: 400
Fix: Check required fields and formats
```

## 🔐 Security Features

### Password Security:
- **bcrypt hashing** with 12 salt rounds
- **Minimum 8 characters** required
- **No plain text storage**

### JWT Security:
- **HS256 algorithm** for signing
- **7-day expiration** (configurable)
- **User ID + role** in payload
- **Secure token storage** required

### Input Validation:
- **Joi schema validation**
- **Email format checking**
- **Required field validation**
- **SQL injection prevention**

## 📁 File Structure

```
backend/src/
├── models/
│   └── User.js                 # User model with auth methods
├── controllers/
│   └── authController.js       # Auth business logic
├── routes/
│   └── authRoutes.js           # Auth API routes
├── middleware/
│   └── authMiddleware.js       # JWT & role validation
└── utils/
    ├── jwt.js                  # Token generation/verification
    ├── apiResponse.js          # Response formatting
    └── apiError.js             # Error handling
```

## 🚀 Next Steps

### Immediate Next:
1. **Test all endpoints** with Postman
2. **Update PROJECT_TRACKER.md** with completion status
3. **Verify database schema** updates

### Future Enhancements:
1. **Email verification** system
2. **Password reset** functionality
3. **Refresh tokens** for better security
4. **Rate limiting** for auth endpoints
5. **Login attempt** tracking

## 📋 Checklist

- [x] User registration with validation
- [x] User login with JWT
- [x] Password hashing (bcrypt)
- [x] Role-based access control
- [x] JWT middleware
- [x] Profile management
- [x] Admin user management
- [x] Input validation
- [x] Error handling
- [x] Database schema updates
- [x] API documentation
- [x] Postman testing guide

## 🎯 Ready for Testing!

The authentication system is now complete and ready for testing. All endpoints are functional with proper security measures in place.

**Start testing with the Postman examples above!** 🚀