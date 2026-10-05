import re
import json
import os

def parse_restaurant_md(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    topic = {
        "id": "restaurant",
        "titleEn": "At the Restaurant",
        "titleVi": "Tại Nhà Hàng",
        "icon": "🍽️",
        "description": "Luyện giao tiếp tiếng Anh khi đi ăn nhà hàng: đặt bàn, gọi món, yêu cầu đặc biệt và thanh toán.",
        "scenarios": []
    }

    sections = re.split(r'##\s+Phần\s+(\d+):\s*([^\n]+)', content)
    
    for i in range(1, len(sections), 3):
        part_num = int(sections[i])
        title_raw = sections[i+1].strip()
        body = sections[i+2]
        
        # Split En / Vi in title: "Đón Customer, Đặt bàn & Chọn chỗ ngồi (Arrival, Reservation & Seating)"
        title_vi = title_raw
        title_en = title_raw
        paren_match = re.search(r'\(([^)]+)\)', title_raw)
        if paren_match:
            title_en = paren_match.group(1).strip()
            title_vi = re.sub(r'\s*\([^)]+\)', '', title_raw).strip()

        sample_dialogue = []
        user_hints = []
        initial_msg_en = ""
        
        lines = body.strip().split('\n')
        for line in lines:
            line = line.strip()
            if not line or line.startswith('*(') or line.startswith('---'):
                continue
            
            role_match = re.match(r'^(?:[^\w\s*]+)?\s*\*\*([^*]+):\*\*\s*["\']?(.*?)["\']?$', line)
            if role_match:
                role = role_match.group(1).strip()
                text = role_match.group(2).strip().strip('"')
                speaker = "user" if "Customer" in role or "Khách" in role else "ai"
                
                sample_dialogue.append({
                    "speaker": speaker,
                    "roleName": role,
                    "textEn": text,
                    "textVi": "" # Short dialogues didn't have full vi translations line by line
                })
                
                if speaker == "ai" and not initial_msg_en:
                    initial_msg_en = text
                elif speaker == "user":
                    user_hints.append(text)

        scenario = {
            "id": f"restaurant-scenario-{part_num}",
            "order": part_num,
            "section": "🍽️ Restaurant Dialogues",
            "titleEn": title_en,
            "titleVi": title_vi,
            "situation": f"Tình huống tại nhà hàng: {title_vi}",
            "defaultRoles": {
                "ai": {
                    "id": "ai",
                    "name": "Waiter",
                    "titleEn": "Waiter",
                    "titleVi": "Bồi bàn / Nhân viên",
                    "avatar": "🛎️"
                },
                "user": {
                    "id": "user",
                    "name": "Customer",
                    "titleEn": "Customer",
                    "titleVi": "Khách hàng (Bạn)",
                    "avatar": "👤"
                }
            },
            "initialMessageEn": initial_msg_en or "Welcome! How may I help you today?",
            "initialMessageVi": "Chào mừng quý khách! Tôi có thể giúp gì cho bạn hôm nay?",
            "vocabulary": [
                {
                    "id": f"res-vocab-{part_num}-1",
                    "word": "reservation",
                    "partOfSpeech": "n",
                    "ipa": "/ˌrezərˈveɪʃn/",
                    "meaningVi": "sự đặt bàn / phòng trước",
                    "synonyms": ["booking"],
                    "antonyms": [],
                    "collocations": ["make a reservation", "have a reservation"],
                    "exampleEn": "Do you have a reservation with us?",
                    "exampleVi": "Quý khách có đặt bàn trước với chúng tôi không?"
                }
            ],
            "sampleDialogue": sample_dialogue,
            "suggestedHints": user_hints
        }
        topic["scenarios"].append(scenario)

    return topic

if __name__ == "__main__":
    os.makedirs("src/data/topics", exist_ok=True)
    res_data = parse_restaurant_md("restaurant_short_dialogues.md")
    out_file = "src/data/topics/restaurant.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(res_data, f, ensure_ascii=False, indent=2)
    print(f"Successfully generated {out_file} with {len(res_data['scenarios'])} scenarios!")
