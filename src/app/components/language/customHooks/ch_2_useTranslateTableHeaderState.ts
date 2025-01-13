import React from 'react';
import { TableHeaderRefType } from '@/components/language/translateTableHeader';

export default function useTranslateTableHeaderState_ch_2({
  p_turnResetOn,
  p_onFileLoad,
  p_langChoiceRef,
}: Props) {
  const [createNew, setCreateNew] = React.useState(false);
  const [loadNew, setLoadNew] = React.useState(false);
  const [langName, setLangName] = React.useState('');
  const [disableLangSelect, setDisableLangSelect] = React.useState(false);
  const [disableLangInput, setDisableLangInput] = React.useState(false);
  const [editLanguageName, setEditLanguageName] = React.useState(false);
  const [selectedFileName, setSelectedFileName] = React.useState('');

  const loadFromFile = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const blobLang = e.target.files?.[0];
        if (blobLang) {
          const language = await new Response(blobLang).json();
          language.lang = JSON.parse(language['0'].replaceAll("'", '"')).lang;
          delete language['0'];
          p_onFileLoad(language);
          setLangName(language.lang);
          setSelectedFileName(blobLang?.name ?? '');
        }
      } catch {
        console.log('read error');
      }
    },
    [p_onFileLoad],
  );

  const refFunction = React.useCallback((): TableHeaderRefType => {
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
  }, [
    createNew,
    loadNew,
    langName,
    disableLangSelect,
    editLanguageName,
    selectedFileName,
    disableLangInput,
  ]);

  const inputMethodChanged = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setDisableLangInput(false);
      p_turnResetOn();
      setCreateNew(true);
      setSelectedFileName('');

      if (e.target.value === 'create_new') {
        setLoadNew(false);
        setEditLanguageName(false);
        setLangName('');
      } else if (e.target.value === 'load_new') {
        setLoadNew(true);
        if (p_langChoiceRef.current) {
          p_langChoiceRef.current.value = '';
        }
        setLangName('');
        setEditLanguageName(true);
      } else {
        setLoadNew(false);
        setLangName(e.target.value);
        setEditLanguageName(true);
      }

      e.target.value = 'lang';
    },
    [p_turnResetOn, p_langChoiceRef],
  );

  const clickOnEditLangName = () => {
    setEditLanguageName(true);
    setDisableLangInput(false);
  };

  const onChangeLangName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLangName(e.target.value);
  };

  return {
    ch_2_createNew: createNew,
    ch_2_loadNew: loadNew,
    ch_2_langName: langName,
    ch_2_disableLangSelect: disableLangSelect,
    ch_2_disableLangInput: disableLangInput,
    ch_2_selectedFileName: selectedFileName,
    ch_2_loadFromFile: loadFromFile,
    ch_2_refFunction: refFunction,
    ch_2_inputMethodChanged: inputMethodChanged,
    ch_2_clickOnEditLangName: clickOnEditLangName,
    ch_2_onChangeLangName: onChangeLangName,
  };
}

type Props = {
  p_turnResetOn: () => void;
  p_onFileLoad: (language: { [keyof: string]: string }) => void;
  p_langChoiceRef: React.RefObject<HTMLInputElement>;
};
