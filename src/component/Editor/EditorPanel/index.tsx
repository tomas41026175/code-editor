import { useState, useEffect } from "react";
import type { Tab, TabLanguageType } from "../type";
import { TAB_LANGUAGE_CONFIG } from "../const";
import MonacoEditor from "../MonacoEditor";

interface EditorPanelProps {
  activeTab: Tab | null;
  onTabUpdate: (tabId: string, updates: Partial<Tab>) => void;
}

const EditorPanel = ({ activeTab, onTabUpdate }: EditorPanelProps) => {
  const [localContent, setLocalContent] = useState("");
  const [localLanguage, setLocalLanguage] = useState<TabLanguageType>(
    TAB_LANGUAGE_CONFIG.HTML
  );

  useEffect(() => {
    if (activeTab) {
      setLocalContent(activeTab.content);
      setLocalLanguage(activeTab.language);
    }
  }, [activeTab]);

  // 自動保存功能
  useEffect(() => {
    if (activeTab && localContent !== activeTab.content) {
      const timeoutId = setTimeout(() => {
        onTabUpdate(activeTab.id, { content: localContent });
      }, 1000); // 1秒後自動保存

      return () => clearTimeout(timeoutId);
    }
  }, [localContent, activeTab, onTabUpdate]);

  const handleLanguageChange = (language: TabLanguageType) => {
    setLocalLanguage(language);
    if (activeTab) {
      onTabUpdate(activeTab.id, { language });
    }
  };

  const handleNameChange = (name: string) => {
    if (activeTab) {
      onTabUpdate(activeTab.id, { name });
    }
  };

  if (!activeTab) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-4">📝</div>
          <p className="text-lg mb-2">選擇一個標籤頁開始編輯</p>
          <p className="text-sm">或點擊「新檔案」創建新的標籤頁</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 min-h-0">
      {/* 編輯器工具列 */}
      <div className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 mb-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          {/* 檔案名稱編輯 */}
          <input
            type="text"
            value={activeTab.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="bg-gray-700 text-white px-3 py-1.5 rounded border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
            placeholder="檔案名稱"
          />

          {/* 語言選擇器 */}
          <select
            value={localLanguage}
            onChange={(e) =>
              handleLanguageChange(e.target.value as TabLanguageType)
            }
            className="bg-gray-700 text-white px-3 py-1.5 rounded border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
          >
            {Object.entries(TAB_LANGUAGE_CONFIG).map(([key, value]) => (
              <option key={key} value={value}>
                {key === "HTML" && "🌐 HTML"}
                {key === "CSS" && "🎨 CSS"}
                {key === "JAVASCRIPT" && "⚡ JavaScript"}
                {key === "TYPESCRIPT" && "🔷 TypeScript"}
                {key === "JSON" && "📄 JSON"}
                {key === "MARKDOWN" && "📝 Markdown"}
              </option>
            ))}
          </select>
        </div>

        {/* 保存狀態指示器 */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>自動保存</span>
        </div>
      </div>

      {/* Monaco 編輯器 */}
      <div className="flex-1 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden min-h-0">
        <MonacoEditor
          language={localLanguage}
          value={localContent}
          onChange={(value) => setLocalContent(value || "")}
        />
      </div>
    </div>
  );
};

export default EditorPanel;
