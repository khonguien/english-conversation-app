# Acoustic Cassette Studio: 2D Retro Room with 3D Isometric Radio

## 1. Problem Statement & User Vision
Thay vì giao diện web hiện đại với tab và thẻ bài trừu tượng, người học được đặt vào một căn phòng 2D hoài niệm (Retro Tabletop Room) với hai vật thể vật lý thực thụ:
1. **Kệ băng gỗ đa ngăn (Wooden Cassette Organizer)** mô phỏng chân thực bức ảnh tư liệu (`uploaded_media_1793299000623.png`): Kệ gỗ mộc mạc chia thành các cột ngăn dọc đại diện cho từng chủ đề (Airport, Restaurant, Hotel, Wildlife...). Trong mỗi ngăn, các cuốn băng cassette nằm ngang xếp tầng, mỗi cuốn có dán nhãn gáy nhiều màu sắc (spine label) in tên tình huống cụ thể.
2. **Đài Cassette Retro 3D Isometric (Isometric Retro Cassette Radio)** mô phỏng chính xác ảnh concept (`uploaded_media_0_1793299196251.png`): Thân đài trắng ngà với hiệu ứng đổ bóng isometric 3D tinh tế, cửa hộc băng nghiêng lộ cuộn băng bên trong, màng loa lưới đục lỗ, thanh gạt âm lượng bên hông và hàng nút bấm cơ học nổi bật ở đáy (với nút cam đặc trưng).

## 2. Interaction Loop
- **Chọn & Rút băng khỏi kệ (Tactile Tape Pull & Empty Slot)**:
  - Khi người học bấm vào một cuốn băng trên kệ gỗ: Cuốn băng trượt nhô hẳn ra ngoài (`translate-x-12`) và biến mất khỏi kệ, để lại **khe rãnh gỗ trống hoàn toàn** (mô phỏng đúng chi tiết các rãnh gỗ trống trong Ảnh 1).
  - Khi đổi sang băng khác hoặc bấm Eject: Cuốn băng cũ sẽ có hiệu ứng đút lướt ngược trở lại khe rãnh trống của nó trên kệ gỗ.
- **Nạp băng vào Radio (Door Open -> Insert -> Snap Close Sequence)**:
  - Khi cuốn băng bay tới chiếc đài: Cửa khay hộc băng của radio tự động nghiêng mở ra phía trước (`perspective rotateX(-20deg)`).
  - Cuốn băng trượt lọt vào trong khoang máy.
  - Cửa khay hộc băng dập đóng lại (`snap close`) phẳng với thân đài, bánh răng và nhãn băng hiện rõ sẵn sàng.
- **Bấm PLAY trên Radio (Start Direct AI Spoken Roleplay)**:
  - Bấm nút PLAY (nút cam cơ học trên thân radio): Bánh răng băng bắt đầu quay đều (`spin-reels`).
  - **LOẠI BỎ HOÀN TOÀN bước nghe thử snippet**: Cuộc trò chuyện luyện nói AI bắt đầu ngay lập tức.
  - AI cất giọng mở đầu kịch bản. Lời thoại AI nổi lên từ chính màng lưới loa của radio như những gợn sóng âm thanh sống động (Acoustic Sound Bubbles).
  - Khung micro và phản hồi của người học xuất hiện trực quan ngay dưới thân radio, cho phép đàm thoại 2 chiều mượt mà.
- **Điều chỉnh tốc độ độc lập (+ Tăng / - Giảm)**:
  - Tách biệt rõ ràng 2 nút bấm vật lý: Bấm vào vùng `+` ở trên để tăng tốc (`0.8x -> 1.0x -> 1.2x -> 1.5x`), bấm vào vùng `-` ở dưới để giảm tốc (`1.5x -> 1.2x -> 1.0x -> 0.8x`). Cần gạt knob trượt cơ học tương ứng theo nấc. Không còn tình trạng click vào đâu cũng bị đổi vòng tròn.
- **Bấm STOP / EJECT trên Radio**:
  - STOP: Bánh răng dừng quay, tạm dừng cuộc hội thoại.
  - EJECT: Cửa khay hộc mở ra, cuốn băng trượt ra ngoài và bay về đút lại vào khe rãnh trống trên kệ gỗ.

## 3. Not Doing (and Why)
- **Không dùng Three.js cồng kềnh**: Dựng chiếc radio 3D bằng kỹ thuật CSS 3D isometric transforms, gradient lighting và SVG vector sắc nét để đạt 60fps tức thì, nhẹ và tương thích hoàn hảo.
- **Không có chế độ nghe thử thừa thãi**: Bấm Play là vào thẳng thực chiến đàm thoại AI như yêu cầu của người dùng.
- **Không nhảy trang (No Route Navigation)**: Tất cả diễn ra trên cùng một mặt bàn 2D của căn phòng.

## 4. Key Success Metrics
1. **Độ chân thực thị giác**: Kệ gỗ nhiều ngăn dọc xếp băng ngang chuẩn ảnh 1; Đài radio trắng ngà chuẩn ảnh 2 với hộc băng trong suốt, màng loa đục lỗ và nút cam.
2. **Cảm giác cơ học**: Hiệu ứng băng rút khỏi kệ, lướt vào đài; nút bấm cơ học lún xuống khi nhấn; cuộn băng quay mượt khi Play và dừng khi Stop.
3. **Liền mạch âm thanh**: Kết nối ngay với Gemini AI và Edge TTS bản ngữ, nhận diện giọng nói mượt mà không lỗi.
