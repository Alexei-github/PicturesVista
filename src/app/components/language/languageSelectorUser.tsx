"use client";

import React from "react";
import { gs_1_useLanguageText } from "@/components/language/stores/gs_1_languageLoad";

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
  defaultLanguage,
}: Props) => {
  const { availableLanguages: availableLanguages, setLanguage: setLanguage } =
    gs_1_useLanguageText();

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
