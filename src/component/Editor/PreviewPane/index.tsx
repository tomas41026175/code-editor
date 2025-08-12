import { useEffect, useRef, useState } from "react";
import { marked } from "marked";

interface PreviewPaneProps {
  html: string;
  css: string;
  js: string;
  markdown?: string;
  json?: string;
}

const PreviewPane = ({ html, css, js, markdown, json }: PreviewPaneProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [previewMode, setPreviewMode] = useState<"html" | "markdown" | "json">(
    "html"
  );

  // 檢測內容類型並設置預覽模式
  useEffect(() => {
    if (markdown?.trim()) {
      setPreviewMode("markdown");
    } else if (json?.trim()) {
      setPreviewMode("json");
    } else if (html?.trim() || css?.trim() || js?.trim()) {
      setPreviewMode("html");
    } else {
      // 當沒有內容時，重置為 html 模式
      setPreviewMode("html");
    }
  }, [html, css, js, markdown, json]);

  // 渲染 Markdown
  const renderMarkdown = (md: string) => {
    try {
      return marked(md);
    } catch (error) {
      return `<p class="text-red-500">Markdown 解析錯誤: ${error}</p>`;
    }
  };

  // 格式化 JSON
  const formatJSON = (jsonStr: string): string => {
    try {
      const parsed = JSON.parse(jsonStr);
      return JSON.stringify(parsed, null, 2);
    } catch {
      // 如果解析失敗，嘗試手動格式化
      try {
        // 移除多餘的空格和換行
        const cleaned = jsonStr.replace(/\s+/g, " ").trim();

        // 嘗試修復常見的 JSON 格式問題
        let fixed = cleaned;

        // 修復沒有引號的屬性名
        fixed = fixed.replace(/(\w+):/g, '"$1":');

        // 修復沒有引號的字符串值（但保留數字、布爾值、null等）
        fixed = fixed.replace(/:\s*([^"{\d][^,}\]]*[^"\s,}\]])/g, ': "$1"');

        // 移除尾隨逗號
        fixed = fixed.replace(/,(\s*[}\]])/g, "$1");

        // 再次嘗試解析
        const parsed = JSON.parse(fixed);
        return JSON.stringify(parsed, null, 2);
      } catch {
        // 如果還是失敗，返回原始字符串
        return jsonStr;
      }
    }
  };

  // 渲染 JSON 預覽
  const renderJSONPreview = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      return `
        <div class="json-preview">
          <h2>JSON 預覽</h2>
          <div class="json-tree">
            ${renderJSONTree(parsed)}
          </div>
        </div>
      `;
    } catch (error) {
      return `
        <div class="json-preview">
          <h2>JSON 預覽</h2>
          <div class="json-error">
            <div class="error-header">
              <span class="error-icon">⚠️</span>
              <span class="error-title">JSON 格式錯誤</span>
            </div>
            <div class="error-message">${
              error instanceof Error ? error.message : String(error)
            }</div>
            <div class="error-suggestion">
              <h4>常見 JSON 格式問題：</h4>
              <ul>
                <li>屬性名稱必須用雙引號包圍：<code>"name"</code> 而不是 <code>name</code></li>
                <li>字符串值必須用雙引號包圍：<code>"value"</code> 而不是 <code>value</code></li>
                <li>最後一個屬性後面不能有逗號</li>
                <li>確保所有括號和引號都正確配對</li>
              </ul>
            </div>
            <div class="formatted-json">
              <h4>格式化後的 JSON：</h4>
              <pre><code>${formatJSON(jsonStr)}</code></pre>
            </div>
          </div>
        </div>
      `;
    }
  };

  // 遞歸渲染 JSON 樹狀結構
  const renderJSONTree = (obj: unknown, level = 0): string => {
    const indent = "  ".repeat(level);
    let html = "";

    if (obj === null) {
      return `<span class="json-null">null</span>`;
    }

    if (typeof obj === "undefined") {
      return `<span class="json-undefined">undefined</span>`;
    }

    if (typeof obj === "string") {
      return `<span class="json-string">"${obj}"</span>`;
    }

    if (typeof obj === "number") {
      return `<span class="json-number">${obj}</span>`;
    }

    if (typeof obj === "boolean") {
      return `<span class="json-boolean">${obj}</span>`;
    }

    if (Array.isArray(obj)) {
      html += '<span class="json-bracket">[</span><br>';
      obj.forEach((item, index) => {
        html += `${indent}  <span class="json-key">${index}:</span> ${renderJSONTree(
          item,
          level + 1
        )}<br>`;
      });
      html += `${indent}<span class="json-bracket">]</span>`;
      return html;
    }

    if (typeof obj === "object" && obj !== null) {
      html += '<span class="json-bracket">{</span><br>';
      Object.keys(obj as Record<string, unknown>).forEach((key) => {
        html += `${indent}  <span class="json-key">"${key}":</span> ${renderJSONTree(
          (obj as Record<string, unknown>)[key],
          level + 1
        )}<br>`;
      });
      html += `${indent}<span class="json-bracket">}</span>`;
      return html;
    }

    return String(obj);
  };

  const hasContent =
    html?.trim() ||
    css?.trim() ||
    js?.trim() ||
    markdown?.trim() ||
    json?.trim();

  // 調試信息
  console.log('PreviewPane Debug:', {
    html: html?.trim() || '',
    css: css?.trim() || '',
    js: js?.trim() || '',
    markdown: markdown?.trim() || '',
    json: json?.trim() || '',
    hasContent,
    previewMode
  });

  // 當沒有內容時，重置預覽模式
  useEffect(() => {
    if (!hasContent) {
      setPreviewMode("html");
    }
  }, [hasContent]);

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      
      // 如果沒有內容，清除 iframe
      if (!hasContent) {
        iframe.srcdoc = "";
        return;
      }

      const doc = iframe.contentDocument || iframe.contentWindow?.document;

      if (doc) {
        let content = "";
        let customCSS = "";

        if (previewMode === "markdown" && markdown?.trim()) {
          content = `
            <div class="markdown-preview">
              ${renderMarkdown(markdown)}
            </div>
          `;
          customCSS = `
            .markdown-preview {
              max-width: 800px;
              margin: 0 auto;
              padding: 2rem;
              line-height: 1.6;
            }
            .markdown-preview h1, .markdown-preview h2, .markdown-preview h3,
            .markdown-preview h4, .markdown-preview h5, .markdown-preview h6 {
              margin-top: 2rem;
              margin-bottom: 1rem;
              color: #2c3e50;
            }
            .markdown-preview h1 { border-bottom: 3px solid #3498db; padding-bottom: 0.5rem; }
            .markdown-preview h2 { border-bottom: 2px solid #e74c3c; padding-bottom: 0.3rem; }
            .markdown-preview p { margin-bottom: 1rem; }
            .markdown-preview ul, .markdown-preview ol { margin-bottom: 1rem; padding-left: 2rem; }
            .markdown-preview li { margin-bottom: 0.5rem; }
            .markdown-preview blockquote {
              border-left: 4px solid #3498db;
              padding-left: 1rem;
              margin: 1rem 0;
              color: #555;
              font-style: italic;
            }
            .markdown-preview code {
              background: #f8f9fa;
              padding: 0.2rem 0.4rem;
              border-radius: 3px;
              font-family: 'Monaco', 'Menlo', monospace;
            }
            .markdown-preview pre {
              background: #2c3e50;
              color: #ecf0f1;
              padding: 1rem;
              border-radius: 5px;
              overflow-x: auto;
            }
            .markdown-preview pre code {
              background: none;
              padding: 0;
              color: inherit;
            }
          `;
        } else if (previewMode === "json" && json?.trim()) {
          content = renderJSONPreview(json);
          customCSS = `
            .json-preview {
              max-width: 1000px;
              margin: 0 auto;
              padding: 2rem;
              font-family: 'Monaco', 'Menlo', monospace;
              font-size: 14px;
              line-height: 1.5;
            }
            .json-preview h2 {
              color: #2c3e50;
              margin-bottom: 1.5rem;
              border-bottom: 2px solid #3498db;
              padding-bottom: 0.5rem;
            }
            .json-tree {
              background: #f8f9fa;
              padding: 1.5rem;
              border-radius: 8px;
              border: 1px solid #e9ecef;
              white-space: pre-wrap;
            }
            .json-key { color: #e74c3c; font-weight: bold; }
            .json-string { color: #27ae60; }
            .json-number { color: #f39c12; }
            .json-boolean { color: #9b59b6; font-weight: bold; }
            .json-null { color: #95a5a6; font-style: italic; }
            .json-undefined { color: #95a5a6; font-style: italic; }
            .json-bracket { color: #34495e; font-weight: bold; }
            .json-error {
              background: #fdf6e3;
              padding: 1.5rem;
              border-radius: 8px;
              border: 1px solid #eee8d5;
              color: #555;
            }
            .error-header {
              display: flex;
              align-items: center;
              margin-bottom: 1rem;
              color: #c09853;
            }
            .error-icon {
              font-size: 1.5rem;
              margin-right: 0.5rem;
            }
            .error-title {
              font-weight: bold;
            }
            .error-message {
              color: #c09853;
              font-size: 0.9rem;
              margin-bottom: 1rem;
            }
            .error-suggestion h4 {
              margin-top: 0;
              margin-bottom: 0.5rem;
              color: #333;
            }
            .error-suggestion ul {
              list-style: disc;
              padding-left: 1.5rem;
              margin-bottom: 1rem;
            }
            .error-suggestion li {
              margin-bottom: 0.3rem;
            }
            .formatted-json h4 {
              margin-top: 0;
              margin-bottom: 0.5rem;
              color: #333;
            }
            .formatted-json pre {
              background: #f8f9fa;
              padding: 0.8rem;
              border-radius: 5px;
              overflow-x: auto;
            }
            .formatted-json pre code {
              background: none;
              padding: 0;
              color: inherit;
            }
          `;
        } else {
          // 原有的 HTML 預覽邏輯
          const generateDefaultHTML = () => {
            if (html.trim()) {
              return html;
            }

            if (css.trim() || js.trim()) {
              return `
                <!DOCTYPE html>
                <html lang="zh-TW">
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>代碼預覽</title>
                </head>
                <body>
                    <div class="container">
                        <h1>CSS/JS 預覽</h1>
                        <p>這是一個預覽模板，您可以在此看到 CSS 和 JavaScript 的效果</p>
                        <div id="demo-area">
                            <button id="demo-button">點擊我</button>
                            <div id="demo-output">輸出結果將顯示在這裡</div>
                        </div>
                    </div>
                </body>
                </html>
              `;
            }
            return "";
          };

          content = generateDefaultHTML();
          customCSS = css || "";
        }

        const fullHTML = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                /* 基礎樣式 */
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  background: #f8f9fa;
                  padding: 20px;
                }
                
                .container {
                  max-width: 800px;
                  margin: 0 auto;
                  background: white;
                  padding: 2rem;
                  border-radius: 8px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                
                h1 {
                  color: #2c3e50;
                  margin-bottom: 1rem;
                  border-bottom: 2px solid #3498db;
                  padding-bottom: 0.5rem;
                }
                
                p {
                  color: #555;
                  margin-bottom: 1.5rem;
                }
                
                #demo-area {
                  margin-top: 2rem;
                  padding: 1.5rem;
                  background: #f8f9fa;
                  border-radius: 6px;
                  border: 1px solid #e9ecef;
                }
                
                #demo-button {
                  background: #3498db;
                  color: white;
                  border: none;
                  padding: 10px 20px;
                  border-radius: 5px;
                  cursor: pointer;
                  font-size: 16px;
                  margin-bottom: 1rem;
                  transition: background 0.3s ease;
                }
                
                #demo-button:hover {
                  background: #2980b9;
                }
                
                #demo-output {
                  padding: 1rem;
                  background: white;
                  border: 1px solid #dee2e6;
                  border-radius: 4px;
                  min-height: 60px;
                  font-family: monospace;
                }
                
                /* 用戶自定義 CSS */
                ${customCSS}
              </style>
            </head>
            <body>
              ${content}
              ${
                previewMode === "html" && js
                  ? `
                <script>
                  try {
                    ${js}
                  } catch (error) {
                    console.error('JavaScript 執行錯誤:', error);
                    const outputElement = document.getElementById('demo-output');
                    if (outputElement) {
                      outputElement.innerHTML = 'JavaScript 錯誤: ' + error.message;
                    }
                  }
                </script>
              `
                  : ""
              }
            </body>
          </html>
        `;

        iframe.srcdoc = fullHTML;
      }
    }
  }, [html, css, js, markdown, json, previewMode, hasContent]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 預覽工具列 */}
      <div className="flex items-center justify-between bg-gray-100 border-b border-gray-200 px-4 py-2">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-medium text-gray-700">實時預覽</h3>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-500">即時更新</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* 預覽模式切換 */}
          {hasContent && (
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-500">模式:</span>
              <select
                value={previewMode}
                onChange={(e) =>
                  setPreviewMode(e.target.value as "html" | "markdown" | "json")
                }
                className="text-xs bg-white border border-gray-300 rounded px-2 py-1 text-gray-700"
              >
                {(html?.trim() || css?.trim() || js?.trim()) && (
                  <option value="html">HTML</option>
                )}
                {markdown?.trim() && <option value="markdown">Markdown</option>}
                {json?.trim() && <option value="json">JSON</option>}
              </select>
            </div>
          )}
          <button
            onClick={() => iframeRef.current?.contentWindow?.location.reload()}
            className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
          >
            重新整理
          </button>
        </div>
      </div>

      {/* 預覽內容 */}
      <div className="flex-1 relative">
        {!hasContent ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-4">👀</div>
              <p className="text-lg mb-2">開始編寫代碼</p>
              <p className="text-sm">
                支援 HTML、CSS、JavaScript、Markdown 和 JSON
              </p>
              <p className="text-sm">結果將在這裡即時顯示</p>
            </div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            title="代碼預覽"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
          />
        )}
      </div>
    </div>
  );
};

export default PreviewPane;
