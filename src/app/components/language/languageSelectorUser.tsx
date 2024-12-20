import React from "react";
import { useLanguageText } from "@/stores/languageLoad";
const defaultLanguage = "Español";
import languageStyles from "@/components/language/language.module.css";
import LanguageEditTransalte from "@/components/language/languageEditTranslate";

type Props = {
  selectorClassName: string;
  onChangePassed?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children?: React.ReactNode;
  disabledSelect?: boolean;
};

const LanguageSelectorUser = ({
  selectorClassName,
  onChangePassed,
  children,
  disabledSelect = false,
}: Props) => {
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
        onChange={onChangePassed ? onChangePassed : onChange}
        className={selectorClassName}
        {...(!onChangePassed && { value: selectedLanguage })}
        disabled={disabledSelect}
      >
        {children}

        {Object.keys(availableLanguages).map((language, idx) => {
          return (
            <optgroup key={language + idx}>
              <option value={language} style={{ padding: "20px" }}>
                {language}
              </option>
            </optgroup>
          );
        })}
      </select>
    </div>
  );
};

export default LanguageSelectorUser;
