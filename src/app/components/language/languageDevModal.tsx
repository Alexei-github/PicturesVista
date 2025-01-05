"use client";

import React from "react";
import { useLanguageText } from "@/stores/languageLoad";
import languageStyles from "@/components/language/language.module.css";
import Modal from "@/components/modal/modal";
import LanguageSelectorUser from "@/components/language/languageSelectorUser";
import TranslationTableRow from "@/components/language/translationTableRow";
import TranslateTableHeader, {
  TableHeaderRefType,
} from "@/components/language/translateTableHeader";
import { fileOpen, fileSave } from "browser-fs-access";
import { LanguageText } from "@/components/language/types";
import useLanguageDevState from "./customHooks/useLanguageDevState";

type Props = {
  onClose: () => void;
};

const LanguageDevModal = (p: Props) => {
  const gs = useLanguageText((s) => ({
    // availableLanguages: s.availableLanguages,
    currLangText: s.currLangText,
    allIdsSet: s.allIdsSet,
  }));

  const h = useLanguageDevState();

  return (
    <Modal sizeScale={0.8} 
    onClose={p.onClose}>
      <table className={languageStyles.table}>
        <TranslateTableHeader
          ref={h.headerRef}
          reset={h.reset}
          turnResetOn={h.turnResetOn}
          saveChanges={h.saveChanges}
          onFileLoad={h.onFileLoad}
          getFromLanguage={h.getFromLanguage}
          syncChangesOn={h.syncChangesOn}
          toggleSync={h.toggleSync}
          syncStart={h.syncChangeStart}
          processLangNameChange={h.processLangNameChange}
        />
        <tbody>
          {gs.currLangText &&
            Array.from(gs.allIdsSet)
              .sort((a, b) => parseInt(a) - parseInt(b))
              .map((key, idx) => {
                return (
                  <TranslationTableRow
                    key={"translate_row_" + key}
                    id={"translate_row_" + key}
                    key_val={key}
                    fromLangValue={h.fromLanguage[key]}
                    onChange={h.translateOnChange}
                    updatedTransaltion={
                      h.newTranslation ? h.newTranslation[key] : ""
                    }
                    updated={h.updatedValues[key]}
                    updatedAfterLatestSave={h.unsavedUpdate[key]}
                  />
                );
              })}
        </tbody>
      </table>
    </Modal>
  );
};

export default LanguageDevModal;
