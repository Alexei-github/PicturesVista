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
import { LanguageText, LanguageUpdateValues } from "@/components/language/types";


type Props = {
    newTranslation: LanguageText,
  updatedValues: LanguageUpdateValues,
  setUnsavedUpdate,
  setLatestSave
}


export default function useSaveTranslationCanges(
  newTranslation,
  updatedValues,
  setUnsavedUpdate,
  setLatestSave
) {
  const { allIdsSet } = useLanguageText();


  const saveChanges = React.useCallback(async () => {
    const fileName = `${newTranslation.lang
      ?.trim()
      ?.toLowerCase()
      ?.replace(" ", "_")}.json`;

    const all = Array.from(allIdsSet).every((key) => newTranslation[key])
      ? "yes"
      : "no";

    const recordNewTranslation = { ...newTranslation };

    const savedChanges: { [key: string]: string } = {};

    for (const key in recordNewTranslation) {
      recordNewTranslation[key] = recordNewTranslation[key].trim();
      if (updatedValues[key]) {
        savedChanges[key] = recordNewTranslation[key];
      }
    }
    recordNewTranslation[
      "0"
    ] = `{ 'lang': '${recordNewTranslation.lang}', 'complete': '${all}' }`;
    delete recordNewTranslation.lang;
    const jsonString = JSON.stringify(recordNewTranslation, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });

    try {
      await fileSave(blob, {
        fileName: fileName ?? "undefined.json",
        extensions: [".json"],
      });
      headerRef?.current?.setDisableLangSelect(false);
      setLatestSave({ ...savedChanges });
      setUnsavedUpdate({});
    } catch {}
  }, [allIdsSet]);

  return {
    saveChanges,
  };
}
