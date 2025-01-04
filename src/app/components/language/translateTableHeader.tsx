"use client";

import React from "react";
import LanguageSelectorUser from "@/components/language/languageSelectorUser";
import libStyles from "@/lib/lib.module.css";
import languageStyles from "@/components/language/language.module.css";
import Btn from "@/lib/buttons/btn";
import { useLanguageText } from "@/stores/languageLoad";
import useTranslateTableHeaderState from "@/components/language/customHooks/useTranslateTableHeaderState";

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
  const { selectedLanguage } = useLanguageText();
  const langChoiceRef = React.useRef<HTMLInputElement>(null);

  const {
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
  } = useTranslateTableHeaderState({
    reset,
    onFileLoad,
    turnResetOn,
    processLangNameChange,
    langChoiceRef,
  });

  React.useImperativeHandle(ref, refFunction, [
    createNew,
    loadNew,
    langName,
    disableLangSelect,
    editLanguageName,
    selectedFileName,
    disableLangInput,
  ]);

  React.useEffect(() => {
    const mockEvent = {
      target: { value: selectedLanguage },
    } as React.ChangeEvent<HTMLSelectElement>;
    getFromLanguage(mockEvent);
  }, []);

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
            <SyncBtn
              syncChangesOn={syncChangesOn}
              syncStart={syncStart}
              toggleSync={toggleSync}
            />
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
          {loadNew && (
            <LoadLangFromFile
              selectedFileName={selectedFileName}
              langChoiceRef={langChoiceRef}
              loadFromFile={loadFromFile}
              disableLangSelect={disableLangSelect}
              disableLangInput={disableLangInput}
            />
          )}
          {((createNew && selectedFileName) || (createNew && !loadNew)) && (
            <LangNameInput
              createNew={createNew}
              loadNew={loadNew}
              disableLangInput={disableLangInput}
              langName={langName}
              onChangeLangName={onChangeLangName}
              clickOnEditLangName={clickOnEditLangName}
            />
          )}
        </th>
      </tr>
    </thead>
  );
};

export default React.memo(
  React.forwardRef<TableHeaderRefType, Props>(TranslateTableHeader)
);

type PropsForLangNameInput = {
  createNew: boolean;
  loadNew: boolean;
  disableLangInput: boolean;
  onChangeLangName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  langName: string;
  clickOnEditLangName: () => void;
};

const LangNameInput = ({
  createNew,
  loadNew,
  disableLangInput,
  langName,
  onChangeLangName,
  clickOnEditLangName,
}: PropsForLangNameInput) => {
  return (
    <div className={languageStyles.lang_input_area}>
      <input
        {...(createNew && !loadNew && { autoFocus: true })}
        className={languageStyles.textarea}
        type="text"
        onChange={onChangeLangName}
        disabled={disableLangInput}
        value={langName}
      />
      {disableLangInput && (
        <Btn
          className={languageStyles.btn_language_input}
          onClick={clickOnEditLangName}
        >
          ✏️
        </Btn>
      )}
    </div>
  );
};

type PropsForLoadLangFromFile = {
  selectedFileName: string;
  langChoiceRef: React.RefObject<HTMLInputElement>;
  loadFromFile: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  disableLangSelect: boolean;
  disableLangInput: boolean;
};

const LoadLangFromFile = ({
  selectedFileName,
  langChoiceRef,
  loadFromFile,
  disableLangSelect,
  disableLangInput,
}: PropsForLoadLangFromFile) => {
  return !selectedFileName ? (
    <input
      ref={langChoiceRef}
      className={languageStyles.textarea + " " + languageStyles.file_input}
      type="file"
      onInput={loadFromFile}
      disabled={disableLangSelect || disableLangInput}
    />
  ) : (
    <input
      className={
        languageStyles.textarea + " " + languageStyles.file_input_selected
      }
      type="text"
      disabled
      placeholder={`Loaded File: ${selectedFileName}`}
    />
  );
};

type PropsForSyncBtn = {
  syncChangesOn: boolean;
  syncStart: boolean;
  toggleSync: () => void;
};

const SyncBtn = ({ syncChangesOn, syncStart, toggleSync }: PropsForSyncBtn) => {
  return (
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
  );
};
