import type { TAB_LANGUAGE_CONFIG } from "./const";

export interface Tab {
  id: string;
  name: string;
  language: TabLanguageType;
  content: string;
}

export interface TabManagerProps {
  onTabsChange: (tabs: Tab[], activeTab: string) => void;
}

export type TabLanguageType =
  (typeof TAB_LANGUAGE_CONFIG)[keyof typeof TAB_LANGUAGE_CONFIG];

export interface LanguageSelectorProps {
  language: TabLanguageType;
  onLanguageChange: (language: TabLanguageType) => void;
}
