"use client";

import React from "react";
import LanguageSelectorUser from "@/components/language/languageSelectorUser";
import libStyles from "@/lib/lib.module.css";
import languageStyles from "@/components/language/language.module.css";
import Btn from "@/lib/buttons/btn";
import { gs_1_useLanguageText } from "@/components/language/stores/gs_1_languageLoad";
import useTranslateTableHeaderState from "@/components/language/customHooks/ch_2_useTranslateTableHeaderState";

const TranslateTableHeader = (
  {
    p_syncChangesOn,
    p_syncStart,
    p_reset,
    p_turnResetOn,
    p_saveChanges,
    p_onFileLoad,
    p_getFromLanguage,
    p_toggleSync,
    p_processLangNameChange,
  }: Props,
  ref?: React.ForwardedRef<TableHeaderRefType>
) => {
  const { selectedLanguage: selectedLanguage } = gs_1_useLanguageText();
  const langChoiceRef = React.useRef<HTMLInputElement>(null);

  const {
    ch_2_createNew,
    ch_2_loadNew,
    ch_2_langName,
    ch_2_disableLangSelect,
    ch_2_disableLangInput,
    ch_2_selectedFileName,
    ch_2_loadFromFile,
    ch_2_refFunction,
    ch_2_inputMethodChanged,
    ch_2_clickOnEditLangName,
    ch_2_onChangeLangName,
  } = useTranslateTableHeaderState({
    p_reset,
    p_onFileLoad,
    p_turnResetOn,
    p_processLangNameChange,
    p_langChoiceRef: langChoiceRef,
  });

  React.useImperativeHandle(ref, ch_2_refFunction, [ch_2_refFunction]);

  React.useEffect(() => {
    const mockEvent = {
      target: { value: selectedLanguage },
    } as React.ChangeEvent<HTMLSelectElement>;
    p_getFromLanguage(mockEvent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p_getFromLanguage]);

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
            onChangePassed={p_getFromLanguage}
          >
            <option value="start_version">Start Version</option>
          </LanguageSelectorUser>
        </th>
        <th className={languageStyles.third_column}>
          <div className={languageStyles.select_save_div}>
            <SyncBtn
              p_syncChangesOn={p_syncChangesOn}
              p_syncStart={p_syncStart}
              p_toggleSync={p_toggleSync}
            />
            <LanguageSelectorUser
              defaultLanguage="lang"
              selectorClassName={`${languageStyles.language_selector} ${languageStyles.language_selector_navbar}`}
              onChangePassed={ch_2_inputMethodChanged}
              disabledSelect={ch_2_disableLangSelect}
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
            {ch_2_disableLangSelect && (
              <button
                className={` ${libStyles.btn_main_navbar} ${languageStyles.save_btn}`}
                onClick={p_saveChanges}
              >
                <span>Save Changes</span>
              </button>
            )}
          </div>
          {ch_2_loadNew && (
            <LoadLangFromFile
              p_selectedFileName={ch_2_selectedFileName}
              p_langChoiceRef={langChoiceRef}
              p_loadFromFile={ch_2_loadFromFile}
              p_disableLangSelect={ch_2_disableLangSelect}
              p_disableLangInput={ch_2_disableLangInput}
            />
          )}
          {((ch_2_createNew && ch_2_selectedFileName) ||
            (ch_2_createNew && !ch_2_loadNew)) && (
            <LangNameInput
              p_createNew={ch_2_createNew}
              p_loadNew={ch_2_loadNew}
              p_disableLangInput={ch_2_disableLangInput}
              p_langName={ch_2_langName}
              p_onChangeLangName={ch_2_onChangeLangName}
              p_clickOnEditLangName={ch_2_clickOnEditLangName}
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

const LangNameInput = ({
  p_createNew,
  p_loadNew,
  p_disableLangInput,
  p_onChangeLangName,
  p_langName,
  p_clickOnEditLangName,
}: PropsForLangNameInput) => {
  return (
    <div className={languageStyles.lang_input_area}>
      <input
        {...(p_createNew && !p_loadNew && { autoFocus: true })}
        className={languageStyles.textarea}
        type="text"
        onChange={p_onChangeLangName}
        disabled={p_disableLangInput}
        value={p_langName}
      />
      {p_disableLangInput && (
        <Btn
          className={languageStyles.btn_language_input}
          onClick={p_clickOnEditLangName}
        >
          ✏️
        </Btn>
      )}
    </div>
  );
};

const LoadLangFromFile = ({
  p_selectedFileName,
  p_langChoiceRef,
  p_loadFromFile,
  p_disableLangSelect,
  p_disableLangInput,
}: PropsForLoadLangFromFile) => {
  return !p_selectedFileName ? (
    <input
      ref={p_langChoiceRef}
      className={languageStyles.textarea + " " + languageStyles.file_input}
      type="file"
      onInput={p_loadFromFile}
      disabled={p_disableLangSelect || p_disableLangInput}
    />
  ) : (
    <input
      className={
        languageStyles.textarea + " " + languageStyles.file_input_selected
      }
      type="text"
      disabled
      placeholder={`Loaded File: ${p_selectedFileName}`}
    />
  );
};

const SyncBtn = ({
  p_syncChangesOn,
  p_syncStart,
  p_toggleSync,
}: Partial<Props>) => {
  return (
    <Btn
      className={languageStyles.sync_btn}
      style={{
        ...(p_syncChangesOn && {
          color: "var(--btn_green)",
          border: "0.2rem solid var(--btn_green)",
        }),
      }}
      onClick={p_toggleSync}
    >
      <span className={languageStyles.sync_symbol}>&#x21BB;</span>
      {p_syncStart && (
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
  p_syncChangesOn: boolean;
  p_syncStart: boolean;
  p_reset: boolean;
  p_turnResetOn: () => void;
  p_saveChanges: () => void;
  p_onFileLoad: (language: { [keyof: string]: string }) => void;
  p_getFromLanguage: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  p_toggleSync: () => void;
  p_processLangNameChange: (langName: string) => void;
};

type PropsForLangNameInput = {
  p_createNew: boolean;
  p_loadNew: boolean;
  p_disableLangInput: boolean;
  p_onChangeLangName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  p_langName: string;
  p_clickOnEditLangName: () => void;
};

type PropsForLoadLangFromFile = {
  p_selectedFileName: string;
  p_langChoiceRef: React.RefObject<HTMLInputElement>;
  p_loadFromFile: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  p_disableLangSelect: boolean;
  p_disableLangInput: boolean;
};
