"use client";
import React from "react";
import LanguageSelectorUser from "@/components/language/languageSelectorUser";
import languageStyles from "@/components/language/language.module.css";
import LanguageEditTransalte from "@/components/language/languageEditTranslate";
import { useLanguageText } from "@/stores/languageLoad";
import { DEFAULT_LANGUAGE } from "@/components/language/lib/constants";

export default function MainLangSelect() {
  const { setLanguage } = useLanguageText();

  React.useEffect(() => {
    setLanguage(DEFAULT_LANGUAGE);
  }, [setLanguage]);

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "0.2rem" }}>
      <LanguageSelectorUser
        defaultLanguage={DEFAULT_LANGUAGE}
        selectorClassName={`${languageStyles.language_selector} ${languageStyles.language_selector_navbar}`}
      />
      <LanguageEditTransalte />
    </div>
  );
}
