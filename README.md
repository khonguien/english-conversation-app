# ✈️ English in Conversation - AI Roleplay Web App

Ứng dụng luyện giao tiếp tiếng Anh tương tác với AI, tối ưu hóa cho **iPhone, iPad và Laptop** (chuẩn PWA cài đặt ra màn hình chính).

---

## 🌟 Tính Năng Nổi Bật

1. **AI Roleplay phản xạ tự nhiên (Google Gemini):**
   - AI đóng vai nhân vật trong tình huống (nhân viên làm thủ tục, tiếp viên, hải quan, bồi bàn...).
   - Hiểu ý chính của học sinh, không bắt bẻ soi mói ngữ pháp, sẵn sàng đối đáp linh hoạt ngoài kịch bản.
2. **Chế độ Luyện Nghe (Bật/Tắt Phụ Đề):**
   - **Tắt chữ (Ẩn phụ đề):** Câu thoại của AI bị che mờ, học sinh phải tập trung lắng nghe âm thanh. Nếu nghe chưa kịp, chỉ cần chạm nhẹ vào câu thoại để mở chữ.
   - **Bật chữ:** Hiển thị song song tiếng Anh và bản dịch tiếng Việt mượt mà.
3. **Âm thanh giọng đọc & Micro thu âm:**
   - Sử dụng Web Speech API chuẩn trình duyệt (hoàn toàn miễn phí, không tốn chi phí phát âm).
   - Tùy chỉnh tốc độ đọc linh hoạt (`0.8x` chậm cho người mới bắt đầu, `1.0x` bình thường, `1.2x` nhanh).
   - Nút Micro thu âm trực tiếp tiếng Anh, hỗ trợ cả gõ phím và tính năng đọc chính tả có sẵn của iPhone.
4. **Kho Từ Vựng & Gợi Ý Câu Nói:**
   - Tích hợp toàn bộ từ vựng, phiên âm IPA, nghĩa tiếng Việt, cụm từ hay gặp (collocations) và ví dụ từ tài liệu `airport.md`.
   - Nút **💡 Gợi ý câu trả lời** giúp học sinh không bị "đứng hình" khi chưa biết phải nói gì tiếp theo.
5. **Đổi vai linh hoạt:**
   - Học sinh có thể đổi vai: làm Hành khách (mặc định) hoặc thử thách làm Nhân viên sân bay/Bồi bàn.
6. **Sẵn có 2 chủ đề lớn:**
   - 🛫 **Sân bay (At the Airport):** 12 bài hội thoại thực tế (Ga đi, Trên máy bay, Ga đến).
   - 🍽️ **Nhà hàng (At the Restaurant):** 6 bài hội thoại từ đặt bàn đến thanh toán.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy

### 1. Cài đặt Gemini API Key (Miễn phí từ Google)
1. Truy cập [Google AI Studio](https://aistudio.google.com/) và đăng nhập bằng tài khoản Google (tài khoản Google AI Pro của bạn).
2. Bấm **Get API key** -> Tạo một API Key mới (miễn phí).
3. Tạo file `.env.local` ở thư mục gốc của dự án với nội dung:
   ```bash
   GEMINI_API_KEY=AIzaSy...your_gemini_api_key_here
   ```
*(Lưu ý: Nếu chưa nhập key, app vẫn chạy bình thường ở chế độ hội thoại mẫu có sẵn)*

### 2. Khởi chạy trên máy tính
```bash
# Khởi chạy chế độ phát triển
npm run dev

# Hoặc chạy bản build tối ưu
npm run build
npm start
```
Mở trình duyệt: `http://localhost:3000`

---

## 📱 Hướng Dẫn Sử Dụng Trên iPhone & iPad

### Cách 1: Dùng thử ngay trong mạng Wi-Fi nội bộ
1. Khi chạy `npm start`, terminal sẽ hiển thị địa chỉ mạng nội bộ, ví dụ: `http://192.168.1.X:3000`.
2. Mở trình duyệt Safari trên iPhone hoặc iPad (chung Wi-Fi với laptop) và nhập địa chỉ trên.
3. **Cài đặt như App thật (PWA):**
   - Trên Safari iPhone, bấm vào nút **Chia sẻ (Share)** (biểu tượng hình vuông có mũi tên hướng lên ở dưới cùng).
   - Cuộn xuống chọn **"Thêm vào Màn hình chính" (Add to Home Screen)**.
   - App sẽ xuất hiện trên màn hình iPhone với icon riêng, mở lên toàn màn hình không có thanh URL.

### Cách 2: Đưa lên mạng Internet miễn phí qua Vercel (Để gửi link cho học sinh)
Để học sinh mở được link ở bất kỳ đâu mà không cần chung mạng Wi-Fi:
1. Đăng ký tài khoản miễn phí tại [Vercel](https://vercel.com).
2. Liên kết thư mục dự án này lên GitHub cá nhân.
3. Trên Vercel, chọn **Add New Project** -> Chọn repository vừa tạo.
4. Ở phần **Environment Variables**, thêm:
   - Name: `GEMINI_API_KEY`
   - Value: `<API Key Google của bạn>`
5. Bấm **Deploy**. Vercel sẽ cấp cho bạn một đường link HTTPS miễn phí (ví dụ: `https://tienganh-sanbay.vercel.app`).
6. Bạn chỉ cần gửi link này cho học trò là các em mở điện thoại lên luyện tập được ngay lập tức!

---

## 📂 Cách Thêm Chủ Đề Mới Sau Này

Dữ liệu được tổ chức dưới dạng JSON tại `src/data/topics/`:
- Muốn thêm chủ đề mới (ví dụ: Khách sạn `hotel.json`), chỉ cần tạo file cấu trúc tương tự hoặc viết file Markdown rồi chạy script chuyển đổi:
  ```bash
  python scripts/parse_airport.py
  ```
- Thêm topic vào mảng `ALL_TOPICS` tại `src/data/topics/index.ts`. Ứng dụng sẽ tự động hiển thị chủ đề mới trong danh sách bài học!
