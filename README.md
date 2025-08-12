# 在線代碼編輯器

一個基於 Monaco Editor 的現代化在線代碼編輯器，支援多標籤頁管理、實時預覽和本地儲存功能。

## 🚀 功能特色

### 核心功能

- **多語言支援** - HTML、CSS、JavaScript、TypeScript、JSON、Markdown 等
- **多標籤頁管理** - 支援多文件同時編輯，可拖拽調整分割比例
- **實時預覽** - HTML/CSS/JS 代碼即時執行預覽
- **智能預覽模式** - 自動檢測內容類型，支援 HTML、Markdown、JSON 三種預覽模式

### 編輯器功能

- **Monaco Editor 核心** - VS Code 級別的代碼編輯體驗
- **語法高亮** - 支援所有主流程式語言的語法高亮
- **智能提示** - 自動完成、語法檢查、錯誤提示
- **語言選擇器** - 可切換不同程式語言的編輯模式

### 預覽功能

- **HTML 預覽** - 完整的 HTML/CSS/JS 執行環境
- **Markdown 預覽** - 支援所有 Markdown 語法，即時渲染
- **JSON 預覽** - 樹狀結構顯示，語法高亮，自動格式化修復
- **錯誤處理** - 智能錯誤提示和修復建議

### 數據管理

- **本地儲存** - 自動保存所有分頁內容到 localStorage
- **匯出功能** - 可匯出所有分頁為 JSON 檔案
- **匯入功能** - 支援從 JSON 檔案匯入分頁
- **清空功能** - 一鍵清空所有分頁數據

### 用戶體驗

- **響應式設計** - 適配各種螢幕尺寸
- **拖拽分割** - 可拖拽調整編輯器和預覽區域的比例
- **工具提示** - 智能 Tooltip 組件，提供操作指引
- **現代化 UI** - 基於 Tailwind CSS 的美觀界面

## 🛠 技術棧

### 前端框架

- **React 19** - 最新版本的 React 框架
- **TypeScript 5.8** - 完整的類型安全支援
- **Vite 7.1** - 快速的構建工具和開發伺服器

### 樣式和 UI

- **Tailwind CSS 3.4** - 實用優先的 CSS 框架
- **PostCSS** - CSS 後處理器
- **Autoprefixer** - 自動添加 CSS 前綴

### 代碼編輯

- **Monaco Editor 0.52** - VS Code 的核心編輯器
- **@monaco-editor/react 4.7** - React 封裝的 Monaco Editor

### 工具和庫

- **Marked 16.1** - Markdown 解析器
- **ESLint 9.32** - 代碼質量檢查
- **pnpm** - 快速、節省磁盤空間的包管理器

## 📁 專案結構

```
src/
├── component/
│   ├── Editor/                 # 編輯器核心組件
│   │   ├── EditorLayout.tsx   # 主佈局組件
│   │   ├── TabManager/        # 分頁管理組件
│   │   ├── MonacoEditor/      # Monaco 編輯器組件
│   │   ├── PreviewPane/       # 預覽面板組件
│   │   ├── LanguageSelector/  # 語言選擇器
│   │   ├── TabItem/           # 分頁項目組件
│   │   ├── EditorPanel/       # 編輯器面板
│   │   ├── type.ts            # 類型定義
│   │   └── const.ts           # 常量定義
│   └── UI/                    # 通用 UI 組件
│       └── Tooltip/           # 工具提示組件
├── hooks/                      # 自定義 React Hooks
│   └── useTab.tsx             # 分頁管理 Hook
├── utils/                      # 工具函數
│   └── executeCode.ts         # 代碼執行工具
├── App.tsx                     # 主應用組件
└── main.tsx                    # 應用入口點
```

## 📦 快速開始

### 環境要求

- **Node.js**: 18.0.0 或更高版本
- **pnpm**: 8.0.0 或更高版本（推薦使用 pnpm 作為包管理器）

### 安裝和運行

```bash
# 克隆項目
git clone <repository-url>
cd code-editor

# 安裝依賴
pnpm install

# 啟動開發伺服器
pnpm dev

# 構建生產版本
pnpm build

# 預覽生產版本
pnpm preview

# 代碼檢查
pnpm lint
```

### 開發模式

開發伺服器會在 `http://localhost:5173` 啟動，支援：

- 熱重載 (Hot Reload)
- 快速構建
- 即時錯誤提示

## 🎯 使用指南

### 基本操作

1. **創建新分頁** - 點擊「新檔案」按鈕
2. **切換語言** - 使用右上角的語言選擇器
3. **調整佈局** - 拖拽中間的分割線調整編輯器和預覽區域比例
4. **切換預覽模式** - 在預覽區域頂部選擇 HTML、Markdown 或 JSON 模式

### 預覽功能

- **HTML 模式**: 顯示 HTML/CSS/JS 的執行結果
- **Markdown 模式**: 渲染 Markdown 語法，支援標題、列表、代碼塊等
- **JSON 模式**: 樹狀顯示 JSON 數據，自動格式化，錯誤修復

### 數據管理

- **自動保存**: 所有修改會自動保存到瀏覽器本地儲存
- **匯出數據**: 點擊「匯出」按鈕下載所有分頁數據
- **匯入數據**: 點擊「匯入」按鈕從檔案恢復分頁數據
- **清空數據**: 點擊「清空」按鈕清除所有分頁

## 🔧 配置選項

### Tailwind CSS 配置

專案使用 Tailwind CSS 3.4，配置文件位於 `tailwind.config.js`，支援：

- 自定義顏色主題
- 響應式斷點
- 自定義組件樣式

### TypeScript 配置

TypeScript 配置位於 `tsconfig.json`，支援：

- 嚴格模式
- 路徑別名 (`@/` 指向 `src/`)
- 最新的 TypeScript 特性

### ESLint 配置

代碼質量檢查配置位於 `eslint.config.js`，包含：

- React Hooks 規則
- TypeScript 規則
- 代碼風格統一
