---
name: irasutoya
description: >
  Create vivid, engaging 16:9 widescreen PowerPoint presentations using high-resolution
  transparent PNG illustrations from Irasutoya (https://www.irasutoya.com/).
  Defines standards for Hero Card vocabulary layouts (1 word/slide), turn-by-turn dynamic
  avatar dialogue scenes (Staff left, Guest right), full script review slides, and minimum 14pt typography.
---

# 🎨 Irasutoya Presentation & Vivid Dialogue Skill

Use this skill whenever designing, updating, or generating conversational English PowerPoint presentations in this repository.

This skill governs the integration of [Irasutoya](https://www.irasutoya.com/) illustrations with `python-pptx`, transforming raw text into an engaging, visual courseware deck.

---

## 📐 1. Hard Rules & Quality Standards

### Rule 1: Widescreen Canvas Format
- **Dimensions:** Exactly **16:9 Widescreen** (`13.333" x 7.5"` or `12,192,000 x 6,858,000 EMUs`).
- Never generate 4:3 standard slides.

### Rule 2: Minimum Font Size is 14pt (`min_font_size = 14pt`)
> [!IMPORTANT]
> **To ensure maximum readability on projectors and mobile devices, all body content must be at least 14pt:**
> - Slide Titles: `22–28pt` (Bold Navy `#1E3A8A`)
> - Section Badges & Kicker: `12–13pt` (Bold Amber `#D97706`)
> - Dialogue English Lines: `14–16pt` (Bold Dark `#0F172A`)
> - Dialogue Vietnamese Subtitles: `14pt` (Italic `#2563EB` for Staff, `#B45309` for Guest)
> - Full Script Slides: `14pt` (Bold speaker label + regular text)
> - Vocabulary Collocations & Examples: `14pt` (Bold English, italic Vietnamese)

### Rule 3: Dynamic Turn-by-Turn Avatars (Nhân vật gắn sát hộp thoại)
- In dialogue scenes, **do NOT place two static characters fixed at the slide margins**.
- Instead, place the character's transparent PNG avatar **directly adjacent to the speech bubble they are speaking**:
  - **Staff / Service Provider turns:**
    - Avatar positioned on the **Left** (`left: 0.8"`).
    - Speech bubble positioned immediately to the right (`left: 2.35"`, `width: 10.15"`).
    - Color theme: Soft Blue fill (`#EEF6FF`), Border Blue (`#60A5FA`).
  - **Guest / Customer turns:**
    - Speech bubble positioned on the **Left** (`left: 0.8"`, `width: 10.15"`).
    - Avatar positioned on the **Right** (`left: 11.1"`).
    - Color theme: Soft Warm Amber fill (`#FEF9EE`), Border Amber (`#F59E0B`).

### Rule 4: Hero Card Vocabulary Layout (1 Word / Slide)
- Every core vocabulary term has its own dedicated slide.
- **Left 40% (`left: 0.8"`, `width: 4.8"`):** Large transparent PNG from Irasutoya centered inside a rounded card (`#F8FAFC`, border `#E2E8F0`).
- **Right 60% (`left: 5.9"`, `width: 6.6"`):** White card containing:
  - Word title (`28pt` bold)
  - Part of speech badge + IPA pronunciation (`14pt`)
  - Vietnamese meaning (`16pt` bold `#2563EB`)
  - Collocations / Synonyms section (`14pt`)
  - Real-life contextual example with bilingual translation (`14–15pt`)

### Rule 5: 2 Full Script Review Slides per Scenario
- Immediately following the visual scene slides of each scenario, provide:
  1. **FULL SCRIPT (ENGLISH):** All 8–10 lines of continuous dialogue for uninterrupted reading, shadowing, and fluency practice.
  2. **BẢN DỊCH TIẾNG VIỆT TOÀN VĂN:** Full Vietnamese translation for quick cross-referencing and comprehension checking.

---

## 🛠️ 2. Irasutoya Asset Pipeline

### 2.1. Scraper & Local Cache Engine
- Source: `materials/tools/irasutoya_scraper.py`
- Cache directory: `materials/tools/cached_images/irasutoya/`
- All images are scraped directly from `irasutoya.com` using Japanese/English queries, upgraded to `/s800/` high-resolution transparent PNGs, and cached locally for offline reuse.

### 2.2. Query Mapping Example Table
| Key | Concept | Best Japanese Query |
| :--- | :--- | :--- |
| `char_receptionist` | Front desk staff | `ホテル フロント 女性` |
| `char_guest` | Tourist / Guest with luggage | `旅行者 女性 スーツケース` |
| `char_housekeeper` | Housekeeper / Bed maker | `ベッドメイキング` |
| `char_technician` | Maintenance repairman | `修理 作業員 水道` |
| `vocab_reservation` | Reservation tent card | `予約席` |
| `vocab_key_card` | Hotel key card | `カードキー` |
| `vocab_breakfast` | Breakfast buffet / meal | `朝食` |
| `vocab_clogged_toilet` | Clogged toilet / plunger | `トイレ つまり` |
| `vocab_leaking_water` | Water leaking pipe | `水漏れ 配水管` |

---

## 💻 3. Python-pptx Implementation Template

### 3.1. Canvas Initialization
```python
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
```

### 3.2. Dynamic Avatar Turn Placement
```python
# Staff Turn: Left Avatar + Bubble
slide.shapes.add_picture(staff_avatar_path, Inches(0.8), top_pos, width=avatar_w)
bubble = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8) + avatar_w + Inches(0.25), top_pos, bubble_w, bubble_h)

# Guest Turn: Bubble + Right Avatar
bubble = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), top_pos, bubble_w, bubble_h)
slide.shapes.add_picture(guest_avatar_path, Inches(0.8) + bubble_w + Inches(0.25), top_pos, width=avatar_w)
```

### 3.3. Typography Configuration
```python
# English dialogue line (>= 14pt)
r_en.font.size = Pt(15 if num_turns <= 3 else 14)
r_en.font.bold = True

# Vietnamese subtitle line (>= 14pt)
r_vi.font.size = Pt(14)
r_vi.font.italic = True
```

---

## 🧪 4. Quality Verification
Always verify the generated deck:
```powershell
# 1. Regenerate slides
python materials/tools/generate_<topic>_pptx.py

# 2. Check schema and build
node scripts/verify_topics.js
```
Confirm:
1. All body text is $\ge 14pt$.
2. All turns have avatars placed directly next to their bubbles.
3. Every scenario ends with 1 Full English slide and 1 Full Vietnamese slide.
