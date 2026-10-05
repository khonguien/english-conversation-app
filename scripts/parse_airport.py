import re
import json
import os

def parse_airport_md(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    topic = {
        "id": "airport",
        "titleEn": "At the Airport",
        "titleVi": "Tại Sân Bay",
        "icon": "✈️",
        "description": "Luyện giao tiếp tiếng Anh sân bay thực tế qua 12 tình huống từ Ga đi, Trên máy bay đến Ga đến.",
        "scenarios": []
    }

    # Split into sections
    # Match ## 2.x
    # Or match ### Hội thoại X
    conv_blocks = re.split(r'###\s+Hội thoại\s+(\d+):\s*([^\n]+)', content)
    
    # conv_blocks[0] is preamble
    # Then trios: (conv_num, title, body)
    
    current_section = "Ga đi (Departure)"
    
    for i in range(1, len(conv_blocks), 3):
        conv_num = int(conv_blocks[i])
        title_raw = conv_blocks[i+1].strip()
        body = conv_blocks[i+2]
        
        # Determine section
        if conv_num in [1, 2, 3, 4]:
            section = "🛫 Ga đi (Departure)"
        elif conv_num in [5, 6, 7]:
            section = "☁️ Trên máy bay (On the Plane)"
        else:
            section = "🛬 Ga đến (Arrival)"
            
        # Parse titles
        if '/' in title_raw:
            parts = title_raw.split('/', 1)
            title_en = parts[0].strip()
            title_vi = parts[1].strip()
        else:
            title_en = title_raw
            title_vi = title_raw

        # Extract Situation
        situation_match = re.search(r'Tình huống:\s*([^\n]+)', body)
        situation = situation_match.group(1).strip() if situation_match else ""

        # Extract Vocabulary
        vocab_list = []
        vocab_section_match = re.search(r'#### 📚 TỪ VỰNG MỚI[^\n]*\n([\s\S]*?)#### 💬 NỘI DUNG HỘI THOẠI:', body)
        if vocab_section_match:
            vocab_text = vocab_section_match.group(1)
            # Find each numbered vocab item: "1. word (pos) | /ipa/ | meaning"
            items = re.findall(r'(\d+)\.\s+([^(|]+?)(?:\s*\(([^)]+)\))?\s*\|\s*([^|]+)\|\s*([^\n]+)', vocab_text)
            
            # Split by numbered items to get details (synonyms, collocations, examples)
            item_blocks = re.split(r'\n\s*\d+\.\s+', '\n' + vocab_text)
            
            for idx, item in enumerate(items):
                word = item[1].strip()
                pos = item[2].strip() if item[2] else ""
                ipa = item[3].strip()
                meaning = item[4].strip()
                
                block = item_blocks[idx+1] if idx+1 < len(item_blocks) else ""
                
                # Synonyms
                synonyms = []
                syn_match = re.search(r'Synonyms[^:]*:\s*([^\n]+)', block)
                if syn_match:
                    syn_raw = syn_match.group(1)
                    synonyms = [s.strip() for s in re.split(r'[,;]', syn_raw) if s.strip()]

                # Antonyms
                antonyms = []
                ant_match = re.search(r'Antonyms[^:]*:\s*([^\n]+)', block)
                if ant_match:
                    ant_raw = ant_match.group(1)
                    antonyms = [a.strip() for a in re.split(r'[,;]', ant_raw) if a.strip()]

                # Collocations
                collocations = []
                colloc_matches = re.findall(r'\+\s*([^\n]+)', block)
                for col in colloc_matches:
                    collocations.append(col.strip())

                # Example
                example_en = ""
                example_vi = ""
                ex_match = re.search(r'Ví dụ:\s*([^\n]+)(?:\n\s*->\s*Dịch:\s*([^\n]+))?', block)
                if ex_match:
                    example_en = ex_match.group(1).strip()
                    example_vi = ex_match.group(2).strip() if ex_match.group(2) else ""

                vocab_list.append({
                    "id": f"vocab-{conv_num}-{idx+1}",
                    "word": word,
                    "partOfSpeech": pos,
                    "ipa": ipa,
                    "meaningVi": meaning,
                    "synonyms": synonyms,
                    "antonyms": antonyms,
                    "collocations": collocations,
                    "exampleEn": example_en,
                    "exampleVi": example_vi
                })

        # Extract Dialogue
        en_dialogue_match = re.search(r'🇬🇧 Tiếng Anh:\s*\n([\s\S]*?)(?:🇻🇳 Tiếng Việt:|$)', body)
        vi_dialogue_match = re.search(r'🇻🇳 Tiếng Việt:\s*\n([\s\S]*?)(?:---|###|$)', body)

        en_lines = []
        if en_dialogue_match:
            for line in en_dialogue_match.group(1).strip().split('\n'):
                line = line.strip()
                if not line or line.startswith('📦') or line.startswith('🔔') or line.startswith('🟢') or line.startswith('🍽️'):
                    continue
                # Line format: emoji **Role:** text
                role_match = re.match(r'^(?:[^\w\s*]+)?\s*\*\*([^*]+):\*\*\s*(.*)$', line)
                if role_match:
                    role = role_match.group(1).strip()
                    text = role_match.group(2).strip()
                    en_lines.append((role, text))

        vi_lines = []
        if vi_dialogue_match:
            for line in vi_dialogue_match.group(1).strip().split('\n'):
                line = line.strip()
                if not line or line.startswith('📦') or line.startswith('🔔') or line.startswith('🟢') or line.startswith('🍽️'):
                    continue
                role_match = re.match(r'^(?:[^\w\s*]+)?\s*\*\*([^*]+):\*\*\s*(.*)$', line)
                if role_match:
                    role = role_match.group(1).strip()
                    text = role_match.group(2).strip()
                    vi_lines.append((role, text))

        sample_dialogue = []
        for idx in range(len(en_lines)):
            role_en, text_en = en_lines[idx]
            text_vi = vi_lines[idx][1] if idx < len(vi_lines) else ""
            
            # Determine speaker: AI or User (Default: Staff/Officer/Attendant is AI, Passenger is User)
            speaker = "user" if "Passenger" in role_en or "Hành khách" in role_en else "ai"
            sample_dialogue.append({
                "speaker": speaker,
                "roleName": role_en,
                "textEn": text_en,
                "textVi": text_vi
            })

        # Identify default roles
        # If AI is first, AI opens. If User is first, User opens or AI welcomes.
        first_turn = sample_dialogue[0] if sample_dialogue else None
        
        # Deduce roles
        ai_role_name = "Staff"
        user_role_name = "Passenger"
        ai_avatar = "🛎️"
        user_avatar = "👤"
        
        for turn in sample_dialogue:
            if turn["speaker"] == "ai":
                ai_role_name = turn["roleName"]
                if "Attendant" in ai_role_name or "Steward" in ai_role_name:
                    ai_avatar = "✈️"
                elif "Officer" in ai_role_name or "Security" in ai_role_name or "Customs" in ai_role_name or "Immigration" in ai_role_name:
                    ai_avatar = "👮"
                else:
                    ai_avatar = "🛎️"
                break

        # Initial message (usually first AI message or scenario greeting)
        initial_msg_en = ""
        initial_msg_vi = ""
        for turn in sample_dialogue:
            if turn["speaker"] == "ai":
                initial_msg_en = turn["textEn"]
                initial_msg_vi = turn["textVi"]
                break

        # Suggested hints for user
        user_hints = [turn["textEn"] for turn in sample_dialogue if turn["speaker"] == "user"]

        scenario = {
            "id": f"airport-scenario-{conv_num}",
            "order": conv_num,
            "section": section,
            "titleEn": title_en,
            "titleVi": title_vi,
            "situation": situation,
            "defaultRoles": {
                "ai": {
                    "id": "ai",
                    "name": ai_role_name,
                    "titleEn": ai_role_name,
                    "titleVi": "Nhân viên / Cán bộ",
                    "avatar": ai_avatar
                },
                "user": {
                    "id": "user",
                    "name": user_role_name,
                    "titleEn": user_role_name,
                    "titleVi": "Hành khách (Bạn)",
                    "avatar": user_avatar
                }
            },
            "initialMessageEn": initial_msg_en,
            "initialMessageVi": initial_msg_vi,
            "vocabulary": vocab_list,
            "sampleDialogue": sample_dialogue,
            "suggestedHints": user_hints
        }
        topic["scenarios"].append(scenario)

    return topic

if __name__ == "__main__":
    os.makedirs("src/data/topics", exist_ok=True)
    airport_data = parse_airport_md("airport.md")
    out_file = "src/data/topics/airport.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(airport_data, f, ensure_ascii=False, indent=2)
    print(f"Successfully generated {out_file} with {len(airport_data['scenarios'])} scenarios!")
