# Hướng Dẫn: Từ API Docs Sang Axios Code

## Mục Lục

1. [Axios là gì?](#axios-là-gì)
2. [Cấu trúc API Docs](#cấu-trúc-api-docs)
3. [Quy Trình: Docs → Code](#quy-trình-docs--code)
4. [Ví Dụ Chi Tiết](#ví-dụ-chi-tiết)
5. [Bảng Chuyển Đổi](#bảng-chuyển-đổi)
6. [Debugging & Testing](#debugging--testing)

---

## Axios là gì?

**Axios** là thư viện JavaScript dùng để gọi API (HTTP requests) từ browser hoặc Node.js.

```javascript
// Cài đặt
npm install axios

// Import
import axios from "axios";

// Cách dùng cơ bản
axios.get("/api/users").then(res => console.log(res.data));
axios.post("/api/users", { name: "John" }).then(res => console.log(res.data));
```

**Tại sao dùng axios?**

- Dễ dùng, API đơn giản
- Hỗ trợ Promises & async/await
- Có interceptors (xử lý request/response trước khi gửi/nhận)
- Tự động serialize JSON, xử lý headers
- Error handling tốt

---

## Cấu Trúc API Docs

Tài liệu API (API Docs) thường có dạng **OpenAPI/Swagger** hoặc **Postman Collection**.
Chúng ta sẽ học từ file `admin-api.yaml` (OpenAPI 3.0.3 format).

### Các Thành Phần Chính

```yaml
# 1. Endpoint (đường dẫn)
paths:
  /admin/auth/login:           # ← Endpoint
    post:                       # ← HTTP Method (POST)
      summary: Authenticate admin user
      
      requestBody:              # ← Request (dữ liệu gửi lên)
        required: true
        content:
          application/json:
            schema:
              properties:
                username: { type: string }
                password: { type: string }
      
      responses:                # ← Response (dữ liệu server trả về)
        '200':
          content:
            application/json:
              schema:
                properties:
                  access_token: { type: string }
                  token_type: { type: string }
                  expires_in: { type: integer }
```

### 5 Yếu Tố Cần Đọc Từ Docs

| Yếu Tố | Ý Nghĩa | Ví Dụ |
|--------|---------|--------|
| **Endpoint** | Đường dẫn API | `/admin/auth/login` |
| **Method** | HTTP method (GET/POST/PUT/DELETE) | `POST` |
| **Parameters** | Dữ liệu gửi lên (query, body, path) | `{ username, password }` |
| **Request Schema** | Kiểu dữ liệu request | `string, integer, boolean` |
| **Response Schema** | Kiểu dữ liệu response | `{ access_token, token_type, ... }` |

---

## Quy Trình: Docs → Code

### Step 1: Đọc Endpoint & Method

```yaml
# Docs
paths:
  /admin/auth/login:  # ← Endpoint
    post:             # ← Method
```

```javascript
// Code
const endpoint = "/admin/auth/login";
const method = "POST";

// Axios syntax
axios.post(endpoint, data);
// hoặc
axios.request({ url: endpoint, method: "POST", data });
```

### Step 2: Đọc Request Schema (Input)

```yaml
# Docs
requestBody:
  required: true
  content:
    application/json:
      schema:
        properties:
          username:
            type: string
            example: "admin"
          password:
            type: string
            example: "strongpassword123"
```

```javascript
// Code
const payload = {
  username: "admin",
  password: "strongpassword123"
};

axios.post(endpoint, payload);
```

### Step 3: Đọc Response Schema (Output)

```yaml
# Docs
responses:
  '200':
    content:
      application/json:
        schema:
          properties:
            success: { type: boolean }
            data:
              properties:
                access_token: { type: string }
                token_type: { type: string }
                expires_in: { type: integer }
```

```javascript
// Code
axios.post(endpoint, payload)
  .then(res => {
    const { success, data } = res.data;
    const { access_token, token_type, expires_in } = data;
    
    console.log(access_token);  // "eyJ..."
    console.log(expires_in);    // 691200 (seconds)
  });
```

### Step 4: Xử Lý Errors

```yaml
# Docs
responses:
  '400':
    description: Bad request
  '401':
    description: Unauthorized
  '500':
    description: Internal server error
```

```javascript
// Code
try {
  const res = await axios.post(endpoint, payload);
  const token = res.data.data.access_token;
  
} catch (err) {
  if (err.response?.status === 400) {
    console.error("Bad request");
  } else if (err.response?.status === 401) {
    console.error("Unauthorized");
  } else if (err.response?.status === 500) {
    console.error("Server error");
  }
}
```

### Step 5: Tạo Service Function

```javascript
// Wrap request vào function để tái sử dụng
export const loginAdmin = async (username, password) => {
  const endpoint = "/admin/auth/login";
  const payload = { username, password };
  
  try {
    const res = await axios.post(endpoint, payload);
    return res.data.data; // { access_token, token_type, expires_in }
  } catch (err) {
    throw {
      code: err.response?.status,
      message: err.response?.data?.message || "Login failed"
    };
  }
};
```

---

## Ví Dụ Chi Tiết

### VD1: Đơn Giản - GET Request

**Docs:**

```yaml
/admin/users:
  get:
    parameters:
      - name: page
        in: query
        schema: { type: integer, default: 1 }
      - name: limit
        in: query
        schema: { type: integer, default: 20 }
    responses:
      '200':
        schema:
          properties:
            data:
              type: array
              items: { type: object }
            pagination:
              type: object
```

**Code:**

```javascript
// Method 1: axios.get()
const res = await axios.get("/admin/users", {
  params: { page: 1, limit: 20 }
});
const { data, pagination } = res.data;

// Method 2: axios.request()
const res = await axios.request({
  url: "/admin/users",
  method: "GET",
  params: { page: 1, limit: 20 }
});
```

---

### VD2: POST Request với Body

**Docs:**

```yaml
/admin/users:
  post:
    requestBody:
      required: true
      content:
        application/json:
          schema:
            properties:
              email: { type: string, format: email }
              name: { type: string }
              password: { type: string }
    responses:
      '200':
        schema:
          properties:
            data:
              properties:
                id: { type: integer }
                email: { type: string }
                name: { type: string }
```

**Code:**

```javascript
// Method 1: axios.post()
const newUser = {
  email: "john@example.com",
  name: "John Doe",
  password: "Pass123"
};
const res = await axios.post("/admin/users", newUser);
const { id, email, name } = res.data.data;

// Method 2: axios.request()
const res = await axios.request({
  url: "/admin/users",
  method: "POST",
  data: newUser
});
```

---

### VD3: PUT Request (Update)

**Docs:**

```yaml
/admin/users/{user_id}:
  put:
    parameters:
      - name: user_id
        in: path
        required: true
        schema: { type: integer }
    requestBody:
      content:
        application/json:
          schema:
            properties:
              name: { type: string }
              position: { type: string }
```

**Code:**

```javascript
const userId = 5;
const updates = {
  name: "Jane Doe",
  position: "Manager"
};

// Method 1: axios.put()
const res = await axios.put(`/admin/users/${userId}`, updates);

// Method 2: axios.request()
const res = await axios.request({
  url: `/admin/users/${userId}`,
  method: "PUT",
  data: updates
});

const { id, name, position } = res.data.data;
```

---

### VD4: DELETE Request

**Docs:**

```yaml
/admin/users/{user_id}:
  delete:
    parameters:
      - name: user_id
        in: path
        required: true
    responses:
      '200':
        schema:
          properties:
            data:
              properties:
                id: { type: integer }
                is_deleted: { type: boolean }
```

**Code:**

```javascript
const userId = 5;

// Method 1: axios.delete()
const res = await axios.delete(`/admin/users/${userId}`);
console.log(res.data.data.is_deleted); // true

// Method 2: axios.request()
const res = await axios.request({
  url: `/admin/users/${userId}`,
  method: "DELETE"
});
```

---

### VD5: Bulk Operations

**Docs:**

```yaml
/admin/users/bulk/create:
  post:
    requestBody:
      content:
        application/json:
          schema:
            properties:
              users:
                type: array
                items:
                  properties:
                    email: { type: string }
                    name: { type: string }
    responses:
      '200':
        schema:
          properties:
            data:
              type: array
              items:
                properties:
                  success: { type: boolean }
                  user_id: { type: integer }
                  error: { type: string }
            total_success: { type: integer }
            total_failed: { type: integer }
```

**Code:**

```javascript
const users = [
  { email: "user1@example.com", name: "User 1" },
  { email: "user2@example.com", name: "User 2" }
];

const res = await axios.post("/admin/users/bulk/create", { users });

const results = res.data.data; // Array of {success, user_id, error}
console.log(res.data.total_success); // 2
console.log(res.data.total_failed);  // 0

results.forEach(result => {
  if (result.success) {
    console.log(`Created user ID: ${result.user_id}`);
  } else {
    console.error(`Failed: ${result.error}`);
  }
});
```

---

### VD6: Authentication (Bearer Token)

**Docs:**

```yaml
securitySchemes:
  BearerAuth:
    type: http
    scheme: bearer
    bearerFormat: JWT

paths:
  /admin/users:
    get:
      security:
        - BearerAuth: []
```

**Code:**

```javascript
// Manual way
const token = "eyJ...";
const res = await axios.get("/admin/users", {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

// Recommended: Axios interceptor
axios.interceptors.request.use(config => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Sau đó có thể gọi mà không cần truyền token
const res = await axios.get("/admin/users");
```

---

## Bảng Chuyển Đổi

### HTTP Methods

| Docs | Axios | Ý Nghĩa |
|------|-------|---------|
| `get:` | `axios.get(url)` | Lấy dữ liệu |
| `post:` | `axios.post(url, data)` | Tạo mới |
| `put:` | `axios.put(url, data)` | Cập nhật |
| `patch:` | `axios.patch(url, data)` | Cập nhật một phần |
| `delete:` | `axios.delete(url)` | Xóa |

### Parameter Locations

| Location | Docs | Axios | Ví Dụ |
|----------|------|-------|--------|
| Query String | `in: query` | `params` | `?page=1&limit=20` |
| URL Path | `in: path` | Template string | `/users/{id}` → `/users/5` |
| Request Body | `requestBody` | `data` | `{ name: "John" }` |
| Header | `in: header` | `headers` | `Authorization: Bearer ...` |

### Response Status Codes

| Code | Ý Nghĩa | Xử Lý |
|------|---------|--------|
| `200` | OK - Thành công | `res.data` |
| `201` | Created - Tạo mới thành công | `res.data` |
| `400` | Bad Request - Input không hợp lệ | `err.response.status === 400` |
| `401` | Unauthorized - Token không hợp lệ | `redirect to login` |
| `403` | Forbidden - Không có quyền | `show permission error` |
| `404` | Not Found - Resource không tồn tại | `show not found message` |
| `500` | Internal Server Error - Lỗi server | `retry hoặc show error` |

---

## Debugging & Testing

### 1. Console Logging

```javascript
// Log request
console.log("Requesting:", { url, method, data, params });

// Log response
axios.get("/api/users")
  .then(res => {
    console.log("Status:", res.status);
    console.log("Data:", res.data);
    console.log("Headers:", res.headers);
  });
```

### 2. Axios Interceptors (Debug)

```javascript
// Log tất cả request
axios.interceptors.request.use(config => {
  console.log("Request:", config);
  return config;
});

// Log tất cả response
axios.interceptors.response.use(
  res => {
    console.log("Response:", res);
    return res;
  },
  err => {
    console.error("Error:", err);
    throw err;
  }
);
```

### 3. Testing với Postman

1. Mở Postman
2. Import `admin-api.yaml` file
3. Test từng endpoint
4. Copy request details sang Axios code

**Postman → Axios:**

```
Postman URL: POST http://localhost:8000/api/v1/admin/auth/login
Postman Body: { "username": "admin", "password": "pass" }

→

Axios:
axios.post("/admin/auth/login", {
  username: "admin",
  password: "pass"
});
```

### 4. Network Tab (Browser DevTools)

```
F12 → Network tab → Refresh
→ Xem request headers, body, response
→ Copy details sang code
```

---

## Best Practices

### 1. Luôn Sử dụng Try-Catch

```javascript
try {
  const res = await axios.get("/api/users");
  console.log(res.data);
} catch (err) {
  console.error(err.message);
}
```

### 2. Tạo Service Layer

```javascript
// ❌ Không tốt: gọi axios trực tiếp ở component
const MyComponent = () => {
  useEffect(() => {
    axios.get("/api/users").then(res => setUsers(res.data));
  }, []);
};

// ✅ Tốt: dùng service layer
import { getUsers } from "./api/userService";
const MyComponent = () => {
  useEffect(() => {
    getUsers().then(users => setUsers(users));
  }, []);
};
```

### 3. Chuẩn Hóa Response

```javascript
// ❌ Không tốt: response format khác nhau ở mỗi endpoint
// Endpoint 1 trả về: { data: [...] }
// Endpoint 2 trả về: { users: [...] }

// ✅ Tốt: normalize response
const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.users)) return data.users;
  return [];
};
```

### 4. Sử dụng Interceptors Cho Token

```javascript
// Thay vì truyền token mỗi lần:
const res = await axios.get("/api/users", {
  headers: { Authorization: `Bearer ${token}` }
});

// Dùng interceptor:
axios.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

const res = await axios.get("/api/users"); // Token tự động thêm
```

### 5. Xử Lý 401 Errors

```javascript
axios.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      // Token hết hạn
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    throw err;
  }
);
```

---

## Cheat Sheet

### Cách Đọc Docs → Code

```
1️⃣ Đọc endpoint + method
   /admin/users/5 + DELETE
   
2️⃣ Đọc parameters
   - Path: user_id = 5
   - Query: page = 1, limit = 20
   - Body: { name: "John" }
   
3️⃣ Viết axios code
   axios.delete("/admin/users/5", {
     params: { page: 1, limit: 20 },
   })
   
4️⃣ Đọc response schema
   { success: true, data: { id, name, ... } }
   
5️⃣ Xử lý response
   const { id, name } = res.data.data;
   
6️⃣ Xử lý lỗi
   } catch (err) {
     if (err.status === 404) { ... }
   }
```

---

## Tài Liệu Tham Khảo

- **Axios Docs**: <https://axios-http.com/>
- **OpenAPI Spec**: <https://spec.openapis.org/>
- **HTTP Status Codes**: <https://httpwg.org/specs/rfc7231.html#status.codes>
- **Admin API Docs**: [admin-api.yaml](./admin-api.yaml)
