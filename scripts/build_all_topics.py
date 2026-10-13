# -*- coding: utf-8 -*-
"""Builder script to generate both Markdown materials and JSON files for all topics."""

import json
import os
from data_hotel import HOTEL_DATA
from data_transportation import TRANSPORTATION_DATA
from data_cafe import CAFE_DATA
from data_shopping import SHOPPING_DATA
from data_socializing import SOCIALIZING_DATA
from data_workplace import WORKPLACE_DATA

BASE_DOCS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "materials", "documents"))
TOPICS_JSON_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src", "data", "topics"))

TOPICS_LIST = [
    ("Hotel", "hotel", HOTEL_DATA),
    ("Transportation", "transportation", TRANSPORTATION_DATA),
    ("Cafe", "cafe", CAFE_DATA),
    ("Shopping", "shopping", SHOPPING_DATA),
    ("Socializing", "socializing", SOCIALIZING_DATA),
    ("Workplace", "workplace", WORKPLACE_DATA),
]

def render_markdown(topic_data):
    md = []
    md.append(f"# {topic_data['icon']} {topic_data['titleEn']} / {topic_data['titleVi']}\n")
    md.append(f"> {topic_data['description']}\n")
    md.append("---\n")

    for s in topic_data["scenarios"]:
        if s.get("isFreeTalk"):
            md.append(f"## 🌟 {s['titleEn']} ({s['titleVi']})\n")
            md.append(f"**Tình huống:** {s['situation']}\n")
            md.append(f"- **AI Role:** {s['defaultRoles']['ai']['titleEn']} ({s['defaultRoles']['ai']['titleVi']})")
            md.append(f"- **Learner Role:** {s['defaultRoles']['user']['titleEn']} ({s['defaultRoles']['user']['titleVi']})")
            md.append(f"- **Câu mở đầu AI:** \"{s['initialMessageEn']}\" (*{s['initialMessageVi']}*)\n")
            md.append("### 💡 Gợi ý câu mở đầu thực chiến:")
            for h in s.get("suggestedHints", []):
                md.append(f"- \"{h}\"")
            md.append("\n---\n")
            continue

        md.append(f"### Hội thoại {s['order']}: {s['titleEn']} / {s['titleVi']}\n")
        md.append(f"**Phần:** {s['section']}")
        md.append(f"**Tình huống:** {s['situation']}\n")

        # Vocab section
        md.append("#### 📚 TỪ VỰNG MỚI & MỞ RỘNG:\n")
        for idx, v in enumerate(s.get("vocabulary", []), 1):
            pos_str = f" ({v['partOfSpeech']})" if v.get("partOfSpeech") else ""
            ipa_str = f" | {v['ipa']}" if v.get("ipa") else ""
            md.append(f"{idx}. **{v['word']}**{pos_str}{ipa_str} | {v['meaningVi']}")
            if v.get("synonyms"):
                md.append(f"   - **Đồng nghĩa:** {', '.join(v['synonyms'])}")
            if v.get("antonyms"):
                md.append(f"   - **Trái nghĩa:** {', '.join(v['antonyms'])}")
            if v.get("collocations"):
                md.append("   - **Cụm từ thường gặp:**")
                for c in v["collocations"]:
                    md.append(f"     + {c}")
            if v.get("exampleEn"):
                md.append(f"   - **Ví dụ EN:** {v['exampleEn']}")
                md.append(f"   - **Ví dụ VI:** {v['exampleVi']}")
            md.append("")

        # Sample Dialogue
        md.append("#### 💬 NỘI DUNG HỘI THOẠI MẪU:\n")
        for turn in s.get("sampleDialogue", []):
            role_label = turn['roleName']
            md.append(f"- **{role_label}:** {turn['textEn']}")
            if turn.get("textVi"):
                md.append(f"  *{turn['textVi']}*")
        md.append("")

        # Hints
        if s.get("suggestedHints"):
            md.append("#### 💡 GỢI Ý CÂU NÓI PHẢN XẠ (HINTS):\n")
            for h in s["suggestedHints"]:
                md.append(f"- {h}")
            md.append("")

        md.append("---\n")

    if topic_data.get("appendix"):
        md.append(topic_data["appendix"])

    return "\n".join(md)

def main():
    print("=== BUILDING TOPIC MATERIALS & DATA ===")
    
    # 1. Generate Markdown and JSON for each new topic
    for folder_name, topic_id, data in TOPICS_LIST:
        doc_folder = os.path.join(BASE_DOCS_DIR, folder_name)
        os.makedirs(doc_folder, exist_ok=True)
        md_path = os.path.join(doc_folder, f"{topic_id}.md")
        
        md_content = render_markdown(data)
        with open(md_path, "w", encoding="utf-8") as f:
            f.write(md_content)
        print(f"Generated Markdown: {md_path}")

        json_path = os.path.join(TOPICS_JSON_DIR, f"{topic_id}.json")
        data_to_dump = {k: v for k, v in data.items() if k != "appendix"}
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(data_to_dump, f, ensure_ascii=False, indent=2)
        print(f"Generated JSON: {json_path}")

    # 2. Update src/data/topics/index.ts
    index_ts_path = os.path.join(TOPICS_JSON_DIR, "index.ts")
    index_ts_content = """import { Topic } from "@/types/conversation";
import airportTopic from "./airport.json";
import restaurantTopic from "./restaurant.json";
import hotelTopic from "./hotel.json";
import transportationTopic from "./transportation.json";
import cafeTopic from "./cafe.json";
import shoppingTopic from "./shopping.json";
import socializingTopic from "./socializing.json";
import workplaceTopic from "./workplace.json";

export const ALL_TOPICS: Topic[] = [
  airportTopic as unknown as Topic,
  restaurantTopic as unknown as Topic,
  hotelTopic as unknown as Topic,
  transportationTopic as unknown as Topic,
  cafeTopic as unknown as Topic,
  shoppingTopic as unknown as Topic,
  socializingTopic as unknown as Topic,
  workplaceTopic as unknown as Topic,
];

export function getTopicById(id: string): Topic | undefined {
  return ALL_TOPICS.find((t) => t.id === id);
}

export function getScenarioById(topicId: string, scenarioId: string) {
  const topic = getTopicById(topicId);
  if (!topic) return undefined;
  return topic.scenarios.find((s) => s.id === scenarioId);
}
"""
    with open(index_ts_path, "w", encoding="utf-8") as f:
        f.write(index_ts_content)
    print(f"Updated index.ts: {index_ts_path}")
    print("=== COMPLETED SUCCESSFULLY ===")

if __name__ == "__main__":
    main()
