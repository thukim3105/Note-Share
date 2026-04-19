// Nhập thư viện axios - thư viện dùng để gọi API (HTTP request) từ JavaScript
import axios from "axios";

/**
 * ============================================
 * PHẦN 1: TẠO INSTANCE AXIOS
 * ============================================
 * axios.create() tạo một "client" API độc lập để:
 * - Cấu hình chung cho tất cả request (baseURL, timeout, headers)
 * - Dễ dàng thêm interceptors (xử lý request/response trước khi gửi/nhận)
 * - Tái sử dụng trong nhiều chỗ mà không lặp lại cấu hình
 */
const api = axios.create({
  // baseURL: địa chỉ gốc cho mọi request (ví dụ: POST /admin/users → http://localhost:8000/api/v1/admin/users)
  // import.meta.env.VITE_API_URL = biến môi trường từ file .env (nếu có)
  // || "http://localhost:8000/api/v1" = nếu không có biến môi trường thì dùng địa chỉ mặc định
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  
  // timeout: nếu server không phản hồi trong 10000ms (10 giây) thì hủy request
  timeout: 10000,
  
  // headers: headers mặc định gửi kèm mỗi request
  headers: {
    // "Content-Type": "application/json" = chỉ định dữ liệu request là JSON format
    "Content-Type": "application/json",
  },
});

/**
 * ============================================
 * PHẦN 2: LẤY TOKEN TỪ LOCALSTORAGE
 * ============================================
 * Hàm này tìm và trả về token đã lưu từ lần đăng nhập trước
 * Token dùng để chứng thực với server (server biết request này từ user nào)
 * 
 * Cơ chế: admin_token là key chính, access_token là backup
 * Lý do: nếu bạn đã xóa admin_token nhưng chưa xóa access_token, vẫn có token để dùng
 */
const getAccessToken = () => {
  // localStorage.getItem("admin_token"): lấy token nếu có
  // || localStorage.getItem("access_token"): nếu admin_token không có, lấy access_token thay thế
  return localStorage.getItem("admin_token") || localStorage.getItem("access_token");
};

/**
 * ============================================
 * PHẦN 3: KIỂM TRA RESPONSE CÓ PHẢI API CHUẨN KHÔNG
 * ============================================
 * Backend trả về response chuẩn có dạng: { status, success, data, error, meta }
 * Hàm này kiểm tra: nếu response có trường "success" thì đó là API chuẩn
 * 
 * Tại sao: vì có thể server trả về HTML error page hoặc format khác → cần phân biệt
 */
const isApiResponse = (res) => {
  // res && typeof res === "object" && "success" in res
  // res: object phải tồn tại (không null, undefined)
  // typeof res === "object": phải là object (không phải string, number, boolean)
  // "success" in res: object phải có trường "success"
  return res && typeof res === "object" && "success" in res;
};

/**
 * ============================================
 * PHẦN 4: ĐỊNH DẠNG RESPONSE THÀNH CÔNG
 * ============================================
 * Backend trả về: { status, success, data, meta, error }
 * Frontend muốn: { ...axios_response, data: (dữ liệu thực), meta, message, pagination }
 * 
 * Hàm này "chuẩn hóa" để dễ xử lý ở component
 */
const formatSuccess = (response) => {
  // response.data: lấy phần dữ liệu từ response của axios
  // (axios response có: status, data, headers, config, ... → chúng ta chỉ quan tâm data)
  const res = response.data;

  // Trả về object mới với:
  return {
    ...response, // Copy tất cả field từ response gốc (status, headers, config, ...)
    data: res.data, // Thay thế data = dữ liệu thực từ backend (access_token, user list, ...)
    meta: res.meta ?? null, // Meta info từ backend (request_id, timestamp, ...) hoặc null nếu không có
    message: res.message ?? null, // Message từ backend (thành công, warning, ...) hoặc null
    pagination: res.pagination ?? null, // Thông tin phân trang (page, limit, total) hoặc null
  };
};

/**
 * ============================================
 * PHẦN 5: ĐỊNH DẠNG LỖI
 * ============================================
 * Khi response.success = false, chúng ta muốn format lỗi theo chuẩn
 * Để component dễ hiểu: code lỗi, message, liệu có thể retry, chi tiết, ...
 */
const formatError = (res, status) => {
  // res?.error || {}: lấy object error từ response, nếu không có thì dùng object rỗng
  const error = res?.error || {};

  // Trả về object lỗi chuẩn:
  return {
    // code: mã lỗi từ backend, nếu không có thì dùng "API_ERROR" mặc định
    code: error.code || "API_ERROR",
    // message: thông báo lỗi từ backend, hoặc message từ response, hoặc text mặc định
    message: error.message || res?.message || "Request failed",
    // retryable: có nên thử lại request không? (true/false từ backend, mặc định false)
    retryable: error.retryable ?? false,
    // details: chi tiết lỗi (validation errors, stack trace, ...) hoặc null
    details: error.details ?? null,
    // meta: meta info từ response (request_id, timestamp, ...)
    meta: res?.meta ?? null,
    // status: HTTP status code từ axios (200, 404, 500, ...)
    status,
  };
};

/**
 * ============================================
 * PHẦN 6: REQUEST INTERCEPTOR (XỬ LÝ TRƯỚC KHI GỬI)
 * ============================================
 * Interceptor = bộ "chặn" request
 * Mỗi khi gọi api.get(), api.post(), ... → xử lý ở đây trước khi thực sự gửi đi
 * 
 * Việc làm: thêm Authorization header với token (nếu có)
 * Lý do: server cần token để xác thực identity của user
 */
api.interceptors.request.use((config) => {
  // config = object cấu hình request (url, method, data, headers, ...)
  const token = getAccessToken(); // Lấy token từ localStorage

  // Nếu có token, thêm vào Authorization header
  if (token) {
    // Authorization: Bearer [token] = format chuẩn HTTP để gửi token
    // "Bearer " + token = ví dụ: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config; // Trả về config đã chỉnh sửa để gửi request
});

/**
 * ============================================
 * PHẦN 7: RESPONSE INTERCEPTOR (XỬ LÝ SAU KHI NHẬN)
 * ============================================
 * Interceptor có 2 callback:
 * 1. (response) => {} : xử lý response thành công (status 2xx)
 * 2. (error) => {} : xử lý response lỗi (status 4xx, 5xx) hoặc network error
 * 
 * Việc làm: chuẩn hóa response/error thành format mà component dễ xử lý
 */
api.interceptors.response.use(
  // Callback 1: Xử lý response thành công (HTTP status 200, 201, ...)
  (response) => {
    // response.data = dữ liệu trả về từ server
    const res = response.data;

    // Kiểm tra: response có phải API chuẩn không?
    // (có trường "success" không)
    if (isApiResponse(res)) {
      // Nếu success = false, coi đó là lỗi từ backend
      if (!res.success) {
        // Promise.reject() = từ chối promise, chuyển sang catch block
        // component gọi loginAdmin() sẽ bắt được lỗi ở .catch()
        return Promise.reject(formatError(res, response.status));
      }

      // Nếu success = true, chuẩn hóa response và trả về
      return formatSuccess(response);
    }

    // Nếu không phải API chuẩn (ví dụ: HTML error page)
    // Trả về response gốc để component xử lý
    return response;
  },
  
  // Callback 2: Xử lý response lỗi hoặc network error
  async (error) => {
    // error = object lỗi từ axios
    // error.response = response từ server (400, 500, ...) hoặc undefined nếu network error
    const response = error.response;
    const res = response?.data; // Dữ liệu lỗi từ server (nếu có response)

    // Kiểm tra: response có phải API chuẩn không?
    if (res && isApiResponse(res)) {
      // Chuẩn hóa và từ chối promise
      return Promise.reject(formatError(res, response.status));
    }

    // Kiểm tra: đó là lỗi 401 (Unauthorized) không?
    // 401 = token hết hạn hoặc không hợp lệ
    if (response?.status === 401) {
      // TODO: implement refresh token or logout
      // e.g. clearAuth(); window.location.href = "/login";
      // Ý tưởng: xóa token, chuyển hướng về login page
    }

    // Network error hoặc unknown error (server không phản hồi, timeout, ...)
    return Promise.reject({
      code: "NETWORK_ERROR", // Mã lỗi là NETWORK_ERROR
      message: error.message || "Network request failed", // Thông báo lỗi
      retryable: false, // Network error thường không nên retry ngay lập tức
      status: response?.status ?? null, // HTTP status (nếu có) hoặc null
      details: res ?? null, // Chi tiết lỗi từ server (nếu có) hoặc null
    });
  },
);

/**
 * ============================================
 * PHẦN 8: REQUEST WRAPPER - WRAPPER HÀM GỌI API
 * ============================================
 * Hàm này giúp gọi API dễ dàng hơn:
 * - Không cần nhớ cú pháp axios đầy đủ
 * - Tự động chọn trả về response.data hay response nguyên
 * - Dễ bảo trì và mở rộng
 * 
 * Cách dùng:
 *   request("/users", { method: "GET" })
 *   request("/users", { method: "POST", body: { name: "John" } })
 */
export const request = async (
  // path: đường dẫn endpoint (ví dụ: "/admin/users", "/admin/auth/login")
  // baseURL sẽ được thêm vào trước: /admin/users → http://localhost:8000/api/v1/admin/users
  path,
  // options = object tùy chọn (method, body, params, headers, raw)
  { method = "GET", body, params, headers, raw = false } = {},
) => {
  // api.request() = gọi request qua axios instance
  const response = await api.request({
    url: path, // Endpoint
    method, // HTTP method (GET, POST, PUT, DELETE, ...)
    params, // Query string (ví dụ: ?page=1&limit=10)
    data: body, // Request body (JSON object)
    headers, // Custom headers (nếu cần)
  });

  // raw = false: trả về response.data (dữ liệu thực đã chuẩn hóa)
  // raw = true: trả về response nguyên (để xử lý thêm ở layer service)
  return raw ? response : response.data;
};

// Export api instance để sử dụng ở nơi khác hoặc để thêm interceptors mới
export default api;

/**
 * ============================================
 * PHẦN 9: VÍ DỤ SỬ DỤNG REQUEST WRAPPER
 * ============================================
 * 
 * Request wrapper `request()` là hàm low-level để gọi API
 * Thường không dùng trực tiếp mà thông qua service layer (userService.js)
 * Nhưng có thể dùng khi cần request tùy biến
 */

/**
 * VD1: GET request đơn giản
 * 
 * Sử dụng:
 *   const result = await request("/admin/users", { method: "GET" });
 *   // result = response.data (object)
 * 
 * Tương đương với:
 *   GET http://localhost:8000/api/v1/admin/users
 *   Response: { success: true, data: [...], meta: {...} }
 */

/**
 * VD2: GET request với query parameters
 * 
 * Sử dụng:
 *   const result = await request("/admin/users", {
 *     method: "GET",
 *     params: { page: 1, limit: 20, name: "John" }
 *   });
 * 
 * Tương đương với:
 *   GET http://localhost:8000/api/v1/admin/users?page=1&limit=20&name=John
 *   
 * Lưu ý: params undefined, null, "" tự động bị loại bỏ bởi interceptor
 */

/**
 * VD3: POST request với body (JSON data)
 * 
 * Sử dụng:
 *   const result = await request("/admin/auth/login", {
 *     method: "POST",
 *     body: { username: "admin", password: "password123" }
 *   });
 *   // result = { access_token: "...", token_type: "bearer", ... }
 * 
 * Tương đương với:
 *   POST http://localhost:8000/api/v1/admin/auth/login
 *   Content-Type: application/json
 *   Body: { "username": "admin", "password": "password123" }
 *   Authorization: Bearer [token] (nếu token tồn tại)
 */

/**
 * VD4: PUT request (Update)
 * 
 * Sử dụng:
 *   const result = await request("/admin/users/5", {
 *     method: "PUT",
 *     body: { name: "Updated Name", position: "Manager" }
 *   });
 *   // result = { id: 5, name: "Updated Name", position: "Manager", ... }
 * 
 * Tương đương với:
 *   PUT http://localhost:8000/api/v1/admin/users/5
 *   Content-Type: application/json
 *   Body: { "name": "Updated Name", "position": "Manager" }
 *   Authorization: Bearer [token]
 */

/**
 * VD5: DELETE request
 * 
 * Sử dụng:
 *   const result = await request("/admin/users/5", {
 *     method: "DELETE"
 *   });
 *   // result = { id: 5, is_deleted: true, ... }
 * 
 * Tương đương với:
 *   DELETE http://localhost:8000/api/v1/admin/users/5
 *   Authorization: Bearer [token]
 */

/**
 * VD6: Request với raw = true (lấy response nguyên)
 * 
 * Mặc định raw = false: trả về response.data (dữ liệu thực)
 * raw = true: trả về response nguyên (status, data, headers, config, ...)
 * 
 * Sử dụng khi cần:
 *   const response = await request("/admin/users", {
 *     method: "GET",
 *     params: { page: 1 },
 *     raw: true  // ← Lấy response nguyên
 *   });
 *   
 *   console.log(response.status);    // 200
 *   console.log(response.statusText); // "OK"
 *   console.log(response.data);      // Dữ liệu từ server
 *   console.log(response.headers);   // Response headers (content-type, ...)
 * 
 * Thường service layer (userService.js) sử dụng raw = true
 * để xử lý dữ liệu trước khi trả về component
 */

/**
 * VD7: Error handling
 * 
 * Khi gọi request(), nếu lỗi sẽ throw error object:
 * 
 *   try {
 *     const result = await request("/admin/users/999", { method: "GET" });
 *   } catch (err) {
 *     console.log(err.code);     // "API_ERROR", "NETWORK_ERROR", ...
 *     console.log(err.message);  // "User not found", "Network error", ...
 *     console.log(err.status);   // 404, 500, ...
 *     console.log(err.retryable); // true/false
 *     console.log(err.details);  // Chi tiết validation error, ...
 *     console.log(err.meta);     // { request_id, timestamp, ... }
 *   }
 * 
 * Error codes:
 *   - "API_ERROR": Lỗi từ backend API
 *   - "NETWORK_ERROR": Lỗi network (timeout, connection refused, ...)
 *   - "VALIDATION_ERROR": Dữ liệu input không hợp lệ
 *   - ...
 */

/**
 * VD8: Gán custom headers
 * 
 * Sử dụng:
 *   const result = await request("/admin/users", {
 *     method: "GET",
 *     headers: {
 *       "X-Custom-Header": "custom-value",
 *       "X-Request-ID": "12345"
 *     }
 *   });
 * 
 * Lưu ý:
 *   - "Content-Type: application/json" tự động được thêm
 *   - "Authorization: Bearer [token]" tự động được thêm (từ token interceptor)
 *   - Custom headers sẽ merge với headers mặc định
 */
