#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generate_flashcards.py
Tự động trích xuất toàn bộ các đoạn hội thoại (Sample Dialogues) từ scripts/data_<topic>.py
và xuất thành file flashcard chuẩn để import vào Quizlet (1 mặt tiếng Việt, 1 mặt tiếng Anh).

Định dạng Quizlet:
[Vai VI] Nội dung tiếng Việt [TAB] [Vai EN] Nội dung tiếng Anh
"""

import os
import sys
import argparse
import importlib

# Thiết lập UTF-8 cho console Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# Mapping tên vai sang tiếng Việt ngắn gọn cho Quizlet
ROLE_VI_MAP = {
    "barista": "Nhân viên",
    "waiter": "Nhân viên",
    "waitress": "Nhân viên",
    "server": "Nhân viên",
    "staff": "Nhân viên",
    "receptionist": "Lễ tân",
    "officer": "An ninh",
    "agent": "Nhân viên quầy",
    "driver": "Tài xế",
    "cashier": "Thu ngân",
    "colleague": "Đồng nghiệp",
    "manager": "Quản lý",
    "customer": "Khách",
    "guest": "Khách",
    "passenger": "Hành khách",
    "traveler": "Khách",
    "shopper": "Khách",
    "learner": "Bạn",
    "remote worker": "Khách",
}

def get_role_vi(role_en: str, speaker: str) -> str:
    role_key = role_en.strip().lower()
    if role_key in ROLE_VI_MAP:
        return ROLE_VI_MAP[role_key]
    if speaker == "ai":
        return "Nhân viên"
    return "Khách"

def generate_topic_flashcards(topic_id: str, script_dir: str, base_dir: str):
    module_name = f"data_{topic_id}"
    sys.path.insert(0, script_dir)
    
    try:
        mod = importlib.import_module(module_name)
    except ModuleNotFoundError:
        print(f"[!] Khong tim thay module {module_name} trong {script_dir}")
        return False
        
    # Tìm biến dữ liệu chủ đề: e.g. CAFE_DATA, HOTEL_DATA, hoặc TOPIC_DATA
    var_name = f"{topic_id.upper()}_DATA"
    topic_data = getattr(mod, var_name, getattr(mod, "TOPIC_DATA", None))
    
    if not topic_data:
        print(f"[!] Module {module_name} khong co bien {var_name} hoac TOPIC_DATA.")
        return False
        
    title_en = topic_data.get("titleEn", topic_id)
    topic_folder_name = topic_id.capitalize()
    
    folder_mapping = {
        "cafe": "Cafe",
        "airport": "Airport",
        "hotel": "Hotel",
        "restaurant": "Restaurant",
        "shopping": "Shopping",
        "socializing": "Socializing",
        "transportation": "Transportation",
        "workplace": "Workplace"
    }
    folder_name = folder_mapping.get(topic_id.lower(), topic_folder_name)
    
    output_dir = os.path.join(base_dir, "materials", "documents", folder_name)
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, f"{topic_id}_dialogues_flashcards_quizlet.txt")
    
    cards = []
    scenarios = topic_data.get("scenarios", [])
    
    for s_idx, scenario in enumerate(scenarios, 1):
        dialogues = scenario.get("sampleDialogue", [])
        if not dialogues:
            continue
            
        for d_idx, turn in enumerate(dialogues, 1):
            speaker = turn.get("speaker", "ai")
            role_en = turn.get("roleName", "Staff" if speaker == "ai" else "Customer")
            role_vi = get_role_vi(role_en, speaker)
            
            text_en = turn.get("textEn", "").strip()
            text_vi = turn.get("textVi", "").strip()
            
            if not text_en or not text_vi:
                continue
                
            text_en_clean = " ".join(text_en.split())
            text_vi_clean = " ".join(text_vi.split())
            
            term = f"[{role_vi}] {text_vi_clean}"
            definition = f"[{role_en}] {text_en_clean}"
            
            cards.append(f"{term}\t{definition}")
            
    if not cards:
        print(f"[WARN] Chu de {topic_id} khong co cau thoai mau nao.")
        return False
        
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("\n".join(cards) + "\n")
        
    print(f"[OK] Da tao thanh cong {len(cards)} the Flashcard Quizlet cho [{title_en}]:")
    print(f"     File: {output_file}")
    return True

def main():
    parser = argparse.ArgumentParser(description="Tao file Flashcard Quizlet tu hoi thoai chu de.")
    parser.add_argument("--topic", type=str, default="cafe", help="Ma chu de (vd: cafe, hotel) hoac 'all'")
    args = parser.parse_args()
    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.abspath(os.path.join(current_dir, ".."))
    
    all_topics = ["cafe", "hotel", "transportation", "shopping", "socializing", "workplace"]
    
    if args.topic.lower() == "all":
        for t in all_topics:
            generate_topic_flashcards(t, current_dir, base_dir)
    else:
        generate_topic_flashcards(args.topic.lower(), current_dir, base_dir)

if __name__ == "__main__":
    main()
