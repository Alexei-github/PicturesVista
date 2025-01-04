"use client";

import React from "react";
import { useLanguageText } from "@/stores/languageLoad";
// const defaultLanguage = "Español";
import languageStyles from "@/components/language/language.module.css";
import LanguageEditTransalte from "@/components/language/languageEditTranslate";

type Props = {
  selectorClassName: string;
  onChangePassed?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children?: React.ReactNode;
  disabledSelect?: boolean;
  // defaultValuePassed?: string;
  defaultLanguage: string;
};

const LanguageSelectorUser = ({
  selectorClassName,
  onChangePassed,
  children,
  disabledSelect = false,
  // defaultValuePassed,
  defaultLanguage,
}: Props) => {
  const { getText, availableLanguages, setLanguage, selectedLanguage } =
    useLanguageText();

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setLanguage(e.target.value);
    },
    [setLanguage]
  );

  const selectTagId = React.useId();

  return (
    <select
      id={`clickedLanguage_${selectTagId}`}
      name="language"
      defaultValue={defaultLanguage}
      onChange={onChangePassed ? onChangePassed : onChange}
      className={selectorClassName}
      // {...(!onChangePassed && { value: selectedLanguage })}
      disabled={disabledSelect}
      style={{
        ...(disabledSelect && {
          color: "grey",
          borderColor: "grey",
          cursor: "default",
        }),
      }}
      // {...(value && { defaultValue: value })}
      // value={"language"}
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
  );
};

export default LanguageSelectorUser;
