# ☕ Prompts NotebookLM Tạo Slide PowerPoint & Podcast (Topic: Cafe Communication)

Tài liệu này cung cấp các prompt được tối ưu hóa đặc biệt để **dán vừa 100% vào ô Customize (Focus Prompt)** của tính năng **Slide Deck** và **Audio Overview** trên NotebookLM mà không bị tràn bộ nhớ hay cắt bớt ký tự.

---

## 🚀 Hướng Dẫn Nhanh Trên NotebookLM

1. Truy cập [NotebookLM](https://notebooklm.google.com/) và tải file [`cafe.md`](file:///D:/Desktop/English%20in%20Conservation/materials/documents/Cafe/cafe.md) vào mục **Sources (Nguồn tài liệu)**.
2. Tại bảng **Studio** (cột bên phải):
   - **Để tạo Slide PowerPoint:** Chọn **Slide Deck** -> bấm biểu tượng bánh răng / nút **Customize (Tùy chỉnh)**.
   - Chọn một trong các phiên bản prompt bên dưới, dán vào ô **Focus Prompt** và bấm **Generate**.
   - Khi slide hoàn thành, bấm nút **Export to Google Slides / Download PPTX** để lưu về máy.

---

## 🌟 PHIÊN BẢN 1: FOCUS PROMPT CHUẨN (~750 ký tự - KHUYÊN DÙNG CHO SLIDE)
> *Bao quát trọn vẹn 3 đoạn hội thoại tự nhiên, 43 mẫu câu (Staff & Customer) và từ vựng cốt lõi.*

```text
Create a 16-slide ESL presentation deck from the Cafe source.
STYLE GUIDELINES:
- Font: Times New Roman. Title: 28pt bold, Body: 16pt.
- Split Layout: Left = Lesson Content (Bilingual EN/VI, IPA, Dialogues); Right = Visual Cafe Scene Concept.
- A clean, glossy whiteboard aesthetic featuring hand-drawn marker lines with slight 'ink-pooling' at the ends of strokes. Use basic primary marker colors (red, blue, black) on a bright white reflective background. Include faint ghosting marks from previously 'erased' content to give it a lived-in, brainstorming feel.
SLIDE DECK OUTLINE:
1. Cover: English in Conversation - At the Cafe & Coffee Shop
2. Agenda: Core Vocab, 3 Real Dialogues, Staff & Customer Reflex Drill
3-6. Core Vocabs (iced coffee with milk, best-selling drink, boba & cheese foam, bank transfer & QR code, straw & AC: 1 slide each with IPA, meaning, example)
7-8. Real Dialogue 1: Ordering at Counter & Customizing (Sizing, Ice, Sugar, Pastry)
9-10. Real Dialogue 2: Toppings, QR Payment & Waiting
11-12. Real Dialogue 3: Pick-up, Upstairs Seating, Wi-Fi & Amenities
13-14. Staff Essential Phrases Drill (21 practical service expressions)
15. Customer Essential Phrases Drill (22 ordering & inquiry phrases)
16. Summary & Quick Ordering Cheat Sheet
```

---

## ⚡ PHIÊN BẢN 2: BẢN SIÊU RÚT GỌN (~460 ký tự)
> *Dành cho trường hợp ô nhập liệu của tài khoản NotebookLM bị giới hạn độ dài ký tự ngặt nghèo.*

```text
Generate a 14-slide ESL deck from the Cafe source.
STYLE: Times New Roman font. Title 28pt bold, Body 16pt.
LAYOUT: 2 columns (Left: Bilingual EN/VI lesson content with IPA; Right: Cafe image description).
STRUCTURE:
- Slide 1: Cover
- Slide 2: Agenda
- Slides 3-6: 4 Core Vocabs (iced coffee with milk, boba & cheese foam, bank transfer, straw & AC)
- Slides 7-9: 3 Real-life roleplay dialogues (Ordering, Toppings & QR, Amenities)
- Slides 10-13: Staff & Customer 43 practical phrase drills
- Slide 14: Summary cheat sheet
```

---

## 🎙️ PHIÊN BẢN 3: PROMPT TẠO AUDIO OVERVIEW / PODCAST (DEEP DIVE CONVERSATION)
> *Dán vào ô Customize của tính năng Audio Overview (Podcast 2 người dẫn chuyện) để tạo file audio phân tích bài học.*

```text
Generate a dynamic, engaging ESL conversation between two hosts analyzing the Cafe source.
Focus on:
1. Natural flow of ordering coffee: from asking for recommendations (best-selling drink) to customizing size, ice, and sweetness.
2. Trendy cafe culture: adding toppings (boba, cheese foam), paying with bank transfer / QR codes, and waiting for drinks.
3. Polite customer requests & staff hospitality: asking for straws, finding seats upstairs, checking Wi-Fi passwords, and requesting AC adjustments.
Include practical pronunciation tips and encourage listeners to practice speaking aloud.
```

---

## 📌 Bảng Đối Chiếu Quy Cách Slide

| Tiêu chí | Quy định trong prompt | Mục đích thực tế |
|---|---|---|
| **Font chữ** | `Times New Roman` | Đồng nhất kiểu chữ học thuật, thanh lịch chuẩn dự án |
| **Cỡ chữ Title** | `28pt bold` | Nổi bật tiêu đề từng phần khi trình chiếu |
| **Cỡ chữ Body** | `16pt` | Rõ nét, dễ đọc cho người học khi chiếu hoặc in ấn |
| **Bố cục (Layout)** | `Split Layout (2 columns)` | 1 bên nội dung bài học EN/VI, 1 bên hình ảnh thực tế quán cafe |
| **Dung lượng slide** | `14 - 16 slides` | Trải đều từ từ vựng, 3 hội thoại thực tế đến 43 câu phản xạ nhanh |
