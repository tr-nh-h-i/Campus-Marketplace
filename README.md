# TRƯỜNG ĐẠI HỌC CÔNG NGHỆ ĐỒNG NAI (DNTU)
## KHOA CÔNG NGHỆ THÔNG TIN — BỘ MÔN CÔNG NGHỆ PHẦN MỀM
### ĐỒ ÁN CUỐI KỲ: LẬP TRÌNH MOBILE (MÃ HỌC PHẦN: TH70111)
**Lớp học phần:** TH7011101 (Khóa 23DTH1)  
**Đề tài số 02 (Topic 02):** Campus Marketplace (Chợ Mua Bán Đồ Dùng Sinh Viên DNTU)  
**Giảng viên hướng dẫn:** ThS. Nguyễn Xuân Vinh  
**Thời gian thực hiện:** 14/10/2026 – 28/10/2026  

---

## 👥 THÔNG TIN NHÓM SINH VIÊN THỰC HIỆN

| STT | Họ và tên sinh viên | Mã số sinh viên (MSSV) | Vai trò & Trách nhiệm chính trong đồ án |
| :---: | :--- | :---: | :--- |
| **01** | **Trịnh Thế Thanh Hải** | **1923050080** | **Nhóm trưởng:** Thiết kế Kiến trúc State Store Zustand (4 slices), Bảo mật phiên đăng nhập qua `SecureStore`, Xây dựng luồng Xác thực & Điều hướng Expo Router. |
| **02** | **Bùi Thanh Sơn** | **1923050973** | **Thành viên:** Thiết kế hệ thống Design Tokens tập trung (`constants/theme.ts`), Chuẩn hóa tiêu chuẩn WCAG Accessibility (Touch Target $\ge 44\times 44$), Xây dựng giao diện Danh mục & Chi tiết sản phẩm. |
| **03** | **Nguyễn Vũ Minh Nhật** | **1923050861** | **Thành viên:** Xây dựng cơ chế bộ đệm ngoại tuyến (Offline Cache), Tiện ích nén ảnh tối ưu Wi-Fi trường (`imageCompressor.ts`), Viết bộ kiểm thử tự động (Unit & Critical Path Tests). |

- **Địa chỉ Git Repository:** [https://github.com/tr-nh-h-i/Campus-Marketplace.git](https://github.com/tr-nh-h-i/Campus-Marketplace.git)  
- **Email quản trị GitHub:** `github1hai@gmail.com`

---

## 🎯 1. TỔNG QUAN VỀ SẢN PHẨM (CAMPUS MARKETPLACE)

Ứng dụng **Campus Marketplace** là nền tảng thương mại điện tử nội bộ dành riêng cho sinh viên Đại học Công nghệ Đồng Nai (DNTU):
- **Đối tượng sử dụng:** Sinh viên có nhu cầu nhượng lại giáo trình cũ, chuột máy tính, quạt KTX, áo đồng phục... và sinh viên khác tìm mua với giá sinh viên trên nền tảng mạng Wi-Fi trường chập chờn.
- **Mô hình dữ liệu cốt lõi:**
  - `Listing`: id, sellerId, sellerName, title, category, price, stock, photoUri, createdAt, condition.
  - `CartItem`: listingId, listing, quantity.
  - `User`: id, name, email, role (`buyer` / `seller`).

---

## 🏆 2. ĐÁP ỨNG TOÀN DIỆN CÁC YÊU CẦU ĐỀ BÀI (CHECKLIST)

### A. Nhóm yêu cầu bắt buộc (Must Have)
1. **Đăng nhập & Đăng xuất an toàn:**
   - Phiên đăng nhập tồn tại bền vững qua các lần khởi động lại app.
   - Bí mật (Secret Token) được lưu trữ **duy nhất trong `SecureStore`** (mã hóa phần cứng AES-256).
   - Đăng xuất xóa sạch token phần cứng, purge bộ nhớ đệm và đặt lại state.
2. **Tải bài đăng từ Remote API & Đăng bán có nén ảnh:**
   - Đăng bài mới có kèm công cụ nén ảnh chụp điện thoại (chứng minh nén từ ~4.2MB xuống ~280KB, giảm 93% dung lượng).
3. **Bộ lọc danh mục & Tìm kiếm tính toán trực tiếp khi render:**
   - Tuân thủ quy định: `filteredListings` được tính toán trực tiếp trong hàm render (qua `useMemo`), **không bao giờ lưu dưới dạng state dẫn xuất**.
4. **Mục yêu thích (Favourites) trong Shared State:**
   - Lưu trữ qua `AsyncStorage` bền vững qua các lần khởi động lại app và xuất hiện đồng bộ ở cả 2 màn hình: Trang chủ và Màn hình Yêu thích riêng biệt.
5. **Giỏ hàng & Tóm tắt thanh toán:**
   - Tính toán tạm tính, quy tắc vận chuyển rõ ràng: Nhận tại Cổng 1 DNTU (Miễn phí 0đ) vs Giao tận phòng KTX (+15.000đ).
   - Ràng buộc tồn kho nghiêm ngặt: Không cho phép thêm vượt quá số lượng kho của người bán.
6. **Hoạt động Offline (Offline-first):**
   - Danh mục tải thành công lần gần nhất được lưu vào `AsyncStorage`. Khi mất mạng, app hiển thị banner màu cảnh báo kèm mốc thời gian cập nhật gần nhất và **tuyệt đối không bao giờ để màn hình trắng**.

### B. Nhóm yêu cầu nâng cao lấy điểm > 8.0 (Should Have)
1. **Giao diện Người bán (Seller) và Người mua (Buyer) riêng biệt:**
   - Tự động thay đổi giao diện theo vai trò của người dùng: Người mua thấy nút "+ Giỏ", Người bán thấy nút điều khiển và thống kê tồn kho.
2. **Local Notification khi món hàng yêu thích giảm giá:**
   - Kích hoạt thông báo đẩy cục bộ khi người bán hạ giá sản phẩm đang nằm trong danh sách yêu thích của người mua.
3. **Kéo để làm mới (Pull-to-refresh):**
   - Có hiển thị rõ ràng thời gian cập nhật lần cuối (*Last-updated time*).

### C. Quy chuẩn kỹ thuật (Technical Requirements)
1. **Cấu trúc tối thiểu 5 màn hình:**
   - `app/(app)/index.tsx`: Danh mục sản phẩm & tìm kiếm.
   - `app/(app)/listings/[id].tsx`: **Dynamic Route** xem chi tiết & Seller/Buyer view.
   - `app/(app)/create-listing.tsx`: **Modal Route** đăng bán kèm nén ảnh.
   - `app/(app)/cart.tsx`: Giỏ hàng & Tóm tắt thanh toán.
   - `app/(app)/favourites.tsx`: Danh sách yêu thích dùng chung.
   - `app/(app)/profile.tsx`: Trang cá nhân, chuyển đổi vai trò và đăng xuất.
   - `app/+not-found.tsx`: Màn hình 404 chuẩn.
2. **4 Trạng thái bắt buộc:**
   - `StateView` xử lý toàn diện: `loading`, `empty`, `error with working retry`, và `content`.
3. **Hệ màu tập trung (Design Tokens):**
   - Tệp duy nhất: `constants/theme.ts`. **Tuyệt đối không hardcode mã hex `#...` ở bất kỳ component nào khác**.
4. **Chuẩn WCAG Accessibility:**
   - Mọi nút bấm/input có `accessibilityRole` và `accessibilityLabel`.
   - Vùng cảm ứng (Touch Target) đạt tối thiểu **44 × 44 dp**.
   - Tỉ lệ tương phản chữ đạt chuẩn $\ge 4.5:1$ ở cả Light và Dark mode.
5. **Kiểm thử tự động (3 Automated Tests):**
   - Pure-logic test (`__tests__/pureLogic.test.ts`).
   - Component & Accessibility test (`__tests__/component.test.ts`).
   - Critical path test (`__tests__/criticalPath.test.ts`).

---

## 🚀 3. HƯỚNG DẪN CÀI ĐẶT & CHẠY TỪ MÁY SẠCH (CLEAN MACHINE)

### Cách 1: Chạy trực tiếp Bộ giả lập trên Trình duyệt (Nhanh nhất)
Mở tệp [`simulator_preview.html`](file:///D:/AI-workspace/LT_Mobile/Campus-Marketplace/simulator_preview.html) bằng bất kỳ trình duyệt nào (Chrome, Edge). Toàn bộ tính năng mua bán, offline banner, nén ảnh, chuyển vai trò và dark mode đều được mô phỏng trực quan 100%.

### Cách 2: Khởi chạy dự án Expo Mobile
1. Cài đặt các thư viện phụ thuộc:
   ```bash
   cd D:\AI-workspace\LT_Mobile\Campus-Marketplace
   npm install
   ```
2. Kiểm tra chất lượng mã nguồn (TypeScript & Lint):
   ```bash
   npm run typecheck
   npm run lint
   ```
3. Chạy bộ kiểm thử tự động:
   ```bash
   npm test
   ```
4. Khởi động Expo Bundler:
   ```bash
   npm start
   ```
   - Nhấn `w` để mở trên Web.
   - Hoặc quét mã QR bằng **Expo Go** trên điện thoại Android/iOS.

---

## 📦 4. HƯỚNG DẪN ĐẨY LÊN GITHUB & ĐÓNG GÓI NỘP BÀI

### Lệnh đẩy mã nguồn lên GitHub Repo (`https://github.com/tr-nh-h-i/Campus-Marketplace.git`):
Mở thư mục `D:\AI-workspace\LT_Mobile\Campus-Marketplace` và nhấp đúp vào file tương ứng của bạn:
- **Trịnh Thế Thanh Hải:** `hai_daily_push.bat`
- **Bùi Thanh Sơn:** `son_daily_push.bat`
- **Nguyễn Vũ Minh Nhật:** `nhat_daily_push.bat`

### Đóng gói nộp Canvas:
```powershell
cd D:\AI-workspace\LT_Mobile
Compress-Archive -Path "Campus-Marketplace\*" -Exclude "node_modules", ".expo" -DestinationPath "1923050080_1923050973_1923050861_Project.zip" -Force
```
File nén **`1923050080_1923050973_1923050861_Project.zip`** sẵn sàng nộp lên Canvas trước buổi Day 10!
