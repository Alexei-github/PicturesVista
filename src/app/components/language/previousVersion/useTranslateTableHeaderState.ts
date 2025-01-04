import React from "react";
import LanguageSelectorUser from "@/components/language/languageSelectorUser";
import libStyles from "@/lib/lib.module.css";
import languageStyles from "@/components/language/language.module.css";
import Btn from "@/lib/buttons/btn";
import { useLanguageText } from "@/stores/languageLoad";
import {
  UNSAVED_TRANSLATION_LOCAL_STORAGE,
  LOCAL_STORAGE_DEBOUNCE_TIME,
  SYNC_DEBOUNCE_TIME,
} from "@/components/language/lib/constants";

export type TableHeaderRefType = {
  getState: () => {
    createNew: boolean;
    loadNew: boolean;
    langName: string;
    editLanguageName: boolean;
    disableLangSelect: boolean;
    selectedFileName: string;
    disableLangInput: boolean;
  };
  setDisableLangSelect: (state: boolean) => void;
  setDisableLangInput: (state: boolean) => void;
  setEditLanguageName: (state: boolean) => void;
  setInitState: (initStateValues: {
    createNew: boolean;
    loadNew: boolean;
    langName: string;
    disableLangSelect: boolean;
    selectedFileName: string;
    editLanguageName: boolean;
    disableLangInput: boolean;
  }) => void;
};

type Props = {
  reset: boolean;
  turnResetOn: () => void;
  onFileLoad: (language: { [keyof: string]: string }) => void;
  getFromLanguage: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  processLangNameChange: (langName: string) => void;
};

export default function useTranslateTableHeaderState({
  reset,
  onFileLoad,
  turnResetOn,
  getFromLanguage,
  processLangNameChange,
}: Props) {
  const { selectedLanguage } = useLanguageText();

  const [createNew, setCreateNew] = React.useState(false);
  const [loadNew, setLoadNew] = React.useState(false);
  const langChoiceRef = React.useRef<HTMLInputElement>(null);
  const [langName, setLangName] = React.useState("");
  const [disableLangSelect, setDisableLangSelect] = React.useState(false);
  const [disableLangInput, setDisableLangInput] = React.useState(false);
  const [editLanguageName, setEditLanguageName] = React.useState(false);
  const [selectedFileName, setSelectedFileName] = React.useState("");

  const loadFromFile = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const blobLang = e.target.files?.[0];
        if (blobLang) {
          const language = await new Response(blobLang).json();
          language.lang = JSON.parse(language["0"].replaceAll("'", '"')).lang;
          delete language["0"];
          onFileLoad(language);
          setLangName(language.lang);
          setSelectedFileName(blobLang?.name ?? "");
        }
      } catch {
        console.log("read error");
      }
    },
    [onFileLoad]
  );

  React.useEffect(() => {
    const mockEvent = {
      target: { value: selectedLanguage },
    } as React.ChangeEvent<HTMLSelectElement>;
    getFromLanguage(mockEvent);
  }, [getFromLanguage, selectedLanguage]);

  React.useImperativeHandle(
    ref,
    () => {
      return {
        getState: () => {
          return {
            createNew,
            loadNew,
            langName,
            editLanguageName,
            disableLangSelect,
            selectedFileName,
            disableLangInput,
          };
        },
        setDisableLangSelect: (state: boolean) => setDisableLangSelect(state),
        setDisableLangInput: (state: boolean) => setDisableLangInput(state),
        setEditLanguageName: (state: boolean) => setEditLanguageName(state),
        setInitState: ({
          createNew,
          loadNew,
          langName,
          disableLangSelect,
          selectedFileName,
          editLanguageName,
          disableLangInput,
        }) => {
          setCreateNew(createNew);
          setLoadNew(loadNew);
          setLangName(langName);
          setDisableLangSelect(disableLangSelect);
          setDisableLangInput(disableLangInput);
          setEditLanguageName(editLanguageName);
          setSelectedFileName(selectedFileName);
        },
      };
    },
    [
      createNew,
      loadNew,
      langName,
      disableLangSelect,
      editLanguageName,
      selectedFileName,
      disableLangInput,
    ]
  );

  React.useEffect(() => {
    const timeout = setTimeout(
      () => {
        processLangNameChange(langName);
      },
      reset ? 0 : 500
    );

    return () => {
      clearTimeout(timeout);
    };
  }, [langName, processLangNameChange, reset]);

  const inputMethodChanged = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setDisableLangInput(false);
      turnResetOn();
      setCreateNew(true);
      setSelectedFileName("");

      if (e.target.value === "create_new") {
        setLoadNew(false);
        setEditLanguageName(false);
        setLangName("");
      } else if (e.target.value === "load_new") {
        setLoadNew(true);
        langChoiceRef.current && (langChoiceRef.current.value = "");
        setLangName("");
        setEditLanguageName(true);
      } else {
        setLoadNew(false);
        setLangName(e.target.value);
        setEditLanguageName(true);
      }

      e.target.value = "lang";
    },
    [turnResetOn]
  );

  return {};
}
