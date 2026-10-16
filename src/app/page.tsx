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
  const [isUserSpeaking, setIsUserSpeaking] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [completedScenarioIds, setCompletedScenarioIds] = useState<string[]>([]);

  // Ref to hold the latest speech rate without causing re-renders or resetting conversations
  const speechRateRef = useRef(speechRate);
  useEffect(() => {
    speechRateRef.current = speechRate;
  }, [speechRate]);

  // Load completed scenarios from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("completed_scenarios");
      if (saved) {
        setCompletedScenarioIds(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const handleMarkCompleted = useCallback((scenarioId: string) => {
    setCompletedScenarioIds((prev) => {
      if (prev.includes(scenarioId)) return prev;
      const updated = [...prev, scenarioId];
      try {
        localStorage.setItem("completed_scenarios", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  // Continuous interaction listener to keep audio unlocked on mobile Safari / iOS
  useEffect(() => {
    const handleTouch = () => {
      unlockAudio();
    };
    window.addEventListener("touchstart", handleTouch, { passive: true });
    window.addEventListener("click", handleTouch, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouch);
      window.removeEventListener("click", handleTouch);
    };
  }, []);

  // Initialize conversation when scenario changes or role toggles
  const initScenario = useCallback(
    (scenario: Scenario, role: "user" | "ai") => {
      stopSpeaking();
      setActiveAudioId(null);
      setIsUserSpeaking(false);

      const aiRoleInfo =
        role === "user" ? scenario.defaultRoles.ai : scenario.defaultRoles.user;

      const firstTurn = scenario.sampleDialogue && scenario.sampleDialogue[0];
      const isAiFirstSpeaker = scenario.isFreeTalk
        ? role === "user"
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

        setTimeout(() => {
          speakText(openingEn, speechRateRef.current, () => {
            setActiveAudioId(null);
          });
          setActiveAudioId(initialId);
        }, 400);
      } else {
        setMessages([]);
      }
    },
    []
  );

  // Toggle roles
  const handleToggleRole = () => {
    const newRole = userRole === "user" ? "ai" : "user";
    setUserRole(newRole);
    initScenario(currentScenario, newRole);
  };

  // Select a new scenario from the modal selector
  const handleSelectScenario = (topic: Topic, scenario: Scenario) => {
    setCurrentTopic(topic);
    setCurrentScenario(scenario);
    setIsScenarioSelectorOpen(false);
    initScenario(scenario, userRole);
  };

  // Advance to next scenario seamlessly
  const handleNextScenario = useCallback(() => {
    const currentIndex = currentTopic.scenarios.findIndex(
      (s) => s.id === currentScenario.id
    );

    if (currentIndex >= 0 && currentIndex < currentTopic.scenarios.length - 1) {
      const nextSc = currentTopic.scenarios[currentIndex + 1];
      setCurrentScenario(nextSc);
      initScenario(nextSc, userRole);
    } else {
      // Advance to next topic
      const topicIndex = ALL_TOPICS.findIndex((t) => t.id === currentTopic.id);
      const nextTopicIndex = (topicIndex + 1) % ALL_TOPICS.length;
      const nextTopic = ALL_TOPICS[nextTopicIndex];
      const nextSc = nextTopic.scenarios[0];
      setCurrentTopic(nextTopic);
      setCurrentScenario(nextSc);
      initScenario(nextSc, userRole);
    }
  }, [currentTopic, currentScenario, initScenario, userRole]);

  // Toggle subtitles / Listening Challenge Mode
  const handleToggleSubtitles = () => {
    setSubtitlesEnabled((prev) => !prev);
  };

  // Change speech speed: 0.8x -> 1.0x -> 1.2x -> 0.8x
  const handleChangeSpeechRate = () => {
    const rates = [0.8, 1.0, 1.2];
    const currentIndex = rates.indexOf(speechRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setSpeechRate(nextRate);
  };

  // Play audio for a specific message
  const handlePlayAudio = (msgId: string, text: string) => {
    unlockAudio();
    stopSpeaking();

    if (activeAudioId === msgId) {
      setActiveAudioId(null);
      return;
    }

    setActiveAudioId(msgId);
    speakText(text, speechRateRef.current, () => {
      setActiveAudioId(null);
    });
  };

  const handleStopAudio = () => {
    stopSpeaking();
    setActiveAudioId(null);
  };

  const handleToggleReveal = (msgId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === msgId ? { ...msg, revealed: !msg.revealed } : msg
      )
    );
  };

  const handleStartScenario = (
    topic: Topic,
    scenario: Scenario,
    role: "user" | "ai"
  ) => {
    unlockAudio();
    setCurrentTopic(topic);
    setCurrentScenario(scenario);
    setUserRole(role);
    setCurrentView("chat");
    initScenario(scenario, role);
  };

  const handleBackToHome = () => {
    stopSpeaking();
    setActiveAudioId(null);
    setCurrentView("home");
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
        completedScenarioIds={completedScenarioIds}
      />
    );
  }

  return (
    <main className="flex flex-col h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#fafaf9] dark:bg-[#0c0e14] text-slate-900 dark:text-slate-100">
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
          isUserSpeaking={isUserSpeaking}
          onPlayAudio={handlePlayAudio}
          onStopAudio={handleStopAudio}
          onToggleReveal={handleToggleReveal}
          scenario={currentScenario}
          userRole={userRole}
          onNextScenario={handleNextScenario}
          onResetChat={() => initScenario(currentScenario, userRole)}
          onMarkCompleted={handleMarkCompleted}
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
        onListeningChange={setIsUserSpeaking}
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
