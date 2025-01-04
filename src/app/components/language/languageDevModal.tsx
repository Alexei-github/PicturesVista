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
import useLanguageState from "./customHooks/useLanguageDevState";

type Props = {
  onClose: () => void;
};

const LanguageDevModal = ({ onClose }: Props) => {
  const {
    currLangText,
    allIdsSet,
    fromLanguage,
    newTranslation,
    updatedValues,
    unsavedUpdate,
    reset,
    syncChangesOn,
    syncChangeStart,
    onFileLoad,
    saveChanges,
    toggleSync,
    processLangNameChange,
    getFromLanguage,
    translateOnChange,
    headerRef,
    turnResetOn,
  } = useLanguageState();

  return (
    <Modal sizeScale={0.8} onClose={onClose}>
      <table className={languageStyles.table}>
        <TranslateTableHeader
          ref={headerRef}
          reset={reset}
          turnResetOn={turnResetOn}
          saveChanges={saveChanges}
          onFileLoad={onFileLoad}
          getFromLanguage={getFromLanguage}
          syncChangesOn={syncChangesOn}
          toggleSync={toggleSync}
          syncStart={syncChangeStart}
          processLangNameChange={processLangNameChange}
        />
        <tbody>
          {currLangText &&
            Array.from(allIdsSet)
              .sort((a, b) => parseInt(a) - parseInt(b))
              .map((key, idx) => {
                return (
                  <TranslationTableRow
                    key={"translate_row_" + key}
                    id={"translate_row_" + key}
                    key_val={key}
                    fromLangValue={fromLanguage[key]}
                    onChange={translateOnChange}
                    updatedTransaltion={
                      newTranslation ? newTranslation[key] : ""
                    }
                    updated={updatedValues[key]}
                    updatedAfterLatestSave={unsavedUpdate[key]}
                  />
                );
              })}
        </tbody>
      </table>
    </Modal>
  );
};

export default LanguageDevModal;
