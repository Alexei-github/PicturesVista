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

type Props = {
  onClose: () => void;
};

const LanguageDevModal = ({ onClose }: Props) => {
  const {
    availableLanguages,
    currLangText,
    getLanguage,
    allIdsSet,
    setLanguage,
    selectedLanguage,
    selectedIdx,
  } = useLanguageText();

  const [newTranslation, setNewTranslation] = React.useState<LanguageText>({});

  const [updatedValues, setUpdatedValues] = React.useState<{
    [key: string]: boolean;
  }>({});
  const [unsavedUpdate, setUnsavedUpdate] = React.useState<{
    [key: string]: boolean;
  }>({});
  const [languageInitCopy, setLanguageInitCopy] = React.useState<LanguageText>(
    {}
  );
  const [reset, setReset] = React.useState(false);
  const [latestSave, setLatestSave] = React.useState<LanguageText>({});
  const [rerenderComponet, setRerenderComponent] = React.useState("");
  const [fromLanguage, setFromLanguage] = React.useState<LanguageText>({});
  const [syncChangesOn, setSyncChangesOn] = React.useState(false);
  const [syncChangeStart, setSyncChangeStart] = React.useState(false);

  // console.log("=======51=====", newTranslation, reset);
  const headerRef = React.useRef<TableHeaderRefType>(null);

  React.useEffect(() => {
    const element = document.getElementById(`translate_row_${selectedIdx}`);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedIdx]);

  const getFromLanguage = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      (async () => {
        setFromLanguage((await getLanguage(e.target.value)) ?? {});
      })();
    },
    [setFromLanguage, getLanguage]
  );

  React.useEffect(() => {
    const unsavedTranslationStateString = localStorage.getItem(
      "unsavedTranslationState"
    );

    if (unsavedTranslationStateString) {
      const unsavedTranslationState = JSON.parse(unsavedTranslationStateString);
      if (headerRef && unsavedTranslationState.translateTableHeader) {
        headerRef.current?.setInitState(
          unsavedTranslationState.translateTableHeader
        );
      }
      setNewTranslation(unsavedTranslationState.newTranslation);
      setLatestSave(unsavedTranslationState.latestSave);
      setLanguageInitCopy(unsavedTranslationState.languageInitCopy);
      setUnsavedUpdate(unsavedTranslationState.unsavedUpdate);
      setFromLanguage(unsavedTranslationState.fromLanguage);
      setSyncChangesOn(unsavedTranslationState.syncChangesOn);
      setUpdatedValues(unsavedTranslationState.updatedValues);
      setReset(unsavedTranslationState.reset);
    }
  }, [headerRef]);

  React.useEffect(() => {
    if (syncChangesOn) {
      const timeout = setTimeout(() => {
        setSyncChangeStart(true);
        setLanguage(selectedLanguage, newTranslation);
      }, 2000);
      return () => {
        setSyncChangeStart(false);
        clearTimeout(timeout);
      };
    }
  }, [
    rerenderComponet,
    syncChangesOn,
    newTranslation,
    selectedLanguage,
    setLanguage,
  ]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (Object.keys(newTranslation).length !== 0) {
        const unsavedTranslationState = {
          newTranslation,
          latestSave,
          languageInitCopy,
          unsavedUpdate,
          fromLanguage,
          syncChangesOn,
          updatedValues,
          reset,
          translateTableHeader: {
            langName: headerRef?.current?.getState()?.langName ?? "",
            loadNew: headerRef?.current?.getState()?.loadNew ?? false,
            createNew: headerRef?.current?.getState()?.createNew ?? false,
            disableLangSelect:
              headerRef?.current?.getState()?.disableLangSelect ?? false,
            selectedFileName:
              headerRef?.current?.getState()?.selectedFileName ?? "",
            editLanguageName:
              headerRef?.current?.getState().editLanguageName ?? false,
            disableLangInput:
              headerRef?.current?.getState().disableLangInput ?? false,
          },
        };

        localStorage.setItem(
          "unsavedTranslationState",
          JSON.stringify(unsavedTranslationState)
        );
      }
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [
    rerenderComponet,
    fromLanguage,
    languageInitCopy,
    latestSave,
    newTranslation,
    syncChangesOn,
    unsavedUpdate,
    updatedValues,
    reset,
  ]);

  React.useEffect(() => {
    if (!syncChangesOn) {
      setSyncChangeStart(false);
      setLanguage(selectedLanguage);
    }
  }, [syncChangesOn, selectedLanguage, setLanguage]);

  const processLangNameChange = React.useCallback(
    (lang: string) => {
      // if (lang) {
      if (!headerRef?.current?.getState().editLanguageName || reset) {
        setReset(false);
        if (availableLanguages[lang]) {
          (async () => {
            const existLang = await getLanguage(lang);
            setLanguageInitCopy(existLang ?? {});
            setNewTranslation({ ...existLang, lang: lang });
            setUpdatedValues({});
            setUnsavedUpdate({});
            setLatestSave({});
          })();
          console.log("hello");
        } else {
          if (Object.keys(languageInitCopy).length > 0) {
            setLanguageInitCopy({});
            setNewTranslation({});
            setUpdatedValues({});
            setUnsavedUpdate({});
            setLatestSave({});
          }
        }
      }
      newTranslation.lang = lang;
      setRerenderComponent(`langName-${lang}`);

      // }
    },
    [availableLanguages, languageInitCopy, getLanguage, reset, newTranslation]
  );

  const onFileLoad = React.useCallback(
    (language: { [keyof: string]: string }) => {
      // setLanguageInitCopy({ ...language });
      setNewTranslation({ ...language });
      newTranslation["lang"] = language.lang;

      if (availableLanguages[language.lang]) {
        (async () => {
          const existLang = await getLanguage(language.lang);
          const newUpdateVal: { [key: string]: boolean } = {};
          const newLatestSave: LanguageText = {};
          for (const key in existLang) {
            if (existLang && existLang[key] !== language[key]) {
              newUpdateVal[key] = true;
              newLatestSave[key] = language[key];
            }
          }
          setLanguageInitCopy(existLang ?? {});
          setUpdatedValues(newUpdateVal);
          setLatestSave(newLatestSave);
          setUnsavedUpdate({});
        })();
      } else {
        setLanguageInitCopy({ ...language });
        setUpdatedValues({});
        setUnsavedUpdate({});
        setLatestSave({});
      }
    },
    [availableLanguages, getLanguage, newTranslation]
  );
  /**
   *
   */
  const translateOnChange = React.useCallback(
    /**
     *
     * @param e
     * @param key
     */
    (e: React.ChangeEvent<HTMLTextAreaElement>, key: string) => {
      const valueTrimmed = e.target.value?.trim() ?? "";

      headerRef?.current?.setEditLanguageName(true);
      updatedValues[key] =
        valueTrimmed !== (languageInitCopy[key]?.trim() ?? "");

      unsavedUpdate[key] =
        valueTrimmed !== (latestSave[key]?.trim() ?? "") &&
        valueTrimmed !== (languageInitCopy[key]?.trim() ?? "");

      if (
        Object.keys(updatedValues).some(
          (k) => updatedValues[k] && !latestSave[k]
        ) ||
        Object.values(unsavedUpdate).some((v) => v)
      ) {
        headerRef?.current?.setDisableLangSelect(true);
        headerRef?.current?.setDisableLangInput(true);
      } else {
        headerRef?.current?.setDisableLangSelect(false);
      }
      newTranslation[key] = e.target.value;

      setRerenderComponent(`${key}-${e.target.value}`);
    },
    [newTranslation, languageInitCopy, updatedValues, unsavedUpdate, latestSave]
  );
  /**
   *
   */
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
  }, [newTranslation, updatedValues, allIdsSet]);

  /**
   *
   */
  const toggleSync = React.useCallback(() => {
    setSyncChangesOn(!syncChangesOn);
  }, [syncChangesOn]);

  const turnResetOn = React.useCallback(() => {
    setReset(true);
  }, []);

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
