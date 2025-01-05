import React from "react";
import { useLanguageText } from "@/stores/languageLoad";
import { TableHeaderRefType } from "@/components/language/translateTableHeader";
import { LanguageText } from "@/components/language/types";
import saveTranslationChanges from "@/components/language/functions/useSaveTranslationChnages";
import {
  UNSAVED_TRANSLATION_LOCAL_STORAGE,
  LOCAL_STORAGE_DEBOUNCE_TIME,
  SYNC_DEBOUNCE_TIME,
} from "@/components/language/lib/constants";

export default function useLanguageDevState() {
  const gs = useLanguageText((s) => ({
    availableLanguages: s.availableLanguages,
    currLangText: s.currLangText,
    getLanguage: s.getLanguage,
    allIdsSet: s.allIdsSet,
    setLanguage: s.setLanguage,
    selectedLanguage: s.selectedLanguage,
    selectedIdx: s.selectedIdx,
  }));

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
  const headerRef = React.useRef<TableHeaderRefType>(null);

  // console.log("=======51=====", newTranslation, reset);

  React.useEffect(() => {
    const element = document.getElementById(`translate_row_${gs.selectedIdx}`);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [gs.selectedIdx]);

  const getFromLanguage = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      (async () => {
        setFromLanguage((await gs.getLanguage(e.target.value)) ?? {});
      })();
    },
    [setFromLanguage, gs.getLanguage]
  );
  // console.log(performance.getEntries());

  React.useEffect(() => {
    const unsavedTranslationStateString = localStorage.getItem(
      UNSAVED_TRANSLATION_LOCAL_STORAGE
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
        gs.setLanguage(gs.selectedLanguage, newTranslation);
      }, SYNC_DEBOUNCE_TIME);
      return () => {
        setSyncChangeStart(false);
        clearTimeout(timeout);
      };
    }
  }, [
    rerenderComponet,
    syncChangesOn,
    newTranslation,
    gs.selectedLanguage,
    gs.setLanguage,
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
          UNSAVED_TRANSLATION_LOCAL_STORAGE,
          JSON.stringify(unsavedTranslationState)
        );
        // console.log(Object.values(localStorage));
        // console.log(
        //   new Blob(Object.values(localStorage)).size / 1024 / 1024 + " MB"
        // );
      }
    }, LOCAL_STORAGE_DEBOUNCE_TIME);
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
      gs.setLanguage(gs.selectedLanguage);
    }
  }, [syncChangesOn, gs.selectedLanguage, gs.setLanguage]);
  /**
   *
   */
  const processLangNameChange = React.useCallback(
    (lang: string) => {
      // if (lang) {
      if (!headerRef?.current?.getState().editLanguageName || reset) {
        setReset(false);
        if (gs.availableLanguages[lang]) {
          (async () => {
            const existLang = await gs.getLanguage(lang);
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
    [
      gs.availableLanguages,
      languageInitCopy,
      gs.getLanguage,
      reset,
      newTranslation,
    ]
  );

  const onFileLoad = React.useCallback(
    (language: { [keyof: string]: string }) => {
      // setLanguageInitCopy({ ...language });
      setNewTranslation({ ...language });
      newTranslation["lang"] = language.lang;

      if (gs.availableLanguages[language.lang]) {
        (async () => {
          const existLang = await gs.getLanguage(language.lang);
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
    [gs.availableLanguages, gs.getLanguage, newTranslation]
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
    const latestSavedChanges = await saveTranslationChanges({
      newTranslation,
      updatedValues,
      allIdsSet: gs.allIdsSet,
    });
    headerRef?.current?.setDisableLangSelect(false);
    setLatestSave(latestSavedChanges);
    setUnsavedUpdate({});
  }, [newTranslation, updatedValues, gs.allIdsSet]);

  /**
   *
   */
  const toggleSync = React.useCallback(() => {
    setSyncChangesOn((value) => !value);
  }, []);

  const turnResetOn = React.useCallback(() => {
    setReset(true);
  }, []);

  return {
    currLangText: gs.currLangText,
    fromLanguage,
    newTranslation,
    updatedValues,
    unsavedUpdate,
    reset,
    syncChangesOn,
    headerRef,
    syncChangeStart,
    saveChanges,
    onFileLoad,
    toggleSync,
    processLangNameChange,
    getFromLanguage,
    translateOnChange,
    turnResetOn,
  };
}
