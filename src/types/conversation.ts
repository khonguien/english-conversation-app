export interface VocabularyItem {
  id: string;
  word: string;
  partOfSpeech: string;
  ipa: string;
  meaningVi: string;
  synonyms: string[];
  antonyms?: string[];
  collocations: string[];
  exampleEn: string;
  exampleVi: string;
}

export interface DialogueTurn {
  speaker: "ai" | "user";
  roleName: string;
  textEn: string;
  textVi: string;
}

export interface RoleInfo {
  id: string;
  name: string;
  titleEn: string;
  titleVi: string;
  avatar: string;
  description?: string;
}

export interface Scenario {
  id: string;
  order: number;
  section: string;
  titleEn: string;
  titleVi: string;
  situation: string;
  defaultRoles: {
    ai: RoleInfo;
    user: RoleInfo;
  };
  initialMessageEn: string;
  initialMessageVi: string;
  vocabulary: VocabularyItem[];
  sampleDialogue: DialogueTurn[];
  suggestedHints: string[];
  isFreeTalk?: boolean;
}

export interface Topic {
  id: string;
  titleEn: string;
  titleVi: string;
  icon: string;
  description: string;
  scenarios: Scenario[];
}

export interface ChatMessage {
  id: string;
  sender: "ai" | "user" | "system";
  roleName: string;
  textEn: string;
  textVi?: string;
  timestamp: number;
  revealed?: boolean; // For listening challenge mode: whether student tapped to reveal text
}
