import type { Tab, TabLanguageType } from "@component/Editor";
import { generateUniqId } from "@utils";
import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "code-editor-tabs";

const useTabs = ({
  onTabsChange,
  initialTabList = [],
}: {
  onTabsChange: (tabs: Tab[], activeTab: string) => void;
  initialTabList?: Omit<Tab, "id">[];
}) => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");

  const onTabsChangeRef = useRef(onTabsChange);
  onTabsChangeRef.current = onTabsChange;

  useEffect(() => {
    try {
      const savedTabs = localStorage.getItem(STORAGE_KEY);
      if (savedTabs) {
        const parsedTabs = JSON.parse(savedTabs);
        if (Array.isArray(parsedTabs) && parsedTabs.length > 0) {
          setTabs(parsedTabs);
          setActiveTab(parsedTabs[0].id);
          return;
        }
      }
    } catch (error) {
      console.warn("無法載入已保存的標籤頁:", error);
    }

    if (initialTabList.length > 0) {
      const newTabs = initialTabList.map((tab) => ({
        ...tab,
        id: generateUniqId(),
      }));
      setTabs(newTabs);
      setActiveTab(newTabs[0].id);
    }
  }, []);

  const saveTabsToStorage = useCallback((tabsToSave: Tab[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tabsToSave));
    } catch (error) {
      console.warn("無法保存標籤頁到 localStorage:", error);
    }
  }, []);

  useEffect(() => {
    // 總是調用 onTabsChange，即使沒有分頁
    onTabsChangeRef.current(tabs, activeTab);

    // 只有在有分頁時才保存到 localStorage
    if (tabs.length > 0) {
      saveTabsToStorage(tabs);
    } else {
      // 如果沒有分頁，清除 localStorage
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [tabs, activeTab, saveTabsToStorage]);

  const addTab = useCallback((tab: Omit<Tab, "id">) => {
    const newTab = {
      ...tab,
      id: generateUniqId(),
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTab(newTab.id);
  }, []);

  const removeTab = useCallback(
    (tabId: string) => {
      setTabs((prev) => {
        const newTabs = prev.filter((tab) => tab.id !== tabId);
        if (activeTab === tabId) {
          if (newTabs.length > 0) {
            setActiveTab(newTabs[0].id);
          } else {
            setActiveTab("");
          }
        }
        return newTabs;
      });
    },
    [activeTab]
  );

  const updateTabContent = useCallback((tabId: string, content: string) => {
    setTabs((prev) =>
      prev.map((tab) => (tab.id === tabId ? { ...tab, content } : tab))
    );
  }, []);

  const updateTabLanguage = useCallback(
    (tabId: string, language: TabLanguageType) => {
      setTabs((prev) =>
        prev.map((tab) => (tab.id === tabId ? { ...tab, language } : tab))
      );
    },
    []
  );

  const updateTabName = useCallback((tabId: string, name: string) => {
    setTabs((prev) =>
      prev.map((tab) => (tab.id === tabId ? { ...tab, name } : tab))
    );
  }, []);

  const clearAllTabs = useCallback(() => {
    setTabs([]);
    setActiveTab("");
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const exportTabs = useCallback(() => {
    try {
      const dataStr = JSON.stringify(tabs, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `code-editor-tabs-${
        new Date().toISOString().split("T")[0]
      }.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("匯出標籤頁失敗:", error);
    }
  }, [tabs]);

  const importTabs = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedTabs = JSON.parse(content);
        if (Array.isArray(importedTabs)) {
          const newTabs = importedTabs.map((tab) => ({
            ...tab,
            id: generateUniqId(),
          }));
          setTabs(newTabs);
          setActiveTab(newTabs[0]?.id || "");
        }
      } catch (error) {
        console.error("匯入標籤頁失敗:", error);
        alert("匯入失敗：檔案格式不正確");
      }
    };
    reader.readAsText(file);
  }, []);

  return {
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
  };
};

export default useTabs;
