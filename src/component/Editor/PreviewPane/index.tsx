import { useEffect, useRef } from "react";

interface PreviewPaneProps {
  html: string;
  css: string;
  js: string;
}

const PreviewPane = ({ html, css, js }: PreviewPaneProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 生成默認 HTML 模板
  const generateDefaultHTML = () => {
    if (html.trim()) {
      return html;
    }

    // 如果沒有 HTML 但有 CSS 或 JS，提供默認模板
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

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;

      if (doc) {
        const finalHTML = generateDefaultHTML();
        const finalCSS = css || "";
        const finalJS = js || "";

        doc.open();
        doc.write(`
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
                ${finalCSS}
              </style>
            </head>
            <body>
              ${finalHTML}
              <script>
                // 用戶自定義 JavaScript
                try {
                  ${finalJS}
                } catch (error) {
                  console.error('JavaScript 執行錯誤:', error);
                  document.getElementById('demo-output').innerHTML = 'JavaScript 錯誤: ' + error.message;
                }
              </script>
            </body>
          </html>
        `);
        doc.close();
      }
    }
  }, [html, css, js]);

  const hasContent = html.trim() || css.trim() || js.trim();

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
                在左側編輯器中編寫 HTML、CSS 或 JavaScript，
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
