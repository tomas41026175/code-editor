import { useState, useCallback } from "react";
import TabManager from "@/component/Editor/TabManager";
import PreviewPane from "@/component/Editor/PreviewPane";

export interface Tab {
  id: string;
  name: string;
  language: string;
  content: string;
}

const EditorLayout = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [splitRatio, setSplitRatio] = useState(60); // 左側編輯器佔比

  // 從 TabManager 獲取標籤頁數據
  const handleTabsChange = useCallback(
    (newTabs: Tab[], newActiveTab: string) => {
      setTabs(newTabs);
      setActiveTab(newActiveTab);
    },
    []
  );

  // 獲取當前活動標籤頁的內容
  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  // 根據語言類型分離內容
  const getContentByLanguage = () => {
    if (!activeTabData) return { html: "", css: "", js: "" };

    const { language, content } = activeTabData;

    switch (language) {
      case "html":
        return { html: content, css: "", js: "" };
      case "css":
        return { html: "", css: content, js: "" };
      case "javascript":
      case "typescript":
        return { html: "", css: "", js: content };
      default:
        return { html: content, css: "", js: "" };
    }
  };

  const { html, css, js } = getContentByLanguage();

  // 拖拽調整分割比例
  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startRatio = splitRatio;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const containerWidth = window.innerWidth;
      const newRatio = Math.max(
        20,
        Math.min(80, startRatio + (deltaX / containerWidth) * 100)
      );
      setSplitRatio(newRatio);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* 左側編輯器區域 */}
      <div className="flex flex-col" style={{ width: `${splitRatio}%` }}>
        <TabManager onTabsChange={handleTabsChange} />
      </div>

      {/* 分割線 */}
      <div
        className="w-1 bg-gray-700 cursor-col-resize hover:bg-blue-500 transition-colors"
        onMouseDown={handleMouseDown}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-0.5 h-8 bg-gray-500 rounded-full"></div>
        </div>
      </div>

      {/* 右側預覽區域 */}
      <div className="flex flex-col" style={{ width: `${100 - splitRatio}%` }}>
        <PreviewPane html={html} css={css} js={js} />
      </div>
    </div>
  );
};

export default EditorLayout;
