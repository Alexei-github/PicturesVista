"use client";

import React from "react";
import LanguageSelectorUser from "@/components/language/languageSelectorUser";
import libStyles from "@/lib/lib.module.css";
import languageStyles from "@/components/language/language.module.css";
import Btn from "@/lib/buttons/btn";
import { useLanguageText } from "@/stores/languageLoad";
import useTranslateTableHeaderState from "@/components/language/customHooks/useTranslateTableHeaderState";

const TranslateTableHeader = (
  p: Props,
  ref?: React.ForwardedRef<TableHeaderRefType>
) => {
  const { selectedLanguage } = useLanguageText();
  const langChoiceRef = React.useRef<HTMLInputElement>(null);

  const h = useTranslateTableHeaderState({
    reset: p.reset,
    onFileLoad: p.onFileLoad,
    turnResetOn: p.turnResetOn,
    processLangNameChange: p.processLangNameChange,
    langChoiceRef,
  });

  React.useImperativeHandle(ref, h.refFunction, [
    h.createNew,
    h.loadNew,
    h.langName,
    h.disableLangSelect,
    h.editLanguageName,
    h.selectedFileName,
    h.disableLangInput,
  ]);

  React.useEffect(() => {
    const mockEvent = {
      target: { value: selectedLanguage },
    } as React.ChangeEvent<HTMLSelectElement>;
    p.getFromLanguage(mockEvent);
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
            onChangePassed={p.getFromLanguage}
          >
            <option value="start_version">Start Version</option>
          </LanguageSelectorUser>
        </th>
        <th className={languageStyles.third_column}>
          <div className={languageStyles.select_save_div}>
            <SyncBtn
              syncChangesOn={p.syncChangesOn}
              syncStart={p.syncStart}
              toggleSync={p.toggleSync}
            />
            <LanguageSelectorUser
              defaultLanguage="lang"
              selectorClassName={`${languageStyles.language_selector} ${languageStyles.language_selector_navbar}`}
              onChangePassed={h.inputMethodChanged}
              disabledSelect={h.disableLangSelect}
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
            {h.disableLangSelect && (
              <button
                className={` ${libStyles.btn_main_navbar} ${languageStyles.save_btn}`}
                onClick={p.saveChanges}
              >
                <span>Save Changes</span>
              </button>
            )}
          </div>
          {h.loadNew && (
            <LoadLangFromFile
              selectedFileName={h.selectedFileName}
              langChoiceRef={langChoiceRef}
              loadFromFile={h.loadFromFile}
              disableLangSelect={h.disableLangSelect}
              disableLangInput={h.disableLangInput}
            />
          )}
          {((h.createNew && h.selectedFileName) ||
            (h.createNew && !h.loadNew)) && (
            <LangNameInput
              createNew={h.createNew}
              loadNew={h.loadNew}
              disableLangInput={h.disableLangInput}
              langName={h.langName}
              onChangeLangName={h.onChangeLangName}
              clickOnEditLangName={h.clickOnEditLangName}
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

const LangNameInput = (p: PropsForLangNameInput) => {
  return (
    <div className={languageStyles.lang_input_area}>
      <input
        {...(p.createNew && !p.loadNew && { autoFocus: true })}
        className={languageStyles.textarea}
        type="text"
        onChange={p.onChangeLangName}
        disabled={p.disableLangInput}
        value={p.langName}
      />
      {p.disableLangInput && (
        <Btn
          className={languageStyles.btn_language_input}
          onClick={p.clickOnEditLangName}
        >
          ✏️
        </Btn>
      )}
    </div>
  );
};

const LoadLangFromFile = (p: PropsForLoadLangFromFile) => {
  return !p.selectedFileName ? (
    <input
      ref={p.langChoiceRef}
      className={languageStyles.textarea + " " + languageStyles.file_input}
      type="file"
      onInput={p.loadFromFile}
      disabled={p.disableLangSelect || p.disableLangInput}
    />
  ) : (
    <input
      className={
        languageStyles.textarea + " " + languageStyles.file_input_selected
      }
      type="text"
      disabled
      placeholder={`Loaded File: ${p.selectedFileName}`}
    />
  );
};

const SyncBtn = ({ syncChangesOn, syncStart, toggleSync }: Partial<Props>) => {
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

export type Props = {
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

type PropsForLangNameInput = {
  createNew: boolean;
  loadNew: boolean;
  disableLangInput: boolean;
  onChangeLangName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  langName: string;
  clickOnEditLangName: () => void;
};

type PropsForLoadLangFromFile = {
  selectedFileName: string;
  langChoiceRef: React.RefObject<HTMLInputElement>;
  loadFromFile: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  disableLangSelect: boolean;
  disableLangInput: boolean;
};
