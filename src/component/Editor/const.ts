import type { TabLanguageType } from "./type";

export const TAB_LANGUAGE_CONFIG = {
  HTML: "html",
  CSS: "css",
  JAVASCRIPT: "javascript",
  TYPESCRIPT: "typescript",
  JSON: "json",
  MARKDOWN: "markdown",
} as const;

export const TAB_LANGUAGES: {
  value: TabLanguageType;
  label: string;
  icon: string;
}[] = [
  { value: TAB_LANGUAGE_CONFIG.HTML, label: "HTML", icon: "🌐" },
  { value: TAB_LANGUAGE_CONFIG.CSS, label: "CSS", icon: "🎨" },
  { value: TAB_LANGUAGE_CONFIG.JAVASCRIPT, label: "JavaScript", icon: "⚡" },
  { value: TAB_LANGUAGE_CONFIG.TYPESCRIPT, label: "TypeScript", icon: "🔷" },
  { value: TAB_LANGUAGE_CONFIG.JSON, label: "JSON", icon: "📄" },
  { value: TAB_LANGUAGE_CONFIG.MARKDOWN, label: "Markdown", icon: "📝" },
];
