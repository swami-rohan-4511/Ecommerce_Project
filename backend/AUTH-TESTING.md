# 🧪 Authentication Testing Script

## Quick Test Commands

### 1. Start Server
```bash
cd backend
npm run dev
```

### 2. Test Registration
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Test Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4. Test Protected Route (copy token from login response)
```bash
curl -X GET http://localhost:5000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Test Admin Route (use admin token)
```bash
curl -X GET http://localhost:5000/api/v1/auth/users \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

## Sample Test Users (from database)

### Admin User:
- Email: `admin@ecommerce.com`
- Password: `password123` (hashed in DB)
- Role: ADMIN

### Customer User:
- Email: `alice@customer.com`
- Password: `password123` (hashed in DB)
- Role: CUSTOMER

## Expected Responses

### Registration Success (201):
```json
{
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "user": { /* user data */ },
    "token": "jwt_token_here"
  }
}
```

### Login Success (200):
```json
{
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": { /* user data */ },
    "token": "jwt_token_here"
  }
}
```

### Profile Access (200):
```json
{
  "statusCode": 200,
  "message": "Profile retrieved successfully",
  "data": { "user": { /* user data */ } }
}
```

### Unauthorized (401):
```json
{
  "statusCode": 401,
  "message": "Access token is required"
}
```

### Forbidden (403):
```json
{
  "statusCode": 403,
  "message": "Access denied. Required role(s): ADMIN"
}
```

## Common Issues

1. **"Access token is required"**
   - Add `Authorization: Bearer <token>` header

2. **"Invalid token"**
   - Token expired or malformed

3. **"Access denied"**
   - Wrong role for endpoint

4. **"User already exists"**
   - Email already registered

## Test Checklist

- [ ] Server starts successfully
- [ ] Registration works
- [ ] Login returns JWT token
- [ ] Profile endpoint works with token
- [ ] Admin endpoints require admin role
- [ ] Invalid tokens are rejected
- [ ] Password hashing works
- [ ] Role-based access works

## Postman Collection

Import this collection to test all endpoints:

```json
{
  "info": {
    "name": "E-commerce Auth API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"first_name\": \"Test\",\n  \"last_name\": \"User\",\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\"\n}"
        },
        "url": {
          "raw": "http://localhost:5000/api/v1/auth/register",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "v1", "auth", "register"]
        }
      }
    },
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\"\n}"
        },
        "url": {
          "raw": "http://localhost:5000/api/v1/auth/login",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "v1", "auth", "login"]
        }
      }
    },
    {
      "name": "Get Profile",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{auth_token}}"
          }
        ],
        "url": {
          "raw": "http://localhost:5000/api/v1/auth/profile",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "v1", "auth", "profile"]
        }
      }
    }
  ]
}
```

## Next Steps After Testing

1. ✅ Mark Module 2 as tested in PROJECT_TRACKER.md
2. ✅ Confirm with user that testing is complete
3. 🔄 Ready for Module 3: User Management

---

**Happy Testing! 🚀**