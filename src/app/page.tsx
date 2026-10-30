"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { ALL_TOPICS } from "@/data/topics";
import { ChatMessage, Scenario, Topic } from "@/types/conversation";
import { WoodenCassetteRack } from "@/components/WoodenCassetteRack";
import { IsometricRetroRadio } from "@/components/IsometricRetroRadio";
import { VocabularyDrawer } from "@/components/VocabularyDrawer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { speakText, stopSpeaking, unlockAudio } from "@/utils/speech";
import { Headphones, Trophy, BookMarked, Sparkles } from "lucide-react";

const SPEEDS = [0.8, 1.0, 1.2, 1.5];

export default function Home() {
  const [currentTopic, setCurrentTopic] = useState<Topic>(ALL_TOPICS[0]);
  // Initial state: Radio deck starts empty on first load (User directive: "ko có cái băng nào được ở trong radio cả")
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [userRole, setUserRole] = useState<"user" | "ai">("user");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState<boolean>(true);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [isVocabOpen, setIsVocabOpen] = useState<boolean>(false);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [completedScenarioIds, setCompletedScenarioIds] = useState<string[]>([]);
  
  // Mechanical animation states
  const [pullingScenarioId, setPullingScenarioId] = useState<string | null>(null);
  const [returningScenarioId, setReturningScenarioId] = useState<string | null>(null);
  const [doorState, setDoorState] = useState<"closed" | "opening" | "inserting" | "closing">("closed");

  // Speech rate ref for persistent value in speech synthesis callbacks
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

  // Continuous interaction listener for iOS Web Audio unlock
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

  // Initialize conversation and immediately speak first turn if shouldAutoPlay is true
  const initScenario = useCallback(
    (scenario: Scenario, role: "user" | "ai", shouldAutoPlay: boolean = false) => {
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

        if (shouldAutoPlay) {
          setIsPlaying(true);
          setTimeout(() => {
            speakText(openingEn, speechRateRef.current, () => {
              setActiveAudioId(null);
            });
            setActiveAudioId(initialId);
          }, 300);
        } else {
          setIsPlaying(false);
        }
      } else {
        setMessages([]);
        if (shouldAutoPlay) {
          setIsPlaying(true);
        }
      }
    },
    []
  );

  // Mechanical Sequence: Pull tape from shelf -> Open Radio Door -> Insert Tape -> Close Radio Door
  const handleSelectScenario = useCallback(
    (scenario: Scenario) => {
      if (currentScenario?.id === scenario.id) return;
      stopSpeaking();
      setIsPlaying(false);
      setActiveAudioId(null);

      const prevScenario = currentScenario;

      // Phase 1: Tape pull-out from shelf + return old tape + open door
      setPullingScenarioId(scenario.id);
      if (prevScenario) {
        setReturningScenarioId(prevScenario.id);
      }
      setDoorState("opening");

      // Phase 2 (300ms): Tape inserts into open radio bay
      setTimeout(() => {
        setPullingScenarioId(null);
        setCurrentScenario(scenario);
        setDoorState("inserting");
      }, 300);

      // Phase 3 (600ms): Radio bay snaps closed
      setTimeout(() => {
        setDoorState("closing");
        setReturningScenarioId(null);
      }, 600);

      // Phase 4 (900ms): Steady closed state, ready for PLAY
      setTimeout(() => {
        setDoorState("closed");
        initScenario(scenario, userRole, false);
      }, 900);
    },
    [currentScenario, userRole, initScenario]
  );

  // Play button on radio: Spins reels and immediately begins spoken roleplay
  const handleRadioPlay = () => {
    unlockAudio();
    if (!currentScenario || isPlaying) return;

    if (messages.length === 0) {
      initScenario(currentScenario, userRole, true);
    } else {
      setIsPlaying(true);
      const latestAi = [...messages].reverse().find((m) => m.sender === "ai");
      if (latestAi) {
        speakText(latestAi.textEn, speechRateRef.current, () => {
          setActiveAudioId(null);
        });
        setActiveAudioId(latestAi.id);
      }
    }
  };

  // Stop button on radio: Halts speech & stops spinning reels
  const handleRadioStop = () => {
    stopSpeaking();
    setIsPlaying(false);
    setActiveAudioId(null);
  };

  // Eject button on radio: Radio bay opens and returns tape back to shelf slot
  const handleRadioEject = () => {
    if (!currentScenario) return;
    stopSpeaking();
    setIsPlaying(false);
    setActiveAudioId(null);

    const ejectedScenario = currentScenario;
    setDoorState("opening");

    setTimeout(() => {
      setReturningScenarioId(ejectedScenario.id);
      setCurrentScenario(null);
      setMessages([]);
    }, 280);

    setTimeout(() => {
      setDoorState("closed");
    }, 550);

    setTimeout(() => {
      setReturningScenarioId(null);
    }, 850);
  };

  // Toggle roles
  const handleToggleRole = () => {
    const newRole = userRole === "user" ? "ai" : "user";
    setUserRole(newRole);
    if (currentScenario) {
      initScenario(currentScenario, newRole, isPlaying);
    }
  };

  // Toggle subtitles / Ear-First Masking
  const handleToggleSubtitles = () => {
    setSubtitlesEnabled((prev) => !prev);
  };

  // Speech Speed Controls (+ / -)
  const handleIncreaseSpeed = useCallback(() => {
    setSpeechRate((prev) => {
      const idx = SPEEDS.indexOf(prev);
      if (idx < SPEEDS.length - 1) {
        return SPEEDS[idx + 1];
      }
      return prev;
    });
  }, []);

  const handleDecreaseSpeed = useCallback(() => {
    setSpeechRate((prev) => {
      const idx = SPEEDS.indexOf(prev);
      if (idx > 0) {
        return SPEEDS[idx - 1];
      }
      return prev;
    });
  }, []);

  // Play audio for a specific message
  const handlePlayAudio = (msgId: string, text: string) => {
    unlockAudio();
    stopSpeaking();

    if (activeAudioId === msgId) {
      setActiveAudioId(null);
      return;
    }

    setIsPlaying(true);
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

  // Mark completion after active exchange
  const userMessageCount = messages.filter((m) => m.sender === "user").length;
  useEffect(() => {
    if (currentScenario && userMessageCount >= 2 && messages.length >= 4) {
      handleMarkCompleted(currentScenario.id);
    }
  }, [userMessageCount, messages.length, currentScenario, handleMarkCompleted]);

  // Send message to Gemini conversational backend
  const handleSendMessage = async (text: string) => {
    if (!currentScenario) return;
    unlockAudio();
    stopSpeaking();
    setActiveAudioId(null);
    setIsPlaying(true);

    const userMsgId = `msg-user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMsgId,
      sender: "user",
      roleName:
        userRole === "user"
          ? currentScenario.defaultRoles.user.name
          : currentScenario.defaultRoles.ai.name,
      textEn: text,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsAiThinking(true);

    const aiRoleInfo =
      userRole === "user"
        ? currentScenario.defaultRoles.ai
        : currentScenario.defaultRoles.user;

    try {
      const historyForApi = newMessages.map((m) => ({
        role: m.sender === "user" ? ("user" as const) : ("model" as const),
        parts: [{ text: `${m.roleName}: ${m.textEn}` }],
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId: currentTopic.id,
          scenarioId: currentScenario.id,
          messages: newMessages,
          userRole:
            userRole === "user"
              ? currentScenario.defaultRoles.user.name
              : currentScenario.defaultRoles.ai.name,
          aiRole: aiRoleInfo.name,
          message: text,
          history: historyForApi,
          scenarioTitleEn: currentScenario.titleEn,
          scenarioTitleVi: currentScenario.titleVi,
          situation: currentScenario.situation,
          partnerRoleName: aiRoleInfo.name,
          partnerRoleDesc: aiRoleInfo.titleVi || aiRoleInfo.titleEn,
          learnerRoleName:
            userRole === "user"
              ? currentScenario.defaultRoles.user.name
              : currentScenario.defaultRoles.ai.name,
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

  const learnerRoleInfo = currentScenario
    ? userRole === "user"
      ? currentScenario.defaultRoles.user
      : currentScenario.defaultRoles.ai
    : null;

  const dynamicHints = useMemo(() => {
    if (!currentScenario || !learnerRoleInfo) return [];
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
  }, [currentScenario, learnerRoleInfo]);

  const totalScenarios = useMemo(() => {
    return ALL_TOPICS.reduce((acc, t) => acc + t.scenarios.length, 0);
  }, []);

  const completedCount = completedScenarioIds.length;

  return (
    <div className="min-h-[100dvh] flex flex-col retro-room-wall text-stone-900 dark:text-stone-100 transition-colors duration-300">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 border-b border-amber-950/20 bg-[#f4efe8]/90 dark:bg-[#15110e]/90 backdrop-blur-md safe-top-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-600 text-stone-950 flex items-center justify-center flex-shrink-0 shadow-md shadow-amber-600/30">
              <Headphones className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg tracking-tight">
                English in Conservation
              </span>
              <span className="hidden sm:inline-block text-xs text-stone-600 dark:text-stone-400 ml-2 font-medium">
                • 2D Cassette Studio & Spoken Practice
              </span>
            </div>
          </div>

          {/* Right Action Hub */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {completedCount > 0 && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-900/10 dark:bg-amber-500/10 text-xs font-semibold text-amber-800 dark:text-amber-300 border border-amber-800/20">
                <Trophy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>
                  {completedCount}/{totalScenarios} Tapes
                </span>
              </div>
            )}

            {/* Vocabulary Drawer Button */}
            <button
              type="button"
              onClick={() => setIsVocabOpen(true)}
              disabled={!currentScenario}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-200/80 hover:bg-stone-300/80 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 disabled:opacity-40 transition-colors cursor-pointer"
              title="Open vocabulary & phrases"
            >
              <BookMarked className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">Vocabulary</span>
            </button>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* =========================================================================
          2D RETRO ROOM SCENE CONTAINER
          Upper portion: Plaster Wall
          Lower portion: Continuous Wooden Tabletop Workbench holding Rack & Radio
         ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col justify-between">
        {/* Wainscot wooden moulding trim between wall and table */}
        <div className="w-full h-1.5 rounded-full bg-gradient-to-r from-[#2c1a0e] via-[#4a2e19] to-[#2c1a0e] opacity-80 shadow-xs mb-4" />

        {/* Continuous Wooden Desk Surface holding Both Entities */}
        <div className="relative rounded-3xl p-4 sm:p-7 retro-desk-wood border-4 border-[#1c0f06] shadow-2xl flex-1 flex flex-col justify-between">
          {/* Natural Tabletop Ambient Lighting Sheen */}
          <div className="absolute top-0 inset-x-8 h-2 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent pointer-events-none" />

          {/* ===================================================================
              ELEVATED WORKSTATION CONSOLE BAR (Always visible above the fold)
             =================================================================== */}
          <div className="mb-6 pb-3 border-b border-amber-950/70 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-200/90 font-mono relative z-20">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] inline-block animate-pulse" />
              <span className="font-bold tracking-wider text-amber-300 uppercase">
                ACOUSTIC WORKSTATION
              </span>
              <span className="text-amber-500/40 hidden sm:inline">•</span>
              <span className="text-amber-300/80 hidden sm:inline uppercase">
                {currentTopic.titleEn}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-amber-400/70 hidden lg:inline">
                {currentScenario
                  ? `TAPE #${String(currentScenario.order || 1).padStart(2, "0")} LOADED`
                  : "RADIO DECK EMPTY"}
              </span>
              <button
                type="button"
                onClick={handleToggleRole}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#140a04] hover:bg-[#281408] border border-amber-700/60 hover:border-amber-400/80 text-amber-300 font-mono text-xs transition-all shadow-md press-tactile active:scale-95 cursor-pointer"
                title="Switch dialogue practice role"
              >
                <span className="text-amber-400/60">ROLE:</span>
                <span className="font-bold text-amber-200">
                  {userRole === "user" ? "YOU (LEARNER)" : "YOU (PARTNER)"}
                </span>
                <span className="text-[10px] px-1 py-0.5 rounded bg-amber-900/60 text-amber-300 font-bold uppercase ml-0.5">
                  SWAP ⇄
                </span>
              </button>
            </div>
          </div>

          {/* Tabletop Workbench Grid: Left = Wooden Rack (Image 1) | Right = 3D Radio (Image 2) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            {/* ===================================================================
                LEFT: Wooden Multi-Compartment Cassette Rack (Image 1)
               =================================================================== */}
            <div className="lg:col-span-7 xl:col-span-7 flex flex-col">
              <WoodenCassetteRack
                topics={ALL_TOPICS}
                selectedTopic={currentTopic}
                onSelectTopic={(t) => setCurrentTopic(t)}
                activeScenario={currentScenario}
                onSelectScenario={handleSelectScenario}
                completedScenarioIds={completedScenarioIds}
                pullingScenarioId={pullingScenarioId}
                returningScenarioId={returningScenarioId}
              />
            </div>

            {/* ===================================================================
                RIGHT: 3D Isometric Retro Cassette Radio (Image 2)
               =================================================================== */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-center">
              <IsometricRetroRadio
                topic={currentTopic}
                scenario={currentScenario}
                isPlaying={isPlaying}
                onPlay={handleRadioPlay}
                onStop={handleRadioStop}
                onEject={handleRadioEject}
                messages={messages}
                onSendMessage={handleSendMessage}
                isAiThinking={isAiThinking}
                activeAudioId={activeAudioId}
                isUserSpeaking={isUserSpeaking}
                onListeningChange={setIsUserSpeaking}
                onPlayAudio={handlePlayAudio}
                onStopAudio={handleStopAudio}
                onToggleReveal={handleToggleReveal}
                subtitlesEnabled={subtitlesEnabled}
                onToggleSubtitles={handleToggleSubtitles}
                speechRate={speechRate}
                onIncreaseSpeed={handleIncreaseSpeed}
                onDecreaseSpeed={handleDecreaseSpeed}
                suggestedHints={dynamicHints}
                userRole={userRole}
                onToggleUserRole={handleToggleRole}
                onResetChat={() => {
                  if (currentScenario) {
                    initScenario(currentScenario, userRole, false);
                  }
                }}
                doorState={doorState}
              />
            </div>
          </div>

          {/* ===================================================================
              DESK SURFACE ACCENT: 1984 Solid Oak Table Edge
             =================================================================== */}
          <div className="mt-6 pt-3 border-t border-amber-950/40 flex items-center justify-between text-[11px] text-amber-400/50 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600/60 inline-block" />
              <span>HANDCRAFTED SOLID WALNUT WORKBENCH</span>
            </span>
            <span className="hidden sm:inline">1984 VINTAGE ACOUSTIC SERIES</span>
          </div>
        </div>
      </main>

      {/* Floating Vocabulary Drawer */}
      {currentScenario && (
        <VocabularyDrawer
          isOpen={isVocabOpen}
          onClose={() => setIsVocabOpen(false)}
          vocabulary={currentScenario.vocabulary}
          scenarioTitle={`${currentScenario.order || 1}. ${currentScenario.titleEn}`}
        />
      )}
    </div>
  );
}
