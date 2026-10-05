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
    const candidateModels = [
      "gemini-flash-latest",
      "gemini-flash-lite-latest",
      "gemini-3.5-flash-lite",
      "gemini-3.8-flash",
    ];

    // Build the system prompt
    const systemPrompt = `You are a native English speaker roleplaying as "${aiRole || scenario.defaultRoles.ai.name}" in a conversational English practice app for Vietnamese learners.
The user is roleplaying as "${userRole || scenario.defaultRoles.user.name}".
Context / Situation: "${scenario.situation}".
Topic: "${scenario.titleEn}".

IMPORTANT INSTRUCTIONS:
1. Deeply stay in character as "${aiRole || scenario.defaultRoles.ai.name}".
2. Keep your response CONCISE: 1 to 2 sentences maximum. Real conversation flows back and forth quickly!
3. Focus on communicative intent: If the learner makes minor grammar or phrasing mistakes, understand what they mean and respond naturally. DO NOT correct their grammar or lecture them.
4. Allow natural exploration: If the learner asks off-script questions or changes the topic slightly, answer helpfully in character.
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
            temperature: 0.7,
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
