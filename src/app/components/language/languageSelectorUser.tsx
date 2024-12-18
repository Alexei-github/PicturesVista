import React from "react";
import { useLanguageText } from "@/stores/languageLoad";
const defaultLanguage = "Español";

const LanguageSelectorUser = () => {
  const { getText, availableLanguages, setLanguage, selectedLanguage } =
    useLanguageText();

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setLanguage(e.target.value);
    },
    [setLanguage]
  );

  React.useEffect(() => {
    setLanguage(defaultLanguage);
  }, [setLanguage]);

  return (
    <div>
      <select
        id="clickedLanguage"
        name="language"
        defaultValue={defaultLanguage}
        onChange={onChange}
      >
        {Object.keys(availableLanguages).map((language, idx) => {
          return (
            <option key={language + idx} value={language}>
              {language}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default LanguageSelectorUser;
