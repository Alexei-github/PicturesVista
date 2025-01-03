"use client";

const defaultLanguage = "Español";

import React from "react";
import LanguageSelectorUser from "@/components/language/languageSelectorUser";
import libStyles from "@/lib/lib.module.css";
import languageStyles from "@/components/language/language.module.css";
import Btn from "@/lib/buttons/btn";
import { useLanguageText } from "@/stores/languageLoad";

export type TableHeaderRefType = {
  getState: () => {
    createNew: boolean;
    loadNew: boolean;
    langName: string;
    editLanguageName: boolean;
    disableLangSelect: boolean;
    selectedFileName: string;
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
  }) => void;
};

type Props = {
  syncChangesOn: boolean;
  syncStart: boolean;
  reset: boolean;
  turnResetOn: () => void;
  saveChanges: () => void;
  onFileLoad: (language: { [keyof: string]: string }) => void;
  getFromLanguage: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  toggleSync: () => void;
  processLangNameChange: (langName: string) => void;
};

const TranslateTableHeader = (
  {
    syncChangesOn,
    syncStart,
    reset,
    saveChanges,
    onFileLoad,
    turnResetOn,
    getFromLanguage,
    toggleSync,
    processLangNameChange,
  }: Props,
  ref?: React.ForwardedRef<TableHeaderRefType>
) => {
  const {
    availableLanguages,
    currLangText,
    getLanguage,
    allIdsSet,
    setLanguage,
    selectedLanguage,
    selectedIdx,
  } = useLanguageText();

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
        }) => {
          setCreateNew(createNew);
          setLoadNew(loadNew);
          setLangName(langName);
          setDisableLangSelect(disableLangSelect);
          setDisableLangInput(true);
          setEditLanguageName(true);
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
  return (
    <thead>
      <tr>
        <th className={languageStyles.first_column}>
          <p>id</p>
        </th>
        <th className={languageStyles.second_column}>
          <LanguageSelectorUser
            defaultLanguage={selectedLanguage}
            selectorClassName={`${languageStyles.language_selector} ${languageStyles.language_selector_navbar}`}
            onChangePassed={getFromLanguage}
          >
            <option value="start_version">Start Version</option>
          </LanguageSelectorUser>
        </th>
        <th className={languageStyles.third_column}>
          <div className={languageStyles.select_save_div}>
            <Btn
              className={languageStyles.sync_btn}
              style={{
                ...(syncChangesOn && {
                  color: "var(--btn_green)",
                  border: "0.2rem solid var(--btn_green)",
                }),
              }}
              onClick={toggleSync}
            >
              <span className={languageStyles.sync_symbol}>&#x21BB;</span>
              {syncStart && (
                <svg className={languageStyles.progress_circle_svg}>
                  <circle className={languageStyles.progress} />
                </svg>
              )}
            </Btn>
            <LanguageSelectorUser
              defaultLanguage="lang"
              selectorClassName={`${languageStyles.language_selector} ${languageStyles.language_selector_navbar}`}
              onChangePassed={inputMethodChanged}
              disabledSelect={disableLangSelect}
              // defaultValuePassed="lang"
            >
              <optgroup>
                <option value="lang" disabled>
                  Language:
                </option>
                <option value="create_new">Create New</option>
                <option value="load_new">Load From File</option>
              </optgroup>
              <optgroup style={{ fontSize: "1.1rem" }} label="Available:" />
            </LanguageSelectorUser>
            {disableLangSelect && (
              <button
                className={` ${libStyles.btn_main_navbar} ${languageStyles.save_btn}`}
                onClick={saveChanges}
              >
                <span>Save Changes</span>
              </button>
            )}
          </div>
          {loadNew &&
            (!selectedFileName ? (
              <input
                ref={langChoiceRef}
                className={
                  languageStyles.textarea + " " + languageStyles.file_input
                }
                type="file"
                onInput={loadFromFile}
                disabled={disableLangSelect || disableLangInput}
              />
            ) : (
              <input
                className={
                  languageStyles.textarea +
                  " " +
                  languageStyles.file_input_selected
                }
                type="text"
                disabled
                placeholder={`Loaded File: ${selectedFileName}`}
              />
            ))}
          {((createNew && selectedFileName) || (createNew && !loadNew)) && (
            <div className={languageStyles.lang_input_area}>
              <input
                {...(createNew && !loadNew && { autoFocus: true })}
                className={languageStyles.textarea}
                type="text"
                onChange={(e) => {
                  setLangName(e.target.value);
                }}
                disabled={disableLangInput}
                value={langName}
              />
              {disableLangInput && (
                <Btn
                  className={languageStyles.btn_language_input}
                  onClick={() => {
                    setEditLanguageName(true);
                    setDisableLangInput(false);
                  }}
                >
                  ✏️
                </Btn>
              )}
            </div>
          )}
        </th>
      </tr>
    </thead>
  );
};

export default React.memo(
  React.forwardRef<TableHeaderRefType, Props>(TranslateTableHeader)
);
