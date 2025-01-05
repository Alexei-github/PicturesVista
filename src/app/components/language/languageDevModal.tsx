"use client";

import React from "react";
import { gs_1_useLanguageText } from "@/components/language/stores/gs_1_languageLoad";
import languageStyles from "@/components/language/language.module.css";
import Modal from "@/components/modal/modal";
import TranslationTableRow from "@/components/language/translationTableRow";
import TranslateTableHeader from "@/components/language/translateTableHeader";
import useLanguageDevState from "./customHooks/ch_1_useLanguageDevState";

type Props = {
  onClose: () => void;
};

const LanguageDevModal = (p: Props) => {
  const gs = gs_1_useLanguageText((s) => ({
    // availableLanguages: s.availableLanguages,
    currLangText: s.currLangText,
    allIdsSet: s.allIdsSet,
  }));

  const {
    ch_1_fromLanguage,
    ch_1_newTranslation,
    ch_1_updatedValues,
    ch_1_unsavedUpdate,
    ch_1_reset,
    ch_1_syncChangesOn,
    ch_1_headerRef,
    ch_1_syncChangeStart,
    ch_1_saveChanges,
    ch_1_onFileLoad,
    ch_1_toggleSync,
    ch_1_processLangNameChange,
    ch_1_getFromLanguage,
    ch_1_translateOnChange,
    ch_1_turnResetOn,
  } = useLanguageDevState();

  return (
    <Modal sizeScale={0.8} onClose={p.onClose}>
      <table className={languageStyles.table}>
        <TranslateTableHeader
          ref={ch_1_headerRef}
          p_reset={ch_1_reset}
          p_turnResetOn={ch_1_turnResetOn}
          p_saveChanges={ch_1_saveChanges}
          p_onFileLoad={ch_1_onFileLoad}
          p_getFromLanguage={ch_1_getFromLanguage}
          p_syncChangesOn={ch_1_syncChangesOn}
          p_toggleSync={ch_1_toggleSync}
          p_syncStart={ch_1_syncChangeStart}
          p_processLangNameChange={ch_1_processLangNameChange}
        />
        <tbody>
          {gs.currLangText &&
            Array.from(gs.allIdsSet)
              .sort((a, b) => parseInt(a) - parseInt(b))
              .map((key) => {
                return (
                  <TranslationTableRow
                    key={"translate_row_" + key}
                    id={"translate_row_" + key}
                    key_val={key}
                    fromLangValue={ch_1_fromLanguage[key]}
                    onChange={ch_1_translateOnChange}
                    updatedTransaltion={
                      ch_1_newTranslation ? ch_1_newTranslation[key] : ""
                    }
                    updated={ch_1_updatedValues[key]}
                    updatedAfterLatestSave={ch_1_unsavedUpdate[key]}
                  />
                );
              })}
        </tbody>
      </table>
    </Modal>
  );
};

export default LanguageDevModal;
