import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getScenarioById, ALL_TOPICS } from "@/data/topics";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topicId, scenarioId, messages, userRole, aiRole } = body;

    // Resilient scenario lookup: by topicId & scenarioId, or search across all topics, or fallback
    let scenario = getScenarioById(topicId || "airport", scenarioId);
    if (!scenario && scenarioId) {
      for (const t of ALL_TOPICS) {
        const found = t.scenarios.find((s) => s.id === scenarioId);
        if (found) {
          scenario = found;
          break;
        }
      }
    }
    if (!scenario) {
      const fallbackTopic = ALL_TOPICS.find((t) => t.id === topicId) || ALL_TOPICS[0];
      scenario = fallbackTopic.scenarios[0];
    }

    const safeMessages = Array.isArray(messages)
      ? messages
      : Array.isArray(body.history)
      ? body.history
      : [];

    const apiKey = process.env.GEMINI_API_KEY;

    const activeAiRole = aiRole || scenario.defaultRoles.ai.name;
    const activeUserRole = userRole || scenario.defaultRoles.user.name;

    // Helper to get scripted fallback turn matching aiRole
    const getScriptedFallback = () => {
      if (!scenario.sampleDialogue || scenario.sampleDialogue.length === 0) {
        return {
          textEn: "Understood! Let me assist you with that.",
          textVi: "Tôi hiểu rồi! Để tôi hỗ trợ bạn việc này.",
        };
      }
      const aiTurns = scenario.sampleDialogue.filter(
        (t: any) => t.roleName.toLowerCase() === activeAiRole.toLowerCase()
      );
      if (aiTurns.length > 0) {
        const aiMessageCount = safeMessages.filter(
          (m: any) => (m.roleName || m.role)?.toLowerCase() === activeAiRole.toLowerCase()
        ).length;
        const turnIdx = Math.min(aiMessageCount, aiTurns.length - 1);
        return aiTurns[turnIdx];
      }
      return scenario.sampleDialogue[Math.min(safeMessages.length, scenario.sampleDialogue.length - 1)];
    };

    // Fallback if API key is not configured yet
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
      const scriptedTurn = getScriptedFallback();
      return NextResponse.json({
        textEn: scriptedTurn ? scriptedTurn.textEn : "Thank you! Have a wonderful day!",
        textVi: scriptedTurn ? scriptedTurn.textVi : "Cảm ơn bạn! Chúc một ngày tuyệt vời!",
        isFallback: true,
        note: "Chế độ mẫu (Chưa cấu hình GEMINI_API_KEY trong .env.local)",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Strictly use Gemini 3.5 models (flash-lite default ~1.1s, flash backup)
    const candidateModels = [
      "gemini-3.5-flash-lite",
      "gemini-3.5-flash",
    ];

    const isFreeTalk = Boolean(scenario.isFreeTalk);

    // Calculate reference script
    const referenceScript = scenario.sampleDialogue
      .map(
        (t, idx) =>
          `Turn ${idx} (${t.roleName}): ${t.textEn} (Vi: ${t.textVi})`
      )
      .join("\n");

    const scriptGuideline = isFreeTalk
      ? `THIS IS AN OPEN REAL-WORLD PRACTICE (FREE TALK) SESSION.
There is NO fixed script. You are roleplaying as "${activeAiRole}". Converse naturally and stay in character. Keep replies punchy (1-2 sentences).`
      : `
OFFICIAL LESSON SCRIPT FOR THIS SCENARIO:
${referenceScript}

INTELLIGENT SCRIPT MATCHING RULES:
1. The user is playing as "${activeUserRole}". YOU ARE PLAYING AS "${activeAiRole}".
2. Examine the learner's latest message carefully to understand what they are saying or asking.
3. Find the turn in the lesson script that responds to the learner, and reply with the corresponding line for YOUR role ("${activeAiRole}"):
   - If the learner's message corresponds to any step or question in the script: respond with the matching reply for "${activeAiRole}".
   - If the learner simply continues the sequential conversation: reply with your next line as "${activeAiRole}".
4. Only if the learner's message is fundamentally off-script: generate a custom, natural in-character response as "${activeAiRole}" (1-2 sentences).`;

    // Build the system prompt
    const systemPrompt = `You are a native English speaker roleplaying as "${activeAiRole}" in a conversational English practice app for Vietnamese learners.
The user is roleplaying as "${activeUserRole}".
Context / Situation: "${scenario.situation}".
Topic: "${scenario.titleEn}".

CRITICAL ROLEPLAY INSTRUCTIONS:
1. Deeply stay in character as "${activeAiRole}". You MUST ALWAYS speak as "${activeAiRole}".
   - NEVER speak as "${activeUserRole}".
   - NEVER steal or repeat lines meant for "${activeUserRole}".
2. Keep your response CONCISE: 1 to 2 sentences maximum. Real conversation flows back and forth quickly!
3. Focus on communicative intent: If the learner makes minor grammar or phrasing mistakes, understand what they mean and respond naturally in character. DO NOT correct their grammar or lecture them.
4. ${scriptGuideline}
5. Provide your response in valid JSON format with two fields:
   - "textEn": Your spoken English response in character as ${activeAiRole} (1-2 sentences).
   - "textVi": Accurate natural Vietnamese translation of your response (for learner subtitles).

Return ONLY the JSON object, nothing else.`;

    // Format chat history for context
    const historyText = safeMessages
      .slice(-8)
      .map(
        (m: { sender?: string; roleName?: string; textEn?: string; parts?: { text: string }[] }) => {
          if (m.textEn) {
            return `${m.roleName || (m.sender === "user" ? activeUserRole : activeAiRole)}: ${m.textEn}`;
          }
          if (m.parts && m.parts[0]?.text) {
            return m.parts[0].text;
          }
          return "";
        }
      )
      .filter(Boolean)
      .join("\n");

    const prompt = `${systemPrompt}\n\nRecent conversation history:\n${historyText}\n\nNow respond as ${activeAiRole} in JSON format:`;

    let responseText = "";
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1000,
            responseMimeType: "application/json",
          },
        });
        // Hard timeout 3.5s to prevent long hanging
        const result: any = await Promise.race([
          model.generateContent(prompt),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Timeout 3.5s on ${modelName}`)), 3500)
          ),
        ]);
        responseText = result.response.text().trim();
        if (responseText) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed or timed out:`, err.message);
      }
    }

    if (!responseText) {
      // Graceful fallback to scripted dialogue turn matching aiRole
      const scriptedTurn = getScriptedFallback();
      return NextResponse.json({
        textEn: scriptedTurn ? scriptedTurn.textEn : "Understood! Let me assist you with that.",
        textVi: scriptedTurn ? scriptedTurn.textVi : "Tôi hiểu rồi! Để tôi hỗ trợ bạn việc này.",
        isFallback: true,
      });
    }

    // Clean JSON response
    let cleanJson = responseText;
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    try {
      const parsed = JSON.parse(cleanJson);
      return NextResponse.json({
        textEn: parsed.textEn || "Could you please repeat that?",
        textVi: parsed.textVi || "Bạn có thể nhắc lại được không?",
      });
    } catch {
      return NextResponse.json({
        textEn: responseText,
        textVi: "",
      });
    }
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    // Never return 404/500 to break user roleplay experience
    return NextResponse.json(
      {
        textEn: "Understood! Could you please repeat that?",
        textVi: "Tôi hiểu rồi! Bạn có thể nhắc lại câu vừa rồi được không?",
        isFallback: true,
      },
      { status: 200 }
    );
  }
}
