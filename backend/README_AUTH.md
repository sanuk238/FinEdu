# FinEdu Authentication (Part 1 Backend)

This document explains backend auth setup using MongoDB, bcrypt password hashing, and JWT tokens.

## Added Endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token required)
- `POST /api/auth/logout` (stateless acknowledgement)

## 1) Environment Setup

Create a root `.env` file (project root) or adapt existing one with:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/finedu
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=
FMP_API_KEY=demo
```

> Note: `server.js` currently loads env from `../.env` relative to backend, i.e. root `.env`.

## 2) Install Backend Dependencies

From project root:

```bash
cd backend && npm install
```

New packages:
- `mongoose`
- `bcryptjs`
- `jsonwebtoken`

## 3) Start Backend

```bash
cd backend && npm start
```

You should see:
- `MongoDB connected.` (if DB is available)
- `FinEdu server running at http://localhost:5000`

If `MONGODB_URI` is missing, non-auth APIs still run, while auth endpoints return service unavailable.

## 4) Request/Response Examples

### Signup

`POST /api/auth/signup`
```json
{
  "name": "Suraj",
  "email": "suraj@example.com",
  "password": "StrongPass123"
}
```

Success: `201`
```json
{
  "message": "Account created successfully.",
  "token": "<jwt>",
  "user": {
    "id": "...",
    "name": "Suraj",
    "email": "suraj@example.com"
  }
}
```

### Login

`POST /api/auth/login`
```json
{
  "email": "suraj@example.com",
  "password": "StrongPass123"
}
```

Success: `200` + token + user

### Current User

`GET /api/auth/me`
Header:
`Authorization: Bearer <jwt>`

Success: `200`
```json
{
  "user": {
    "id": "...",
    "name": "Suraj",
    "email": "suraj@example.com"
  }
}
```

### Logout

`POST /api/auth/logout`

Success: `200`
```json
{
  "message": "Logout successful."
}
```

## 5) Curl Test Commands

```bash
curl -X POST http://localhost:5000/api/auth/signup ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Suraj\",\"email\":\"suraj@example.com\",\"password\":\"StrongPass123\"}"
```

```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"suraj@example.com\",\"password\":\"StrongPass123\"}"
```

```bash
curl -X GET http://localhost:5000/api/auth/me ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 6) Security Notes

- Passwords are never stored in plain text, only bcrypt hashes.
- JWT secret must be strong in production.
- Consider moving tokens to secure HttpOnly cookies for hardened browser security in production.
