import { TAB_LANGUAGE_CONFIG, TAB_LANGUAGES } from "../const";
import type { LanguageSelectorProps, TabLanguageType } from "../type";

const _isTabLanguageType = (value: string): value is TabLanguageType => {
  return Object.values(TAB_LANGUAGE_CONFIG).includes(value as TabLanguageType);
};

const LanguageSelector = ({
  language,
  onLanguageChange,
}: LanguageSelectorProps) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-xs text-gray-400">語言:</span>
      <select
        value={language}
        onChange={(e) => {
          if (_isTabLanguageType(e.target.value)) {
            onLanguageChange(e.target.value);
          }
        }}
        className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
      >
        {TAB_LANGUAGES.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.icon} {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
