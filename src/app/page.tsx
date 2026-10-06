"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { ALL_TOPICS } from "@/data/topics";
import { ChatMessage, Scenario, Topic } from "@/types/conversation";
import { Header } from "@/components/Header";
import { ChatWindow } from "@/components/ChatWindow";
import { AudioInputBar } from "@/components/AudioInputBar";
import { VocabularyDrawer } from "@/components/VocabularyDrawer";
import { ScenarioSelector } from "@/components/ScenarioSelector";
import { HomeDashboard } from "@/components/HomeDashboard";
import { speakText, stopSpeaking, unlockAudio } from "@/utils/speech";

export default function Home() {
  const [currentView, setCurrentView] = useState<"home" | "chat">("home");
  const [currentTopic, setCurrentTopic] = useState<Topic>(ALL_TOPICS[0]);
  const [currentScenario, setCurrentScenario] = useState<Scenario>(
    ALL_TOPICS[0].scenarios[0]
  );
  const [userRole, setUserRole] = useState<"user" | "ai">("user");
  const [subtitlesEnabled, setSubtitlesEnabled] = useState<boolean>(true);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [isVocabOpen, setIsVocabOpen] = useState<boolean>(false);
  const [isScenarioSelectorOpen, setIsScenarioSelectorOpen] =
    useState<boolean>(false);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Ref to hold the latest speech rate without causing re-renders or resetting conversations
  const speechRateRef = useRef(speechRate);
  useEffect(() => {
    speechRateRef.current = speechRate;
  }, [speechRate]);

  // One-time interaction listener to unlock audio on mobile Safari / iOS
  useEffect(() => {
    const handleFirstTouch = () => {
      unlockAudio();
    };
    window.addEventListener("touchstart", handleFirstTouch, { once: true, passive: true });
    window.addEventListener("click", handleFirstTouch, { once: true, passive: true });
    return () => {
      window.removeEventListener("touchstart", handleFirstTouch);
      window.removeEventListener("click", handleFirstTouch);
    };
  }, []);

  // Initialize conversation when scenario changes or role toggles
  const initScenario = useCallback(
    (scenario: Scenario, role: "user" | "ai") => {
      stopSpeaking();
      setActiveAudioId(null);

      const aiRoleInfo =
        role === "user" ? scenario.defaultRoles.ai : scenario.defaultRoles.user;

      // Determine who speaks first:
      // In structured dialogues, check roleName of turn 0 in sampleDialogue
      const firstTurn = scenario.sampleDialogue && scenario.sampleDialogue[0];
      const isAiFirstSpeaker = scenario.isFreeTalk
        ? role === "user" // In Free Talk: AI staff greets first if learner is guest/traveler
        : firstTurn
        ? firstTurn.roleName.toLowerCase() === aiRoleInfo.name.toLowerCase()
        : role === "user";

      if (isAiFirstSpeaker) {
        const openingEn =
          firstTurn && firstTurn.roleName.toLowerCase() === aiRoleInfo.name.toLowerCase()
            ? firstTurn.textEn
            : scenario.initialMessageEn;
        const openingVi =
          firstTurn && firstTurn.roleName.toLowerCase() === aiRoleInfo.name.toLowerCase()
            ? firstTurn.textVi
            : scenario.initialMessageVi;

        const initialId = `msg-init-${Date.now()}`;
        const initialMessage: ChatMessage = {
          id: initialId,
          sender: "ai",
          roleName: aiRoleInfo.name,
          textEn: openingEn,
          textVi: openingVi,
          timestamp: Date.now(),
          revealed: false,
        };

        setMessages([initialMessage]);

        // Play initial line after slight delay
        setTimeout(() => {
          speakText(openingEn, speechRateRef.current, () => {
            setActiveAudioId(null);
          });
          setActiveAudioId(initialId);
        }, 400);
      } else {
        // Learner speaks first! AI waits for learner to start the dialogue.
        setMessages([]);
      }
    },
    []
  );

  // Transition from Home Dashboard to Chat Room
  const handleStartScenario = (
    topic: Topic,
    scenario: Scenario,
    role: "user" | "ai" = "user"
  ) => {
    unlockAudio();
    setCurrentTopic(topic);
    setCurrentScenario(scenario);
    setUserRole(role);
    setCurrentView("chat");
    initScenario(scenario, role);
  };

  // Back from Chat Room to Home Dashboard
  const handleBackToHome = () => {
    stopSpeaking();
    setActiveAudioId(null);
    setCurrentView("home");
  };

  // Audio Playback
  const handlePlayAudio = (msgId: string, text: string) => {
    unlockAudio();
    stopSpeaking();
    setActiveAudioId(msgId);
    speakText(text, speechRateRef.current, () => {
      setActiveAudioId(null);
    });
  };

  const handleStopAudio = () => {
    stopSpeaking();
    setActiveAudioId(null);
  };

  // Toggle speech rate: 1.0 -> 0.8 -> 1.2 -> 1.0
  const handleChangeSpeechRate = () => {
    setSpeechRate((prev) => {
      if (prev === 1.0) return 0.8;
      if (prev === 0.8) return 1.2;
      return 1.0;
    });
  };

  // Toggle role in chat
  const handleToggleRole = () => {
    const nextRole = userRole === "user" ? "ai" : "user";
    setUserRole(nextRole);
    initScenario(currentScenario, nextRole);
  };

  // Toggle global subtitles
  const handleToggleSubtitles = () => {
    setSubtitlesEnabled((prev) => {
      const next = !prev;
      if (!next) {
        // When entering challenge mode (hiding subtitles), re-mask all AI messages
        setMessages((msgs) => msgs.map((m) => ({ ...m, revealed: false })));
      }
      return next;
    });
  };

  // Toggle reveal for individual masked message in challenge mode
  const handleToggleReveal = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, revealed: !m.revealed } : m))
    );
  };

  // Select new scenario from in-chat modal
  const handleSelectScenario = (topic: Topic, scenario: Scenario) => {
    setCurrentTopic(topic);
    setCurrentScenario(scenario);
    initScenario(scenario, userRole);
  };

  // Send message
  const handleSendMessage = async (text: string) => {
    unlockAudio();
    const userRoleInfo =
      userRole === "user"
        ? currentScenario.defaultRoles.user
        : currentScenario.defaultRoles.ai;
    const aiRoleInfo =
      userRole === "user"
        ? currentScenario.defaultRoles.ai
        : currentScenario.defaultRoles.user;

    const userMsgId = `msg-user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMsgId,
      sender: "user",
      roleName: userRoleInfo.name,
      textEn: text,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsAiThinking(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topicId: currentTopic.id,
          scenarioId: currentScenario.id,
          messages: newMessages,
          userRole: userRoleInfo.name,
          aiRole: aiRoleInfo.name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await response.json();
      const aiMsgId = `msg-ai-${Date.now()}`;
      const aiMessage: ChatMessage = {
        id: aiMsgId,
        sender: "ai",
        roleName: aiRoleInfo.name,
        textEn: data.textEn,
        textVi: data.textVi,
        timestamp: Date.now(),
        revealed: false,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Speak AI response automatically
      speakText(data.textEn, speechRateRef.current, () => {
        setActiveAudioId(null);
      });
      setActiveAudioId(aiMsgId);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsgId = `msg-err-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: errorMsgId,
          sender: "ai",
          roleName: aiRoleInfo.name,
          textEn: "Sorry, I had a momentary connection glitch. Could you say that again?",
          textVi: "Xin lỗi, đường truyền hơi gián đoạn. Bạn nói lại được không?",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Dynamic suggested hints matching learner's active role
  const learnerRoleInfo =
    userRole === "user"
      ? currentScenario.defaultRoles.user
      : currentScenario.defaultRoles.ai;

  const dynamicHints = React.useMemo(() => {
    if (currentScenario.sampleDialogue && currentScenario.sampleDialogue.length > 0) {
      const learnerTurns = currentScenario.sampleDialogue
        .filter(
          (t) => t.roleName.toLowerCase() === learnerRoleInfo.name.toLowerCase()
        )
        .map((t) => t.textEn);
      if (learnerTurns.length > 0) {
        return Array.from(
          new Set([...learnerTurns, ...currentScenario.suggestedHints])
        ).slice(0, 5);
      }
    }
    return currentScenario.suggestedHints;
  }, [currentScenario, learnerRoleInfo.name]);

  if (currentView === "home") {
    return (
      <HomeDashboard
        topics={ALL_TOPICS}
        selectedTopic={currentTopic}
        onSelectTopic={(t) => setCurrentTopic(t)}
        onStartScenario={handleStartScenario}
      />
    );
  }

  return (
    <main className="flex flex-col h-screen max-h-screen overflow-hidden bg-slate-50">
      {/* Header */}
      <Header
        topic={currentTopic}
        scenario={currentScenario}
        subtitlesEnabled={subtitlesEnabled}
        onToggleSubtitles={handleToggleSubtitles}
        speechRate={speechRate}
        onChangeSpeechRate={handleChangeSpeechRate}
        isVocabOpen={isVocabOpen}
        onToggleVocab={() => setIsVocabOpen(!isVocabOpen)}
        onOpenScenarios={() => setIsScenarioSelectorOpen(true)}
        onResetChat={() => initScenario(currentScenario, userRole)}
        userRole={userRole}
        onToggleRole={handleToggleRole}
        onBackToHome={handleBackToHome}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex overflow-hidden relative">
        <ChatWindow
          messages={messages}
          subtitlesEnabled={subtitlesEnabled}
          speechRate={speechRate}
          isAiThinking={isAiThinking}
          activeAudioId={activeAudioId}
          onPlayAudio={handlePlayAudio}
          onStopAudio={handleStopAudio}
          onToggleReveal={handleToggleReveal}
          scenario={currentScenario}
          userRole={userRole}
        />

        {/* Vocabulary Drawer */}
        <VocabularyDrawer
          isOpen={isVocabOpen}
          onClose={() => setIsVocabOpen(false)}
          vocabulary={currentScenario.vocabulary}
          scenarioTitle={`${currentScenario.order}. ${currentScenario.titleEn}`}
        />
      </div>

      {/* Bottom Audio Input Bar */}
      <AudioInputBar
        onSendMessage={handleSendMessage}
        disabled={isAiThinking}
        suggestedHints={dynamicHints}
        isAiSpeaking={activeAudioId !== null}
        onStopAudio={handleStopAudio}
      />

      {/* Scenario & Topic Selector Modal */}
      <ScenarioSelector
        isOpen={isScenarioSelectorOpen}
        onClose={() => setIsScenarioSelectorOpen(false)}
        currentTopic={currentTopic}
        currentScenario={currentScenario}
        onSelectScenario={handleSelectScenario}
      />
    </main>
  );
}
