import useTabs from "@/hooks/useTab";
import LanguageSelector from "../LanguageSelector";
import type { Tab as TabType, TabLanguageType, TabManagerProps } from "../type";
import { TAB_LANGUAGE_CONFIG } from "../const";
import TabItem from "../TabItem";
import EditorPanel from "../EditorPanel";

const TabManager = ({ onTabsChange }: TabManagerProps) => {
  const {
    tabs,
    activeTab,
    addTab,
    removeTab,
    setActiveTab,
    updateTabContent,
    updateTabLanguage,
    updateTabName,
  } = useTabs({ onTabsChange });

  const handleAddTab = () => {
    addTab({
      name: `新檔案 ${tabs.length + 1}`,
      language: TAB_LANGUAGE_CONFIG.HTML,
      content: "",
    });
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleTabClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    removeTab(tabId);
  };

  const handleLanguageChange = (language: TabLanguageType) => {
    if (activeTab) {
      updateTabLanguage(activeTab, language);
    }
  };

  const activeTabData = tabs.find((tab: TabType) => tab.id === activeTab);

  // 處理標籤頁更新
  const handleTabUpdate = (tabId: string, updates: Partial<TabType>) => {
    // 使用 useTabs 提供的函數來更新狀態
    if (updates.content !== undefined) {
      updateTabContent(tabId, updates.content);
    }
    if (updates.language !== undefined) {
      updateTabLanguage(tabId, updates.language);
    }
    if (updates.name !== undefined) {
      updateTabName(tabId, updates.name);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 標籤頁工具列 */}
      <div className="flex items-center justify-between bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700/50 px-4 py-3">
        <div className="flex items-center mt-2 ml-1 flex-shrink-0">
          <button
            onClick={handleAddTab}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg text-sm font-medium transition-all duration-200 ease-out shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 whitespace-nowrap min-w-fit"
          >
            <svg
              className="w-3 h-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="flex-shrink-0 text-sm">新檔案</span>
          </button>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          {activeTabData && (
            <LanguageSelector
              language={activeTabData.language}
              onLanguageChange={handleLanguageChange}
            />
          )}
        </div>
      </div>

      {/* 標籤頁列表 */}
      <div className="flex bg-gradient-to-r from-gray-900 to-gray-950 border-b border-gray-700/50 overflow-x-auto">
        {tabs.map((tab: TabType) => (
          <TabItem
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onClick={handleTabClick}
            onClose={handleTabClose}
          />
        ))}
      </div>

      {/* 編輯器面板 */}
      <div className="flex-1 min-h-0">
        <EditorPanel
          activeTab={activeTabData || null}
          onTabUpdate={handleTabUpdate}
        />
      </div>
    </div>
  );
};

export default TabManager;
