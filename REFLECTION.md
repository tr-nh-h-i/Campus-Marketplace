# BẢN PHẢN TƯ DỰ ÁN (ONE-PAGE REFLECTION)
## MÔN HỌC: LẬP TRÌNH MOBILE (TH70111) — HỌC KỲ 1 NĂM HỌC 2026–2027
**Đề tài số 02:** Campus Marketplace — Chợ Mua Bán Đồ Dùng Sinh Viên DNTU  
**Nhóm sinh viên thực hiện:**
- Trịnh Thế Thanh Hải (MSSV: 1923050080)
- Bùi Thanh Sơn (MSSV: 1923050973)
- Nguyễn Vũ Minh Nhật (MSSV: 1923050861)  
**Lớp:** TH7011101 (23DTH1) — Giảng viên hướng dẫn: ThS. Nguyễn Xuân Vinh  

---

### 1. NHỮNG ĐIỀU NHÓM SẼ LÀM KHÁC ĐI NẾU ĐƯỢC LÀM LẠI TỪ ĐẦU (WHAT WE WOULD DO DIFFERENTLY)

Trải qua 2 tuần thực hiện đồ án cuối kỳ với đề tài **Campus Marketplace**, nhóm đã học hỏi được rất nhiều về tư duy xây dựng ứng dụng di động thực tế. Tuy nhiên, nếu có cơ hội bắt đầu lại dự án từ ngày đầu tiên, nhóm sẽ thực hiện khác đi ở 3 điểm sau:

1. **Quy hoạch Design Tokens ngay từ Commit số 1:**
   - Trong những ngày đầu, các thành viên bắt tay vào dựng màn hình và tiện tay viết một số mã màu hex tạm thời. Khi tổng hợp lại để đáp ứng quy định *"No hex colour anywhere else in the codebase"*, nhóm đã mất khá nhiều thời gian để rà soát toàn bộ tệp và chuyển đổi sang `constants/theme.ts`. Nếu làm lại, nhóm sẽ thống nhất tệp Token và quy tắc style trước khi viết bất kỳ dòng mã JSX nào.
2. **Thiết kế cơ chế Offline Caching ngay từ đầu thay vì bổ sung sau:**
   - Ban đầu nhóm tập trung vào luồng gọi API trực tuyến, sau đó mới tích hợp `AsyncStorage` để cache danh mục. Việc này dẫn đến việc phải cấu trúc lại hàm `fetchListings()` và StateView để đồng bộ giữa dữ liệu mạng và dữ liệu bộ đệm. Thiết kế theo tư duy **Offline-first ngay từ ngày đầu** sẽ giúp kiến trúc mã nguồn tự nhiên và mạch lạc hơn.
3. **Mô phỏng mạng yếu (Throttling / Latency) thường xuyên hơn:**
   - Trong quá trình phát triển trên máy tính, mạng luôn ở trạng thái hoàn hảo nên nhóm ít cảm nhận được sự giật lag khi tải ảnh nặng. Đến khi tích hợp module nén ảnh `imageCompressor.ts` và thử nghiệm giảm tốc độ mạng, nhóm mới thấy rõ tầm quan trọng của việc tối ưu hóa dung lượng media đối với trải nghiệm người dùng thực tế tại trường.

---

### 2. MỘT LỖI SAI NGHIÊM TRỌNG CỦA TRỢ LÝ AI MÀ NHÓM ĐÃ TỰ PHÁT HIỆN VÀ SỬA ĐƯỢC (ONE THING AN AI GOT WRONG THAT WE CAUGHT)

Trong quá trình xây dựng bộ lọc và tìm kiếm ở trang chủ (`app/(app)/index.tsx`), nhóm đã yêu cầu trợ lý AI hỗ trợ viết logic lọc sản phẩm theo danh mục và từ khóa. 

#### Lỗi sai của AI:
Trợ lý AI đã đề xuất đoạn mã sử dụng một `useState` riêng biệt để lưu trữ kết quả lọc, kết hợp với `useEffect` để cập nhật mỗi khi người dùng gõ phím:
```tsx
// ❌ ĐOẠN CODE SAI DO AI ĐỀ XUẤT:
const [filteredListings, setFilteredListings] = useState<Listing[]>([]);

useEffect(() => {
  const result = listings.filter(item => 
    item.category === selectedCategory && item.title.includes(searchQuery)
  );
  setFilteredListings(result); // Gây re-render thừa và tạo derived state!
}, [listings, selectedCategory, searchQuery]);
```

#### Phân tích lỗi kỹ thuật & Hậu quả:
1. **Vi phạm trực tiếp yêu cầu đề bài:** Đề bài của thầy Nguyễn Xuân Vinh ghi rõ: *"Category filter plus text search, both computed during render, never stored as derived state."* Việc lưu kết quả lọc vào `useState` tạo ra **State dẫn xuất (Derived State)** dư thừa.
2. **Lỗi bất đồng bộ và Re-render thừa (Double Render):** Mỗi khi `searchQuery` thay đổi, component phải render lần 1 với query mới, sau đó `useEffect` kích hoạt và gọi `setFilteredListings` gây ra thêm một chu kỳ render lần 2 không cần thiết. Trên các thiết bị di động cấu hình yếu, điều này gây hiện tượng khựng khung hình (jank) khi người dùng gõ bàn phím nhanh.

#### Cách nhóm phát hiện và khắc phục:
Thành viên **Bùi Thanh Sơn** và **Trịnh Thế Thanh Hải** khi đối chiếu với tài liệu Brief đã lập tức phát hiện ra lỗi này. Nhóm đã loại bỏ hoàn toàn `useState` và `useEffect` cho việc lọc, chuyển sang **tính toán trực tiếp trong quá trình render** bằng hook `useMemo`:
```tsx
// ✅ BẢN SỬA CHUẨN XÁC CỦA NHÓM:
const filteredListings = useMemo(() => {
  return listings.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sellerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat =
      selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCat;
  });
}, [listings, searchQuery, selectedCategory]);
```
Giải pháp này giúp mã nguồn tuân thủ 100% tiêu chí đề bài, loại bỏ hoàn toàn vòng lặp render thừa, và giúp thao tác tìm kiếm trên ứng dụng diễn ra mượt mà tức thì.

---
*Biên soạn bởi Nhóm sinh viên 23DTH1 — Trường Đại học Công nghệ Đồng Nai.*
