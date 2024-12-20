import React from "react";
import { useLanguageText } from "@/stores/languageLoad";
const defaultLanguage = "Español";
import languageStyles from "@/components/language/language.module.css";
import LanguageDevModal from "@/components/language/languageDevModal";

const LanguageEditTransalte = () => {
  const [editTranslate, setEditTranslate] = React.useState(false);

  const switchLanugageEdit = React.useCallback(() => {
    setEditTranslate(!editTranslate);
  }, [editTranslate]);

  return (
    <>
      <button onClick={switchLanugageEdit}>✏️</button>
      {editTranslate && <LanguageDevModal />}
    </>
  );
};

export default LanguageEditTransalte;
