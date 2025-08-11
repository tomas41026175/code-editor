import type { Tab } from "@component/Editor";
import { generateUniqId } from "@utils";
import { useCallback, useEffect, useState } from "react";

const useTabs = ({
  onTabsChange,
  initialTabList = [],
}: {
  onTabsChange: (tabs: Tab[], activeTab: string) => void;
  initialTabList?: Omit<Tab, "id">[];
}) => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    if (initialTabList.length > 0) {
      const newTabs = initialTabList.map((tab) => ({
        ...tab,
        id: generateUniqId(),
      }));
      setTabs(newTabs);
      setActiveTab(newTabs[0].id);
    }
  }, []);

  useEffect(() => {
    onTabsChange(tabs, activeTab);
  }, [tabs, activeTab, onTabsChange]);

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
        if (activeTab === tabId && newTabs.length > 0) {
          setActiveTab(newTabs[0].id);
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

  const updateTabLanguage = useCallback((tabId: string, language: string) => {
    setTabs((prev) =>
      prev.map((tab) => (tab.id === tabId ? { ...tab, language } : tab))
    );
  }, []);

  return {
    tabs,
    activeTab,
    addTab,
    removeTab,
    setActiveTab,
    updateTabContent,
    updateTabLanguage,
  };
};

export default useTabs;
