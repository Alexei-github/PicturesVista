import React from 'react';
/**
 * Custom hook to manage the state and behavior of the language translation table header.
 *
 * @param params - The parameters for the hook.
 * @param params.p_turnResetOn - Function to trigger a reset action.
 * @param params.p_onFileLoad - Function to process text loaded from JSON file.
 * @param params.p_langChoiceRef - Reference to the language choice input element.
 * @returns An object containing state variables and functions to manage the translation table
 *   header:
 *
 *   - `ch_2_createNew`: boolean indicating if a new language is being created.
 *   - `ch_2_loadNew`: boolean indicating if a new language is being loaded.
 *   - `ch_2_langName`: string representing the language name of the current new translation.
 *   - `ch_2_disableLangSelect`: boolean indicating if the language selection field is to be disabled.
 *   - `ch_2_disableLangInput`: boolean indicating if the language input field is to be disabled.
 *   - `ch_2_selectedFileName`: string representing the selected file name.
 *   - `ch_2_loadFromFile`: function to handle loading a language from a file.
 *   - `ch_2_refFunction`: function which will be passed as a callback to React.useImperativeHandle.
 *   - `ch_2_inputMethodChanged`: function with action to be run on change of input method.
 *   - `ch_2_clickOnEditLangName`: function to enable editing of the language name.
 *   - `ch_2_onChangeLangName`: function to handle changes to the language name input.
 */

export default function useTranslateTableHeaderState_ch_2({
  p_turnResetOn,
  p_onFileLoad,
  p_langChoiceRef,
}: Props): ReturnType {
  const [createNew, setCreateNew] = React.useState(false);
  const [loadNew, setLoadNew] = React.useState(false);
  const [langName, setLangName] = React.useState('');
  const [disableLangSelect, setDisableLangSelect] = React.useState(false);
  const [disableLangInput, setDisableLangInput] = React.useState(false);
  const [editLanguageName, setEditLanguageName] = React.useState(false);
  const [selectedFileName, setSelectedFileName] = React.useState('');

  const loadFromFile = React.useCallback(
    /**
     * Loads a language text from a JSON file calls relevant function to update the state with the
     * loaded language details.
     *
     * @param e - The change event triggered by the file input element.
     * @returns A Promise that resolves when the language is loaded and state is updated.
     */
    async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
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

  const refFunction = React.useCallback(
    /**
     * Returns a function that provides access to the current state of the table header controls and
     * allows updating specific state values.
     *
     * @returns An object of type `TableHeaderRefType` containing:
     *
     *   - `getState`: Function that returns the current state values.
     *   - `setDisableLangSelect`: Function to set the state of `disableLangSelect`.
     *   - `setDisableLangInput`: Function to set the state of `disableLangInput`.
     *   - `setEditLanguageName`: Function to enable or disable editing of the language name.
     *   - `setInitState`: Function to initialize state values for the table header controls.
     */

    (): TableHeaderRefType => {
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
    ],
  );

  const inputMethodChanged = React.useCallback(
    /**
     * A function to handle change in the input method of the language text.
     *
     * @param e - The event of the change in the input method selection field.
     */
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

  const clickOnEditLangName = React.useCallback(
    /** A function to enable editing of the language name. */
    () => {
      setEditLanguageName(true);
      setDisableLangInput(false);
    },
    [setEditLanguageName, setDisableLangInput],
  );

  const onChangeLangName = React.useCallback(
    /**
     * A function to handle changes in the language name input field.
     *
     * @param e - The change event triggered by input in the language name input field.
     */
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLangName(e.target.value);
    },
    [setLangName],
  );

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

type ReturnType = {
  ch_2_createNew: boolean;
  ch_2_loadNew: boolean;
  ch_2_langName: string;
  ch_2_disableLangSelect: boolean;
  ch_2_disableLangInput: boolean;
  ch_2_selectedFileName: string;
  ch_2_loadFromFile: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  ch_2_refFunction: () => TableHeaderRefType;
  ch_2_inputMethodChanged: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  ch_2_clickOnEditLangName: () => void;
  ch_2_onChangeLangName: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
