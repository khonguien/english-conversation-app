# -*- coding: utf-8 -*-
"""Generate Workplace.pptx presentation with vivid Irasutoya illustrations.

Features:
- Standard 16:9 widescreen layout (13.333" x 7.5").
- 12 Hero Card Vocabulary slides (1 word per slide) with high-res Irasutoya PNGs on the left,
  phonetics, collocations, and contextual examples on the right.
- 8 Dynamic Character Scene Dialogue slides (4 Scenarios split into 2 scenes each) featuring
  turn-by-turn Irasutoya character avatars directly adjacent to speech bubbles.
- 8 Dedicated Full Script Review slides (4 Full English + 4 Full Vietnamese) for continuous shadowing.
- Starter Questions, 25 Reflex Phrases, Logistics Cut-off Survival Guide, Banter & Networking Mastery.
- Defensive file lock handling: auto-fallback to Workplace_v2.pptx if Workplace.pptx is locked.
- Synchronized with Single Source of Truth: scripts/data_workplace.py.
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
OUTPUT_PATH = os.path.join(PROJECT_DIR, "materials", "slides", "Workplace.pptx")
FALLBACK_PATH = os.path.join(PROJECT_DIR, "materials", "slides", "Workplace_v2.pptx")

sys.path.append(os.path.join(PROJECT_DIR, "scripts"))
from data_workplace import WORKPLACE_DATA

# Typography & Color Palette (Executive Business & Logistics)
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
COLOR_EMERALD = RGBColor(16, 185, 129)      # #10B981

# Speech Bubble Themes
BUBBLE_AI_BG = RGBColor(238, 246, 255)      # #EEF6FF
BUBBLE_AI_LINE = RGBColor(96, 165, 250)     # #60A5FA
BUBBLE_USER_BG = RGBColor(254, 249, 238)    # #FEF9EE
BUBBLE_USER_LINE = RGBColor(245, 158, 11)   # #F59E0B

def get_asset(filename):
    """Retrieve asset path from local cache or fallback."""
    path = os.path.join(CACHE_DIR, filename)
    if os.path.exists(path):
        return path
    # Fallback to similar character if missing
    if "char_" in filename:
        for fb in ["char_office_man_a.png", "char_office_man_b.png"]:
            fb_path = os.path.join(CACHE_DIR, fb)
            if os.path.exists(fb_path):
                return fb_path
    return None

def create_deck():
    """Create 16:9 widescreen presentation canvas."""
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    return prs

def add_header(slide, title_text, category_badge="", subtitle_text=""):
    """Standard aesthetic header banner for 16:9 slides."""
    header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.733), Inches(0.95))
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
        p_sub.space_before = Pt(2)
        run_sub = p_sub.add_run()
        run_sub.text = subtitle_text
        run_sub.font.name = FONT_BODY
        run_sub.font.size = Pt(12)
        run_sub.font.color.rgb = COLOR_TEXT_MUTED

# ==============================================================================
# 1. COVER SLIDE
# ==============================================================================
def add_cover_slide(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    
    # Left decorative card
    left_card = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE,
        Inches(0.8), Inches(0.8), Inches(5.0), Inches(5.9)
    )
    left_card.fill.solid()
    left_card.fill.fore_color.rgb = COLOR_CARD_BG
    left_card.line.color.rgb = COLOR_CARD_BORDER
    left_card.line.width = Pt(1.5)
    
    deco_img = get_asset("deco_workplace.png")
    if deco_img:
        slide.shapes.add_picture(deco_img, Inches(1.1), Inches(1.3), width=Inches(4.4))
        
    tag_box = slide.shapes.add_textbox(Inches(1.0), Inches(5.7), Inches(4.6), Inches(0.8))
    tf_tag = tag_box.text_frame
    tf_tag.word_wrap = True
    p_tag = tf_tag.paragraphs[0]
    p_tag.alignment = PP_ALIGN.CENTER
    r_tag = p_tag.add_run()
    r_tag.text = "CORPORATE LOGISTICS & CAREER SERIES\nEnglish in Conservation Curriculum 2026"
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
    p1.space_before = Pt(10)
    r1 = p1.add_run()
    r1.text = "Work & Career 💼"
    r1.font.name = FONT_HEADING
    r1.font.size = Pt(36)
    r1.font.bold = True
    r1.font.color.rgb = COLOR_NAVY_PRIMARY

    # Subtitle
    p2 = tf.add_paragraph()
    p2.space_before = Pt(8)
    r2 = p2.add_run()
    r2.text = "Tiếng Anh Giao Tiếp Thực Chiến Công Sở & Ngành Logistics\nMinh họa trực quan sinh động chuẩn phong cách Irasutoya"
    r2.font.name = FONT_BODY
    r2.font.size = Pt(16)
    r2.font.color.rgb = COLOR_NAVY_DARK

    # Highlights
    p3 = tf.add_paragraph()
    p3.space_before = Pt(20)
    highlights = [
        "✨ 12 Thẻ Từ Vựng Hero Card kèm hình minh họa Irasutoya",
        "💬 4 Đoạn Hội Thoại Đối Đáp Nhân Vật Sinh Động (8 Cảnh + 8 Full Script)",
        "🎯 4 Câu Hỏi Khởi Động & 25 Mẫu Câu Phản Xạ Đời Thường",
        "🚢 Cẩm Nang Xử Lý Giờ Cắt Máng Tàu Chạy & Nghệ Thuật Networking"
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
            "desc": "• Vận chuyển & Thời hạn: freight forwarding, cut-off time\n• Môi trường làm việc: freelance, remote work, colleague\n• Áp lực & Cân bằng: deadline, work-life balance\n• Thăng tiến & Nghỉ việc: promotion, salary, networking, internship, resign",
            "color": COLOR_NAVY_PRIMARY,
            "badge": "12 Slides Trực Quan"
        },
        {
            "num": "02",
            "title": "REAL-LIFE CONVERSATIONS",
            "title_vi": "4 Kịch Bản Đối Đáp Nhân Vật Sinh Động",
            "desc": "• Kịch bản 1: Giới thiệu nghề nghiệp & văn phòng nhộn nhịp (2 cảnh + 2 Full Script)\n• Kịch bản 2: Rượt đuổi giờ tàu chạy & lệch múi giờ (2 cảnh + 2 Full Script)\n• Kịch bản 3: Tương lai 5 năm & nhậu networking cứu cont (2 cảnh + 2 Full Script)\n• Kịch bản 4: Đồng nghiệp lâu năm nghỉ việc (2 cảnh + 2 Full Script)",
            "color": COLOR_AMBER_ACCENT,
            "badge": "8 Cảnh + 8 Slide Full"
        },
        {
            "num": "03",
            "title": "STARTERS & 25 REFLEX PHRASES",
            "title_vi": "4 Câu Hỏi Khởi Động & 25 Câu Phản Xạ",
            "desc": "• 4 Starter Questions: Trả lời tự nhiên, bản lĩnh chuyên viên Logistics\n• 25 Mẫu câu giao tiếp phản xạ phân loại theo chủ đề công sở\n• Luyện ngữ điệu và sắc thái đời thực tự nhiên.",
            "color": COLOR_NAVY_LIGHT,
            "badge": "Phản Xạ Tức Thì"
        },
        {
            "num": "04",
            "title": "LOGISTICS MASTERY & CHALLENGE",
            "title_vi": "Bí Kíp Sinh Tồn Cảng Biển & Thử Thách",
            "desc": "• Cẩm nang cut-off SI, VGM, Port Closing và mẫu câu xin nới giờ\n• Nghệ thuật tự châm biếm và networking quán nhậu dân dã\n• Thử thách đóng vai trong phòng Free Talk AI & flashcard Quizlet.",
            "color": COLOR_EMERALD,
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
        p_vi.space_before = Pt(3)
        r_vi = p_vi.add_run()
        r_vi.text = data["title_vi"]
        r_vi.font.name = FONT_BODY
        r_vi.font.size = Pt(14)
        r_vi.font.bold = True
        r_vi.font.color.rgb = COLOR_NAVY_PRIMARY
        
        p_desc = tf.add_paragraph()
        p_desc.space_before = Pt(6)
        r_desc = p_desc.add_run()
        r_desc.text = data["desc"]
        r_desc.font.name = FONT_BODY
        r_desc.font.size = Pt(14)
        r_desc.font.color.rgb = COLOR_NAVY_DARK

# ==============================================================================
# 3. HERO CARD VOCABULARY SLIDES (1 Word / Slide, min 14pt)
# ==============================================================================
def add_hero_vocab_slide(prs, vocab_data, img_filename, badge="TỪ VỰNG TRỌNG TÂM"):
    """
    Creates a dedicated Hero Card slide for 1 vocabulary item:
    - Left 40%: Irasutoya transparent PNG centered inside a card.
    - Right 60%: Word details card with POS, IPA, Vietnamese meaning, collocations, example.
    """
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    
    add_header(slide, f"{vocab_data['word'].upper()}", badge, "Từ vựng trọng tâm Công Sở & Logistics")
    
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
        r_ch.font.size = Pt(14)
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
    r_eh.font.size = Pt(14)
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
    - If AI/Left speaks: [Left Avatar] -> [Speech Bubble]
    - If User/Right speaks: [Speech Bubble] <- [Right Avatar]
    """
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    
    badge = f"HỘI THOẠI {scene_meta['scenario_num']} • PHÂN CẢNH {scene_meta['scene_num']}/{scene_meta['total_scenes']}"
    add_header(slide, scene_meta["title"], badge, scene_meta["situation"])
    
    num_turns = len(dialogue_turns)
    
    if num_turns == 2:
        top_positions = [Inches(1.6), Inches(4.3)]
        avatar_w = Inches(1.5)
        bubble_h = Inches(2.2)
        bubble_w = Inches(9.8)
    elif num_turns == 3:
        top_positions = [Inches(1.5), Inches(3.3), Inches(5.1)]
        avatar_w = Inches(1.3)
        bubble_h = Inches(1.55)
        bubble_w = Inches(9.8)
    else: # 4 turns
        top_positions = [Inches(1.4), Inches(2.75), Inches(4.1), Inches(5.45)]
        avatar_w = Inches(1.05)
        bubble_h = Inches(1.2)
        bubble_w = Inches(10.1)

    for i, turn in enumerate(dialogue_turns):
        top_pos = top_positions[i]
        is_left_speaker = (turn["speaker"] == "ai" or "Friend A" in turn["roleName"] or "Colleague A" in turn["roleName"])
        
        if is_left_speaker:
            # 1. Left Avatar
            avatar_path = get_asset(left_char_info["img"])
            if avatar_path:
                slide.shapes.add_picture(avatar_path, Inches(0.8), top_pos, width=avatar_w)
                
            # 2. Left Speech Bubble (Soft Blue)
            bubble_left = Inches(0.8) + avatar_w + Inches(0.25)
            bubble = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, bubble_left, top_pos, bubble_w, bubble_h)
            bubble.fill.solid()
            bubble.fill.fore_color.rgb = BUBBLE_AI_BG
            bubble.line.color.rgb = BUBBLE_AI_LINE
            bubble.line.width = Pt(1.5)
            
            prefix = f"💬 {turn['roleName']}:"
            prefix_col = COLOR_NAVY_PRIMARY
        else:
            # 1. Right Speech Bubble (Soft Warm Amber)
            bubble_left = Inches(0.8)
            bubble = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, bubble_left, top_pos, bubble_w, bubble_h)
            bubble.fill.solid()
            bubble.fill.fore_color.rgb = BUBBLE_USER_BG
            bubble.line.color.rgb = BUBBLE_USER_LINE
            bubble.line.width = Pt(1.5)
            
            # 2. Right Avatar
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
        r_spk.font.size = Pt(14)
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
        r_vi.font.color.rgb = COLOR_VI_SUBTITLE if is_left_speaker else RGBColor(180, 83, 9)

# ==============================================================================
# 5. FULL SCRIPT REVIEW SLIDES (English & Vietnamese)
# ==============================================================================
def add_full_script_slide(prs, scenario_title, scenario_num, turns, is_vietnamese=False):
    """
    Creates a full continuous script slide for shadowing or reading practice:
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
        subtitle = "Đối chiếu ngữ nghĩa tự nhiên mày - tao, phản xạ nhanh trong thực tế"
        
    add_header(slide, title, badge, subtitle)
    
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
    space_val = 3 if num_turns >= 6 else 6
    
    for i, t in enumerate(turns):
        if i == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
            p.space_before = Pt(space_val)
            
        is_left_speaker = (t["speaker"] == "ai" or "Friend A" in t["roleName"] or "Colleague A" in t["roleName"])
        
        # Speaker prefix run
        r_spk = p.add_run()
        prefix = f"[{t['roleName']}]: "
        r_spk.text = prefix
        r_spk.font.name = FONT_HEADING
        r_spk.font.size = Pt(14)
        r_spk.font.bold = True
        r_spk.font.color.rgb = COLOR_NAVY_PRIMARY if is_left_speaker else COLOR_AMBER_ACCENT
        
        # Text run
        r_txt = p.add_run()
        r_txt.text = t["textVi"] if is_vietnamese else t["textEn"]
        r_txt.font.name = FONT_BODY
        r_txt.font.size = Pt(14)
        r_txt.font.color.rgb = COLOR_NAVY_DARK

# ==============================================================================
# 6. STARTER QUESTIONS SLIDES
# ==============================================================================
def add_starter_questions_slide(prs, q_data_list, part_num):
    """Creates a slide displaying 2 Starter Questions with deep in-office responses."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide, f"STARTER QUESTIONS ({part_num}/2)", f"PHẦN 3 • CÂU HỎI KHỞI ĐỘNG", "Phản xạ câu hỏi phỏng vấn & giao lưu công sở theo tâm thế dân Logistics")
    
    y_positions = [Inches(1.5), Inches(4.25)]
    
    for i, q in enumerate(q_data_list):
        top_pos = y_positions[i]
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), top_pos, Inches(11.733), Inches(2.55))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_WHITE
        card.line.color.rgb = COLOR_CARD_BORDER
        card.line.width = Pt(1.5)
        
        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = Inches(0.3)
        tf.margin_top = Inches(0.2)
        tf.margin_bottom = Inches(0.2)
        
        # Question Title
        p0 = tf.paragraphs[0]
        r_q_num = p0.add_run()
        r_q_num.text = f"{q['num']}. {q['question_en']} "
        r_q_num.font.name = FONT_HEADING
        r_q_num.font.size = Pt(15)
        r_q_num.font.bold = True
        r_q_num.font.color.rgb = COLOR_NAVY_PRIMARY
        
        r_q_vi = p0.add_run()
        r_q_vi.text = f"({q['question_vi']})"
        r_q_vi.font.name = FONT_BODY
        r_q_vi.font.size = Pt(14)
        r_q_vi.font.italic = True
        r_q_vi.font.color.rgb = COLOR_AMBER_ACCENT
        
        # English Answer
        p_en = tf.add_paragraph()
        p_en.space_before = Pt(6)
        r_en_tag = p_en.add_run()
        r_en_tag.text = "• EN: "
        r_en_tag.font.name = FONT_HEADING
        r_en_tag.font.size = Pt(14)
        r_en_tag.font.bold = True
        r_en_tag.font.color.rgb = COLOR_NAVY_DARK
        
        r_en_val = p_en.add_run()
        r_en_val.text = f"\"{q['answer_en']}\""
        r_en_val.font.name = FONT_BODY
        r_en_val.font.size = Pt(14)
        r_en_val.font.color.rgb = COLOR_NAVY_DARK
        
        # Vietnamese Answer
        p_vi = tf.add_paragraph()
        p_vi.space_before = Pt(4)
        r_vi_tag = p_vi.add_run()
        r_vi_tag.text = "• VI: "
        r_vi_tag.font.name = FONT_HEADING
        r_vi_tag.font.size = Pt(14)
        r_vi_tag.font.bold = True
        r_vi_tag.font.color.rgb = COLOR_VI_SUBTITLE
        
        r_vi_val = p_vi.add_run()
        r_vi_val.text = f"\"{q['answer_vi']}\""
        r_vi_val.font.name = FONT_BODY
        r_vi_val.font.size = Pt(14)
        r_vi_val.font.italic = True
        r_vi_val.font.color.rgb = COLOR_NAVY_DARK

# ==============================================================================
# 7. 25 ESSENTIAL REFLEX PHRASES SLIDES
# ==============================================================================
def add_reflex_phrases_slide(prs, phrases_list, part_num, subtitle):
    """Creates a slide displaying essential workplace conversational phrases."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide, f"25 MẪU CÂU GIAO TIẾP PHẢN XẠ ({part_num}/2)", "PHẦN 3 • REFLEX EXPRESSIONS", subtitle)
    
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(11.733), Inches(5.4))
    card.fill.solid()
    card.fill.fore_color.rgb = COLOR_CARD_BG
    card.line.color.rgb = COLOR_CARD_BORDER
    card.line.width = Pt(1.5)
    
    tf = card.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = Inches(0.35)
    tf.margin_top = Inches(0.2)
    tf.margin_bottom = Inches(0.2)
    
    for i, phrase in enumerate(phrases_list):
        if i == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
            p.space_before = Pt(4)
            
        r_num = p.add_run()
        r_num.text = f"{phrase['num']}. "
        r_num.font.name = FONT_HEADING
        r_num.font.size = Pt(14)
        r_num.font.bold = True
        r_num.font.color.rgb = COLOR_AMBER_ACCENT
        
        r_en = p.add_run()
        r_en.text = f"{phrase['en']} "
        r_en.font.name = FONT_BODY
        r_en.font.size = Pt(14)
        r_en.font.bold = True
        r_en.font.color.rgb = COLOR_NAVY_DARK
        
        r_vi = p.add_run()
        r_vi.text = f"({phrase['vi']})"
        r_vi.font.name = FONT_BODY
        r_vi.font.size = Pt(14)
        r_vi.font.italic = True
        r_vi.font.color.rgb = COLOR_VI_SUBTITLE

# ==============================================================================
# 8. LOGISTICS SURVIVAL GUIDE SLIDE
# ==============================================================================
def add_logistics_survival_slide(prs):
    """Creates a slide detailing cut-off deadlines and emergency cargo saving phrases."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide, "LOGISTICS SURVIVAL: VESSEL CUT-OFF & CARGO", "PHẦN 4 • BÍ KÍP CỨU HÀNG", "Phân biệt 3 loại hạn chót (Cut-off) và mẫu câu cấp cứu container kẹt cảng")
    
    # Left Card: Cut-off definitions
    left_card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(5.7), Inches(5.3))
    left_card.fill.solid()
    left_card.fill.fore_color.rgb = COLOR_CARD_BG
    left_card.line.color.rgb = COLOR_CARD_BORDER
    left_card.line.width = Pt(1.5)
    
    tf_l = left_card.text_frame
    tf_l.word_wrap = True
    tf_l.margin_left = tf_l.margin_right = tf_l.margin_top = tf_l.margin_bottom = Inches(0.25)
    
    p0 = tf_l.paragraphs[0]
    r0 = p0.add_run()
    r0.text = "1. HIỂU VỀ CÁC MỐC \"CUT-OFF\" (HẠN CHÓT):"
    r0.font.name = FONT_HEADING
    r0.font.size = Pt(14)
    r0.font.bold = True
    r0.font.color.rgb = COLOR_NAVY_PRIMARY
    
    cutoffs = [
        ("• SI Cut-off (Shipping Instruction):", "Hạn chót gửi chi tiết vận đơn để hãng tàu làm Bill nháp."),
        ("• VGM Cut-off (Verified Gross Mass):", "Hạn chót khai báo phiếu cân container chuẩn quốc tế."),
        ("• Port Closing Time (Giờ cắt máng):", "Hạn chót hạ container vào bãi cảng. Quá giờ cont sẽ bị rớt tàu (rolled container)!")
    ]
    for term, exp in cutoffs:
        pt = tf_l.add_paragraph()
        pt.space_before = Pt(8)
        rt = pt.add_run()
        rt.text = f"{term}\n"
        rt.font.name = FONT_HEADING
        rt.font.size = Pt(14)
        rt.font.bold = True
        rt.font.color.rgb = COLOR_AMBER_ACCENT
        
        re = pt.add_run()
        re.text = f"  {exp}"
        re.font.name = FONT_BODY
        re.font.size = Pt(14)
        re.font.color.rgb = COLOR_NAVY_DARK

    # Right Card: Emergency Save Expressions
    right_card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.5), Inches(5.7), Inches(5.3))
    right_card.fill.solid()
    right_card.fill.fore_color.rgb = COLOR_WHITE
    right_card.line.color.rgb = COLOR_CARD_BORDER
    right_card.line.width = Pt(1.5)
    
    tf_r = right_card.text_frame
    tf_r.word_wrap = True
    tf_r.margin_left = tf_r.margin_right = tf_r.margin_top = tf_r.margin_bottom = Inches(0.25)
    
    p1 = tf_r.paragraphs[0]
    r1 = p1.add_run()
    r1.text = "2. MẪU CÂU CỨU CONTAINER NƯỚC RÚT:"
    r1.font.name = FONT_HEADING
    r1.font.size = Pt(14)
    r1.font.bold = True
    r1.font.color.rgb = COLOR_AMBER_ACCENT
    
    emergencies = [
        ("\"Could you please grant us a 2-hour cut-off extension?\"", "Hãng tàu có thể gia hạn giờ cắt máng thêm 2 tiếng cho bên em được không?"),
        ("\"The container has passed the port gate and is waiting to be stacked.\"", "Container đã qua cổng cảng rồi và đang xếp hàng chờ cẩu hạ bãi."),
        ("\"Please do not roll our container; the customer has an urgent L/C!\"", "Xin đừng đá rớt cont của bên em; khách hàng có hạn thư tín dụng L/C rất gấp!")
    ]
    for en, vi in emergencies:
        pe = tf_r.add_paragraph()
        pe.space_before = Pt(10)
        re = pe.add_run()
        re.text = f"• {en}\n"
        re.font.name = FONT_BODY
        re.font.size = Pt(14)
        re.font.bold = True
        re.font.color.rgb = COLOR_NAVY_DARK
        
        rv = pe.add_run()
        rv.text = f"  ↳ {vi}"
        rv.font.name = FONT_BODY
        rv.font.size = Pt(14)
        rv.font.italic = True
        rv.font.color.rgb = COLOR_VI_SUBTITLE

# ==============================================================================
# 9. WORKPLACE BANTER & NETWORKING MASTERY SLIDE
# ==============================================================================
def add_workplace_banter_slide(prs):
    """Creates a slide detailing conversational banter and practical networking skills."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide, "WORKPLACE BANTER & NETWORKING MASTERY", "PHẦN 4 • GIAO TIẾP DÂN DÃ", "Nghệ thuật tự châm biếm hài hước giải tỏa áp lực & networking quán lẩu bia bọt")
    
    left_card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(5.7), Inches(5.3))
    left_card.fill.solid()
    left_card.fill.fore_color.rgb = COLOR_CARD_BG
    left_card.line.color.rgb = COLOR_CARD_BORDER
    left_card.line.width = Pt(1.5)
    
    tf_l = left_card.text_frame
    tf_l.word_wrap = True
    tf_l.margin_left = tf_l.margin_right = tf_l.margin_top = tf_l.margin_bottom = Inches(0.25)
    
    p0 = tf_l.paragraphs[0]
    r0 = p0.add_run()
    r0.text = "1. NGHỆ THUẬT TỰ CHÂM BIẾM (HUMOR):"
    r0.font.name = FONT_HEADING
    r0.font.size = Pt(14)
    r0.font.bold = True
    r0.font.color.rgb = COLOR_NAVY_PRIMARY
    
    humor = [
        ("\"I'm just trying to survive until Friday!\"", "Tao chỉ đang cố sống sót đến thứ Sáu thôi!"),
        ("\"I need a coffee IV drip right now.\"", "Chắc tao phải truyền tĩnh mạch cà phê mới tỉnh nổi."),
        ("\"Still staring at Excel sheets of containers?\"", "Vẫn đang dán mắt vào bảng tính Excel cont à?"),
        ("\"Are you working hard or hardly working?\"", "Mày đang cày chăm chỉ hay lười chảy thây đấy?")
    ]
    for en, vi in humor:
        ph = tf_l.add_paragraph()
        ph.space_before = Pt(6)
        reh = ph.add_run()
        reh.text = f"• {en}\n"
        reh.font.name = FONT_BODY
        reh.font.size = Pt(14)
        reh.font.bold = True
        reh.font.color.rgb = COLOR_NAVY_DARK
        
        rvh = ph.add_run()
        rvh.text = f"  ↳ {vi}"
        rvh.font.name = FONT_BODY
        rvh.font.size = Pt(14)
        rvh.font.italic = True
        rvh.font.color.rgb = COLOR_VI_SUBTITLE

    right_card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.5), Inches(5.7), Inches(5.3))
    right_card.fill.solid()
    right_card.fill.fore_color.rgb = COLOR_WHITE
    right_card.line.color.rgb = COLOR_CARD_BORDER
    right_card.line.width = Pt(1.5)
    
    tf_r = right_card.text_frame
    tf_r.word_wrap = True
    tf_r.margin_left = tf_r.margin_right = tf_r.margin_top = tf_r.margin_bottom = Inches(0.25)
    
    p1 = tf_r.paragraphs[0]
    r1 = p1.add_run()
    r1.text = "2. NETWORKING DÂN DÃ NGÀNH LOGISTICS:"
    r1.font.name = FONT_HEADING
    r1.font.size = Pt(14)
    r1.font.bold = True
    r1.font.color.rgb = COLOR_AMBER_ACCENT
    
    net_tips = [
        ("Xây dựng tình bạn thật sự (Rapport):", "Networking hiệu quả nhất diễn ra ở bàn tiệc, quán lẩu bia bọt hoặc quán cà phê sáng gần cảng biển."),
        ("\"Let's grab some beer and hotpot after work on Friday!\"", "Tối thứ Sáu tan làm đi làm tí lẩu với bia bọt nhé!"),
        ("\"Drinks are on me next time!\"", "Cảm ơn mày đã cứu cont hàng kịp giờ. Lần tới tao bao chầu nước nhé!"),
        ("\"Are you free for a quick coffee break?\"", "Chiều nay rảnh ra làm ly cà phê chém gió tí không?")
    ]
    for head, body in net_tips:
        pn = tf_r.add_paragraph()
        pn.space_before = Pt(6)
        rnh = pn.add_run()
        rnh.text = f"• {head}\n"
        rnh.font.name = FONT_BODY
        rnh.font.size = Pt(14)
        rnh.font.bold = True
        rnh.font.color.rgb = COLOR_AMBER_ACCENT if "\"" not in head else COLOR_NAVY_DARK
        
        rnb = pn.add_run()
        rnb.text = f"  ↳ {body}"
        rnb.font.name = FONT_BODY
        rnb.font.size = Pt(14)
        rnb.font.italic = True
        rnb.font.color.rgb = COLOR_VI_SUBTITLE

# ==============================================================================
# 10. ACTION & ROLE-PLAY CHALLENGE SLIDE
# ==============================================================================
def add_action_challenge_slide(prs):
    """Creates the final wrap-up and practice challenge slide."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide, "ACTION & ROLE-PLAY CHALLENGE", "LỜI KẾT & BÀI TẬP", "Kêu gọi hành động và hướng dẫn thực hành thực chiến trên Web & Quizlet")
    
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
    
    p_quote = tf.paragraphs[0]
    r_q = p_quote.add_run()
    r_q.text = "\"Giao tiếp tiếng Anh công sở không phải là gồng mình học thuộc những bài diễn văn đạo mạo,\nmà là sự chân thành, tự nhiên, linh hoạt và biết pha chút hài hước để vượt qua mọi áp lực!\""
    r_q.font.name = FONT_BODY
    r_q.font.size = Pt(15)
    r_q.font.italic = True
    r_q.font.bold = True
    r_q.font.color.rgb = COLOR_NAVY_PRIMARY
    
    p_task_head = tf.add_paragraph()
    p_task_head.space_before = Pt(16)
    r_th = p_task_head.add_run()
    r_th.text = "🎯 THỰC HÀNH THỰC CHIẾN NGAY HÔM NAY:"
    r_th.font.name = FONT_HEADING
    r_th.font.size = Pt(15)
    r_th.font.bold = True
    r_th.font.color.rgb = COLOR_AMBER_ACCENT
    
    steps = [
        "1. Mở ứng dụng Web -> Chọn Topic \"💼 Work & Career\".",
        "2. Vào phòng \"Work & Career Free Talk (Không Giới Hạn)\" luyện đối đáp với Senior Logistics Lead AI.",
        "3. Thử thách phản xạ với 3 tình huống thực chiến:\n   • Than phiền về 2 container bị nghẽn cảng sắp trễ giờ cut-off lúc 5 giờ chiều.\n   • Chém gió về kế hoạch thăng chức, tăng lương và bí kíp đi nhậu networking với hãng tàu.\n   • Bàn luận về việc một đồng nghiệp lâu năm vừa nộp đơn xin thôi việc.",
        "4. Quét bộ Flashcard Quizlet 25 câu phản xạ trước buổi học tiếp theo để khắc sâu phản xạ cơ miệng!"
    ]
    for s in steps:
        ps = tf.add_paragraph()
        ps.space_before = Pt(6)
        rs = ps.add_run()
        rs.text = s
        rs.font.name = FONT_BODY
        rs.font.size = Pt(14)
        rs.font.color.rgb = COLOR_NAVY_DARK

# ==============================================================================
# MAIN BUILD PIPELINE
# ==============================================================================
def main():
    print("=== Generating Vivid Workplace.pptx (37 Slides) ===")
    prs = create_deck()
    
    # 1. Slide 1: Cover
    print("Building Slide 1: Cover...")
    add_cover_slide(prs)
    
    # 2. Slide 2: Agenda
    print("Building Slide 2: Agenda...")
    add_agenda_slide(prs)
    
    # 3. Slides 3-14: 12 Hero Card Vocabulary Slides
    print("Building Slides 3-14: 12 Hero Cards...")
    vocab_image_map = [
        # (vocab_item, image_filename, badge)
        (WORKPLACE_DATA["scenarios"][0]["vocabulary"][0], "vocab_freight_forwarding.png", "VẬN TẢI & GIAO NHẬN (1/12)"),
        (WORKPLACE_DATA["scenarios"][0]["vocabulary"][1], "vocab_cut_off_time.png", "HẠN CHÓT TÀU CHẠY (2/12)"),
        (WORKPLACE_DATA["scenarios"][1]["vocabulary"][0], "vocab_freelance.png", "LÀM VIỆC TỰ DO (3/12)"),
        (WORKPLACE_DATA["scenarios"][1]["vocabulary"][1], "vocab_remote_work.png", "LÀM VIỆC TỪ XA (4/12)"),
        (WORKPLACE_DATA["scenarios"][1]["vocabulary"][2], "vocab_colleague.png", "ĐỒNG NGHIỆP CÔNG TY (5/12)"),
        (WORKPLACE_DATA["scenarios"][2]["vocabulary"][0], "vocab_deadline.png", "ÁP LỰC DEADLINE (6/12)"),
        (WORKPLACE_DATA["scenarios"][2]["vocabulary"][1], "vocab_work_life_balance.png", "CÂN BẰNG CUỘC SỐNG (7/12)"),
        (WORKPLACE_DATA["scenarios"][3]["vocabulary"][0], "vocab_promotion.png", "THĂNG TIẾN NGHỀ NGHIỆP (8/12)"),
        (WORKPLACE_DATA["scenarios"][3]["vocabulary"][1], "vocab_salary.png", "LƯƠNG & ĐÃI NGỘ (9/12)"),
        (WORKPLACE_DATA["scenarios"][3]["vocabulary"][2], "vocab_networking.png", "KẾT NỐI QUAN HỆ (10/12)"),
        (WORKPLACE_DATA["scenarios"][4]["vocabulary"][0], "vocab_internship.png", "THỰC TẬP TÍCH LŨY (11/12)"),
        (WORKPLACE_DATA["scenarios"][4]["vocabulary"][1], "vocab_resign.png", "BƯỚC NGOẶT NGHỈ VIỆC (12/12)")
    ]
    for v_item, img_file, badge in vocab_image_map:
        add_hero_vocab_slide(prs, v_item, img_file, badge)
        
    # 4. Slides 15-30: 4 Conversational Scenarios
    print("Building Slides 15-30: 4 Scenarios (8 Scene Slides + 8 Full Script Slides)...")
    
    char_a = {"img": "char_office_man_a.png", "name": "Friend A / Colleague A"}
    char_b = {"img": "char_office_man_b.png", "name": "Friend B / Coordinator"}
    char_leaving = {"img": "char_colleague_leaving.png", "name": "Colleague A"}
    
    # --- Scenario 1: Job Setup (What Do You Do for a Living?) ---
    s1_data = WORKPLACE_DATA["scenarios"][1]
    s1_turns = s1_data["sampleDialogue"]
    
    # Scene 1: Turns 1-3
    s1_c1 = {
        "scenario_num": "1", "scene_num": 1, "total_scenes": 2,
        "title": "HỎI THĂM NGHỀ NGHIỆP: LOGISTICS VS FREELANCE",
        "situation": "Tình huống: Hai đứa bạn gặp nhau, A làm thiết kế tự do/remote, B làm điều phối logistics tại văn phòng."
    }
    add_character_scene_slide(prs, s1_c1, char_a, char_b, s1_turns[0:3])
    
    # Scene 2: Turns 4-6
    s1_c2 = {
        "scenario_num": "1", "scene_num": 2, "total_scenes": 2,
        "title": "VĂN PHÒNG NHỘN NHỊP & TINH THẦN ĐỒNG ĐỘI",
        "situation": "Tình huống: B giải thích đặc thù văn phòng bận rộn và cách cả team hỗ trợ nhau vượt qua stress."
    }
    add_character_scene_slide(prs, s1_c2, char_a, char_b, s1_turns[3:6])
    
    # Full Script Slides for Scenario 1
    add_full_script_slide(prs, "What Do You Do for a Living?", 1, s1_turns, is_vietnamese=False)
    add_full_script_slide(prs, "Nghề Nghiệp & Môi Trường Làm Việc", 1, s1_turns, is_vietnamese=True)

    # --- Scenario 2: Deadlines & Work-Life Balance ---
    s2_data = WORKPLACE_DATA["scenarios"][2]
    s2_turns = s2_data["sampleDialogue"]
    
    # Scene 1: Turns 1-3
    s2_c1 = {
        "scenario_num": "2", "scene_num": 1, "total_scenes": 2,
        "title": "MÙA CAO ĐIỂM & RƯỢT ĐUỔI GIỜ TÀU CẮT MÁNG",
        "situation": "Tình huống: Giờ nghỉ trưa hoặc tan ca, B chia sẻ việc 2 container bị nghẽn cảng trước giờ cut-off 5h chiều."
    }
    add_character_scene_slide(prs, s2_c1, char_a, char_b, s2_turns[0:3])
    
    # Scene 2: Turns 4-5
    s2_c2 = {
        "scenario_num": "2", "scene_num": 2, "total_scenes": 2,
        "title": "LỆCH MÚI GIỜ QUỐC TẾ & CÂN BẰNG CUỘC SỐNG",
        "situation": "Tình huống: Khó khăn khi đại lý nhắn tin nửa đêm và lời khuyên tắt thông báo nghỉ ngơi cuối tuần."
    }
    add_character_scene_slide(prs, s2_c2, char_a, char_b, s2_turns[3:5])
    
    # Full Script Slides for Scenario 2
    add_full_script_slide(prs, "Daily Challenges & Deadlines", 2, s2_turns, is_vietnamese=False)
    add_full_script_slide(prs, "Áp Lực Giờ Tàu & Cân Bằng Cuộc Sống", 2, s2_turns, is_vietnamese=True)

    # --- Scenario 3: Five-Year Vision & Promotion Banter ---
    s3_data = WORKPLACE_DATA["scenarios"][3]
    s3_turns = s3_data["sampleDialogue"]
    
    # Scene 1: Turns 1-3
    s3_c1 = {
        "scenario_num": "3", "scene_num": 1, "total_scenes": 2,
        "title": "CÀ KHỊA 5 NĂM: MONG CÒN SỐNG & TĂNG LƯƠNG CHỮA LÀNH",
        "situation": "Tình huống: Ngồi cà phê chém gió, A hỏi câu phỏng vấn mẫu mực, B trả lời vừa bựa vừa chân thật."
    }
    add_character_scene_slide(prs, s3_c1, char_a, char_b, s3_turns[0:3])
    
    # Scene 2: Turns 4-5
    s3_c2 = {
        "scenario_num": "3", "scene_num": 2, "total_scenes": 2,
        "title": "NETWORKING QUÁN LẨU BIA BỌT CỨU CONTAINER",
        "situation": "Tình huống: Tuyệt chiêu networking nhậu thứ Sáu với đại diện hãng tàu để không bị đá rớt cont."
    }
    add_character_scene_slide(prs, s3_c2, char_a, char_b, s3_turns[3:5])
    
    # Full Script Slides for Scenario 3
    add_full_script_slide(prs, "Five-Year Vision & Promotion", 3, s3_turns, is_vietnamese=False)
    add_full_script_slide(prs, "Mục Tiêu 5 Năm & Cà Khịa Thăng Tiến", 3, s3_turns, is_vietnamese=True)

    # --- Scenario 4: Resignation & Career Transition ---
    s4_data = WORKPLACE_DATA["scenarios"][4]
    s4_turns = s4_data["sampleDialogue"]
    
    # Scene 1: Turns 1-2
    s4_c1 = {
        "scenario_num": "4", "scene_num": 1, "total_scenes": 2,
        "title": "BƯỚC NGOẶT NGHỀ NGHIỆP: ANH MICHAEL NGHỈ VIỆC",
        "situation": "Tình huống: Giờ giải lao tại văn phòng, bàn luận về việc một đồng nghiệp lâu năm vừa nộp đơn thôi việc."
    }
    add_character_scene_slide(prs, s4_c1, char_leaving, char_b, s4_turns[0:2])
    
    # Scene 2: Turns 3-4
    s4_c2 = {
        "scenario_num": "4", "scene_num": 2, "total_scenes": 2,
        "title": "CƠ HỘI MỚI TẠI HÃNG TÀU & BỮA TIỆC CHIA TAY",
        "situation": "Tình huống: Nhảy sang hãng tàu lớn với đãi ngộ cao hơn và kế hoạch làm tiệc chia tay thứ Sáu."
    }
    add_character_scene_slide(prs, s4_c2, char_leaving, char_b, s4_turns[2:4])
    
    # Full Script Slides for Scenario 4
    add_full_script_slide(prs, "Taking the Leap & Resignation", 4, s4_turns, is_vietnamese=False)
    add_full_script_slide(prs, "Đồng Nghiệp Lâu Năm Xin Nghỉ Việc", 4, s4_turns, is_vietnamese=True)

    # 5. Slides 31-32: Starter Questions (2 slides, 4 questions)
    print("Building Slides 31-32: Starter Questions...")
    sq1_data = [
        {
            "num": "1",
            "question_en": "What do you do for a living?",
            "question_vi": "Mày đang làm nghề ngỗng gì thế?",
            "answer_en": "I'm a logistics coordinator at an international freight forwarding company. I handle import-export documentation, coordinate with carriers, and make sure containers clear customs without delays.",
            "answer_vi": "Tao làm điều phối viên logistics ở công ty giao nhận vận tải quốc tế. Công việc chính là xử lý bộ chứng từ xuất nhập khẩu, làm việc với hãng tàu và đảm bảo cont thông quan đúng tiến độ."
        },
        {
            "num": "2",
            "question_en": "What's the most challenging part of your job?",
            "question_vi": "Phần khó khăn nhất trong công việc của mày là gì?",
            "answer_en": "Definitely racing against strict shipping cut-off deadlines and managing unexpected customs delays. Because of international time differences, foreign partners often email at night.",
            "answer_vi": "Khó nhất chắc chắn là rượt đuổi với deadline giờ cắt máng và xử lý sự cố kẹt ở hải quan. Đã thế vì lệch múi giờ quốc tế nên đại lý nước ngoài toàn nhắn tin ban đêm."
        }
    ]
    add_starter_questions_slide(prs, sq1_data, 1)

    sq2_data = [
        {
            "num": "3",
            "question_en": "Where do you see yourself professionally in five years?",
            "question_vi": "5 năm nữa mày thấy mày ở đâu rồi?",
            "answer_en": "Hopefully not losing my mind over delayed shipments! In five years, I want a promotion with a better salary, and solid networking connections so my containers never get rolled again.",
            "answer_vi": "Hy vọng lúc đấy chưa phát điên vì hàng chậm trễ! 5 năm nữa tao chỉ mong được thăng chức với mức lương ngon hơn, và có mạng lưới quan hệ đủ thân thiết để hàng không bị đá rớt cont."
        },
        {
            "num": "4",
            "question_en": "Would you rather work from home or in an office?",
            "question_vi": "Mày thích làm ở nhà hay lên văn phòng hơn?",
            "answer_en": "I definitely prefer working in an office. In logistics, things happen fast and shipments can get delayed at any moment. Being right next to my colleagues makes solving cargo problems so much easier.",
            "answer_vi": "Tao chắc chắn chọn làm ở văn phòng. Trong ngành logistics, mọi việc diễn ra cực nhanh. Ngồi ngay cạnh anh em đồng nghiệp giúp tao bàn bạc và xử lý sự cố cont tại chỗ nhanh hơn rất nhiều."
        }
    ]
    add_starter_questions_slide(prs, sq2_data, 2)

    # 6. Slides 33-34: 25 Reflex Phrases (2 slides)
    print("Building Slides 33-34: 25 Reflex Phrases...")
    phrases_part1 = [
        {"num": "1", "en": "What do you do for a living?", "vi": "Mày đang làm công việc gì thế?"},
        {"num": "2", "en": "I work in the logistics and supply chain sector.", "vi": "Tao làm trong mảng logistics và chuỗi cung ứng."},
        {"num": "3", "en": "I'm a logistics coordinator for a freight forwarder.", "vi": "Tao là điều phối viên logistics cho công ty giao nhận."},
        {"num": "4", "en": "Does your company allow remote work?", "vi": "Công ty mày có cho làm việc từ xa không?"},
        {"num": "5", "en": "We work 100% on-site at the office.", "vi": "Bên tao làm việc 100% trực tiếp tại văn phòng."},
        {"num": "6", "en": "I prefer working in the office with my colleagues.", "vi": "Tao thích làm việc tại văn phòng cùng đồng nghiệp hơn."},
        {"num": "7", "en": "We need to handle original shipping papers on the spot.", "vi": "Bọn tao phải xử lý giấy tờ chứng từ gốc ngay tại chỗ."},
        {"num": "8", "en": "We are racing against a tight vessel cut-off deadline.", "vi": "Bọn tao đang phải chạy đua với giờ cắt máng của tàu rất gấp."},
        {"num": "9", "en": "Two export containers got held up at customs.", "vi": "Hai container hàng xuất khẩu đang bị nghẽn ở hải quan."},
        {"num": "10", "en": "The shipping line moved up the cut-off time to 5 PM.", "vi": "Hãng tàu đẩy giờ cắt máng lên sớm lúc 5 giờ chiều."},
        {"num": "11", "en": "What's the most challenging part of your daily routine?", "vi": "Phần khó nhằn nhất trong ngày làm việc của mày là gì?"},
        {"num": "12", "en": "It's really hard to maintain a healthy work-life balance.", "vi": "Muốn giữ cân bằng giữa công việc và đời sống riêng khó lắm."},
        {"num": "13", "en": "Foreign partners keep calling me at midnight.", "vi": "Đối tác nước ngoài toàn gọi cho tao lúc nửa đêm."}
    ]
    add_reflex_phrases_slide(prs, phrases_part1, 1, "Phần 1: Nghề nghiệp, Môi trường làm việc & Áp lực Deadline")

    phrases_part2 = [
        {"num": "14", "en": "Don't let yourself burn out during peak season.", "vi": "Đừng để bị kiệt sức trong mùa cao điểm này nhé."},
        {"num": "15", "en": "Where do you see yourself professionally in five years?", "vi": "5 năm nữa mày thấy mày sẽ ở vị trí nào?"},
        {"num": "16", "en": "I'm aiming for a promotion to Logistics Team Leader.", "vi": "Tao đang nhắm tới việc được thăng chức lên Trưởng nhóm."},
        {"num": "17", "en": "I hope to earn a more competitive salary next year.", "vi": "Tao mong sang năm sẽ kiếm được mức lương cạnh tranh hơn."},
        {"num": "18", "en": "Hard work should be rewarded with a decent salary raise.", "vi": "Làm việc chăm chỉ thì phải được đền đáp bằng mức tăng lương xứng đáng."},
        {"num": "19", "en": "We should do more industry networking to build connections.", "vi": "Tụi mình nên tích cực đi kết nối quan hệ trong ngành nhiều hơn."},
        {"num": "20", "en": "Building good rapport with carrier reps saves your containers.", "vi": "Tạo quan hệ tốt với đại diện hãng tàu sẽ cứu được cont của mày đấy."},
        {"num": "21", "en": "He started at our company as an intern five years ago.", "vi": "Ổng bắt đầu ở công ty tao từ hồi còn là thực tập sinh 5 năm trước."},
        {"num": "22", "en": "Did you hear that he decided to resign yesterday?", "vi": "Mày nghe tin ổng quyết định nộp đơn xin thôi việc hôm qua chưa?"},
        {"num": "23", "en": "She received a great offer from an international shipping line.", "vi": "Bả nhận được lời mời hấp dẫn từ một hãng tàu quốc tế."},
        {"num": "24", "en": "It takes courage to resign and step out of your comfort zone.", "vi": "Cần nhiều can đảm để nộp đơn nghỉ việc và bước ra khỏi vùng an toàn."},
        {"num": "25", "en": "Let's organize a warm farewell dinner for him this weekend!", "vi": "Tụi mình cùng tổ chức một bữa tiệc chia tay thật ấm cúng cho ổng cuối tuần này nhé!"}
    ]
    add_reflex_phrases_slide(prs, phrases_part2, 2, "Phần 2: Mục tiêu thăng tiến, Lương bổng, Networking & Nghỉ việc")

    # 7. Slide 35: Logistics Survival Guide
    print("Building Slide 35: Logistics Survival...")
    add_logistics_survival_slide(prs)

    # 8. Slide 36: Workplace Banter & Networking Mastery
    print("Building Slide 36: Banter & Networking...")
    add_workplace_banter_slide(prs)

    # 9. Slide 37: Action & Role-play Challenge
    print("Building Slide 37: Action Challenge...")
    add_action_challenge_slide(prs)

    # Save Presentation (with defensive file lock handling)
    try:
        prs.save(OUTPUT_PATH)
        print(f"=== Successfully saved {len(prs.slides)} slides to {OUTPUT_PATH} ===")
    except PermissionError:
        prs.save(FALLBACK_PATH)
        print(f"NOTE: {OUTPUT_PATH} is currently open in PowerPoint. Saved {len(prs.slides)} slides to {FALLBACK_PATH}")

if __name__ == "__main__":
    main()
