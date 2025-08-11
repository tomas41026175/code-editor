import { useCallback, useState } from "react";

export interface Tab {
  id: string;
  name: string;
  language: string;
  content: string;
}

const generateUniqId = () => {
  return Math.random().toString(36).substring(2, 15);
};

const useTabs = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");

  const addTab = useCallback((tab: Omit<Tab, "id">) => {
    const newTab = { ...tab, id: generateUniqId() };
    setTabs((prev) => [...prev, newTab]);
    setActiveTab(newTab.id);
  }, []);

  return { tabs, activeTab, addTab };
};

const TabManager = () => {
  const { tabs, activeTab, addTab } = useTabs();
  console.log(tabs, activeTab, addTab);

  return;
};

export default TabManager;
