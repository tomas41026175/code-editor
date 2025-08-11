import { useTabs } from "@hooks";
import LanguageSelector from "../LanguageSelector";
import type { TabManagerProps } from "../type";

const TabManager = ({ onTabsChange }: TabManagerProps) => {
  const {
    tabs,
    activeTab,
    addTab,
    removeTab,
    setActiveTab,
    updateTabContent,
    updateTabLanguage,
  } = useTabs({ onTabsChange });

  const handleAddTab = () => {
    addTab({
      name: `新檔案 ${tabs.length + 1}`,
      language: "html",
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

  const handleLanguageChange = (language: string) => {
    if (activeTab) {
      updateTabLanguage(activeTab, language);
    }
  };

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="flex flex-col h-full">
      {/* 標籤頁工具列 */}
      <div className="flex items-center justify-between bg-gray-800 border-b border-gray-700 px-4 py-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleAddTab}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
          >
            + 新檔案
          </button>
        </div>
        {activeTabData && (
          <LanguageSelector
            language={activeTabData.language}
            onLanguageChange={handleLanguageChange}
          />
        )}
      </div>

      {/* 標籤頁列表 */}
      <div className="flex bg-gray-900 border-b border-gray-700 overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`
              flex items-center px-4 py-2 cursor-pointer border-r border-gray-700 min-w-0
              ${
                activeTab === tab.id
                  ? "bg-gray-800 text-white border-b-2 border-b-blue-500"
                  : "bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-gray-300"
              }
            `}
          >
            <span className="truncate max-w-32">{tab.name}</span>
            <button
              onClick={(e) => handleTabClose(e, tab.id)}
              className="ml-2 text-gray-500 hover:text-red-400 transition-colors"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* 標籤頁內容區域 */}
      <div className="flex-1 bg-gray-800">
        {tabs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">歡迎使用代碼編輯器</p>
              <p className="text-sm mb-4">點擊「新檔案」開始編寫代碼</p>
              <button
                onClick={handleAddTab}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                創建第一個檔案
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`h-full ${
                  activeTab === tab.id ? "block" : "hidden"
                }`}
              >
                {/* 這裡將放置 MonacoEditor 組件 */}
                <div className="h-full bg-gray-900 text-gray-300 p-4">
                  <div className="mb-2 text-sm text-gray-400">
                    語言: {tab.language}
                  </div>
                  <textarea
                    value={tab.content}
                    onChange={(e) => updateTabContent(tab.id, e.target.value)}
                    className="w-full h-full bg-gray-800 text-gray-300 p-4 rounded border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
                    placeholder="開始編寫您的代碼..."
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabManager;
