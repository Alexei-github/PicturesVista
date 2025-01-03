"use client";

import React from "react";
import { useLanguageText } from "@/stores/languageLoad";
const defaultLanguage = "Español";
import Btn from "@/lib/buttons/btn";
import languageStyles from "@/components/language/language.module.css";
import LanguageDevModal from "@/components/language/languageDevModal";

const LanguageEditTransalte = () => {
  const [editTranslate, setEditTranslate] = React.useState(false);

  const openLanguageEdit = React.useCallback(() => {
    setEditTranslate(true);
  }, []);

  const closeLanguageEdit = React.useCallback(() => {
    setEditTranslate(false);
  }, []);

  return (
    <>
      <Btn onClick={openLanguageEdit}>✏️</Btn>
      {editTranslate && <LanguageDevModal onClose={closeLanguageEdit} />}
    </>
  );
};

export default LanguageEditTransalte;
