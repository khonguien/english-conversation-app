# -*- coding: utf-8 -*-
"""Generate Hotel.pptx presentation with vivid Irasutoya illustrations.

Features:
- Standard 16:9 widescreen layout (13.333" x 7.5").
- 12 Hero Card Vocabulary slides (1 word per slide) with high-res Irasutoya PNGs on the left,
  phonetics, collocations, and contextual examples on the right.
- 9 Character Scene Dialogue slides (4 Scenarios split into 2-3 scenes each) featuring full-body
  Irasutoya characters standing on left/right, and alternating comic-style speech bubbles in the center.
- Cover, Agenda, Deep Dive (Bathroom Plumbing), and Practice Challenge slides.
- Synchronized with Single Source of Truth: scripts/data_hotel.py.
"""

import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.shapes import MSO_SHAPE
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.oxml import parse_xml
from pptx.oxml.ns import nsdecls

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding='utf-8')

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))
CACHE_DIR = os.path.join(SCRIPT_DIR, "cached_images", "irasutoya")
OUTPUT_PATH = os.path.join(PROJECT_DIR, "materials", "slides", "Hotel.pptx")

# Typography & Color Palette
FONT_HEADING = "Segoe UI"
FONT_BODY = "Segoe UI"

COLOR_NAVY_DARK = RGBColor(15, 23, 42)      # #0F172A
COLOR_NAVY_PRIMARY = RGBColor(30, 58, 138)  # #1E3A8A
COLOR_NAVY_LIGHT = RGBColor(59, 130, 246)   # #3B82F6
COLOR_AMBER_ACCENT = RGBColor(217, 119, 6)  # #D97706
COLOR_AMBER_LIGHT = RGBColor(245, 158, 11)  # #F59E0B
COLOR_CARD_BG = RGBColor(248, 250, 252)     # #F8FAFC
COLOR_CARD_BORDER = RGBColor(226, 232, 240) # #E2E8F0
COLOR_TEXT_MUTED = RGBColor(100, 116, 139)  # #64748B
COLOR_VI_SUBTITLE = RGBColor(37, 99, 235)   # #2563EB
COLOR_WHITE = RGBColor(255, 255, 255)

# Speech Bubble Themes
BUBBLE_STAFF_BG = RGBColor(238, 246, 255)   # #EEF6FF
BUBBLE_STAFF_LINE = RGBColor(96, 165, 250)  # #60A5FA
BUBBLE_GUEST_BG = RGBColor(254, 249, 238)   # #FEF9EE
BUBBLE_GUEST_LINE = RGBColor(245, 158, 11)  # #F59E0B

def get_asset(filename):
    path = os.path.join(CACHE_DIR, filename)
    if os.path.exists(path):
        return path
    return None

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    return prs

def add_header(slide, title_text, category_badge="", subtitle_text=""):
    """Standard aesthetic header banner for 16:9 slides."""
    # Header bar container
    header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.733), Inches(0.9))
    tf = header_box.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    
    p = tf.paragraphs[0]
    if category_badge:
        run_badge = p.add_run()
        run_badge.text = f"[{category_badge}]  "
        run_badge.font.name = FONT_HEADING
        run_badge.font.size = Pt(13)
        run_badge.font.bold = True
        run_badge.font.color.rgb = COLOR_AMBER_ACCENT
        
    run_title = p.add_run()
    run_title.text = title_text
    run_title.font.name = FONT_HEADING
    run_title.font.size = Pt(22)
    run_title.font.bold = True
    run_title.font.color.rgb = COLOR_NAVY_PRIMARY

    if subtitle_text:
        p_sub = tf.add_paragraph()
        run_sub = p_sub.add_run()
        run_sub.text = subtitle_text
        run_sub.font.name = FONT_BODY
        run_sub.font.size = Pt(12)
        run_sub.font.color.rgb = COLOR_TEXT_MUTED

# ==============================================================================
# 1. COVER SLIDE
# ==============================================================================
def add_cover_slide(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[6]) # blank layout
    
    # Left decorative card
    left_card = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE,
        Inches(0.8), Inches(0.8), Inches(5.0), Inches(5.9)
    )
    left_card.fill.solid()
    left_card.fill.fore_color.rgb = COLOR_CARD_BG
    left_card.line.color.rgb = COLOR_CARD_BORDER
    left_card.line.width = Pt(1.5)
    
    hotel_img = get_asset("deco_hotel.png")
    if hotel_img:
        slide.shapes.add_picture(hotel_img, Inches(1.1), Inches(1.3), width=Inches(4.4))
        
    tag_box = slide.shapes.add_textbox(Inches(1.0), Inches(5.7), Inches(4.6), Inches(0.8))
    tf_tag = tag_box.text_frame
    tf_tag.word_wrap = True
    p_tag = tf_tag.paragraphs[0]
    p_tag.alignment = PP_ALIGN.CENTER
    r_tag = p_tag.add_run()
    r_tag.text = "THE GRAND HORIZON HOTEL & RESORT\nEnglish in Conservation Series"
    r_tag.font.name = FONT_BODY
    r_tag.font.size = Pt(11)
    r_tag.font.bold = True
    r_tag.font.color.rgb = COLOR_TEXT_MUTED

    # Right Content Card
    right_card = slide.shapes.add_textbox(Inches(6.2), Inches(1.0), Inches(6.3), Inches(5.5))
    tf = right_card.text_frame
    tf.word_wrap = True
    
    # Series Pill
    p0 = tf.paragraphs[0]
    r0 = p0.add_run()
    r0.text = "CURRICULUM 2026 • SONG NGỮ ANH - VIỆT"
    r0.font.name = FONT_HEADING
    r0.font.size = Pt(12)
    r0.font.bold = True
    r0.font.color.rgb = COLOR_AMBER_ACCENT
    
    # Main Title
    p1 = tf.add_paragraph()
    p1.space_before = Pt(12)
    r1 = p1.add_run()
    r1.text = "At the Hotel 🏨"
    r1.font.name = FONT_HEADING
    r1.font.size = Pt(38)
    r1.font.bold = True
    r1.font.color.rgb = COLOR_NAVY_PRIMARY

    # Subtitle
    p2 = tf.add_paragraph()
    p2.space_before = Pt(8)
    r2 = p2.add_run()
    r2.text = "Tiếng Anh Giao Tiếp Thực Chiến Trong Khách Sạn\nMinh họa trực quan sinh động chuẩn phong cách Irasutoya"
    r2.font.name = FONT_BODY
    r2.font.size = Pt(16)
    r2.font.color.rgb = COLOR_NAVY_DARK

    # Highlights Badges
    p3 = tf.add_paragraph()
    p3.space_before = Pt(24)
    highlights = [
        "✨ 12 Thẻ Từ Vựng Hero Card kèm ảnh minh họa",
        "💬 4 Đoạn Hội Thoại Đối Đáp Nhân Vật Sinh Động",
        "⚡ 65 Mẫu Câu Giao Tiếp Phản Xạ (Lễ tân & Khách)",
        "🔧 Cẩm nang Xử lý 9 Sự cố Buồng tắm Thường gặp"
    ]
    for h in highlights:
        ph = tf.add_paragraph()
        ph.space_before = Pt(6)
        rh = ph.add_run()
        rh.text = h
        rh.font.name = FONT_BODY
        rh.font.size = Pt(14)
        rh.font.bold = True
        rh.font.color.rgb = COLOR_NAVY_PRIMARY

# ==============================================================================
# 2. AGENDA SLIDE
# ==============================================================================
def add_agenda_slide(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide, "LESSON OUTLINE / MỤC LỤC BÀI HỌC", "TỔNG QUAN BÀI GIẢNG", "Cấu trúc 4 phần bài học kết hợp minh họa trực quan phong cách Irasutoya")
    
    cards_data = [
        {
            "num": "01",
            "title": "CORE VOCABULARY",
            "title_vi": "12 Thẻ Từ Vựng Trọng Tâm (Hero Cards)",
            "desc": "• Nhận phòng & Hướng biển (reservation, key card, sea view)\n• Buồng phòng & Đồ ăn (housekeeping, bed sheets, room service)\n• Sự cố buồng tắm (clogged toilet, leak, water pressure)\n• Dịch vụ & Trả phòng (amenities, recommend, check-out)",
            "color": COLOR_NAVY_PRIMARY,
            "badge": "12 Slides Trực Quan"
        },
        {
            "num": "02",
            "title": "REAL-LIFE CONVERSATIONS",
            "title_vi": "4 Kịch Bản Đối Đáp Nhân Vật Sinh Động",
            "desc": "• Kịch bản 1: Check-in & nhận phòng view biển (3 cảnh + 2 Full Script)\n• Kịch bản 2: Buồng phòng & Room Service (2 cảnh + 2 Full Script)\n• Kịch bản 3: Bồn cầu nghẹt & rò rỉ nước (2 cảnh + 2 Full Script)\n• Kịch bản 4: Hỏi đường & Check-out thẻ (2 cảnh + 2 Full Script)",
            "color": COLOR_AMBER_ACCENT,
            "badge": "9 Cảnh + 8 Slide Full"
        },
        {
            "num": "03",
            "title": "65 ESSENTIAL PHRASES",
            "title_vi": "65 Mẫu Câu Giao Tiếp Phản Xạ Thực Chiến",
            "desc": "• 38 Mẫu câu dành cho Nhân viên (Lễ tân, Buồng phòng, Kỹ thuật)\n• 27 Mẫu câu dành cho Khách lưu trú (Check-in, Yêu cầu, Khiếu nại)\n• Phân loại theo từng chặng trải nghiệm của khách hàng.",
            "color": COLOR_NAVY_LIGHT,
            "badge": "Phản Xạ Tức Thì"
        },
        {
            "num": "04",
            "title": "DEEP DIVE & CHALLENGE",
            "title_vi": "Xử Lý Sự Cố Phòng Tắm & Thử Thách",
            "desc": "• 9 Vấn đề sự cố hệ thống thoát nước thường gặp trong khách sạn\n• Công thức khiếu nại lịch sự 3 bước (Problem -> Request -> Action)\n• Action Challenge: Thử thách phản xạ thực tế tại sảnh khách sạn.",
            "color": RGBColor(16, 185, 129),
            "badge": "Kỹ Năng Đời Thực"
        }
    ]
    
    positions = [
        (Inches(0.8), Inches(1.6)),
        (Inches(6.8), Inches(1.6)),
        (Inches(0.8), Inches(4.4)),
        (Inches(6.8), Inches(4.4))
    ]
    
    for i, data in enumerate(cards_data):
        left, top = positions[i]
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(5.7), Inches(2.55))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD_BG
        card.line.color.rgb = COLOR_CARD_BORDER
        card.line.width = Pt(1.5)
        
        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = Inches(0.2)
        
        p_top = tf.paragraphs[0]
        r_num = p_top.add_run()
        r_num.text = f"PHẦN {data['num']} • "
        r_num.font.name = FONT_HEADING
        r_num.font.size = Pt(11)
        r_num.font.bold = True
        r_num.font.color.rgb = data["color"]
        
        r_title = p_top.add_run()
        r_title.text = data["title"]
        r_title.font.name = FONT_HEADING
        r_title.font.size = Pt(13)
        r_title.font.bold = True
        r_title.font.color.rgb = COLOR_NAVY_DARK
        
        p_vi = tf.add_paragraph()
        r_vi = p_vi.add_run()
        r_vi.text = data["title_vi"]
        r_vi.font.name = FONT_HEADING
        r_vi.font.size = Pt(12)
        r_vi.font.bold = True
        r_vi.font.color.rgb = data["color"]
        
        p_desc = tf.add_paragraph()
        p_desc.space_before = Pt(4)
        r_desc = p_desc.add_run()
        r_desc.text = data["desc"]
        r_desc.font.name = FONT_BODY
        r_desc.font.size = Pt(10.5)
        r_desc.font.color.rgb = COLOR_NAVY_DARK

# ==============================================================================
# 3. HERO CARD VOCABULARY SLIDES (1 word / slide)
# ==============================================================================
def add_hero_vocab_slide(prs, index, total, vocab_data, img_filename):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    
    badge = f"CORE VOCABULARY ({index:02d}/{total:02d})"
    add_header(slide, f"{vocab_data['word'].upper()}", badge, vocab_data.get("category_vi", "Từ vựng trọng tâm Khách Sạn"))
    
    # Left Hero Image Card
    left_card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(4.8), Inches(5.3))
    left_card.fill.solid()
    left_card.fill.fore_color.rgb = COLOR_CARD_BG
    left_card.line.color.rgb = COLOR_CARD_BORDER
    left_card.line.width = Pt(1.5)
    
    img_path = get_asset(img_filename)
    if img_path:
        slide.shapes.add_picture(img_path, Inches(1.1), Inches(1.8), width=Inches(4.2))
        
    caption_box = slide.shapes.add_textbox(Inches(1.0), Inches(5.9), Inches(4.4), Inches(0.7))
    tf_cap = caption_box.text_frame
    tf_cap.word_wrap = True
    p_cap = tf_cap.paragraphs[0]
    p_cap.alignment = PP_ALIGN.CENTER
    r_cap = p_cap.add_run()
    r_cap.text = f"Minh họa: {vocab_data['meaningVi']}"
    r_cap.font.name = FONT_BODY
    r_cap.font.size = Pt(11)
    r_cap.font.italic = True
    r_cap.font.color.rgb = COLOR_TEXT_MUTED
    
    # Right Information Details Card
    right_card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(5.9), Inches(1.5), Inches(6.6), Inches(5.3))
    right_card.fill.solid()
    right_card.fill.fore_color.rgb = COLOR_WHITE
    right_card.line.color.rgb = COLOR_CARD_BORDER
    right_card.line.width = Pt(1.5)
    
    tf = right_card.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = Inches(0.35)
    
    # 1. Main Word Title
    p_word = tf.paragraphs[0]
    r_word = p_word.add_run()
    r_word.text = vocab_data['word']
    r_word.font.name = FONT_HEADING
    r_word.font.size = Pt(28)
    r_word.font.bold = True
    r_word.font.color.rgb = COLOR_NAVY_PRIMARY
    
    # 2. Phonetics & Part of Speech Badge
    p_ipa = tf.add_paragraph()
    p_ipa.space_before = Pt(4)
    r_pos = p_ipa.add_run()
    r_pos.text = f"[{vocab_data['partOfSpeech']}]  "
    r_pos.font.name = FONT_HEADING
    r_pos.font.size = Pt(14)
    r_pos.font.bold = True
    r_pos.font.color.rgb = COLOR_AMBER_ACCENT
    
    r_ipa = p_ipa.add_run()
    r_ipa.text = f"{vocab_data['ipa']}"
    r_ipa.font.name = FONT_BODY
    r_ipa.font.size = Pt(14)
    r_ipa.font.italic = True
    r_ipa.font.color.rgb = COLOR_TEXT_MUTED
    
    # 3. Vietnamese Meaning Box
    p_m = tf.add_paragraph()
    p_m.space_before = Pt(12)
    r_m_tag = p_m.add_run()
    r_m_tag.text = "Ý nghĩa: "
    r_m_tag.font.name = FONT_HEADING
    r_m_tag.font.size = Pt(14)
    r_m_tag.font.bold = True
    r_m_tag.font.color.rgb = COLOR_NAVY_DARK
    
    r_m_val = p_m.add_run()
    r_m_val.text = f"{vocab_data['meaningVi']}"
    r_m_val.font.name = FONT_HEADING
    r_m_val.font.size = Pt(16)
    r_m_val.font.bold = True
    r_m_val.font.color.rgb = COLOR_VI_SUBTITLE

    # 4. Collocations & Synonyms
    if vocab_data.get("collocations"):
        p_col_head = tf.add_paragraph()
        p_col_head.space_before = Pt(12)
        r_ch = p_col_head.add_run()
        r_ch.text = "CỤM TỪ THỰC CHIẾN (COLLOCATIONS):"
        r_ch.font.name = FONT_HEADING
        r_ch.font.size = Pt(13)
        r_ch.font.bold = True
        r_ch.font.color.rgb = COLOR_NAVY_PRIMARY
        
        for col in vocab_data["collocations"][:2]:
            p_c = tf.add_paragraph()
            p_c.space_before = Pt(3)
            r_c = p_c.add_run()
            r_c.text = f"• {col}"
            r_c.font.name = FONT_BODY
            r_c.font.size = Pt(14)
            r_c.font.color.rgb = COLOR_NAVY_DARK

    # 5. Example Sentence
    p_ex_head = tf.add_paragraph()
    p_ex_head.space_before = Pt(14)
    r_eh = p_ex_head.add_run()
    r_eh.text = "CÂU VÍ DỤ NGỮ CẢNH (EXAMPLE SENTENCE):"
    r_eh.font.name = FONT_HEADING
    r_eh.font.size = Pt(13)
    r_eh.font.bold = True
    r_eh.font.color.rgb = COLOR_AMBER_ACCENT
    
    p_ex_en = tf.add_paragraph()
    p_ex_en.space_before = Pt(4)
    r_en = p_ex_en.add_run()
    r_en.text = f"\"{vocab_data['exampleEn']}\""
    r_en.font.name = FONT_BODY
    r_en.font.size = Pt(15)
    r_en.font.bold = True
    r_en.font.color.rgb = COLOR_NAVY_DARK
    
    p_ex_vi = tf.add_paragraph()
    p_ex_vi.space_before = Pt(2)
    r_vi = p_ex_vi.add_run()
    r_vi.text = f"({vocab_data['exampleVi']})"
    r_vi.font.name = FONT_BODY
    r_vi.font.size = Pt(14)
    r_vi.font.italic = True
    r_vi.font.color.rgb = COLOR_VI_SUBTITLE

# ==============================================================================
# 4. CHARACTER SCENE DIALOGUE SLIDES (Turn-by-turn dynamic avatar placement)
# ==============================================================================
def add_character_scene_slide(prs, scene_meta, left_char_info, right_char_info, dialogue_turns):
    """
    Creates a dynamic conversational scene slide where each turn has the speaker's
    avatar directly adjacent to their speech bubble:
    - If Staff speaks: [Staff Avatar (Left)] -> [Speech Bubble]
    - If Guest speaks: [Speech Bubble] <- [Guest Avatar (Right)]
    """
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    
    badge = f"HỘI THOẠI {scene_meta['scenario_num']} • PHÂN CẢNH {scene_meta['scene_num']}/{scene_meta['total_scenes']}"
    add_header(slide, scene_meta["title"], badge, scene_meta["situation"])
    
    num_turns = len(dialogue_turns)
    
    # Calculate heights and spacing based on number of turns
    if num_turns == 2:
        top_positions = [Inches(1.6), Inches(4.3)]
        avatar_w = Inches(1.5)
        avatar_h = Inches(2.2)
        bubble_h = Inches(2.2)
        bubble_w = Inches(9.8)
    elif num_turns == 3:
        top_positions = [Inches(1.5), Inches(3.3), Inches(5.1)]
        avatar_w = Inches(1.3)
        avatar_h = Inches(1.55)
        bubble_h = Inches(1.55)
        bubble_w = Inches(9.8)
    else: # 4 turns
        top_positions = [Inches(1.4), Inches(2.75), Inches(4.1), Inches(5.45)]
        avatar_w = Inches(1.05)
        avatar_h = Inches(1.2)
        bubble_h = Inches(1.2)
        bubble_w = Inches(10.1)

    for i, turn in enumerate(dialogue_turns):
        top_pos = top_positions[i]
        is_staff = (turn["speaker"] == "ai" or "Receptionist" in turn["roleName"] or "Housekeeping" in turn["roleName"] or "Room Service" in turn["roleName"] or "Technician" in turn["roleName"])
        
        if is_staff:
            # 1. Staff Avatar on the Left
            avatar_path = get_asset(left_char_info["img"])
            if avatar_path:
                slide.shapes.add_picture(avatar_path, Inches(0.8), top_pos, width=avatar_w)
                
            # 2. Staff Speech Bubble to the right of Avatar
            bubble_left = Inches(0.8) + avatar_w + Inches(0.25)
            bubble = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, bubble_left, top_pos, bubble_w, bubble_h)
            bubble.fill.solid()
            bubble.fill.fore_color.rgb = BUBBLE_STAFF_BG
            bubble.line.color.rgb = BUBBLE_STAFF_LINE
            bubble.line.width = Pt(1.5)
            
            prefix = f"🛎️ {turn['roleName']}:"
            prefix_col = COLOR_NAVY_PRIMARY
        else:
            # 1. Guest Speech Bubble on the Left
            bubble_left = Inches(0.8)
            bubble = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, bubble_left, top_pos, bubble_w, bubble_h)
            bubble.fill.solid()
            bubble.fill.fore_color.rgb = BUBBLE_GUEST_BG
            bubble.line.color.rgb = BUBBLE_GUEST_LINE
            bubble.line.width = Pt(1.5)
            
            # 2. Guest Avatar on the Right of Bubble
            avatar_path = get_asset(right_char_info["img"])
            if avatar_path:
                avatar_left = bubble_left + bubble_w + Inches(0.25)
                slide.shapes.add_picture(avatar_path, avatar_left, top_pos, width=avatar_w)
                
            prefix = f"👤 {turn['roleName']}:"
            prefix_col = COLOR_AMBER_ACCENT
            
        tf = bubble.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = Inches(0.22)
        tf.margin_top = Inches(0.12)
        tf.margin_bottom = Inches(0.08)
        
        # Speaker Label
        p_spk = tf.paragraphs[0]
        r_spk = p_spk.add_run()
        r_spk.text = prefix
        r_spk.font.name = FONT_HEADING
        r_spk.font.size = Pt(13)
        r_spk.font.bold = True
        r_spk.font.color.rgb = prefix_col
        
        # English text
        p_en = tf.add_paragraph()
        p_en.space_before = Pt(2)
        r_en = p_en.add_run()
        r_en.text = turn["textEn"]
        r_en.font.name = FONT_BODY
        r_en.font.size = Pt(15 if num_turns <= 3 else 14)
        r_en.font.bold = True
        r_en.font.color.rgb = COLOR_NAVY_DARK
        
        # Vietnamese Translation
        p_vi = tf.add_paragraph()
        p_vi.space_before = Pt(2)
        r_vi = p_vi.add_run()
        r_vi.text = f"↳ {turn['textVi']}"
        r_vi.font.name = FONT_BODY
        r_vi.font.size = Pt(14)
        r_vi.font.italic = True
        r_vi.font.color.rgb = COLOR_VI_SUBTITLE if is_staff else RGBColor(180, 83, 9)

def add_full_script_slide(prs, scenario_title, scenario_num, turns, is_vietnamese=False):
    """
    Creates a full continuous script slide for shadowing, reading practice, or cross-referencing.
    - If is_vietnamese=False: Full English dialogue.
    - If is_vietnamese=True: Full Vietnamese translation.
    """
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    
    if not is_vietnamese:
        badge = f"HỘI THOẠI {scenario_num} • TOÀN VĂN TIẾNG ANH (FULL SCRIPT)"
        title = f"FULL SCRIPT (ENGLISH) — {scenario_title.upper()}"
        subtitle = "Luyện đọc liền mạch, phát âm ngữ điệu (Shadowing & Fluency Practice)"
    else:
        badge = f"HỘI THOẠI {scenario_num} • BẢN DỊCH TIẾNG VIỆT ĐẦY ĐỦ"
        title = f"BẢN DỊCH TIẾNG VIỆT TOÀN VĂN — {scenario_title.upper()}"
        subtitle = "Đối chiếu ngữ nghĩa tự nhiên, cách dùng từ và phản xạ thực tế"
        
    add_header(slide, title, badge, subtitle)
    
    # Outer Card Container
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(11.733), Inches(5.4))
    card.fill.solid()
    card.fill.fore_color.rgb = COLOR_CARD_BG
    card.line.color.rgb = COLOR_CARD_BORDER
    card.line.width = Pt(1.5)
    
    tf = card.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = Inches(0.4)
    tf.margin_top = Inches(0.25)
    tf.margin_bottom = Inches(0.25)
    
    num_turns = len(turns)
    font_size = 14
    space_val = 3 if num_turns >= 8 else 5
    
    for i, t in enumerate(turns):
        if i == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
            p.space_before = Pt(space_val)
            
        is_staff = (t["speaker"] == "ai" or "Receptionist" in t["roleName"] or "Housekeeping" in t["roleName"] or "Room Service" in t["roleName"] or "Technician" in t["roleName"])
        
        # Speaker label
        r_spk = p.add_run()
        if not is_vietnamese:
            r_spk.text = f"{t['roleName']}: "
        else:
            role_vi = "Lễ tân" if "Receptionist" in t['roleName'] else ("Buồng phòng" if "Housekeeping" in t['roleName'] else ("Phục vụ phòng" if "Room Service" in t['roleName'] else ("Kỹ thuật" if "Technician" in t['roleName'] else "Khách lưu trú")))
            r_spk.text = f"{role_vi}: "
            
        r_spk.font.name = FONT_HEADING
        r_spk.font.size = Pt(font_size)
        r_spk.font.bold = True
        r_spk.font.color.rgb = COLOR_NAVY_PRIMARY if is_staff else COLOR_AMBER_ACCENT
        
        # Text line
        r_txt = p.add_run()
        if not is_vietnamese:
            r_txt.text = t["textEn"]
            r_txt.font.name = FONT_BODY
            r_txt.font.size = Pt(font_size)
            r_txt.font.color.rgb = COLOR_NAVY_DARK
        else:
            r_txt.text = t["textVi"]
            r_txt.font.name = FONT_BODY
            r_txt.font.size = Pt(font_size)
            r_txt.font.italic = True
            r_txt.font.color.rgb = COLOR_NAVY_DARK

# ==============================================================================
# 5. DEEP DIVE & PRACTICE CHALLENGE SLIDES
# ==============================================================================
def add_deep_dive_slide(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide, "DEEP DIVE: 9 SỰ CỐ PHÒNG TẮM & CÔNG THỨC KHIẾU NẠI LỊCH SỰ", "KỸ NĂNG CHUYÊN SÂU", "Bộ từ vựng xử lý sự cố thiết bị vệ sinh & Công thức giải quyết nhanh cùng Lễ tân")
    
    # Left Card: 9 Plumbing Issues
    left_card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.3))
    left_card.fill.solid()
    left_card.fill.fore_color.rgb = COLOR_CARD_BG
    left_card.line.color.rgb = COLOR_CARD_BORDER
    left_card.line.width = Pt(1.5)
    
    tf_l = left_card.text_frame
    tf_l.word_wrap = True
    tf_l.margin_left = tf_l.margin_right = tf_l.margin_top = tf_l.margin_bottom = Inches(0.25)
    
    p0 = tf_l.paragraphs[0]
    r0 = p0.add_run()
    r0.text = "🔧 9 VẤN ĐỀ SỰ CỐ PHÒNG TẮM (PLUMBING ISSUES)"
    r0.font.name = FONT_HEADING
    r0.font.size = Pt(13)
    r0.font.bold = True
    r0.font.color.rgb = COLOR_NAVY_PRIMARY
    
    issues = [
        ("1. Clogged toilet", "Bồn cầu bị tắc / nghẹt không trôi"),
        ("2. Water leaking onto floor", "Nước rò rỉ tràn lênh láng trên mặt sàn"),
        ("3. Low water pressure", "Áp lực dòng nước chảy rất yếu"),
        ("4. No hot water", "Hệ thống nước nóng không hoạt động"),
        ("5. Toilet keeps running", "Nước bồn cầu cứ tự động chảy xả liên tục"),
        ("6. Dripping / Broken faucet", "Vòi nước bị rỉ nước liên tục hoặc bị gãy"),
        ("7. Shower head blocked", "Bát sen tắm bị nghẹt cặn bẩn"),
        ("8. Slow drain in sink", "Chậu rửa mặt thoát nước rất chậm"),
        ("9. Unpleasant bathroom odor", "Nhà vệ sinh bốc mùi hôi khó chịu")
    ]
    
    for en, vi in issues:
        p = tf_l.add_paragraph()
        p.space_before = Pt(4)
        r_en = p.add_run()
        r_en.text = f"• {en}: "
        r_en.font.name = FONT_BODY
        r_en.font.size = Pt(13)
        r_en.font.bold = True
        r_en.font.color.rgb = COLOR_NAVY_DARK
        
        r_vi = p.add_run()
        r_vi.text = vi
        r_vi.font.name = FONT_BODY
        r_vi.font.size = Pt(13)
        r_vi.font.color.rgb = COLOR_TEXT_MUTED
        
    # Right Card: 3-Step Formula & Sample Complaint
    right_card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.7), Inches(1.5), Inches(5.8), Inches(5.3))
    right_card.fill.solid()
    right_card.fill.fore_color.rgb = COLOR_WHITE
    right_card.line.color.rgb = COLOR_AMBER_ACCENT
    right_card.line.width = Pt(1.5)
    
    tf_r = right_card.text_frame
    tf_r.word_wrap = True
    tf_r.margin_left = tf_r.margin_right = tf_r.margin_top = tf_r.margin_bottom = Inches(0.25)
    
    p_form = tf_r.paragraphs[0]
    r_form = p_form.add_run()
    r_form.text = "⭐ CÔNG THỨC KHIẾU NẠI LỊCH SỰ 3 BƯỚC"
    r_form.font.name = FONT_HEADING
    r_form.font.size = Pt(14)
    r_form.font.bold = True
    r_form.font.color.rgb = COLOR_AMBER_ACCENT
    
    steps = [
        ("Bước 1: Nêu vấn đề nhẹ nhàng", "\"There seems to be a problem with...\"\n(Có vẻ như đang có vấn đề với...)"),
        ("Bước 2: Nêu chi tiết cụ thể", "\"The toilet is clogged and there's no hot water.\"\n(Bồn cầu bị tắc và không có nước nóng.)"),
        ("Bước 3: Yêu cầu giải quyết lịch sự", "\"Could you please send someone to look at it as soon as possible?\"\n(Bạn có thể cử ai đó lên kiểm tra giúp tôi càng sớm càng tốt không?)")
    ]
    
    for s_title, s_desc in steps:
        p = tf_r.add_paragraph()
        p.space_before = Pt(8)
        r_st = p.add_run()
        r_st.text = f"{s_title}:\n"
        r_st.font.name = FONT_HEADING
        r_st.font.size = Pt(13)
        r_st.font.bold = True
        r_st.font.color.rgb = COLOR_NAVY_PRIMARY
        
        r_sd = p.add_run()
        r_sd.text = s_desc
        r_sd.font.name = FONT_BODY
        r_sd.font.size = Pt(13)
        r_sd.font.color.rgb = COLOR_NAVY_DARK

    p_tech = tf_r.add_paragraph()
    p_tech.space_before = Pt(10)
    r_th = p_tech.add_run()
    r_th.text = "💡 Cam kết của Khách sạn:\n"
    r_th.font.name = FONT_HEADING
    r_th.font.size = Pt(13)
    r_th.font.bold = True
    r_th.font.color.rgb = COLOR_VI_SUBTITLE
    
    r_td = p_tech.add_run()
    r_td.text = "\"If it cannot be fixed within 15 minutes, we will gladly switch you to another sea view room immediately.\""
    r_td.font.name = FONT_BODY
    r_td.font.size = Pt(13)
    r_td.font.italic = True
    r_td.font.color.rgb = COLOR_NAVY_DARK

def add_practice_challenge_slide(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide, "ACTION CHALLENGE: THỰC HÀNH PHẢN XẠ THỰC TẾ", "TỔNG KẾT & ÁP DỤNG", "3 Thử thách nhập vai để thành thạo tiếng Anh khách sạn trong 24 giờ")
    
    challenges = [
        {
            "tag": "CHALLENGE 1",
            "title": "Nhận phòng & Xin đổi phòng",
            "task": "Đến quầy lễ tân, xuất trình đặt phòng mang tên bạn, đề xuất lịch sự xin đổi lên tầng cao hoặc phòng view biển và hỏi giờ phục vụ buffet sáng.",
            "prompt": "Key Phrase: \"Could I have a room on a higher floor with a sea view, please?\""
        },
        {
            "tag": "CHALLENGE 2",
            "title": "Gọi buồng phòng & Đồ ăn",
            "task": "Bấm số điện thoại nội bộ gọi Housekeeping xin thêm 2 chai nước suối, đổi ga giường mới và gọi 1 phần đồ ăn nhẹ qua dịch vụ Room Service.",
            "prompt": "Key Phrase: \"Could you bring two extra bottles of water and some fresh towels?\""
        },
        {
            "tag": "CHALLENGE 3",
            "title": "Phản ánh sự cố & Check-out",
            "task": "Thông báo vòi nước rò rỉ bằng công thức lịch sự 3 bước, yêu cầu thợ kỹ thuật lên xử lý; sau đó làm thủ tục trả phòng và xin hóa đơn thanh toán thẻ.",
            "prompt": "Key Phrase: \"There seems to be an issue with the water pressure. Could you have someone check it?\""
        }
    ]
    
    for i, c in enumerate(challenges):
        left = Inches(0.8 + i * 4.0)
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.6), Inches(3.7), Inches(5.1))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD_BG
        card.line.color.rgb = COLOR_CARD_BORDER
        card.line.width = Pt(1.5)
        
        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = Inches(0.25)
        
        p_tag = tf.paragraphs[0]
        r_tag = p_tag.add_run()
        r_tag.text = c["tag"]
        r_tag.font.name = FONT_HEADING
        r_tag.font.size = Pt(11)
        r_tag.font.bold = True
        r_tag.font.color.rgb = COLOR_AMBER_ACCENT
        
        p_title = tf.add_paragraph()
        p_title.space_before = Pt(6)
        r_title = p_title.add_run()
        r_title.text = c["title"]
        r_title.font.name = FONT_HEADING
        r_title.font.size = Pt(16)
        r_title.font.bold = True
        r_title.font.color.rgb = COLOR_NAVY_PRIMARY
        
        p_task = tf.add_paragraph()
        p_task.space_before = Pt(10)
        r_task = p_task.add_run()
        r_task.text = c["task"]
        r_task.font.name = FONT_BODY
        r_task.font.size = Pt(14)
        r_task.font.color.rgb = COLOR_NAVY_DARK
        
        p_pr = tf.add_paragraph()
        p_pr.space_before = Pt(14)
        r_pr = p_pr.add_run()
        r_pr.text = c["prompt"]
        r_pr.font.name = FONT_BODY
        r_pr.font.size = Pt(13.5)
        r_pr.font.bold = True
        r_pr.font.color.rgb = COLOR_VI_SUBTITLE

# ==============================================================================
# MAIN GENERATION PIPELINE
# ==============================================================================
def main():
    print(f"Creating vivid presentation: {OUTPUT_PATH}")
    prs = create_deck()
    
    # 1. Slide 1: Cover
    print("Building Slide 1: Cover...")
    add_cover_slide(prs)
    
    # 2. Slide 2: Agenda
    print("Building Slide 2: Agenda...")
    add_agenda_slide(prs)
    
    # 3. Slides 3-14: 12 Hero Card Vocabulary Slides
    print("Building Slides 3-14: 12 Hero Vocabulary Slides...")
    vocab_items = [
        {
            "word": "reservation", "partOfSpeech": "n", "ipa": "/ˌrezərˈveɪʃn/",
            "meaningVi": "sự đặt phòng trước",
            "category_vi": "Tiếp tân & Nhận phòng (Check-in)",
            "collocations": [
                "have a reservation under the name... (đặt phòng dưới tên...)",
                "make an advance reservation (tiến hành đặt trước)"
            ],
            "exampleEn": "I have a reservation under the name Vân.",
            "exampleVi": "Em mới đặt phòng dưới tên Vân ạ.",
            "img": "vocab_reservation.png"
        },
        {
            "word": "key card", "partOfSpeech": "n", "ipa": "/ˈkiː kɑːrd/",
            "meaningVi": "thẻ từ mở khóa phòng",
            "category_vi": "Tiếp tân & Nhận phòng (Check-in)",
            "collocations": [
                "tap the key card to unlock (quẹt thẻ từ mở khóa)",
                "here is your key card (đây là thẻ phòng của bạn)"
            ],
            "exampleEn": "Here's your key card. Your room is on the 3rd floor.",
            "exampleVi": "Đây là thẻ phòng ạ. Phòng của mình ở trên lầu 3 nha.",
            "img": "vocab_key_card.png"
        },
        {
            "word": "sea view", "partOfSpeech": "n phr", "ipa": "/ˈsiː vjuː/",
            "meaningVi": "tầm nhìn hướng ra biển",
            "category_vi": "Tiếp tân & Nhận phòng (Check-in)",
            "collocations": [
                "room with a sea view (phòng ban công nhìn ra biển)",
                "upgrade to an ocean view suite (nâng hạng phòng hướng biển)"
            ],
            "exampleEn": "Could I have a room with a sea view?",
            "exampleVi": "Em có thể nhận phòng view biển được không ạ?",
            "img": "vocab_sea_view.png"
        },
        {
            "word": "breakfast served", "partOfSpeech": "v phr", "ipa": "/ˈbrekfəst sɜːrvd/",
            "meaningVi": "giờ phục vụ bữa sáng buffet",
            "category_vi": "Tiện ích & Ẩm thực (Dining)",
            "collocations": [
                "complimentary breakfast included (bữa sáng miễn phí đi kèm)",
                "breakfast is served from 6 to 9 am (phục vụ từ 6 đến 9 giờ)"
            ],
            "exampleEn": "Breakfast is served from 6 to 9 am on the 2nd floor.",
            "exampleVi": "Bữa sáng được phục vụ từ 6 đến 9 giờ sáng tại tầng 2.",
            "img": "vocab_breakfast.png"
        },
        {
            "word": "housekeeping", "partOfSpeech": "n", "ipa": "/ˈhaʊskiːpɪŋ/",
            "meaningVi": "bộ phận phục vụ dọn buồng phòng",
            "category_vi": "Buồng phòng & Dịch vụ (Housekeeping)",
            "collocations": [
                "call housekeeping for extra towels (gọi dọn phòng xin thêm khăn)",
                "housekeeping service daily (dịch vụ dọn buồng phòng mỗi ngày)"
            ],
            "exampleEn": "Housekeeping, how can I help you? I'm here to clean your room.",
            "exampleVi": "Bộ phận buồng phòng, em có thể vào dọn phòng cho mình ạ.",
            "img": "vocab_housekeeping.png"
        },
        {
            "word": "bed sheets", "partOfSpeech": "n phr", "ipa": "/ˈbed ʃiːts/",
            "meaningVi": "ga trải giường sạch",
            "category_vi": "Buồng phòng & Dịch vụ (Housekeeping)",
            "collocations": [
                "change the bed sheets (thay ga trải giường mới)",
                "fresh cotton linen (vải trải giường cotton sạch sẽ)"
            ],
            "exampleEn": "I'll change the bed sheets for your room right away.",
            "exampleVi": "Em sẽ thay ga giường cho mình ngay nha.",
            "img": "vocab_bed_sheets.png"
        },
        {
            "word": "room service", "partOfSpeech": "n phr", "ipa": "/ˈruːm sɜːrvɪs/",
            "meaningVi": "dịch vụ phục vụ ăn uống tận phòng",
            "category_vi": "Buồng phòng & Dịch vụ (Housekeeping)",
            "collocations": [
                "order in-room dining (gọi món ăn phục vụ tận phòng)",
                "collect the room service tray (dọn khay đồ ăn sau bữa)"
            ],
            "exampleEn": "Room service, I've brought your order. Enjoy your meal!",
            "exampleVi": "Em mang đồ ăn lên cho anh chị đây ạ. Chúc chị ngon miệng ạ.",
            "img": "vocab_room_service.png"
        },
        {
            "word": "amenities", "partOfSpeech": "n", "ipa": "/əˈmenətiz/",
            "meaningVi": "đồ dùng tiện nghi phòng tắm & khách sạn",
            "category_vi": "Buồng phòng & Dịch vụ (Housekeeping)",
            "collocations": [
                "replenish bathroom amenities (bổ sung đồ dùng vệ sinh)",
                "complimentary toiletries (dầu gội, sữa tắm miễn phí)"
            ],
            "exampleEn": "I'll replenish the amenities and bring drinking water right away.",
            "exampleVi": "Để em bổ sung đồ dùng trong phòng và mang nước uống lên ngay ạ.",
            "img": "vocab_amenities.png"
        },
        {
            "word": "clogged", "partOfSpeech": "adj", "ipa": "/klɑːɡd/",
            "meaningVi": "bị tắc, bị nghẹt dòng nước",
            "category_vi": "Sự cố phòng tắm & Kỹ thuật (Plumbing)",
            "collocations": [
                "clogged toilet bowl (bồn cầu bị tắc không xả trôi được)",
                "blocked drainage pipe (đường ống thoát nước bị nghẹt)"
            ],
            "exampleEn": "Even the toilet is clogged! Could you fix it?",
            "exampleVi": "Nhà vệ sinh lại còn bị tắc nữa! Em sửa giúp chị được không?",
            "img": "vocab_clogged_toilet.png"
        },
        {
            "word": "leak", "partOfSpeech": "v, n", "ipa": "/liːk/",
            "meaningVi": "rò rỉ nước tràn ra sàn",
            "category_vi": "Sự cố phòng tắm & Kỹ thuật (Plumbing)",
            "collocations": [
                "water leaking onto the bathroom floor (nước rò rỉ tràn sàn)",
                "toilet keeps running and leaking (bồn cầu cứ xả rò mãi)"
            ],
            "exampleEn": "There's water leaking onto the floor from the pipe.",
            "exampleVi": "Nước cứ rò rỉ từ đường ống tràn trên sàn ạ.",
            "img": "vocab_leaking_water.png"
        },
        {
            "word": "water pressure", "partOfSpeech": "n phr", "ipa": "/ˈwɔːtər ˈpreʃər/",
            "meaningVi": "lực nước, áp lực dòng chảy",
            "category_vi": "Sự cố phòng tắm & Kỹ thuật (Plumbing)",
            "collocations": [
                "low water pressure in shower (lực vòi hoa sen rất yếu)",
                "strong water stream (dòng nước chảy mạnh)"
            ],
            "exampleEn": "The water pressure is very low and there's no hot water.",
            "exampleVi": "Lực nước yếu lắm ạ và không có cả nước nóng.",
            "img": "vocab_water_pressure.png"
        },
        {
            "word": "check out", "partOfSpeech": "v phr, n", "ipa": "/ˈtʃek aʊt/",
            "meaningVi": "làm thủ tục trả phòng & lấy biên lai",
            "category_vi": "Tiện ích & Trả phòng (Concierge)",
            "collocations": [
                "check-out time is at 12 noon (giờ trả phòng là 12h trưa)",
                "settle minibar bill and get receipt (thanh toán bill và lấy hóa đơn)"
            ],
            "exampleEn": "I'd like to check out, please! Can I pay by card?",
            "exampleVi": "Em muốn trả phòng ạ! Em thanh toán bằng thẻ được không?",
            "img": "vocab_check_out.png"
        }
    ]
    
    for idx, v in enumerate(vocab_items, start=1):
        add_hero_vocab_slide(prs, idx, len(vocab_items), v, v["img"])
        
    # 4. Slides 15-23: 9 Character Scene Dialogue Slides
    print("Building Slides 15-23: 9 Character Scene Dialogue Slides...")
    
    # ----------------------------------------------------
    # SCENARIO 1: CHECK-IN & SEA VIEW ROOM (3 scenes)
    # ----------------------------------------------------
    s1_left = {"role_name": "Receptionist", "role_vi": "Lễ tân", "img": "char_receptionist.png"}
    s1_right = {"role_name": "Guest (Vân)", "role_vi": "Khách lưu trú", "img": "char_guest.png"}
    
    # Scene 1: Arrival & Reservation Lookup (Turns 1-2)
    s1_c1 = {
        "scenario_num": "1", "scene_num": 1, "total_scenes": 3,
        "title": "CHECK-IN & TIẾP NHẬN ĐẶT PHÒNG",
        "situation": "Tình huống: Khách đến quầy lễ tân The Grand Horizon Hotel thông báo đặt phòng trước."
    }
    t1_c1 = [
        {"speaker": "ai", "roleName": "Receptionist", "textEn": "Hello! Welcome to our hotel. How can I help you today?", "textVi": "Em chào chị ạ! Chào mừng đến với khách sạn bên em. Em có thể giúp gì được cho chị ạ?"},
        {"speaker": "user", "roleName": "Guest (Vân)", "textEn": "Hi! I have a reservation under the name Vân. I'd like to check in, please!", "textVi": "Dạ em mới đặt phòng dưới tên Vân ạ. Em muốn làm thủ tục nhận phòng ạ!"}
    ]
    add_character_scene_slide(prs, s1_c1, s1_left, s1_right, t1_c1)

    # Scene 2: ID Check, Sea View & Breakfast (Turns 3-5)
    s1_c2 = {
        "scenario_num": "1", "scene_num": 2, "total_scenes": 3,
        "title": "XÁC NHẬN CĂN CƯỚC, PHÒNG VIEW BIỂN & ĂN SÁNG",
        "situation": "Tình huống: Xuất trình CCCD, xin phòng hướng biển và hỏi giờ phục vụ bữa sáng buffet."
    }
    t1_c2 = [
        {"speaker": "ai", "roleName": "Receptionist", "textEn": "Have you made a reservation online? May I see your ID, please? Please wait a moment.", "textVi": "Chị đã đặt phòng trước chưa ạ? Cho em xin tên và em có thể xem căn cước của chị được không ạ? Đợi em một chút nha."},
        {"speaker": "user", "roleName": "Guest (Vân)", "textEn": "Sure, here is my ID. Could I have a room with a sea view? And is breakfast included?", "textVi": "Dạ đây là căn cước của em. Em có thể nhận phòng view biển được không ạ? Giá này đã bao gồm bữa sáng chưa ạ?"},
        {"speaker": "ai", "roleName": "Receptionist", "textEn": "Yes, breakfast is served from 6 to 9 am! Your room is ready. Your room is on the 3rd floor.", "textVi": "Dạ có, bữa sáng được phục vụ từ 6 đến 9 giờ ạ! Phòng của mình được rồi đấy ạ, phòng ở trên lầu 3 nha."}
    ]
    add_character_scene_slide(prs, s1_c2, s1_left, s1_right, t1_c2)

    # Scene 3: Checkout Time & Key Card Handover (Turns 6-8)
    s1_c3 = {
        "scenario_num": "1", "scene_num": 3, "total_scenes": 3,
        "title": "BÀN GIAO THẺ TỪ PHÒNG 304 & MẬT KHẨU WI-FI",
        "situation": "Tình huống: Khách hỏi giờ check-out, nhận thẻ từ phòng 304 và thông tin Wi-Fi."
    }
    t1_c3 = [
        {"speaker": "user", "roleName": "Guest (Vân)", "textEn": "Awesome! What time is check out? Does the room have Wi-Fi?", "textVi": "Tuyệt quá! Cho em hỏi mấy giờ trả phòng ạ? Phòng có Wi-Fi miễn phí không ạ?"},
        {"speaker": "ai", "roleName": "Receptionist", "textEn": "Check out is at 12:00 noon. Here's your key card. The Wi-Fi password is on this card. If you need any assistance, please call the reception.", "textVi": "Giờ trả phòng là 12h trưa ạ. Đây là thẻ phòng ạ. Mật khẩu Wi-Fi được ghi trên thẻ này ạ. Cần hỗ trợ gì anh chị cứ gọi lễ tân nha."},
        {"speaker": "user", "roleName": "Guest (Vân)", "textEn": "Thank you so much for your help!", "textVi": "Dạ em cảm ơn chị nhiều ạ!"}
    ]
    add_character_scene_slide(prs, s1_c3, s1_left, s1_right, t1_c3)

    # Full Script Slides for Scenario 1
    full_s1 = t1_c1 + t1_c2 + t1_c3
    add_full_script_slide(prs, "Check-in & Phòng View Biển", 1, full_s1, is_vietnamese=False)
    add_full_script_slide(prs, "Check-in & Phòng View Biển", 1, full_s1, is_vietnamese=True)

    # ----------------------------------------------------
    # SCENARIO 2: HOUSEKEEPING & ROOM SERVICE (2 scenes)
    # ----------------------------------------------------
    s2_left_hk = {"role_name": "Housekeeping", "role_vi": "Buồng phòng", "img": "char_housekeeper.png"}
    s2_left_rs = {"role_name": "Room Service", "role_vi": "Phục vụ phòng", "img": "vocab_room_service.png"}
    
    # Scene 1: Housekeeping, Bed Sheets & Extra Water (Turns 1-4)
    s2_c1 = {
        "scenario_num": "2", "scene_num": 1, "total_scenes": 2,
        "title": "DỌN PHÒNG, THAY GA GIƯỜNG & XIN THÊM NƯỚC",
        "situation": "Tình huống: Nhân viên buồng phòng gõ cửa xin phép dọn phòng và bổ sung vật dụng tiện nghi."
    }
    t2_c1 = [
        {"speaker": "ai", "roleName": "Housekeeping", "textEn": "Housekeeping, how can I help you? May I come in? I'm here to clean your room.", "textVi": "Bộ phận buồng phòng, em có thể giúp gì được cho chị ạ? Em có thể vào dọn phòng cho mình ạ."},
        {"speaker": "user", "roleName": "Guest (Room 304)", "textEn": "Yes, please come in! Could I get an extra towel, please?", "textVi": "Dạ được, em vào đi! Cho em xin thêm khăn tắm được không ạ?"},
        {"speaker": "ai", "roleName": "Housekeeping", "textEn": "Certainly! I'll change the bed sheets and replenish the amenities right away. Do you need more drinking water or toilet paper?", "textVi": "Dạ được ạ! Em sẽ thay ga giường cho mình nha, để em bổ sung đồ dùng ngay. Chị có cần thêm nước uống hay giấy vệ sinh không ạ?"},
        {"speaker": "user", "roleName": "Guest (Room 304)", "textEn": "Yes, two extra bottles of drinking water and some toilet paper would be great. Thank you!", "textVi": "Dạ cho em xin thêm hai chai nước uống và ít giấy vệ sinh nữa là tuyệt ạ. Em cảm ơn!"}
    ]
    add_character_scene_slide(prs, s2_c1, s2_left_hk, s1_right, t2_c1)

    # Scene 2: Room Service Delivery (Turns 5-8)
    s2_c2 = {
        "scenario_num": "2", "scene_num": 2, "total_scenes": 2,
        "title": "GIAO MÓN ĂN TẬN PHÒNG (ROOM SERVICE)",
        "situation": "Tình huống: Nhân viên mang món ăn nóng sốt lên phòng và dặn khách liên hệ sau khi dùng xong."
    }
    t2_c2 = [
        {"speaker": "ai", "roleName": "Room Service", "textEn": "Room service, I've brought your order. Please check your order.", "textVi": "Em mang đồ ăn lên cho anh chị đây ạ. Chị kiểm tra lại giùm em nha."},
        {"speaker": "user", "roleName": "Guest (Room 304)", "textEn": "Looks delicious! Thank you.", "textVi": "Trông ngon quá! Cảm ơn bạn nha."},
        {"speaker": "ai", "roleName": "Room Service", "textEn": "Enjoy your meal! Please call reception when you're finished so we can collect the tray.", "textVi": "Chúc chị ngon miệng ạ! Khi dùng xong, mình gọi lễ tân nha để bên em lên dọn khay ạ."},
        {"speaker": "user", "roleName": "Guest (Room 304)", "textEn": "Sure thing, I will. Thanks again!", "textVi": "Được chứ, lát ăn xong chị gọi. Cảm ơn em nhiều nha!"}
    ]
    add_character_scene_slide(prs, s2_c2, s2_left_rs, s1_right, t2_c2)

    # Full Script Slides for Scenario 2
    full_s2 = t2_c1 + t2_c2
    add_full_script_slide(prs, "Housekeeping & Room Service", 2, full_s2, is_vietnamese=False)
    add_full_script_slide(prs, "Housekeeping & Room Service", 2, full_s2, is_vietnamese=True)

    # ----------------------------------------------------
    # SCENARIO 3: BATHROOM PLUMBING ISSUES (2 scenes)
    # ----------------------------------------------------
    s3_left_tech = {"role_name": "Technician", "role_vi": "Kỹ thuật bảo trì", "img": "char_technician.png"}
    
    # Scene 1: Reporting Breakdown (Turns 1-3)
    s3_c1 = {
        "scenario_num": "3", "scene_num": 1, "total_scenes": 2,
        "title": "PHẢN ÁNH BỒN CẦU TẮC & SỰ CỐ PHÒNG TẮM",
        "situation": "Tình huống: Khách gọi điện khẩn cấp báo bồn cầu bị tắc và phòng tắm không sạch sẽ."
    }
    t3_c1 = [
        {"speaker": "ai", "roleName": "Receptionist", "textEn": "Front desk, how can I help you today?", "textVi": "Lễ tân xin nghe, em có thể giúp gì được cho chị ạ?"},
        {"speaker": "user", "roleName": "Guest (Room 304)", "textEn": "Hello! There seems to be a problem with the bathroom in room 304. The bathroom is not very clean, and even the toilet is clogged!", "textVi": "Alo em ơi! Phòng tắm phòng 304 có vấn đề anh ạ. Phòng tắm không sạch sẽ cho lắm ạ, nhà vệ sinh lại còn bị tắc nữa."},
        {"speaker": "ai", "roleName": "Receptionist", "textEn": "Oh, I am terribly sorry to hear that! What else is happening in there?", "textVi": "Ôi em thật sự xin lỗi chị ạ! Còn vấn đề gì nữa không chị?"}
    ]
    add_character_scene_slide(prs, s3_c1, s1_left, s1_right, t3_c1)

    # Scene 2: Dispatching Technician & Room Switch Promise (Turns 4-8)
    s3_c2 = {
        "scenario_num": "3", "scene_num": 2, "total_scenes": 2,
        "title": "CỬ THỢ KỸ THUẬT & CAM KẾT ĐỔI PHÒNG NGAY",
        "situation": "Tình huống: Lễ tân cử thợ kỹ thuật lên xử lý trong 5 phút và sẵn sàng đổi phòng mới nếu không khắc phục kịp."
    }
    t3_c2 = [
        {"speaker": "user", "roleName": "Guest (Room 304)", "textEn": "The toilet keeps running, the faucet isn't working, and the water pressure is very low with water leaking onto the floor!", "textVi": "Nước cứ rò mãi, vòi nước không hoạt động, lực nước yếu lắm mà nước còn rò rỉ tràn sàn nữa ạ!"},
        {"speaker": "ai", "roleName": "Technician / Reception", "textEn": "I apologize! Our technician will be there in 5 minutes. If it cannot be fixed immediately, we will switch you to another room right away.", "textVi": "Em thành thật xin lỗi chị! Thợ kỹ thuật bên em sẽ có mặt trong 5 phút. Nếu không sửa được ngay bên em sẽ đổi phòng khác cho mình ngay lập tức ạ."},
        {"speaker": "user", "roleName": "Guest (Room 304)", "textEn": "I appreciate your prompt assistance. Thank you!", "textVi": "Bên anh hỗ trợ nhiệt tình và nhanh chóng quá, em cảm ơn nhé!"}
    ]
    add_character_scene_slide(prs, s3_c2, s3_left_tech, s1_right, t3_c2)

    # Full Script Slides for Scenario 3
    full_s3 = t3_c1 + t3_c2
    add_full_script_slide(prs, "Sự Cố Phòng Tắm & Kỹ Thuật", 3, full_s3, is_vietnamese=False)
    add_full_script_slide(prs, "Sự Cố Phòng Tắm & Kỹ Thuật", 3, full_s3, is_vietnamese=True)

    # ----------------------------------------------------
    # SCENARIO 4: CONCIERGE & CHECK-OUT (2 scenes)
    # ----------------------------------------------------
    # Scene 1: Beach Directions & Restaurant Recommendations (Turns 1-4)
    s4_c1 = {
        "scenario_num": "4", "scene_num": 1, "total_scenes": 2,
        "title": "HỎI ĐƯỜNG RA BÃI BIỂN & GỢI Ý NHÀ HÀNG NGON",
        "situation": "Tình huống: Khách nhờ Lễ tân hướng dẫn đường đi bộ ra biển và gợi ý quán hải sản ngon gần khách sạn."
    }
    t4_c1 = [
        {"speaker": "ai", "roleName": "Receptionist", "textEn": "Good morning! How may I assist you today?", "textVi": "Chào buổi sáng chị ạ! Em có thể giúp gì được cho chị hôm nay ạ?"},
        {"speaker": "user", "roleName": "Guest (Vân)", "textEn": "Could you tell me how to get to the beach from here? Is it within walking distance?", "textVi": "Anh có thể chỉ em đường ra bãi biển từ đây được không ạ? Đi bộ ra có gần không anh?"},
        {"speaker": "ai", "roleName": "Receptionist", "textEn": "It's just a 5-minute walk straight down this avenue! Very convenient.", "textVi": "Dạ bãi biển chỉ cách đây 5 phút đi bộ thẳng theo đại lộ này thôi ạ! Rất gần và thuận tiện."},
        {"speaker": "user", "roleName": "Guest (Vân)", "textEn": "Awesome! Could you recommend a good seafood restaurant nearby for lunch?", "textVi": "Hay quá! Anh có thể gợi ý cho em một nhà hàng hải sản ngon gần đây để ăn trưa không ạ?"}
    ]
    add_character_scene_slide(prs, s4_c1, s1_left, s1_right, t4_c1)

    # Scene 2: Minibar Bill, Card Payment & Receipt (Turns 5-8)
    s4_c2 = {
        "scenario_num": "4", "scene_num": 2, "total_scenes": 2,
        "title": "TRẢ THẺ PHÒNG, THANH TOÁN THẺ & NHẬN HÓA ĐƠN",
        "situation": "Tình huống: Trả thẻ phòng 304, thanh toán tiền minibar $20 bằng thẻ tín dụng và nhận biên lai."
    }
    t4_c2 = [
        {"speaker": "ai", "roleName": "Receptionist", "textEn": "Definitely Seafood Garden down the block! Are you ready to check out now?", "textVi": "Chắc chắn là quán Seafood Garden ở cuối dãy phố ạ! Mình muốn làm thủ tục trả phòng luôn chưa ạ?"},
        {"speaker": "user", "roleName": "Guest (Vân)", "textEn": "Yes, I'd like to check out now. Here is my key card. Can I pay by card, and could I have the receipt?", "textVi": "Dạ em muốn trả phòng luôn ạ. Đây là thẻ phòng ạ. Em thanh toán bằng thẻ và cho em xin hóa đơn với ạ."},
        {"speaker": "ai", "roleName": "Receptionist", "textEn": "Certainly! Here is your card and receipt. Have a wonderful trip ahead!", "textVi": "Dạ được chứ ạ! Đây là thẻ và hóa đơn của mình ạ. Chúc chị có một chuyến đi tuyệt vời phía trước nha!"}
    ]
    add_character_scene_slide(prs, s4_c2, s1_left, s1_right, t4_c2)

    # Full Script Slides for Scenario 4
    full_s4 = t4_c1 + t4_c2
    add_full_script_slide(prs, "Concierge & Check-out", 4, full_s4, is_vietnamese=False)
    add_full_script_slide(prs, "Concierge & Check-out", 4, full_s4, is_vietnamese=True)

    # 5. Slide 24: Deep Dive - Plumbing Issues & Polite Complaint Formula
    print("Building Slide 24: Deep Dive - Bathroom Issues...")
    add_deep_dive_slide(prs)

    # 6. Slide 25: Action Challenge
    print("Building Slide 25: Action Challenge...")
    add_practice_challenge_slide(prs)

    prs.save(OUTPUT_PATH)
    print(f"=== Successfully saved {len(prs.slides)} slides to {OUTPUT_PATH} ===")

if __name__ == "__main__":
    main()
