import useTabs from "@/hooks/useTab";
import LanguageSelector from "../LanguageSelector";
import type { Tab as TabType, TabLanguageType, TabManagerProps } from "../type";
import { TAB_LANGUAGE_CONFIG } from "../const";
import TabItem from "../TabItem";
import EditorPanel from "../EditorPanel";
import { Tooltip } from "@/component/UI";

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
    clearAllTabs,
    exportTabs,
    importTabs,
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

  const handleImportTabs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importTabs(file);
      // 清空 input 值，允許重複選擇同一個檔案
      e.target.value = "";
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
          {/* 儲存管理按鈕 */}
          <div className="flex items-center space-x-1 mr-3">
            <Tooltip content="匯出所有分頁資料" position="bottom">
              <button
                onClick={exportTabs}
                disabled={tabs.length === 0}
                className="px-2 py-1.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:from-gray-500 disabled:to-gray-400 text-white rounded text-xs font-medium transition-all duration-200 ease-out shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-1 whitespace-nowrap min-w-fit"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </button>
            </Tooltip>

            <Tooltip content="匯入分頁資料" position="bottom">
              <label className="px-2 py-1.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded text-xs font-medium transition-all duration-200 ease-out shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-1 whitespace-nowrap min-w-fit cursor-pointer">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportTabs}
                  className="hidden"
                />
              </label>
            </Tooltip>

            <Tooltip content="清空所有分頁" position="bottom">
              <button
                onClick={clearAllTabs}
                disabled={tabs.length === 0}
                className="px-2 py-1.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 disabled:from-gray-500 disabled:to-gray-400 text-white rounded text-xs font-medium transition-all duration-200 ease-out shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-1 whitespace-nowrap min-w-fit"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </Tooltip>
          </div>

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
