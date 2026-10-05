# ✈️ English in Conversation - AI Roleplay Web App

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-Flash-orange?style=for-the-badge&logo=google)](https://aistudio.google.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-iOS_%26_Android-purple?style=for-the-badge)](https://web.dev/progressive-web-apps/)

> Ứng dụng luyện giao tiếp tiếng Anh phản xạ tự nhiên cùng AI, thiết kế chuẩn PWA tối ưu cho **iPhone, iPad và Laptop**. Học sinh chỉ cần mở đường link trên trình duyệt là có thể luyện nói trực tiếp ngay lập tức mà không cần đăng ký tài khoản.

---

## ⚡ Liên Kết Truy Cập Nhanh (Quick Links)

- 💻 **Chạy trên máy tính:** [http://localhost:3000](http://localhost:3000)
- 📱 **[Hướng dẫn cài PWA lên iPhone & iPad](#-hướng-dẫn-sử-dụng-trên-iphone--ipad)** (chạy toàn màn hình như App bản địa)
- ☁️ **[Hướng dẫn đưa lên Vercel trong 3 phút](#cách-2-đưa-lên-mạng-internet-miễn-phí-qua-vercel-để-gửi-link-cho-học-sinh)** (để gửi link cho học sinh học từ xa)
- 🔑 **[Cách cài đặt Google Gemini API Key](#1-cài-đặt-gemini-api-key-miễn-phí-từ-google)**
- 📚 **[Danh mục chủ đề & 18 bài học có sẵn](#-danh-mục-chủ-đề--bài-học)**
- ➕ **[Cách thêm chủ đề mới từ Markdown](#-cách-thêm-chủ-đề-mới-sau-này)**

---

## 🌟 Tổng Quan Tính Năng Cốt Lõi

| Tính Năng | Mô Tả Trải Nghiệm Học Tập |
| :--- | :--- |
| **🤖 AI Roleplay Tự Nhiên** | AI đóng vai nhân vật trong tình huống (nhân viên check-in, tiếp viên, hải quan, bồi bàn...). Thấu hiểu ý của học sinh, phản hồi ngắn gọn 1–2 câu, sẵn sàng đối đáp linh hoạt ngoài kịch bản mà không bắt bẻ soi mói ngữ pháp. |
| **👁️ Chế Độ Luyện Nghe (Bật/Tắt Phụ Đề)** | **Tắt phụ đề:** Dòng chữ của AI bị che mờ, buộc học sinh phải luyện phản xạ nghe bằng tai; nếu nghe chưa kịp, chạm nhẹ vào câu thoại là chữ hiện ra. **Bật phụ đề:** Hiển thị song song tiếng Anh và dòng dịch tiếng Việt. |
| **🎙️ Thu Âm Micro & Phát Giọng Đọc** | Sử dụng Web Speech API chuẩn trình duyệt (hoàn toàn miễn phí). Nút micro to ở đáy màn hình tối ưu cho ngón tay cái trên iPhone. Tùy chỉnh tốc độ đọc `0.8x`, `1.0x`, `1.2x`. |
| **📖 Kho Từ Vựng & Collocations** | Trích xuất đầy đủ từ vựng chuyên sâu (IPA, nghĩa, cụm từ kết hợp, ví dụ) kèm nút bấm phát âm riêng từng từ. |
| **💡 Gợi Ý Câu Thoại (Hints)** | Khi học sinh bị "đứng hình" chưa biết đối đáp thế nào, bấm nút Gợi ý để xem nhanh các cách trả lời tiêu biểu. |
| **🔄 Đổi Vai Linh Hoạt** | Học sinh có thể đóng vai khách hàng (mặc định) hoặc đổi vai thành nhân viên để thử thách bản thân. |

---

## 📚 Danh Mục Chủ Đề & Bài Học

### 🛫 1. At the Airport (12 Tình huống từ [airport.md](airport.md))
- **Ga đi (Departure):**
  1. *Check-in Counter* (Quầy làm thủ tục)
  2. *Overweight Luggage* (Hành lý quá cân)
  3. *Security Check* (Kiểm tra an ninh)
  4. *Flight Delay* (Chuyến bay bị hoãn)
- **Trên máy bay (On the Plane):**
  5. *Finding Your Seat* (Tìm chỗ ngồi)
  6. *Ordering Food & Drinks* (Gọi đồ ăn & thức uống)
  7. *Asking for Help* (Xin hỗ trợ: chăn gối, tai nghe, Wi-Fi)
- **Ga đến (Arrival):**
  8. *Immigration & Passport Control* (Kiểm soát nhập cảnh)
  9. *Customs Declaration* (Khai báo hải quan)
  10. *Baggage Claim & Info Desk* (Nhận hành lý & Quầy thông tin)
  11. *Lost Luggage* (Báo mất hành lý)
  12. *Asking for Directions* (Hỏi đường & tiện ích sân bay)

### 🍽️ 2. At the Restaurant (6 Tình huống từ [restaurant_short_dialogues.md](restaurant_short_dialogues.md))
1. *Arrival & Seating* (Đón khách, đặt bàn & chọn chỗ ngồi)
2. *Asking for Recommendations* (Hỏi gợi ý thực đơn & món đặc biệt)
3. *Full Course Ordering* (Gọi món chi tiết & tùy chỉnh vị)
4. *During the Meal & Issues* (Yêu cầu thêm đồ & đổi món khi có lỗi)
5. *Food Review & Dessert* (Đánh giá món ăn & gọi món tráng miệng)
6. *Bill & Payment* (Xin hộp mang về, chia hóa đơn & thanh toán)

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Cài đặt Gemini API Key (Miễn phí từ Google)
1. Truy cập [Google AI Studio](https://aistudio.google.com/) và đăng nhập bằng tài khoản Google của bạn.
2. Bấm **Get API key** -> Tạo một API Key mới.
3. Tạo file `.env.local` ở thư mục gốc của dự án với nội dung:
   ```bash
   GEMINI_API_KEY=AIzaSy...your_gemini_api_key_here
   ```
*(Hệ thống đã có cơ chế tự động chuyển đổi thông minh giữa các model `gemini-flash-latest`, `gemini-flash-lite-latest`, `gemini-3.5-flash-lite`, `gemini-3.8-flash` để luôn đảm bảo tốc độ phản hồi nhanh nhất)*

### 2. Khởi chạy trên máy tính
```bash
# Cài đặt thư viện (nếu chưa cài)
npm install

# Chạy bản build tối ưu
npm run build
npm start

# Hoặc chế độ lập trình (Hot-reload)
npm run dev
```
Mở trình duyệt: [http://localhost:3000](http://localhost:3000)

---

## 📱 Hướng Dẫn Sử Dụng Trên iPhone & iPad

### Cách 1: Dùng thử ngay trong mạng Wi-Fi nội bộ
1. Khi chạy `npm start`, terminal sẽ hiển thị địa chỉ mạng nội bộ, ví dụ: `http://192.168.1.X:3000`.
2. Mở trình duyệt Safari trên iPhone hoặc iPad (cùng mạng Wi-Fi với laptop) và nhập địa chỉ đó.
3. **Cài đặt như App thật (PWA):**
   - Trên Safari, bấm nút **Chia sẻ (Share)** (biểu tượng ô vuông có mũi tên lên ở cạnh dưới).
   - Cuộn xuống chọn **"Thêm vào Màn hình chính" (Add to Home Screen)**.
   - Ứng dụng sẽ có biểu tượng riêng trên màn hình iPhone, bấm mở là chạy toàn màn hình không có thanh địa chỉ web.

### Cách 2: Đưa lên mạng Internet miễn phí qua Vercel (Để gửi link cho học sinh)
Để học sinh mở được link ở bất kỳ đâu:
1. Đăng ký tài khoản miễn phí tại [Vercel](https://vercel.com).
2. Kết nối với repository GitHub này: `https://github.com/khonguien/english-conversation-app`.
3. Ở phần **Environment Variables**, thêm:
   - Name: `GEMINI_API_KEY`
   - Value: `<API Key Google của bạn>`
4. Bấm **Deploy**. Vercel sẽ tự động cấp một đường link HTTPS miễn phí (ví dụ: `https://english-conversation-app.vercel.app`).
5. Gửi đường link này cho học sinh qua Zalo/Facebook để các em bấm vào luyện tập ngay!

---

## 📂 Cách Thêm Chủ Đề Mới Sau Này

Dữ liệu được lưu dưới dạng file JSON tại thư mục `src/data/topics/`:
- Để bổ sung chủ đề mới, bạn chỉ cần tạo file dữ liệu tương tự hoặc viết file Markdown theo mẫu rồi chạy:
  ```bash
  python scripts/parse_airport.py
  ```
- Khai báo chủ đề mới trong mảng `ALL_TOPICS` tại `src/data/topics/index.ts`. Giao diện sẽ tự động cập nhật ngay lập tức.
