"use client";
const defaultLanguage = "Español";
import React from "react";
import type { Metadata } from "next";
import compStyles from "@/components/components.module.css";
import LanguageSelectorUser from "@/components/language/languageSelectorUser";
import languageStyles from "@/components/language/language.module.css";
import LanguageEditTransalte from "@/components/language/languageEditTranslate";
import { useLanguageText } from "@/stores/languageLoad";

export default function MainLangSelect() {
  const { getText, availableLanguages, setLanguage, selectedLanguage } =
    useLanguageText();

  React.useEffect(() => {
    setLanguage(defaultLanguage);
  }, [setLanguage]);

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "0.2rem" }}>
      <LanguageSelectorUser
        defaultLanguage={defaultLanguage}
        selectorClassName={`${languageStyles.language_selector} ${languageStyles.language_selector_navbar}`}
      />
      <LanguageEditTransalte />
    </div>
  );
}
