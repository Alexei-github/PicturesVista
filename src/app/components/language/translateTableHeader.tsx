'use client';

import React from 'react';
import LanguageSelectorUser from '@/components/language/LanguageSelectorUser';
import libStyles from '@/lib/lib.module.css';
import languageStyles from '@/components/language/language.module.css';
import Btn from '@/lib/buttons/btn';
import useLanguageText_gs_1 from '@/components/language/globalStores/gs_1_languageLoad';
import useTranslateTableHeaderState_ch_2 from '@/components/language/customHooks/ch_2_useTranslateTableHeaderState';
import TextDisplay from '@/components/language/TextDisplay';

const TranslateTableHeader = (
  {
    p_syncChangesOn,
    p_syncProgressStart,
    p_reset,
    p_turnResetOn,
    p_saveChanges,
    p_onFileLoad,
    p_updateTheFromLanguage,
    p_toggleSync,
    p_processLangNameChange,
    p_fromLanguageName,
  }: Props,
  ref?: React.ForwardedRef<TableHeaderRefType>,
) => {
  const langChoiceRef = React.useRef<HTMLInputElement>(null);

  const { gs_1_selectedLanguage, gs_1_getTextForString } = useLanguageText_gs_1(
    'selectedLanguage',
    'getTextForString',
    'selectedIdx', //"selectedIdx" is requested to rerender current componenet on its change
  );

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
  } = useTranslateTableHeaderState_ch_2({
    p_onFileLoad,
    p_turnResetOn,
    p_langChoiceRef: langChoiceRef,
  });

  React.useImperativeHandle(ref, ch_2_refFunction, [ch_2_refFunction]);

  React.useEffect(() => {
    const mockEvent = {
      target: { value: gs_1_selectedLanguage },
    } as React.ChangeEvent<HTMLSelectElement>;
    p_updateTheFromLanguage(mockEvent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const timeout = setTimeout(
      () => {
        p_processLangNameChange(ch_2_langName);
      },
      p_reset ? 0 : 500,
    );

    return () => {
      clearTimeout(timeout);
    };
  }, [ch_2_langName, p_processLangNameChange, p_reset]);

  return (
    <thead>
      <tr>
        <th className={languageStyles.first_column}>
          <p>id</p>
        </th>
        <th className={languageStyles.second_column}>
          <div className={languageStyles.from_lang_header}>
            <LanguageSelectorUser
              p_defaultLanguage={gs_1_selectedLanguage}
              p_selectorClassName={`${languageStyles.language_selector} ${languageStyles.language_selector_navbar}`}
              p_onChangePassed={p_updateTheFromLanguage}
            >
              <optgroup>
                <option value="init_version">{gs_1_getTextForString('6')}</option>
                {/* <option value="init_version">Initial Version</option> */}
              </optgroup>
            </LanguageSelectorUser>
            {p_fromLanguageName && (
              <input
                className={languageStyles.textarea + ' ' + languageStyles.file_input_selected}
                type="text"
                disabled
                placeholder={p_fromLanguageName}
              />
            )}
          </div>
        </th>
        <th className={languageStyles.third_column}>
          <div className={languageStyles.select_save_div}>
            <SyncBtn
              p_syncChangesOn={p_syncChangesOn}
              p_syncProgressStart={p_syncProgressStart}
              p_toggleSync={p_toggleSync}
            />
            <LanguageSelectorUser
              p_defaultLanguage="lang"
              p_selectorClassName={`${languageStyles.language_selector} ${languageStyles.language_selector_navbar}`}
              p_onChangePassed={ch_2_inputMethodChanged}
              p_disabledSelect={ch_2_disableLangSelect}
            >
              <optgroup>
                <option value="lang" disabled>
                  {gs_1_getTextForString('7')}
                </option>
                <option value="create_new">Create New</option>
                <option value="load_new">Load From File</option>
              </optgroup>
              <optgroup style={{ fontSize: '1.1rem' }} label="Available:" />
            </LanguageSelectorUser>
            {ch_2_disableLangSelect && (
              <button
                className={` ${libStyles.btn_main_navbar} ${languageStyles.save_btn}`}
                onClick={p_saveChanges}
              >
                <span>
                  <TextDisplay p_elementId="8" />
                </span>
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
          {((ch_2_createNew && ch_2_selectedFileName) || (ch_2_createNew && !ch_2_loadNew)) && (
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

export default React.memo(React.forwardRef<TableHeaderRefType, Props>(TranslateTableHeader));

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
        <Btn className={languageStyles.btn_language_input} onClick={p_clickOnEditLangName}>
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
      className={languageStyles.textarea + ' ' + languageStyles.file_input}
      type="file"
      onInput={p_loadFromFile}
      disabled={p_disableLangSelect || p_disableLangInput}
    />
  ) : (
    <input
      className={languageStyles.file_input_selected}
      type="text"
      disabled
      placeholder={`Loaded File: ${p_selectedFileName}`}
    />
  );
};

const SyncBtn = ({ p_syncChangesOn, p_syncProgressStart, p_toggleSync }: Partial<Props>) => {
  return (
    <Btn
      className={languageStyles.sync_btn}
      style={{
        ...(p_syncChangesOn && {
          color: 'var(--btn_green)',
          border: '0.2rem solid var(--btn_green)',
        }),
      }}
      onClick={p_toggleSync}
    >
      <span className={languageStyles.sync_symbol}>&#x21BB;</span>
      {p_syncProgressStart && (
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
  p_syncProgressStart: boolean;
  p_reset: boolean;
  p_fromLanguageName: string;
  p_turnResetOn: () => void;
  p_saveChanges: () => void;
  p_onFileLoad: (language: { [keyof: string]: string }) => void;
  p_updateTheFromLanguage: (e: React.ChangeEvent<HTMLSelectElement>) => void;
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
