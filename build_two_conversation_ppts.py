import os
import sys
from PIL import Image
from pptx import Presentation
from pptx.util import Pt
from pptx.oxml import parse_xml
from pptx.oxml.ns import nsdecls

sys.stdout.reconfigure(encoding='utf-8')

TARGET_BOX_LEFT = 7753800
TARGET_BOX_TOP = 1800000
TARGET_BOX_WIDTH = 3800000
TARGET_BOX_HEIGHT = 4300000
BOX_ASPECT = TARGET_BOX_WIDTH / TARGET_BOX_HEIGHT

def clean_presentation(prs):
    while len(prs.slides) > 0:
        sldId = prs.element.sldIdLst[0]
        rId = sldId.rId
        prs.part.drop_rel(rId)
        prs.element.sldIdLst.remove(sldId)

def add_p(tf, text, is_bold=False, is_italic=False, theme_accent=False):
    if len(tf.paragraphs) == 1 and tf.paragraphs[0].text == '':
        p = tf.paragraphs[0]
    else:
        p = tf.add_paragraph()
    p.text = text
    pPr = p._p.get_or_add_pPr()
    pPr.set('marL', '0')
    pPr.set('indent', '0')
    ns = nsdecls('a')
    buNone = parse_xml(f'<a:buNone {ns}/>')
    pPr.append(buNone)
    for r in p.runs:
        if is_bold:
            r.font.bold = True
        if is_italic:
            r.font.italic = True
        if theme_accent:
            r.font.color.theme_color = 5  # ACCENT_1
    return p

def add_vocab_slide(prs, category, word, example, img_path):
    slide = prs.slides.add_slide(prs.slide_layouts[1]) # Title and Content
    
    # Title
    title = slide.shapes.title
    title.text = "Vocabulary"
    for r in title.text_frame.paragraphs[0].runs:
        r.font.bold = True
    
    # Body
    body = slide.shapes.placeholders[1]
    body.left = 838200
    body.top = 1265125
    body.width = 6614160
    body.height = 4911838
    
    tf = body.text_frame
    tf.word_wrap = True
    
    add_p(tf, category, is_bold=True)
    add_p(tf, "")
    add_p(tf, word)
    add_p(tf, example)
    
    # Add Image if exists
    if img_path and os.path.exists(img_path):
        try:
            with Image.open(img_path) as img:
                w_px, h_px = img.size
            aspect = w_px / h_px
            if aspect > BOX_ASPECT:
                final_width = TARGET_BOX_WIDTH
                final_height = int(TARGET_BOX_WIDTH / aspect)
                final_left = TARGET_BOX_LEFT
                final_top = TARGET_BOX_TOP + (TARGET_BOX_HEIGHT - final_height) // 2
            else:
                final_height = TARGET_BOX_HEIGHT
                final_width = int(TARGET_BOX_HEIGHT * aspect)
                final_left = TARGET_BOX_LEFT + (TARGET_BOX_WIDTH - final_width) // 2
                final_top = TARGET_BOX_TOP
            slide.shapes.add_picture(img_path, final_left, final_top, final_width, final_height)
        except Exception as e:
            print(f"Error adding picture {img_path}: {e}")
    
    return slide

# ==============================================================================
# 1. BUILD CONVERSATION 1 PPTX
# ==============================================================================
prs1 = Presentation("Airport_backup.pptx")
clean_presentation(prs1)

# Slide 1: Title
s1 = prs1.slides.add_slide(prs1.slide_layouts[0])
s1.shapes.title.text = "Check-in Counter"
for r in s1.shapes.title.text_frame.paragraphs[0].runs:
    r.font.bold = True
s1.shapes.placeholders[1].text = "English in Conversation — Conversation 1: Quầy làm thủ tục"

# Vocab slides for Conversation 1
vocab_1 = [
    {
        "category": "TỪ VỰNG LIÊN QUAN: HỘI THOẠI 1 (CHECK-IN COUNTER)",
        "word": "• check-in counter /ˈtʃek ɪn ˈkaʊntər/ (n): quầy làm thủ tục",
        "example": "  Ví dụ: Please go to the check-in counter to get your boarding pass.",
        "img": "cached_images/check_in_counter.jpg"
    },
    {
        "category": "TỪ VỰNG LIÊN QUAN: HỘI THOẠI 1 (CHECK-IN COUNTER)",
        "word": "• passenger /ˈpæsɪndʒər/ (n): hành khách",
        "example": "  Ví dụ: The passenger showed his boarding pass at the gate.",
        "img": "cached_images/passenger.jpg"
    },
    {
        "category": "TỪ VỰNG LIÊN QUAN: HỘI THOẠI 1 (CHECK-IN COUNTER)",
        "word": "• passport /ˈpæspɔːrt/ (n): hộ chiếu",
        "example": "  Ví dụ: May I see your passport, please?",
        "img": "cached_images/passport.jpg"
    },
    {
        "category": "TỪ VỰNG LIÊN QUAN: HỘI THOẠI 1 (CHECK-IN COUNTER)",
        "word": "• luggage /ˈlʌɡɪdʒ/ (n): hành lý",
        "example": "  Ví dụ: How many pieces of luggage do you have?",
        "img": "cached_images/luggage.jpg"
    },
    {
        "category": "TỪ VỰNG LIÊN QUAN: HỘI THOẠI 1 (CHECK-IN COUNTER)",
        "word": "• baggage /ˈbæɡɪdʒ/ (n): hành lý",
        "example": "  Ví dụ: Your baggage will be checked through to your final destination.",
        "img": "cached_images/luggage.jpg"
    },
    {
        "category": "TỪ VỰNG LIÊN QUAN: HỘI THOẠI 1 (CHECK-IN COUNTER)",
        "word": "• scale /ˈskeɪl/ (n): cái cân",
        "example": "  Ví dụ: Please place your bag on the scale.",
        "img": "cached_images/scale.jpg"
    },
    {
        "category": "TỪ VỰNG LIÊN QUAN: HỘI THOẠI 1 (CHECK-IN COUNTER)",
        "word": "• aisle seat /ˈaɪl siːt/ (n): ghế ngồi phía lối đi",
        "example": "  Ví dụ: I prefer an aisle seat so I can stretch my legs.",
        "img": "downloaded_images/slide_49_aisle_seat.jpg"
    },
    {
        "category": "TỪ VỰNG LIÊN QUAN: HỘI THOẠI 1 (CHECK-IN COUNTER)",
        "word": "• window seat /ˈwɪndoʊ siːt/ (n): ghế cạnh cửa sổ",
        "example": "  Ví dụ: Can I have a window seat, please?",
        "img": "downloaded_images/slide_50_window_seat.jpg"
    },
    {
        "category": "TỪ VỰNG LIÊN QUAN: HỘI THOẠI 1 (CHECK-IN COUNTER)",
        "word": "• boarding pass /ˈbɔːrdɪŋ pæs/ (n): thẻ lên máy bay",
        "example": "  Ví dụ: Don't forget your boarding pass at the counter.",
        "img": "cached_images/boarding_pass.jpg"
    },
    {
        "category": "TỪ VỰNG LIÊN QUAN: HỘI THOẠI 1 (CHECK-IN COUNTER)",
        "word": "• flight /ˈflaɪt/ (n): chuyến bay",
        "example": "  Ví dụ: My flight departs at 3 PM.",
        "img": "downloaded_images/slide_32_flight.jpg"
    },
    {
        "category": "TỪ VỰNG LIÊN QUAN: HỘI THOẠI 1 (CHECK-IN COUNTER)",
        "word": "• gate /ɡeɪt/ (n): cổng ra máy bay",
        "example": "  Ví dụ: Your flight leaves from gate 15A.",
        "img": "cached_images/gate.jpg"
    },
    {
        "category": "TỪ VỰNG LIÊN QUAN: HỘI THOẠI 1 (CHECK-IN COUNTER)",
        "word": "• boarding /ˈbɔːrdɪŋ/ (n): việc lên máy bay",
        "example": "  Ví dụ: Boarding will begin at 2:30 PM.",
        "img": "downloaded_images/slide_42_boarding.jpg"
    },
    {
        "category": "TỪ VỰNG LIÊN QUAN: HỘI THOẠI 1 (CHECK-IN COUNTER)",
        "word": "• layover /ˈleɪˌoʊvər/ (n): quá cảnh",
        "example": "  Ví dụ: We have a 3-hour layover in Singapore.",
        "img": "downloaded_images/slide_36_layover.jpg"
    },
    {
        "category": "TỪ VỰNG LIÊN QUAN: HỘI THOẠI 1 (CHECK-IN COUNTER)",
        "word": "• security check /sɪˈkjʊrəti tʃek/ (n): kiểm tra an ninh",
        "example": "  Ví dụ: The security check took about 15 minutes.",
        "img": "cached_images/security_check.jpg"
    }
]

for item in vocab_1:
    add_vocab_slide(prs1, item["category"], item["word"], item["example"], item["img"])

# Slide: Conversation 1 - Part 1
c1_p1 = prs1.slides.add_slide(prs1.slide_layouts[1])
c1_p1.shapes.title.text = "CONVERSATION 1: CHECK-IN COUNTER (PART 1)"
for r in c1_p1.shapes.title.text_frame.paragraphs[0].runs:
    r.font.bold = True
body1 = c1_p1.shapes.placeholders[1]
body1.left = 838200
body1.top = 1265125
body1.width = 10515600
body1.height = 4911838
tf1 = body1.text_frame
tf1.word_wrap = True

add_p(tf1, "Tình huống: Hành khách làm thủ tục check-in, chọn chỗ ngồi và hỏi về hành lý gửi.", is_italic=True)
add_p(tf1, "")
add_p(tf1, "Staff: \t\tGood afternoon, where are you flying today?")
add_p(tf1, "Passenger: \tHello, I'm flying to Bangkok at 3 PM.", theme_accent=True)
add_p(tf1, "Staff: \t\tMay I have your passport, please?")
add_p(tf1, "Passenger: \tOf course, here you go.", theme_accent=True)
add_p(tf1, "Staff: \t\tAre you checking any bags?")
add_p(tf1, "Passenger: \tYes, just one piece of luggage.", theme_accent=True)
add_p(tf1, "Staff:\t\tPlease place your bag on the scale.")
add_p(tf1, "Passenger: \tOkay.", theme_accent=True)

# Slide: Conversation 1 - Part 2
c1_p2 = prs1.slides.add_slide(prs1.slide_layouts[1])
c1_p2.shapes.title.text = "CONVERSATION 1: CHECK-IN COUNTER (PART 2)"
for r in c1_p2.shapes.title.text_frame.paragraphs[0].runs:
    r.font.bold = True
body2 = c1_p2.shapes.placeholders[1]
body2.left = 838200
body2.top = 1265125
body2.width = 10515600
body2.height = 4911838
tf2 = body2.text_frame
tf2.word_wrap = True

add_p(tf2, "Tình huống: Hành khách làm thủ tục check-in, chọn chỗ ngồi và hỏi về hành lý gửi.", is_italic=True)
add_p(tf2, "")
add_p(tf2, "Staff: \t\tThat's fine. Do you have a seat preference?")
add_p(tf2, "Passenger: \tYes, do you have any aisle seat available?", theme_accent=True)
add_p(tf2, "Staff: \t\tLet me check for you. Yes, we do. I'll put you in row 12, seat A — that's an aisle seat.")
add_p(tf2, "Passenger: \tWonderful, thank you so much!", theme_accent=True)
add_p(tf2, "Staff: \t\tHere is your boarding pass. Your flight leaves from gate 15A and boarding begins at 2:30. Your seat number is 12A.")
add_p(tf2, "Passenger: \tPerfect. And one more question — I have a layover in Singapore. Do I need to pick up my luggage there?", theme_accent=True)
add_p(tf2, "Staff: \t\tNo, it will go straight through to Bangkok.")
add_p(tf2, "Passenger: \tGreat. And which way is the security check?", theme_accent=True)
add_p(tf2, "Staff: \t\tRight behind you to the right.")
add_p(tf2, "Passenger: \tThank you!", theme_accent=True)

# Slide: Conversation 1 - Vietnamese Translation
c1_vi = prs1.slides.add_slide(prs1.slide_layouts[1])
c1_vi.shapes.title.text = "CONVERSATION 1: BẢN DỊCH TIẾNG VIỆT"
for r in c1_vi.shapes.title.text_frame.paragraphs[0].runs:
    r.font.bold = True
body_vi = c1_vi.shapes.placeholders[1]
body_vi.left = 838200
body_vi.top = 1265125
body_vi.width = 10515600
body_vi.height = 4911838
tf_vi = body_vi.text_frame
tf_vi.word_wrap = True

add_p(tf_vi, "Nhân viên: \tChào buổi chiều, hôm nay bạn bay đi đâu ạ?")
add_p(tf_vi, "Hành khách: \tXin chào, tôi bay đi Bangkok lúc 3 giờ chiều.", theme_accent=True)
add_p(tf_vi, "Nhân viên: \tCho tôi xem hộ chiếu của bạn được không?")
add_p(tf_vi, "Hành khách: \tTất nhiên, đây ạ.", theme_accent=True)
add_p(tf_vi, "Nhân viên: \tBạn có gửi hành lý không? — Vui lòng đặt túi lên cân.")
add_p(tf_vi, "Hành khách: \tCó, chỉ một kiện hành lý thôi. Còn ghế phía lối đi không ạ?", theme_accent=True)
add_p(tf_vi, "Nhân viên: \tCó, hàng 12, ghế A. Đây là thẻ lên máy bay, cổng 15A, lên lúc 2:30.")
add_p(tf_vi, "Hành khách: \tTôi có quá cảnh ở Singapore, có cần lấy hành lý không?", theme_accent=True)
add_p(tf_vi, "Nhân viên: \tKhông, hành lý sẽ được chuyển thẳng đến Bangkok.")
add_p(tf_vi, "Hành khách: \tLối đi kiểm tra an ninh ở đâu ạ? — Cảm ơn!", theme_accent=True)

prs1.save("Conversation_1_Check_In.pptx")
print(f"Saved Conversation_1_Check_In.pptx with {len(prs1.slides)} slides.")


# ==============================================================================
# 2. BUILD CONVERSATION 2 PPTX
# ==============================================================================
prs2 = Presentation("Airport_backup.pptx")
clean_presentation(prs2)

# Slide 1: Title
s2 = prs2.slides.add_slide(prs2.slide_layouts[0])
s2.shapes.title.text = "Overweight Luggage"
for r in s2.shapes.title.text_frame.paragraphs[0].runs:
    r.font.bold = True
s2.shapes.placeholders[1].text = "English in Conversation — Conversation 2: Hành lý quá cân"

# Vocab slides for Conversation 2
vocab_2 = [
    {
        "category": "TỪ VỰNG LIÊN QUAN: HỘI THOẠI 2 (OVERWEIGHT LUGGAGE)",
        "word": "• overweight /ˌoʊvərˈweɪt/ (adj): quá cân, thừa cân",
        "example": "  Ví dụ: Your luggage is overweight by 3 kilograms.",
        "img": "cached_images/overweight.jpg"
    },
    {
        "category": "TỪ VỰNG LIÊN QUAN: HỘI THOẠI 2 (OVERWEIGHT LUGGAGE)",
        "word": "• luggage /ˈlʌɡɪdʒ/ (n): hành lý",
        "example": "  Ví dụ: How many pieces of luggage do you have?",
        "img": "cached_images/luggage.jpg"
    },
    {
        "category": "TỪ VỰNG LIÊN QUAN: HỘI THOẠI 2 (OVERWEIGHT LUGGAGE)",
        "word": "• baggage /ˈbæɡɪdʒ/ (n): hành lý",
        "example": "  Ví dụ: Your baggage will be checked through to your final destination.",
        "img": "cached_images/luggage.jpg"
    },
    {
        "category": "TỪ VỰNG LIÊN QUAN: HỘI THOẠI 2 (OVERWEIGHT LUGGAGE)",
        "word": "• scale /ˈskeɪl/ (n): cái cân",
        "example": "  Ví dụ: Please place your bag on the scale.",
        "img": "cached_images/scale.jpg"
    },
    {
        "category": "TỪ VỰNG LIÊN QUAN: HỘI THOẠI 2 (OVERWEIGHT LUGGAGE)",
        "word": "• carry-on bag /ˈkæri ɑːn bæɡ/ (n): hành lý xách tay",
        "example": "  Ví dụ: You can bring one carry-on bag on the plane.",
        "img": "cached_images/carry_on_bag.png"
    },
    {
        "category": "TỪ VỰNG LIÊN QUAN: HỘI THOẠI 2 (OVERWEIGHT LUGGAGE)",
        "word": "• checked luggage /tʃekt ˈlʌɡɪdʒ/ (n): hành lý ký gửi",
        "example": "  Ví dụ: Each passenger is allowed one piece of checked luggage.",
        "img": "cached_images/checked_luggage.jpg"
    },
    {
        "category": "TỪ VỰNG LIÊN QUAN: HỘI THOẠI 2 (OVERWEIGHT LUGGAGE)",
        "word": "• passenger /ˈpæsɪndʒər/ (n): hành khách",
        "example": "  Ví dụ: The passenger showed his boarding pass at the gate.",
        "img": "cached_images/passenger.jpg"
    },
    {
        "category": "TỪ VỰNG LIÊN QUAN: HỘI THOẠI 2 (OVERWEIGHT LUGGAGE)",
        "word": "• check-in counter /ˈtʃek ɪn ˈkaʊntər/ (n): quầy làm thủ tục",
        "example": "  Ví dụ: Please go to the check-in counter to get your boarding pass.",
        "img": "cached_images/check_in_counter.jpg"
    }
]

for item in vocab_2:
    add_vocab_slide(prs2, item["category"], item["word"], item["example"], item["img"])

# Slide: Note Luggage vs Baggage
s_note = prs2.slides.add_slide(prs2.slide_layouts[1])
s_note.shapes.title.text = "Vocabulary"
for r in s_note.shapes.title.text_frame.paragraphs[0].runs:
    r.font.bold = True
body_note = s_note.shapes.placeholders[1]
body_note.left = 838200
body_note.top = 1265125
body_note.width = 6614160
body_note.height = 4911838
tf_note = body_note.text_frame
tf_note.word_wrap = True

add_p(tf_note, "TỪ VỰNG: PHÂN BIỆT LUGGAGE & BAGGAGE", is_bold=True)
add_p(tf_note, "")
add_p(tf_note, "Luggage:", is_bold=True)
add_p(tf_note, "• Thiên về vật chứa (vali, túi du lịch, rương).")
add_p(tf_note, "• Hay dùng phổ biến ở Anh (UK) hơn.")
add_p(tf_note, "• Trong tiếng Anh Mỹ, đôi khi chỉ những chiếc vali/túi xách rỗng.")
add_p(tf_note, "")
add_p(tf_note, "Baggage:", is_bold=True)
add_p(tf_note, "• Mang tính tổng hợp cả túi lẫn đồ đạc bên trong mang theo.")
add_p(tf_note, "• Phổ biến ở Mỹ (US) tại sân bay (vd: baggage claim - nơi nhận hành lý).")
add_p(tf_note, "• Nghĩa bóng: Chỉ 'gánh nặng tâm lý' (emotional baggage).")

# Add luggage comparison picture
if os.path.exists("cached_images/luggage.jpg"):
    s_note.shapes.add_picture("cached_images/luggage.jpg", 7311000, 2576963, 4042800, 3600000)

# Slide: Conversation 2 Dialogue
c2 = prs2.slides.add_slide(prs2.slide_layouts[1])
c2.shapes.title.text = "CONVERSATION 2: OVERWEIGHT LUGGAGE"
for r in c2.shapes.title.text_frame.paragraphs[0].runs:
    r.font.bold = True
body_c2 = c2.shapes.placeholders[1]
body_c2.left = 838200
body_c2.top = 1265125
body_c2.width = 10515600
body_c2.height = 4911838
tf_c2 = body_c2.text_frame
tf_c2.word_wrap = True

add_p(tf_c2, "Tình huống: Hành lý của hành khách bị quá cân khi làm thủ tục check-in.", is_italic=True)
add_p(tf_c2, "")
add_p(tf_c2, "Staff: \t\tI'm sorry, sir. Your luggage is overweight.")
add_p(tf_c2, "Passenger: \tBy how much?", theme_accent=True)
add_p(tf_c2, "Staff: \t\tAbout 5 kilograms.")
add_p(tf_c2, "Passenger: \tOkay, let me take something out.", theme_accent=True)
add_p(tf_c2, "📦 (Passenger takes some items out)", is_italic=True)
add_p(tf_c2, "Passenger: \tHow about now?", theme_accent=True)
add_p(tf_c2, "Staff: \t\tIt's just slightly overweight — about 0.5 kg. That should be fine. You're good to go.")
add_p(tf_c2, "Passenger: \tGreat, thank you!", theme_accent=True)

# Slide: Conversation 2 Vietnamese Translation
c2_vi = prs2.slides.add_slide(prs2.slide_layouts[1])
c2_vi.shapes.title.text = "CONVERSATION 2: BẢN DỊCH TIẾNG VIỆT"
for r in c2_vi.shapes.title.text_frame.paragraphs[0].runs:
    r.font.bold = True
body_c2_vi = c2_vi.shapes.placeholders[1]
body_c2_vi.left = 838200
body_c2_vi.top = 1265125
body_c2_vi.width = 10515600
body_c2_vi.height = 4911838
tf_c2_vi = body_c2_vi.text_frame
tf_c2_vi.word_wrap = True

add_p(tf_c2_vi, "Tình huống: Hành lý của hành khách bị quá cân khi làm thủ tục check-in.", is_italic=True)
add_p(tf_c2_vi, "")
add_p(tf_c2_vi, "Nhân viên: \tXin lỗi anh. Hành lý của anh bị quá cân.")
add_p(tf_c2_vi, "Hành khách: \tQuá bao nhiêu ạ?", theme_accent=True)
add_p(tf_c2_vi, "Nhân viên: \tKhoảng 5 kg.")
add_p(tf_c2_vi, "Hành khách: \tĐược rồi, để tôi bỏ bớt đồ ra.", theme_accent=True)
add_p(tf_c2_vi, "📦 (Hành khách bỏ bớt đồ ra)", is_italic=True)
add_p(tf_c2_vi, "Hành khách: \tGiờ thì sao ạ?", theme_accent=True)
add_p(tf_c2_vi, "Nhân viên: \tChỉ hơi quá một chút — khoảng 0,5 kg. Không sao đâu. Anh có thể đi được rồi.")
add_p(tf_c2_vi, "Hành khách: \tTuyệt, cảm ơn!", theme_accent=True)

prs2.save("Conversation_2_Overweight_Luggage.pptx")
print(f"Saved Conversation_2_Overweight_Luggage.pptx with {len(prs2.slides)} slides.")
