import { Editor } from "@monaco-editor/react";

const MonacoEditor = ({
  language,
  value,
  onChange,
}: {
  language: string;
  value: string;
  onChange: (value: string | undefined) => void;
}) => {
  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      value={value}
      onChange={onChange}
      theme="vs-dark"
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        automaticLayout: true,
        scrollBeyondLastLine: false,
        wordWrap: "on",
      }}
    />
  );
};
export default MonacoEditor;
