import { useEffect, useRef } from "react";

interface PreviewPaneProps {
  html: string;
  css: string;
  js: string;
}

const PreviewPane = ({ html, css, js }: PreviewPaneProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;

      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                ${css}
                body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
              </style>
            </head>
            <body>
              ${
                html ||
                '<div style="color: #666; text-align: center; padding: 40px;">HTML 內容將在這裡顯示</div>'
              }
              <script>
                try {
                  ${js}
                } catch (error) {
                  console.error('JavaScript 執行錯誤:', error);
                  document.body.innerHTML += '<div style="color: red; margin-top: 20px; padding: 10px; background: #fee; border: 1px solid #fcc; border-radius: 4px;">JavaScript 錯誤: ' + error.message + '</div>';
                }
              </script>
            </body>
          </html>
        `);
        doc.close();
      }
    }
  }, [html, css, js]);

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
        {!html && !css && !js ? (
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
