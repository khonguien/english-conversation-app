---
name: topic-expansion
description: >-
  Use this skill when adding, expanding, updating, or refining conversational English topics in this repository.
  Guides the complete end-to-end pipeline: raw phrases analysis, natural dialogue design (with strict naturalness rules),
  Single Source of Truth synchronization (scripts/data_<topic>.py -> materials/documents/ and src/data/topics/),
  plain-text and 16:9 widescreen PPTX generation, Quizlet flashcard creation, and verification tests.
---

# Topic Expansion & Conversational Refinement Skill

This skill provides the standard, end-to-end workflow for adding, expanding, or improving conversational topics in the `English in Conservation` repository.

Follow this runbook to maintain architecture integrity, high conversational naturalness, and full synchronization across the web application, curriculum documents, slide decks, and Quizlet flashcards.

---

## 🏗️ Architecture Overview (Single Source of Truth)

All topic data in this project is driven by a single source of truth:
```
scripts/data_<topic>.py (Source of Truth)
   │
   ├── py -3.10 scripts/build_all_topics.py
   │     ├──► materials/documents/<Topic>/<topic>.md (Curriculum & Appendix)
   │     └──► src/data/topics/<topic>.json (Web App State)
   │
   ├── py -3.10 scripts/generate_flashcards.py --topic <topic>
   │     └──► materials/documents/<Topic>/<topic>_dialogues_flashcards_quizlet.txt
   │
   └── py -3.10 materials/tools/generate_<topic>_pptx.py
         ├──► materials/documents/<Topic>/<topic>_ppt.txt (Plain text outline)
         └──► materials/slides/<Topic>.pptx (16:9 Widescreen Presentation)
```

> [!CAUTION]
> **NEVER** edit `src/data/topics/<topic>.json` or `materials/documents/<Topic>/<topic>.md` directly. Always make changes inside `scripts/data_<topic>.py` and recompile via `scripts/build_all_topics.py`.

---

## 📋 Step-by-Step Execution Procedure

### Step 1: Analyze & Map Raw Input Phrases
1. Collect raw English & Vietnamese expressions provided by the user.
2. Group them by roles: Staff / Service Provider vs. Customer / Learner.
3. Map phrases into a chronological **Customer Journey** spanning 3 to 4 scenarios:
   - **Scenario 0 (Free Talk):** Open roleplay with an AI specialist/manager.
   - **Scenario 1:** Greeting, inquiries, basic selection, and preferences.
   - **Scenario 2:** Add-ons, customization, price, and payment (cash / bank transfer QR).
   - **Scenario 3:** Handover / pickup, amenities (Wi-Fi, seating, climate control), wrap-up.
4. Keep the original 100% raw phrases as a reference appendix (`appendix` field).

---

### Step 2: Enforce the 4 Golden Rules of Naturalness
Refine dialogue exchanges to eliminate textbook rigidity and mimic realistic, colloquial English:

1. **No Verbatim Echoing (Tránh lặp từ máy móc):**
   - ❌ *Staff:* "Our iced coffee is our best seller. What would you like?" $\rightarrow$ *Customer:* "Can I get an iced coffee?"
   - ✅ *Staff:* "Definitely our iced coffee with milk!" $\rightarrow$ *Customer:* "Awesome, I'll take that then!"
2. **Natural Request Grouping (Gộp yêu cầu thực tế):**
   - ❌ Asking size, then ice, then sugar across 3 separate turns.
   - ✅ Combining logically: "Large, please. Less ice and no sugar, please."
3. **Situational Logic & Cause-Effect (Logic ngữ cảnh nhân quả):**
   - ❌ Staff points to counter QR code $\rightarrow$ Customer asks "Where is the QR code?".
   - ✅ Customer asks for bank transfer $\rightarrow$ Staff points to counter QR $\rightarrow$ Customer confirms: "Done! Should I wait here or take a seat?".
4. **Colloquial Fillers & Politeness (Sắc thái đời thực):**
   - Use natural conversational anchors: *"Awesome"*, *"Sure thing"*, *"Done!"*, *"Excuse me!"*, *"No, that's perfect. Thank you!"*.

---

### Step 3: Update `scripts/data_<topic>.py`
Structure data using the standard dictionary format (`<TOPIC>_DATA`):
- `id`: lowercase topic identifier (e.g. `cafe`, `hotel`, `airport`).
- `titleEn`, `titleVi`, `icon`, `description`.
- `scenarios`: Array of scenario objects containing:
  - `id`, `order`, `section`, `titleEn`, `titleVi`, `situation`.
  - `defaultRoles`: `{ "ai": { ... }, "user": { ... } }`.
  - `initialMessageEn`, `initialMessageVi`.
  - `vocabulary`: Core vocabulary items with `id`, `word`, `partOfSpeech`, `ipa`, `meaningVi`, `collocations`, `exampleEn`, `exampleVi`.
  - `sampleDialogue`: Natural turn-by-turn dialogue lines (`speaker`, `roleName`, `textEn`, `textVi`).
  - `suggestedHints`: Practical reflex prompt suggestions.
- `appendix`: Full bilingual reference list formatted in Markdown.

---

### Step 4: Synchronize Documents & Web Data
Compile the updated python data into Markdown and JSON:
```powershell
py -3.10 scripts/build_all_topics.py
```
Verify generated output files:
- `materials/documents/<Topic>/<topic>.md`
- `src/data/topics/<topic>.json`

---

### Step 5: Generate Slide Presentations & NotebookLM Prompts
1. **Plain Text Outline (`materials/documents/<Topic>/<topic>_ppt.txt`):**
   - Create a clean 25-slide outline with vocabulary slides, English dialogues, Vietnamese translations, and reflection hints.
2. **PowerPoint Slide Deck (`materials/slides/<Topic>.pptx`):**
   - Run Python generation script with `python-pptx`:
     - Dimensions: 16:9 Widescreen (`13.333` x `7.5` inches).
     - Font: `Times New Roman`.
     - Layout: Split column (Left = Content, Right = Visual Concept).
     - *Defensive lock handling:* Fall back to `<Topic>_v2.pptx` if PowerPoint holds a file lock on Windows.
3. **NotebookLM Prompts (`materials/documents/<Topic>/notebooklm_ppt_prompt.md`):**
   - Provide Standard Prompt (~650 chars), Ultra-Compact Prompt (<300 chars), and Audio Overview / Podcast Prompt.

---

### Step 6: Generate Reflex Quizlet Flashcards
Generate TSV flashcards for Quizlet import containing 100% of the dialogue turns:
```powershell
py -3.10 scripts/generate_flashcards.py --topic <topic_id>
```
**Quizlet TSV Format:**
- **Term (Mặt trước):** `[Vai tiếng Việt] Nội dung câu thoại tiếng Việt`
- **Delimiter:** `\t` (Tab character)
- **Definition (Mặt sau):** `[Vai tiếng Anh] Nội dung câu thoại tiếng Anh`
- **Output path:** `materials/documents/<Topic>/<topic>_dialogues_flashcards_quizlet.txt`

---

### Step 7: Verify Quality Gates
Execute the automated tests to guarantee system health:
```powershell
# 1. Validate topic data structure and scenario counts
node scripts/verify_topics.js

# 2. Validate full Next.js production compilation
npm run build
```

**Success Criteria:**
- `verify_topics.js` prints `ALL VALID!`.
- `npm run build` exits with code `0` (Zero TypeScript or JSX errors).
- Flashcards file has valid tab characters on every dialogue line.

---

## 🔗 Key References & Templates
- Master Workflow Template: [`materials/documents/workflow_topic_expansion_template.md`](file:///D:/Desktop/English%20in%20Conservation/materials/documents/workflow_topic_expansion_template.md)
- Reference Case Study (Cafe): [`materials/documents/Cafe/workflow_cafe_expansion.md`](file:///D:/Desktop/English%20in%20Conservation/materials/documents/Cafe/workflow_cafe_expansion.md)
- Flashcard Generator Script: [`scripts/generate_flashcards.py`](file:///D:/Desktop/English%20in%20Conservation/scripts/generate_flashcards.py)
- Topic Builder Script: [`scripts/build_all_topics.py`](file:///D:/Desktop/English%20in%20Conservation/scripts/build_all_topics.py)
