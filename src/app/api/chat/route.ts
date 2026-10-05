import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getScenarioById } from "@/data/topics";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topicId, scenarioId, messages, userRole, aiRole } = body;

    const scenario = getScenarioById(topicId || "airport", scenarioId);
    if (!scenario) {
      return NextResponse.json(
        { error: "Scenario not found" },
        { status: 404 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback if API key is not configured yet
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
      const nextTurnIndex = messages.length;
      const scriptedTurn = scenario.sampleDialogue[nextTurnIndex] || scenario.sampleDialogue[scenario.sampleDialogue.length - 1];
      return NextResponse.json({
        textEn: scriptedTurn ? scriptedTurn.textEn : "Thank you! Have a wonderful day!",
        textVi: scriptedTurn ? scriptedTurn.textVi : "Cảm ơn bạn! Chúc một ngày tuyệt vời!",
        isFallback: true,
        note: "Chế độ mẫu (Chưa cấu hình GEMINI_API_KEY trong .env.local)",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Prioritize ultra-low latency models for lightning-fast responses (< 1s)
    const candidateModels = [
      "gemini-3.5-flash-lite",
      "gemini-flash-lite-latest",
      "gemini-flash-latest",
      "gemini-3.8-flash",
    ];

    const isFreeTalk = Boolean(scenario.isFreeTalk);

    // Calculate reference script and expected next turn
    const referenceScript = scenario.sampleDialogue
      .map(
        (t, idx) =>
          `Turn ${idx} (${t.roleName}): ${t.textEn} (Vi: ${t.textVi})`
      )
      .join("\n");

    const nextTurnIndex = messages.length;
    const nextScriptedTurn = scenario.sampleDialogue[nextTurnIndex];
    const previousScriptedTurn = scenario.sampleDialogue[nextTurnIndex - 1];

    const scriptGuideline = isFreeTalk
      ? `THIS IS AN OPEN REAL-WORLD PRACTICE (FREE TALK) SESSION.
There is NO fixed script. The student can ask or talk about anything!
You have complete freedom to roleplay in character, answer any questions, and converse naturally. Keep replies punchy (1-2 sentences).`
      : `
OFFICIAL LESSON SCRIPT FOR THIS SCENARIO:
${referenceScript}

INTELLIGENT SCRIPT MATCHING RULES:
1. Examine the learner's latest message carefully to understand what they are ACTUALLY asking or saying.
2. Search the OFFICIAL LESSON SCRIPT to find the exact topic/intent:
   - If the learner's message corresponds to ANY step, question, or request in the script (even if they skipped an intermediate turn, asked out of order, or used different phrasing/slight grammar errors):
     -> YOU MUST respond with the matching AI reply for THAT SPECIFIC question from the script!
     * Crucial Example: If the learner asks "Where is the security check?", locate the security check step in the script and reply with "Right behind you to the right." (DO NOT give an irrelevant answer like "it will go straight through to Bangkok" just because it was an earlier unasked turn!).
     * Example: If the learner asks about luggage layover / pickup, answer with the luggage layover line.
     * Example: If the learner says their destination/flight, answer with the passport request.
   - If the learner's message simply continues the natural sequential step:
     -> Reply with the corresponding scripted line.
3. ONLY IF the learner's message is fundamentally off-script and NOT found anywhere in the lesson script (e.g. asking about lost pets, buying gifts, emergency, special medical needs, or expressing confusion):
   -> THEN AND ONLY THEN: Generate a custom, natural in-character response (1-2 sentences).`;

    // Build the system prompt
    const systemPrompt = `You are a native English speaker roleplaying as "${
      aiRole || scenario.defaultRoles.ai.name
    }" in a conversational English practice app for Vietnamese learners.
The user is roleplaying as "${userRole || scenario.defaultRoles.user.name}".
Context / Situation: "${scenario.situation}".
Topic: "${scenario.titleEn}".

IMPORTANT INSTRUCTIONS:
1. Deeply stay in character as "${aiRole || scenario.defaultRoles.ai.name}".
2. Keep your response CONCISE: 1 to 2 sentences maximum. Real conversation flows back and forth quickly!
3. Focus on communicative intent: If the learner makes minor grammar or phrasing mistakes, understand what they mean and respond naturally. DO NOT correct their grammar or lecture them.
4. ${scriptGuideline}
5. Provide your response in valid JSON format with two fields:
   - "textEn": Your spoken English response in character (1-2 sentences).
   - "textVi": Accurate natural Vietnamese translation of your response (for learner subtitles).

Return ONLY the JSON object, nothing else.`;

    // Format chat history for context
    const historyText = messages
      .slice(-8) // last 8 messages for context
      .map(
        (m: { sender: string; roleName: string; textEn: string }) =>
          `${m.roleName || (m.sender === "user" ? userRole : aiRole)}: ${m.textEn}`
      )
      .join("\n");

    const prompt = `${systemPrompt}\n\nRecent conversation history:\n${historyText}\n\nNow respond as ${aiRole} in JSON format:`;

    let responseText = "";
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.25,
            maxOutputTokens: 1000,
          },
        });
        const result = await model.generateContent(prompt);
        responseText = result.response.text().trim();
        if (responseText) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed, trying next...:`, err.message);
      }
    }

    if (!responseText) {
      // Graceful fallback to scripted dialogue turn if all models are busy
      const nextTurnIndex = messages.length;
      const scriptedTurn = scenario.sampleDialogue[nextTurnIndex] || scenario.sampleDialogue[scenario.sampleDialogue.length - 1];
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
      // In case Gemini returns plain text instead of JSON
      return NextResponse.json({
        textEn: responseText,
        textVi: "",
      });
    }
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate AI response",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
