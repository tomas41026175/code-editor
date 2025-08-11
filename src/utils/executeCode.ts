const executeCode = (html: string, css: string, js: string) => {
  const combinedCode = `
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>
            try {
              ${js}
            } catch (error) {
              console.error('執行錯誤:', error);
            }
          </script>
        </body>
      </html>
    `;

  return combinedCode;
};

export default executeCode;
