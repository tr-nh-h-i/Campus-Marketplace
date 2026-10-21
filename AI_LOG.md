# BẢNG NHẬT KÝ SỬ DỤNG TRỢ LÝ TRÍ TUỆ NHÂN TẠO (AI LOG)
## ĐỒ ÁN CUỐI KỲ — TOPIC 02: CAMPUS MARKETPLACE
**Trường Đại học Công nghệ Đồng Nai (DNTU) — Khoa Công nghệ Thông tin**  
**Môn học:** Lập trình Mobile (TH70111) — Lớp: TH7011101 (23DTH1)  
**Nhóm sinh viên thực hiện:**
1. Trịnh Thế Thanh Hải (MSSV: 1923050080) — Nhóm trưởng
2. Bùi Thanh Sơn (MSSV: 1923050973)
3. Nguyễn Vũ Minh Nhật (MSSV: 1923050861)  
**Giảng viên hướng dẫn:** ThS. Nguyễn Xuân Vinh  

---

> **QUY CHẾ HỌC THUẬT & MINH BẠCH SỬ DỤNG AI:**  
> - Nhóm được phép sử dụng trợ lý AI trong quá trình xây dựng mã nguồn (theo đúng thông lệ chuyên nghiệp).  
> - Bản nhật ký này ghi lại đầy đủ và trung thực: Các câu lệnh (Prompt), Nội dung nhóm chấp nhận đưa vào dự án, và Các nội dung nhóm đã phản biện/từ chối kèm lý do kỹ thuật.  
> - Toàn bộ thành viên trong nhóm đều hiểu sâu sắc mã nguồn để tham gia vấn đáp trực tiếp (Viva) mà không sử dụng bất kỳ công cụ AI nào.

---

### BẢNG GHI NHẬN CÁC PROMPT VÀ KẾT QUẢ ĐỐI THOẠI KỸ THUẬT

| STT | Thành viên phụ trách | Câu hỏi / Yêu cầu gửi AI (Prompt) | Nội dung được chấp nhận (Accepted) | Nội dung nhóm đã từ chối & Lý do kỹ thuật (Rejected & Why) |
| :---: | :---: | :--- | :--- | :--- |
| **01** | **Trịnh Thế Thanh Hải** (1923050080) | *"Xây dựng Zustand store quản lý giỏ hàng và danh sách yêu thích, áp dụng middleware persist để lưu bền vững."* | • Tách store thành các slice độc lập: `sessionSlice`, `cartSlice`, `favouritesSlice`, `preferencesSlice`.<br>• Cấu hình `createJSONStorage(() => AsyncStorage)`.<br>• Viết các atomic selector tính `subtotal`, `deliveryFee` và `total`. | **Từ chối đề xuất lưu `token` vào `AsyncStorage`:**<br>AI ban đầu cấu hình lưu toàn bộ state vào AsyncStorage. Hải đã từ chối vì quy chế bảo mật đề bài quy định rõ: *"Secrets in SecureStore only"*. Hải đã viết hàm `partialize` chỉ lưu `favouriteIds` và `themeMode` vào AsyncStorage, còn `token` và thông tin phiên bắt buộc lưu trong `SecureStore` (mã hóa AES-256). |
| **02** | **Bùi Thanh Sơn** (1923050973) | *"Thiết kế hệ thống theme Light và Dark mode cho ứng dụng Campus Marketplace."* | • Tạo một tệp token duy nhất `constants/theme.ts`.<br>• Định nghĩa bảng màu đối xứng `lightColors` và `darkColors`.<br>• Định nghĩa kích thước `minTouchTarget: 44` và chuẩn hóa kích thước phông chữ. | **Từ chối gợi ý dùng mã hex trực tiếp trong `StyleSheet.create`:**<br>AI gợi ý viết các mã màu như `#0284c7`, `#ffffff` trực tiếp trong style của từng component. Sơn đã từ chối vì đề bài nghiêm cấm: *"No hex colour anywhere else in the codebase"*. Sơn đã xây dựng hook `useTheme()` để toàn bộ component bắt buộc tham chiếu màu thông qua `colors.xxx`. |
| **03** | **Bùi Thanh Sơn** (1923050973) | *"Tạo bộ lọc danh mục và ô tìm kiếm cho trang chủ Campus Marketplace."* | • Thiết kế thanh tìm kiếm kèm các chip danh mục sản phẩm nằm ngang (`textbook`, `electronics`, `stationery`, `dorm_supplies`, `clothing`). | **Từ chối việc tạo state dẫn xuất `filteredListings` trong `useEffect`:**<br>AI ban đầu gợi ý dùng `useEffect` để lọc và set vào một state mới `const [filteredListings, setFilteredListings] = useState([])`. Sơn đã từ chối vì vi phạm tiêu chí cốt lõi của đề bài: *"Category filter plus text search, both computed during render, never stored as derived state"*. Sơn đã chuyển sang tính toán trực tiếp trong render bằng `useMemo`. |
| **04** | **Nguyễn Vũ Minh Nhật** (1923050861) | *"Xử lý vấn đề ảnh chụp điện thoại nặng làm chậm app khi dùng Wi-Fi trường DNTU."* | • Tạo module `services/imageCompressor.ts`.<br>• Nén ảnh giảm kích thước từ ~4.2MB xuống ~280KB trước khi lưu trữ hoặc gửi lên server.<br>• Hiển thị badge bằng chứng chênh lệch dung lượng ngay trên thẻ sản phẩm. | **Từ chối đề xuất upload ảnh dung lượng gốc rồi chờ server resize:**<br>AI gợi ý tải nguyên ảnh gốc lên server để xử lý ngầm. Nhật đã từ chối vì trên mạng Wi-Fi trường chập chờn, việc gửi một file ảnh 5–10MB sẽ gây nghẽn băng thông, timeout hoặc làm người dùng cảm thấy app bị đơ/treo. Bắt buộc phải nén ảnh ngay tại client trước khi upload. |
| **05** | **Nguyễn Vũ Minh Nhật** (1923050861) | *"Xây dựng cơ chế hoạt động khi mất mạng (Offline mode) cho danh mục sản phẩm."* | • Lưu danh mục tải thành công lần gần nhất vào `AsyncStorage` key `campus_marketplace_cached_catalogue`.<br>• Tự động nạp dữ liệu đệm khi không thể kết nối server.<br>• Hiển thị banner cảnh báo offline kèm mốc thời gian cập nhật. | **Từ chối hiển thị màn hình lỗi trắng xóa khi mất mạng:**<br>AI ban đầu thiết kế nếu `fetch` bị catch error thì hiển thị màn hình Error che kín giao diện. Nhật đã từ chối vì yêu cầu đề bài là *"the app never presents a blank screen"*. Nhật đã cho app nạp dữ liệu cache trước, đồng thời hiển thị `OfflineBanner` ở phía trên để người dùng vẫn duyệt được đồ cũ. |
| **06** | **Trịnh Thế Thanh Hải** (1923050080) | *"Viết bộ 3 kiểm thử tự động (Automated tests) cho dự án."* | • Viết 3 test: Pure-logic test (tính phí ship và tỷ lệ nén), Component accessibility test, và Critical path test (luồng đặt hàng và tồn kho). | **Từ chối các bài test hình thức kiểu `expect(true).toBe(true)`:**<br>AI đưa ra một số test mẫu đơn giản không gắn với nghiệp vụ. Nhóm đã yêu cầu viết lại các test mang ý nghĩa thực tế cao: kiểm thử quy tắc tồn kho người bán và tính toán công thức tiết kiệm dung lượng nén ảnh. |

---

### BÀI HỌC KINH NGHIỆM TỔ CHỨC DỰ ÁN CỦA NHÓM
1. **Trợ lý AI là công cụ tăng tốc, không thể thay thế tư duy phản biện:** Đề bài của thầy Nguyễn Xuân Vinh có rất nhiều "bẫy" kỹ thuật (như cấm lưu derived state, cấm dùng mã hex rải rác, bắt buộc SecureStore). Nếu nhóm copy mù quáng code AI mà không đọc kỹ Brief thì chắc chắn sẽ bị trừ điểm nặng ở phần viva.
2. **Hiểu sâu sắc từng dòng code:** Việc cả 3 thành viên cùng rà soát, phản biện các đề xuất của AI giúp tất cả thành viên nắm vững toàn bộ kiến trúc dự án, tự tin trả lời bất kỳ câu hỏi ngẫu nhiên nào của giảng viên trong buổi bảo vệ.
