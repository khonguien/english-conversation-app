# -*- coding: utf-8 -*-
"""
generate_speaking_tests_docx.py
Tạo file Word (.docx) chứa 3 bộ đề kiểm tra nói theo đúng format đề thi
Học sinh Giỏi Quốc Gia môn Tiếng Anh từ Screenshot_23-10-2026_184555_tailieudieuky.com.jpeg.
"""

import os
import sys
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding='utf-8')

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))
OUTPUT_DOCX = os.path.join(PROJECT_DIR, "materials", "documents", "speaking_tests_airport_restaurant_cafe.docx")

# Dữ liệu 3 bộ đề thi (100% tiếng Anh theo đúng lựa chọn Cách 2A)
TEST_SETS = [
    {
        "set_num": 1,
        "title": "Đề số 1",
        "questions": [
            "In an international flight arrival, you have just landed at the airport and are standing before the Immigration Officer. The officer takes your passport and asks about the purpose of your visit and your intended length of stay. What will you say to clear immigration smoothly, and what supporting documents will you provide?",
            "After dropping off your luggage, you walk into a busy local coffee shop to refresh yourself. You want to order a large iced coffee with milk, customize it with less ice and half sugar, and ask the barista for the Wi-Fi password. How will you carry out this conversation with the barista at the counter?",
            "It is 7:00 PM and you walk into a popular downtown restaurant with a friend without a prior reservation. The host greets you at the entrance. You want to ask for a table for two in a quiet area, browse the dinner menu, and ask the waiter to recommend the chef's special dish. How will you initiate and conduct this interaction?"
        ]
    },
    {
        "set_num": 2,
        "title": "Đề số 2",
        "questions": [
            "You are at a modern beverage shop with your colleague. You want to order two specialty drinks with extra boba and cheese foam, pay via bank transfer by scanning a QR code at the counter, and check if there are seats available upstairs. How will you communicate your requests to the staff?",
            "You are waiting at the baggage claim carousel, but after all suitcases have cleared, your luggage has not appeared. You approach the Baggage Service / Lost & Found desk to report your missing luggage. How will you explain the situation, describe your suitcase, and inquire about the tracing and delivery procedures?",
            "You are having dinner at a steakhouse. When your dish is served, the steak is well-done instead of medium-rare as ordered, and the soup is excessively salty. How will you politely call the server over, explain the issues without sounding aggressive, and request to have the dish remade?"
        ]
    },
    {
        "set_num": 3,
        "title": "Đề số 3",
        "questions": [
            "You have just finished an enjoyable dinner with a client. You signal the waiter for the bill. You want to check if the 10% service charge is already included, ask if you can split the payment equally between cash and a credit card, and compliment the chef on the meal. How will you conduct this interaction?",
            "It is the day of your departure and you are at the airline check-in counter at the airport. You present your passport, check in two bags, request a window seat, and ask the agent about the boarding time and departure gate. How will you handle this check-in dialogue?",
            "You are sitting in a cafe near your hotel waiting for your airport cab. The air conditioner directly above your table is blowing cold air onto you, and you also have some leftover pastry on your plate. How will you approach the staff to ask them to adjust the temperature and pack your pastry to go?"
        ]
    }
]

def remove_table_borders(table):
    """Xóa toàn bộ viền của bảng để tạo layout 2 cột tiêu đề như đề thi thật."""
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>\n'
        f'  <w:top w:val="none"/>\n'
        f'  <w:left w:val="none"/>\n'
        f'  <w:bottom w:val="none"/>\n'
        f'  <w:right w:val="none"/>\n'
        f'  <w:insideH w:val="none"/>\n'
        f'  <w:insideV w:val="none"/>\n'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def set_run_font(run, font_name="Arial", size_pt=11, bold=False, italic=False):
    run.font.name = font_name
    run.font.size = Pt(size_pt)
    run.bold = bold
    run.italic = italic
    run.font.color.rgb = RGBColor(0, 0, 0)
    # Ensure Word treats East Asian / Complex scripts correctly with the font
    rPr = run._r.get_or_add_rPr()
    rFonts = parse_xml(f'<w:rFonts {nsdecls("w")} w:ascii="{font_name}" w:hAnsi="{font_name}" w:cs="{font_name}"/>')
    rPr.append(rFonts)

def add_header_table(doc, set_title):
    """Tạo bảng 2 cột tiêu đề giống hệt mẫu đề thi quốc gia."""
    table = doc.add_table(rows=1, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    remove_table_borders(table)

    col_left = table.columns[0]
    col_right = table.columns[1]
    col_left.width = Inches(3.0)
    col_right.width = Inches(3.8)

    cell_left = table.cell(0, 0)
    cell_right = table.cell(0, 1)

    # Cột trái
    p_left1 = cell_left.paragraphs[0]
    p_left1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_left1.paragraph_format.space_before = Pt(0)
    p_left1.paragraph_format.space_after = Pt(2)
    p_left1.paragraph_format.line_spacing = 1.15
    r = p_left1.add_run("ENGLISH IN CONVERSATION")
    set_run_font(r, "Arial", 11.5, bold=True)

    p_left2 = cell_left.add_paragraph()
    p_left2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_left2.paragraph_format.space_before = Pt(2)
    p_left2.paragraph_format.space_after = Pt(0)
    p_left2.paragraph_format.line_spacing = 1.15
    r = p_left2.add_run("ĐỀ THI CHÍNH THỨC")
    set_run_font(r, "Arial", 11.5, bold=True)

    # Cột phải
    p_right1 = cell_right.paragraphs[0]
    p_right1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_right1.paragraph_format.space_before = Pt(0)
    p_right1.paragraph_format.space_after = Pt(2)
    p_right1.paragraph_format.line_spacing = 1.15
    r = p_right1.add_run("KỲ KIỂM TRA NĂNG LỰC NÓI THỰC CHIẾN")
    set_run_font(r, "Arial", 11.5, bold=True)

    p_right2 = cell_right.add_paragraph()
    p_right2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_right2.paragraph_format.space_before = Pt(0)
    p_right2.paragraph_format.space_after = Pt(2)
    p_right2.paragraph_format.line_spacing = 1.15
    r = p_right2.add_run("CHỦ ĐỀ: AIRPORT – CAFE – RESTAURANT")
    set_run_font(r, "Arial", 10.5, bold=True)

    p_right3 = cell_right.add_paragraph()
    p_right3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_right3.paragraph_format.space_before = Pt(0)
    p_right3.paragraph_format.space_after = Pt(0)
    p_right3.paragraph_format.line_spacing = 1.15
    r = p_right3.add_run("NĂM HỌC 2026")
    set_run_font(r, "Arial", 11, bold=True)

    # Dòng môn thi & ngày thi ở giữa
    p_sub1 = doc.add_paragraph()
    p_sub1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub1.paragraph_format.space_before = Pt(14)
    p_sub1.paragraph_format.space_after = Pt(2)
    r = p_sub1.add_run(f"Môn thi: Tiếng Anh (Đề thi Nói – {set_title})")
    set_run_font(r, "Arial", 11, bold=True)

    p_sub2 = doc.add_paragraph()
    p_sub2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub2.paragraph_format.space_before = Pt(0)
    p_sub2.paragraph_format.space_after = Pt(20)
    r = p_sub2.add_run("Thời gian làm bài: 15 phút (không kể thời gian chuẩn bị)")
    set_run_font(r, "Arial", 11, bold=True)

def build_document():
    doc = docx.Document()

    # Thiết lập lề chuẩn trang A4
    for section in doc.sections:
        section.page_width = Inches(8.27)   # A4
        section.page_height = Inches(11.69) # A4
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.9)
        section.right_margin = Inches(0.9)

    total_sets = len(TEST_SETS)
    for idx, test_data in enumerate(TEST_SETS):
        # 1. Header 2 cột
        add_header_table(doc, test_data["title"])

        # 2. Danh sách câu hỏi
        for q_idx, q_text in enumerate(test_data["questions"], 1):
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            p.paragraph_format.space_before = Pt(10)
            p.paragraph_format.space_after = Pt(14)
            p.paragraph_format.line_spacing = 1.25

            r_label = p.add_run(f"Question {q_idx}. ")
            set_run_font(r_label, "Arial", 11.5, bold=True)

            r_text = p.add_run(q_text)
            set_run_font(r_text, "Arial", 11.5, bold=False)

        # 3. Footer THE END
        p_end = doc.add_paragraph()
        p_end.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_end.paragraph_format.space_before = Pt(36)
        p_end.paragraph_format.space_after = Pt(0)
        r_end = p_end.add_run("--------- THE END ---------")
        set_run_font(r_end, "Arial", 11, bold=True)

        # Nếu chưa phải đề cuối thì ngắt trang
        if idx < total_sets - 1:
            doc.add_page_break()

    doc.save(OUTPUT_DOCX)
    print(f"SUCCESS: Generated {OUTPUT_DOCX} with {total_sets} exam sets.")

if __name__ == "__main__":
    build_document()
