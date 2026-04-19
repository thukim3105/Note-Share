/**
 * ============================================
 * ERROR HANDLER - TIỆN ÍCH XỬ LÝ LỖI
 * ============================================
 * 
 * Trong ứng dụng, lỗi từ API có thể xảy ra ở nhiều nơi
 * Hàm này cung cấp một cách thống nhất để xử lý lỗi
 * 
 * Cách import và sử dụng:
 *   
 *   import { handleError } from "../api/errorHandler.js";
 *   
 *   try {
 *     await loginAdmin({ username, password });
 *   } catch (err) {
 *     handleError(err); // Tự động log và alert user
 *   }
 */
export const handleError = (err) => {
  // err?.code: lấy mã lỗi từ err object (ví dụ: "API_ERROR", "SYS_503", "NETWORK_ERROR")
  // || "UNKNOWN_ERROR": nếu không có code thì mặc định là "UNKNOWN_ERROR"
  const code = err?.code || "UNKNOWN_ERROR";

  // Kiểm tra: đó là lỗi service unavailable không?
  // SYS_503 = HTTP 503 Service Unavailable (server quá tải hoặc maintenance)
  if (code === "SYS_503") {
    // console.warn(): log cảnh báo (nhẹ nhàng hơn console.error)
    console.warn("Service unavailable", err); // In ra: "Service unavailable" + chi tiết lỗi
  }

  // Kiểm tra: đó là lỗi có thể retry không?
  // retryable = true có nghĩa: tạm thời lỗi, hãy thử lại sau (network timeout, server quá tải, ...)
  // retryable = false có nghĩa: lỗi cố định, không nên retry (validation error, 404, ...)
  if (err?.retryable) {
    console.warn("Retryable error", err); // In ra cảnh báo để remind developer
  }

  // console.error(): log lỗi (in ra toàn bộ error object để debug)
  console.error(err); // In ra đầy đủ thông tin: code, message, details, meta, status, ...
};

/**
 * ============================================
 * VÍ DỤ SỬ DỤNG ERRORHANDLER TRONG COMPONENT
 * ============================================
 * 
 * VD1: Đơn giản - gọi handleError()
 * 
 *   const handleLogin = async (username, password) => {
 *     try {
 *       const token = await loginAdmin({ username, password });
 *       localStorage.setItem("admin_token", token.access_token);
 *     } catch (err) {
 *       handleError(err);
 *       alert(err.message); // "Login failed" hoặc "Network error"
 *     }
 *   };
 * 
 * VD2: Xử lý lỗi cụ thể theo mã
 * 
 *   const handleDelete = async (userId) => {
 *     try {
 *       await deleteUser(userId);
 *       // Refresh danh sách
 *       loadUsers();
 *     } catch (err) {
 *       if (err.code === "VALIDATION_ERROR") {
 *         alert("Invalid input: " + JSON.stringify(err.details));
 *       } else if (err.status === 404) {
 *         alert("User not found");
 *       } else if (err.status === 401) {
 *         // Token hết hạn → chuyển về login
 *         localStorage.removeItem("admin_token");
 *         window.location.href = "/auth";
 *       } else {
 *         alert("Error: " + err.message);
 *       }
 *       
 *       // Vẫn log để debug:
 *       handleError(err);
 *     }
 *   };
 * 
 * VD3: Xử lý với retry logic
 * 
 *   const fetchWithRetry = async (fn, maxRetries = 3) => {
 *     for (let i = 0; i < maxRetries; i++) {
 *       try {
 *         return await fn();
 *       } catch (err) {
 *         if (!err.retryable || i === maxRetries - 1) {
 *           // Không thể retry hoặc đã retry hết
 *           throw err;
 *         }
 *         // Retry sau 1 giây
 *         await new Promise(resolve => setTimeout(resolve, 1000));
 *       }
 *     }
 *   };
 *   
 *   const handleLoad = async () => {
 *     try {
 *       const { users } = await fetchWithRetry(() => getUsers({ page: 1 }));
 *       setUsers(users);
 *     } catch (err) {
 *       handleError(err);
 *       alert("Failed to load users after retries");
 *     }
 *   };
 */
