import React from "react";
import { TableHeaderRefType } from "@/components/language/translateTableHeader";

type Props = {
  reset: boolean;
  turnResetOn: () => void;
  onFileLoad: (language: { [keyof: string]: string }) => void;
  processLangNameChange: (langName: string) => void;
  langChoiceRef: React.RefObject<HTMLInputElement>;
};

export default function useTranslateTableHeaderState({
  reset,
  onFileLoad,
  turnResetOn,
  processLangNameChange,
  langChoiceRef,
}: Props) {
  const [createNew, setCreateNew] = React.useState(false);
  const [loadNew, setLoadNew] = React.useState(false);
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

  const refFunction = (): TableHeaderRefType => {
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
  };

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

  const clickOnEditLangName = () => {
    setEditLanguageName(true);
    setDisableLangInput(false);
  };

  const onChangeLangName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLangName(e.target.value);
  };

  return {
    createNew,
    loadNew,
    langName,
    disableLangSelect,
    disableLangInput,
    editLanguageName,
    selectedFileName,
    loadFromFile,
    refFunction,
    inputMethodChanged,
    clickOnEditLangName,
    onChangeLangName,
  };
}
