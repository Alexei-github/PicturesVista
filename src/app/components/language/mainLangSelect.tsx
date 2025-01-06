"use client";
import React from "react";
import LanguageSelectorUser from "@/components/language/LanguageSelectorUser";
import languageStyles from "@/components/language/language.module.css";
import LanguageEditTransalte from "@/components/language/LanguageEditTranslate";
import { useLanguageText_gs_1 } from "@/components/language/globalStores/gs_1_languageLoad";
import { DEFAULT_LANGUAGE } from "@/components/language/lib/constants";

export default function MainLangSelect() {
  const { setLanguage: setLanguage } = useLanguageText_gs_1();

  React.useEffect(() => {
    setLanguage(DEFAULT_LANGUAGE);
  }, [setLanguage]);

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "0.2rem" }}>
      <LanguageSelectorUser
        p_defaultLanguage={DEFAULT_LANGUAGE}
        p_selectorClassName={`${languageStyles.language_selector} ${languageStyles.language_selector_navbar}`}
      />
      <LanguageEditTransalte />
    </div>
  );
}
