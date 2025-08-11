import type { Tab } from "../type";

interface TabItemProps {
  tab: Tab;
  isActive: boolean;
  onClick: (tabId: string) => void;
  onClose: (e: React.MouseEvent, tabId: string) => void;
}

const TabItem = ({ tab, isActive, onClick, onClose }: TabItemProps) => {
  return (
    <div
      className={`
        flex items-center gap-2 px-3 py-2 cursor-pointer border-r border-gray-700/50
        transition-all duration-200 min-w-0
        ${
          isActive
            ? "bg-blue-600/20 text-white border-b-2 border-b-blue-500"
            : "bg-gray-900/80 text-gray-400 hover:bg-gray-800/90 hover:text-gray-300"
        }
      `}
      onClick={() => onClick(tab.id)}
    >
      {/* 語言圖標 */}
      <span className="text-xs opacity-70">
        {tab.language === "html" && "🌐"}
        {tab.language === "css" && "🎨"}
        {tab.language === "javascript" && "⚡"}
        {tab.language === "typescript" && "🔷"}
        {tab.language === "json" && "📄"}
        {tab.language === "markdown" && "📝"}
      </span>

      {/* 標籤頁名稱 */}
      <span className="truncate max-w-24 text-sm">{tab.name}</span>

      {/* 關閉按鈕 */}
      <button
        onClick={(e) => onClose(e, tab.id)}
        className="ml-1 w-5 h-5 rounded-full hover:bg-red-500/20 hover:text-red-400 text-gray-500 transition-colors flex items-center justify-center flex-shrink-0"
        title="關閉標籤頁"
      >
        <span className="text-sm leading-none">×</span>
      </button>
    </div>
  );
};

export default TabItem;
