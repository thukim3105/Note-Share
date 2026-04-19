// Nhập api instance từ client.js (axios được cấu hình sẵn)
import api from "./client.js";

/**
 * ============================================
 * GIỚI THIỆU USERSERVICE
 * ============================================
 * 
 * UserService là "service layer" - lớp trung gian giữa component và backend API
 * 
 * Kiến trúc:
 *   Component → userService (service layer) → client.js (axios wrapper) → Backend API
 * 
 * Lợi ích:
 *   1. Không lặp lại code (DRY): component chỉ cần import và gọi hàm
 *   2. Dễ bảo trì: thay đổi API logic chỉ cần sửa service, không ảnh hưởng component
 *   3. Data normalization: format dữ liệu từ backend thành format mà component cần
 *   4. Error handling tập trung: xử lý lỗi ở một nơi
 * 
 * Cách import và sử dụng từ component:
 *   
 *   import { loginAdmin, getUsers, deleteUser } from "../api/userService.js";
 *   
 *   // Trong component:
 *   const handleLogin = async (username, password) => {
 *     try {
 *       const token = await loginAdmin({ username, password });
 *       localStorage.setItem("admin_token", token.access_token);
 *       window.location.href = "/admin"; // Chuyển hướng
 *     } catch (err) {
 *       handleError(err); // Xử lý lỗi
 *     }
 *   };
 *   
 *   const loadUsers = async () => {
 *     try {
 *       const { users, pagination } = await getUsers({ page: 1, limit: 20 });
 *       setUsers(users);
 *       setPagination(pagination);
 *     } catch (err) {
 *       handleError(err);
 *     }
 *   };
 */

/**
 * ============================================
 * PHẦN 1: UTILITY FUNCTIONS (HÀM HỖ TRỢ)
 * ============================================
 * Những hàm nhỏ để xử lý dữ liệu trước khi gửi hoặc sau khi nhận
 */

/**
 * cleanParams: Dọn dẹp parameters (xóa những value rỗng)
 * 
 * Vì sao: Backend API thường yêu cầu không gửi query param nếu không có giá trị
 * Ví dụ:
 *   Input:  { name: "John", age: null, status: "" }
 *   Output: { name: "John" }
 * 
 * Cách hoạt động:
 *   - Object.entries(params): đổi object thành array [[key, value], ...]
 *   - .filter(): chỉ giữ lại item có value !== undefined, null, ""
 *   - Object.fromEntries(): đổi array về lại object
 */
const cleanParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(
      // [, v]: destructure để lấy value (bỏ key), dấu [,] = không dùng giá trị thứ nhất
      // v !== undefined && v !== null && v !== "": chỉ giữ value có thực
      ([, v]) => v !== undefined && v !== null && v !== "",
    ),
  );

/**
 * normalizeList: Chuyển đổi nhiều format danh sách thành array
 * 
 * Vì sao: Backend có thể trả về user list ở các key khác nhau tùy endpoint
 * Tất cả đều là danh sách nhưng tên key khác → normalize thành array
 * 
 * Ví dụ:
 *   { users: [...] } → [...]
 *   { items: [...] } → [...]
 *   { results: [...] } → [...]
 *   [...] → [...]
 *   undefined → []
 */
const normalizeList = (data) => {
  // Nếu data đã là array, trả về luôn
  if (Array.isArray(data)) return data;
  // Nếu data.items là array, trả về data.items
  if (Array.isArray(data?.items)) return data.items;
  // Nếu data.results là array, trả về data.results
  if (Array.isArray(data?.results)) return data.results;
  // Nếu data.users là array, trả về data.users
  if (Array.isArray(data?.users)) return data.users;
  // Nếu không match format nào, trả về array rỗng
  return [];
};

/**
 * ============================================
 * PHẦN 2: HTTP WRAPPER - WRAPPER GỌI API
 * ============================================
 * 
 * Hàm http là layer giữa:
 *   Component → http() → api.request() → axios → server
 * 
 * Mục đích:
 *   1. Tự động dọn dẹp parameters (xóa undefined, null, "")
 *   2. Cho phép trả về response.data hoặc response nguyên (raw)
 *   3. Giảm code lặp lại khi gọi API
 * 
 * Cách dùng:
 *   await http("/admin/users", { method: "GET" })
 *   await http("/admin/users", { method: "POST", body: { name: "John" } })
 *   await http("/admin/users", { params: { page: 1, raw: true } })
 */
const http = async (path, { method = "GET", body, params, raw } = {}) => {
  // api.request(): gọi request qua axios instance (cái đã setup token, interceptor, ...)
  const res = await api.request({
    url: path, // Đường dẫn endpoint
    method, // HTTP method (GET, POST, PUT, DELETE, ...)
    params: cleanParams(params), // Query parameters (đã được dọn dẹp)
    data: body, // Request body (JSON)
  });
  
  // raw = false (mặc định): trả về response.data (dữ liệu thực đã chuẩn hóa)
  // raw = true: trả về response nguyên để xử lý thêm ở đây
  return raw ? res : res.data;
};

/**
 * ============================================
 * PHẦN 3: AUTH FUNCTIONS (HÀM ĐĂNG NHẬP)
 * ============================================
 */

/**
 * loginAdmin: Gửi credential (username, password) để lấy token
 * 
 * Backend response:
 *   {
 *     "success": true,
 *     "data": {
 *       "access_token": "eyJ...",
 *       "token_type": "bearer",
 *       "expires_in": 691200
 *     }
 *   }
 * 
 * Frontend nhận:
 *   { access_token: "eyJ...", token_type: "bearer", expires_in: 691200 }
 * 
 * Cách dùng:
 *   const token = await loginAdmin({ username: "admin", password: "123" })
 *   localStorage.setItem("admin_token", token.access_token)
 */
export const loginAdmin = (payload) =>
  // POST /admin/auth/login + gửi payload (username, password)
  // Trả về response.data (chứa access_token, token_type, expires_in)
  http("/admin/auth/login", { method: "POST", body: payload });

/**
 * ============================================
 * PHẦN 4: USER FUNCTIONS (HÀM QUẢN LÝ USER)
 * ============================================
 */

/**
 * getUsers: Lấy danh sách user với filter
 * 
 * Backend response:
 *   {
 *     "success": true,
 *     "data": [{ id, name, email, ... }],
 *     "meta": { request_id, ... },
 *     "pagination": { page, limit, total, ... }
 *   }
 * 
 * Frontend normalize thành:
 *   {
 *     users: [{ id, name, email, ... }],
 *     meta: { request_id, ... },
 *     pagination: { page, limit, total, ... }
 *   }
 * 
 * Cách dùng:
 *   const { users, pagination } = await getUsers({ page: 1, limit: 10 })
 *   const allUsers = await getUsers({ status: "active" })
 */
export const getUsers = async (filters = {}) => {
  // Gọi api.request với raw = true để lấy response nguyên
  // (vì chúng ta cần xử lý thêm: normalizeList, pagination)
  const res = await http("/admin/users", { params: filters, raw: true });

  // Normalize response:
  return {
    // normalizeList(): chuyển res.data thành array user (xử lý các format khác nhau)
    users: normalizeList(res.data),
    // meta: thông tin meta từ backend (request_id, timestamp, ...) hoặc null
    meta: res.meta ?? null,
    // pagination: thông tin phân trang từ res.meta.pagination hoặc res.pagination hoặc null
    pagination: res.meta?.pagination ?? res.pagination ?? null,
  };
};

/**
 * createUser: Tạo user mới
 * 
 * Cách dùng:
 *   await createUser({ name: "John", email: "john@example.com", password: "123" })
 */
export const createUser = (payload) =>
  // POST /admin/users + gửi user data (name, email, password, ...)
  // Trả về user object vừa được tạo
  http("/admin/users", { method: "POST", body: payload });

/**
 * updateUser: Cập nhật thông tin user
 * 
 * Cách dùng:
 *   await updateUser(userId, { name: "Jane", email: "jane@example.com" })
 */
export const updateUser = (userId, payload) =>
  // PUT /admin/users/{userId} + gửi dữ liệu cập nhật
  // Trả về user object đã cập nhật
  http(`/admin/users/${userId}`, { method: "PUT", body: payload });

/**
 * deleteUser: Xóa user (soft delete - chỉ đánh dấu, không xóa thực)
 * 
 * Cách dùng:
 *   await deleteUser(userId)
 */
export const deleteUser = (userId) =>
  // DELETE /admin/users/{userId}
  // Trả về kết quả xóa (hoặc user object với status = deleted)
  http(`/admin/users/${userId}`, { method: "DELETE" });

/**
 * restoreUser: Khôi phục user đã bị xóa
 * 
 * Cách dùng:
 *   await restoreUser(userId)
 */
export const restoreUser = (userId) =>
  // POST /admin/users/{userId}/restore
  // Trả về user object đã được khôi phục
  http(`/admin/users/${userId}/restore`, { method: "POST" });

/**
 * ============================================
 * PHẦN 5: BULK FUNCTIONS (HÀM HÀNG LOẠT)
 * ============================================
 * Các hàm để xử lý nhiều user cùng lúc
 */

/**
 * bulkDeleteUsers: Xóa nhiều user cùng lúc
 * 
 * Cách dùng:
 *   await bulkDeleteUsers([userId1, userId2, userId3])
 */
export const bulkDeleteUsers = (userIds) =>
  // DELETE /admin/users + gửi danh sách ID cần xóa
  http("/admin/users", {
    method: "DELETE",
    body: { user_ids: userIds }, // { user_ids: [1, 2, 3] }
  });

/**
 * bulkCreateUsers: Tạo nhiều user cùng lúc
 * 
 * Cách dùng:
 *   await bulkCreateUsers([
 *     { name: "John", email: "john@example.com", password: "123" },
 *     { name: "Jane", email: "jane@example.com", password: "456" }
 *   ])
 */
export const bulkCreateUsers = (users) =>
  // POST /admin/users/bulk/create + gửi danh sách user cần tạo
  http("/admin/users/bulk/create", {
    method: "POST",
    body: { users }, // { users: [{...}, {...}] }
  });

/**
 * bulkUpdateUsers: Cập nhật nhiều user cùng lúc
 * 
 * Cách dùng:
 *   await bulkUpdateUsers([
 *     { id: 1, name: "John Updated" },
 *     { id: 2, status: "inactive" }
 *   ])
 */
export const bulkUpdateUsers = (users) =>
  // PUT /admin/users/bulk/update + gửi danh sách user cần cập nhật
  http("/admin/users/bulk/update", {
    method: "PUT",
    body: { users }, // { users: [{id, ...updates}, {...}] }
  });

/**
 * ============================================
 * PHẦN 6: VÍ DỤ SỬ DỤNG (USAGE EXAMPLES)
 * ============================================
 * Dưới đây là các ví dụ thực tế cách sử dụng API từ component
 * Reference: admin-api.yaml
 */

/**
 * VD1: Đăng nhập admin
 * 
 * Endpoint: POST /admin/auth/login
 * Request: { username: string, password: string }
 * Response: { access_token, token_type, expires_in }
 * 
 * Code sử dụng:
 */
// (async () => {
//   try {
//     const result = await loginAdmin({ username: "admin", password: "password123" });
//     // result = { access_token: "eyJ...", token_type: "bearer", expires_in: 691200 }
//     
//     // Lấy token:
//     const token = result.access_token;
//     const expiresIn = result.expires_in; // Số giây token còn hiệu lực (691200s = 8 ngày)
//     
//     // Lưu token vào localStorage
//     localStorage.setItem("admin_token", token);
//     localStorage.setItem("token_expires", Date.now() + expiresIn * 1000);
//   } catch (err) {
//     console.error("Login failed:", err.message); // "Authentication required or token invalid"
//     alert(err.message);
//   }
// })();

/**
 * VD2: Lấy danh sách user có phân trang
 * 
 * Endpoint: GET /admin/users?page=1&limit=20&name=John&status=active
 * Response: { data: [...users], pagination: {...}, meta: {...} }
 * 
 * Code sử dụng:
 */
// (async () => {
//   try {
//     const { users, pagination, meta } = await getUsers({ 
//       page: 1, 
//       limit: 20,
//       name: "John",      // Filter theo tên (partial match)
//       order_by: "created_at",
//       dir: "desc"
//     });
//     
//     // Lấy danh sách user:
//     users.forEach(user => {
//       console.log(user.id, user.email, user.name); // 1, "john@example.com", "John Doe"
//     });
//     
//     // Lấy thông tin phân trang:
//     console.log(pagination.page);        // 1
//     console.log(pagination.total);       // 123 (tổng số user)
//     console.log(pagination.total_pages); // 7 (tổng số trang: 123/20 = 7)
//     console.log(pagination.has_next);    // true (còn trang kế tiếp)
//     console.log(pagination.has_prev);    // false (không có trang trước)
//     
//     // Lấy metadata:
//     console.log(meta.request_id); // "295210f1-4518-4f9b-96a4-859426778987"
//     console.log(meta.timestamp);  // "2026-04-19T11:22:08.017611Z"
//   } catch (err) {
//     console.error("Failed to fetch users:", err.message);
//   }
// })();

/**
 * VD3: Tạo user mới
 * 
 * Endpoint: POST /admin/users
 * Request: { email, password?, name?, avatar_url?, bio?, position? }
 * Response: { data: user_object, meta: {...} }
 * 
 * Code sử dụng:
 */
// (async () => {
//   try {
//     const newUserData = {
//       email: "newuser@example.com",
//       password: "SecurePassword123!",
//       name: "Jane Doe",
//       avatar_url: "https://example.com/avatars/jane.jpg",
//       bio: "Product Manager",
//       position: "Senior PM"
//     };
//     
//     const result = await createUser(newUserData);
//     // result = { id: 5, email: "newuser@example.com", name: "Jane Doe", ... }
//     
//     // Lấy ID của user vừa tạo:
//     const newUserId = result.id;
//     console.log(`User created with ID: ${newUserId}`);
//   } catch (err) {
//     if (err.code === "VALIDATION_ERROR") {
//       console.error("Validation failed:", err.details);
//     } else {
//       console.error("Failed to create user:", err.message);
//     }
//   }
// })();

/**
 * VD4: Cập nhật thông tin user
 * 
 * Endpoint: PUT /admin/users/{user_id}
 * Request: { name?, avatar_url?, bio?, position?, password?, is_deleted? }
 * Response: { data: updated_user_object, meta: {...} }
 * 
 * Code sử dụng:
 */
// (async () => {
//   try {
//     const userId = 5;
//     const updateData = {
//       name: "Jane Smith",
//       position: "Lead PM",
//       bio: "Updated bio"
//     };
//     
//     const result = await updateUser(userId, updateData);
//     // result = { id: 5, name: "Jane Smith", position: "Lead PM", ... }
//     
//     console.log(`User ${result.id} updated:`, result.name);
//   } catch (err) {
//     if (err.status === 404) {
//       console.error("User not found");
//     } else {
//       console.error("Failed to update user:", err.message);
//     }
//   }
// })();

/**
 * VD5: Xóa user (soft delete)
 * 
 * Endpoint: DELETE /admin/users/{user_id}
 * Response: { data: user_object, meta: {...} }
 * 
 * Lưu ý: Soft delete = đánh dấu is_deleted = true, không xóa thực từ database
 * 
 * Code sử dụng:
 */
// (async () => {
//   try {
//     const userId = 5;
//     const result = await deleteUser(userId);
//     // result = { id: 5, is_deleted: true, ... }
//     
//     console.log(`User ${result.id} deleted (soft). is_deleted: ${result.is_deleted}`);
//   } catch (err) {
//     console.error("Failed to delete user:", err.message);
//   }
// })();

/**
 * VD6: Khôi phục user đã xóa
 * 
 * Endpoint: POST /admin/users/{user_id}/restore
 * Response: { data: user_object, meta: {...} }
 * 
 * Code sử dụng:
 */
// (async () => {
//   try {
//     const userId = 5;
//     const result = await restoreUser(userId);
//     // result = { id: 5, is_deleted: false, ... }
//     
//     console.log(`User ${result.id} restored. is_deleted: ${result.is_deleted}`);
//   } catch (err) {
//     console.error("Failed to restore user:", err.message);
//   }
// })();

/**
 * VD7: Bulk create - Tạo nhiều user cùng lúc
 * 
 * Endpoint: POST /admin/users/bulk/create
 * Request: { users: [{email, password?, name?, ...}, ...] }
 * Response: { data: [{success, user_id, error?}, ...], total_processed, total_success, total_failed }
 * 
 * Code sử dụng:
 */
// (async () => {
//   try {
//     const usersToCreate = [
//       { email: "user1@example.com", name: "User One", password: "Pass123" },
//       { email: "user2@example.com", name: "User Two", password: "Pass456" },
//       { email: "user3@example.com", name: "User Three", password: "Pass789" }
//     ];
//     
//     const result = await bulkCreateUsers(usersToCreate);
//     // result = {
//     //   data: [
//     //     { success: true, user_id: 10, error: null },
//     //     { success: true, user_id: 11, error: null },
//     //     { success: false, user_id: null, error: "Email already exists" }
//     //   ],
//     //   total_processed: 3,
//     //   total_success: 2,
//     //   total_failed: 1
//     // }
//     
//     // Xử lý kết quả:
//     result.data.forEach(item => {
//       if (item.success) {
//         console.log(`Created user ID: ${item.user_id}`);
//       } else {
//         console.error(`Failed: ${item.error}`);
//       }
//     });
//     
//     console.log(`Summary: ${result.total_success}/${result.total_processed} succeeded`);
//   } catch (err) {
//     console.error("Bulk create failed:", err.message);
//   }
// })();

/**
 * VD8: Bulk delete - Xóa nhiều user cùng lúc
 * 
 * Endpoint: DELETE /admin/users
 * Request: { user_ids: [1, 2, 3, ...] }
 * Response: { data: [{success, user_id, error?}, ...], total_processed, total_success, total_failed }
 * 
 * Code sử dụng:
 */
// (async () => {
//   try {
//     const userIdsToDelete = [5, 6, 7];
//     
//     const result = await bulkDeleteUsers(userIdsToDelete);
//     // result = {
//     //   data: [
//     //     { success: true, user_id: 5, error: null },
//     //     { success: true, user_id: 6, error: null },
//     //     { success: true, user_id: 7, error: null }
//     //   ],
//     //   total_processed: 3,
//     //   total_success: 3,
//     //   total_failed: 0
//     // }
//     
//     console.log(`Deleted ${result.total_success} users`);
//   } catch (err) {
//     console.error("Bulk delete failed:", err.message);
//   }
// })();

/**
 * VD9: Bulk update - Cập nhật nhiều user cùng lúc
 * 
 * Endpoint: PUT /admin/users/bulk/update
 * Request: { users: [{ id: number, updates: {...} }, ...] }
 * Response: { data: [{success, user_id, error?}, ...], total_processed, total_success, total_failed }
 * 
 * Code sử dụng:
 */
// (async () => {
//   try {
//     const usersToUpdate = [
//       { id: 1, updates: { status: "inactive", bio: "Updated bio 1" } },
//       { id: 2, updates: { position: "Senior Manager" } },
//       { id: 3, updates: { name: "New Name", bio: "New bio" } }
//     ];
//     
//     const result = await bulkUpdateUsers(usersToUpdate);
//     // result = {
//     //   data: [
//     //     { success: true, user_id: 1, error: null },
//     //     { success: true, user_id: 2, error: null },
//     //     { success: false, user_id: 3, error: "User not found" }
//     //   ],
//     //   total_processed: 3,
//     //   total_success: 2,
//     //   total_failed: 1
//     // }
//     
//     console.log(`Updated ${result.total_success} users successfully`);
//   } catch (err) {
//     console.error("Bulk update failed:", err.message);
//   }
// })();

/**
 * ============================================
 * PHẦN 7: LỰA CHỌN & CẬU HIỆN TRẠNG TRONG COMPONENT
 * ============================================
 * 
 * Hướng dẫn tích hợp API với React Component:
 * 
 * 1. Import service:
 *    import { getUsers, loginAdmin, deleteUser } from "../api/userService.js";
 * 
 * 2. Sử dụng trong useEffect (fetch dữ liệu):
 *    useEffect(() => {
 *      (async () => {
 *        try {
 *          const { users, pagination } = await getUsers({ page: 1 });
 *          setUsers(users);
 *          setPagination(pagination);
 *        } catch (err) {
 *          handleError(err);
 *        }
 *      })();
 *    }, []);
 * 
 * 3. Sử dụng trong event handler (create/update/delete):
 *    const handleDelete = async (userId) => {
 *      try {
 *        await deleteUser(userId);
 *        // Refetch danh sách users
 *        const { users } = await getUsers();
 *        setUsers(users);
 *      } catch (err) {
 *        handleError(err);
 *      }
 *    };
 * 
 * 4. Error handling:
 *    if (err.status === 401) {
 *      // Token hết hạn → chuyển về login
 *      window.location.href = "/auth";
 *    } else if (err.status === 404) {
 *      // Resource không tìm thấy
 *      alert("User not found");
 *    } else {
 *      // Lỗi khác
 *      console.error(err.code, err.message);
 *    }
 */
