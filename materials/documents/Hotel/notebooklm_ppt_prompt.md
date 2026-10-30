# 🏨 Prompts NotebookLM Tạo Slide PowerPoint & Podcast (Topic: Hotel Communication)

Tài liệu này cung cấp các prompt được tối ưu hóa đặc biệt để **dán vừa 100% vào ô Customize (Focus Prompt)** của tính năng **Slide Deck** và **Audio Overview** trên NotebookLM mà không bị tràn bộ nhớ hay cắt bớt ký tự.

---

## 🚀 Hướng Dẫn Nhanh Trên NotebookLM

1. Truy cập [NotebookLM](https://notebooklm.google.com/) và tải file [`hotel.md`](file:///D:/Desktop/English%20in%20Conservation/materials/documents/Hotel/hotel.md) vào mục **Sources (Nguồn tài liệu)**.
2. Tại bảng **Studio** (cột bên phải):
   - **Để tạo Slide PowerPoint:** Chọn **Slide Deck** -> bấm biểu tượng bánh răng / nút **Customize (Tùy chỉnh)**.
   - Chọn một trong các phiên bản prompt bên dưới, dán vào ô **Focus Prompt** và bấm **Generate**.
   - Khi slide hoàn thành, bấm nút **Export to Google Slides / Download PPTX** để lưu về máy.
   - **Để tạo Podcast / Audio Overview:** Chọn **Audio Overview** -> bấm **Customize** -> dán prompt ở Phiên bản 3 -> bấm **Generate**.

---

## 🌟 PHIÊN BẢN 1: FOCUS PROMPT CHUẨN (~760 ký tự - KHUYÊN DÙNG CHO SLIDE)
> *Bao quát trọn vẹn 4 đoạn hội thoại thực tế, 45 mẫu câu (Nhân viên & Khách), từ vựng cốt lõi và kỹ năng khiếu nại lịch sự.*

```text
Create a 16-slide ESL presentation deck from the Hotel source.
STYLE GUIDELINES:
- Font: Times New Roman. Title: 28pt bold, Body: 16pt.
- Split Layout: Left = Lesson Content (Bilingual EN/VI, IPA, Dialogues); Right = Visual Hotel Scene Concept.
- Clean whiteboard aesthetic with subtle marker lines and primary accent colors on crisp white reflective background.
SLIDE DECK OUTLINE:
1. Cover: English in Conversation - At the Hotel
2. Agenda: Core Vocab, 4 Real Dialogues, Staff & Guest Drill, Polite Complaints
3-6. Core Vocabs (reservation & deposit, keycard & amenities, iron & adapter, AC & switch rooms: 1 slide each with IPA, meaning, example)
7-10. 4 Real Dialogues (Check-in, Housekeeping, Room Issues & Switching, Check-out & Luggage)
11-12. Staff Essential Phrases Drill (22 expressions)
13-14. Guest Essential Phrases Drill (23 expressions)
15. Polite Complaints & Amenities Request Formula
16. Summary & Hotel Survival Cheat Sheet
```

---

## ⚡ PHIÊN BẢN 2: BẢN SIÊU RÚT GỌN (~430 ký tự)
> *Dành cho trường hợp ô nhập liệu của tài khoản NotebookLM bị giới hạn độ dài ký tự ngặt nghèo.*

```text
Generate a 14-slide ESL deck from the Hotel source.
STYLE: Times New Roman. Title 28pt bold, Body 16pt.
LAYOUT: 2 columns (Left: Bilingual EN/VI lesson content with IPA; Right: Hotel scene description).
STRUCTURE:
- Slide 1: Cover
- Slide 2: Agenda
- Slides 3-6: 4 Core Vocabs (reservation, keycard & amenities, iron & adapter, AC & switch rooms)
- Slides 7-10: 4 Roleplay Dialogues (Check-in, Amenities, Room Issues, Check-out)
- Slides 11-13: 45 Staff & Guest phrase drills
- Slide 14: Summary & polite complaints cheat sheet
```

---

## 🎙️ PHIÊN BẢN 3: PROMPT TẠO AUDIO OVERVIEW / PODCAST (DEEP DIVE CONVERSATION)
> *Dán vào ô Customize của tính năng Audio Overview (Podcast 2 người dẫn chuyện) để tạo file audio phân tích bài học.*

```text
Generate an engaging, lively ESL coaching podcast between two friendly hosts discussing the Hotel source.
Focus on:
1. Check-in confidence: handling reservations, credit card deposits, and asking about breakfast and Wi-Fi naturally.
2. In-room requests: how to politely borrow items from housekeeping like irons, extra towels, and international travel adapters.
3. Polite complaints & problem-solving: how to report a broken A/C blowing warm air or noisy neighbors without sounding rude, and successfully requesting to switch rooms.
4. Seamless departure: minibar transparency, deposit refunds, and leaving luggage safely until evening flights.
Emphasize natural conversational fillers like "Awesome!", "Sure thing", "Certainly", and practical pronunciation tips.
```

---

## 💡 Mẹo Sử Dụng Thực Chiến
- Sau khi NotebookLM tạo xong file Slide Deck, bạn có thể xuất ra Google Slides và đối chiếu trực tiếp với file [`Hotel.pptx`](file:///D:/Desktop/English%20in%20Conservation/materials/slides/Hotel.pptx) đã được sinh tự động bằng Python trong thư mục `materials/slides/`.
- File Podcast Audio Overview (.mp3 / .wav) từ NotebookLM có thể gửi trước cho học viên A nghe trên đường đi làm hoặc trước buổi học 1 ngày để ngấm ngữ điệu bản xứ.
