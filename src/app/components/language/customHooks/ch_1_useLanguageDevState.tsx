import React from 'react';
import useLanguageText_gs_1 from '@/components/language/globalStores/gs_1_languageLoad';
import { TableHeaderRefType } from '@/components/language/TranslateTableHeader';
import { LanguageText, LanguageUpdateValues } from '@/components/language/types';
import f_1_saveTranslationChanges from '@/components/language/functions/f_1_saveTranslationChnages';
import {
  UNSAVED_TRANSLATION_LOCAL_STORAGE,
  LOCAL_STORAGE_DEBOUNCE_TIME,
  SYNC_DEBOUNCE_TIME,
} from '@/components/language/lib/constants';

/**
 * Custom hook to manage the state of the language translation modal.
 *
 * @returns An object with the following properties:
 *
 *   - `ch_1_displayingInitCopy`: a boolean indicating whether to show initial copy of the text from
 *       which translation is being made
 *   - `ch_1_fromTheLanguage`: text of the language from which the translation is being made.
 *   - `ch_1_newTranslation`: text of the current translation state.
 *   - `ch_1_updatedValues`: an object indicating the keys which values have been changed in the
 *       translation.
 *   - `ch_1_unsavedUpdate`: an object indicating the keys which values have been changed in the
 *       translation and have not yet been saved to the file.
 *   - `ch_1_reset`: a boolean indicating if values shown in translation modal should be reset.
 *   - `ch_1_syncChangesOn`: a boolean indicating if the newly translated items should be displayed on
 *       the website (synced to the elements on the website).
 *   - `ch_1_headerRef`: a reference to the table header element. /////////////////////////////////////
 *   - `ch_1_syncChangeStart`: a boolean indicating if the translation is being saved to the local
 *       storage.
 *   - `ch_1_saveChanges`: a function to save the translation to the local storage.
 *   - `ch_1_onFileLoad`: a function to load a new file.
 *   - `ch_1_toggleSync`: a function to toggle the value of `ch_1_syncChangesOn`.
 *   - `ch_1_processLangNameChange`: a function to update the language state based on the new language
 *       name.
 *   - `ch_1_updateTheFromLanguage`: a function to update the language from which the translation is
 *       being made.
 *   - `ch_1_translateOnChange`: a function to handle the change in the translation text and update the
 *       state accordingly.
 *   - `ch_1_turnResetOn`: a function to turn the reset on.
 */
export default function useLanguageDevState_ch_1(): ReturnType {
  const {
    gs_1_availableLanguages,
    gs_1_getLanguage,
    gs_1_allIdsSet,
    gs_1_setLanguage,
    gs_1_selectedLanguage,
    gs_1_selectedIdx,
  } = useLanguageText_gs_1(
    'availableLanguages',
    'getLanguage',
    'allIdsSet',
    'setLanguage',
    'selectedLanguage',
    'selectedIdx',
  );

  const [displayingInitCopy, setDisplayingInitCopy] = React.useState(false);
  const [fromTheLanguage, setFromTheLanguage] = React.useState<LanguageText>({});
  const [languageInitCopy, setLanguageInitCopy] = React.useState<LanguageText>({});
  const [newTranslation, setNewTranslation] = React.useState<LanguageText>({});
  const [updatedValues, setUpdatedValues] = React.useState<{
    [key: string]: boolean;
  }>({});
  const [unsavedUpdate, setUnsavedUpdate] = React.useState<{
    [key: string]: boolean;
  }>({});
  const [reset, setReset] = React.useState(false);
  const [latestSave, setLatestSave] = React.useState<LanguageText>({});
  const [rerenderComponet, setRerenderComponent] = React.useState('');
  const [syncChangesOn, setSyncChangesOn] = React.useState(false);
  const [syncChangeStart, setSyncChangeStart] = React.useState(false);
  const headerRef = React.useRef<TableHeaderRefType>(null);

  React.useEffect(() => {
    const element = document.getElementById(`translate_row_${gs_1_selectedIdx}`);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [gs_1_selectedIdx]);

  /**
   * Updates the state of the language from which the translation is being made.
   *
   * @param e {React.ChangeEvent<HTMLSelectElement>} event object
   */
  const updateTheFromLanguage = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (e.target.value === 'init_version') {
        setFromTheLanguage(languageInitCopy);
        setDisplayingInitCopy(true);
      } else {
        (async () => {
          setFromTheLanguage((await gs_1_getLanguage(e.target.value)) ?? {});
        })();
        setDisplayingInitCopy(false);
      }
    },
    [gs_1_getLanguage, languageInitCopy],
  );

  React.useEffect(
    /** Loads the translation state from the local storage */
    () => {
      const unsavedTranslationStateString = localStorage.getItem(UNSAVED_TRANSLATION_LOCAL_STORAGE);

      if (unsavedTranslationStateString) {
        const unsavedTranslationState = JSON.parse(unsavedTranslationStateString);
        if (headerRef && unsavedTranslationState.translateTableHeader) {
          headerRef.current?.setInitState(unsavedTranslationState.translateTableHeader);
        }
        setNewTranslation(unsavedTranslationState.newTranslation);
        setLatestSave(unsavedTranslationState.latestSave);
        setLanguageInitCopy(unsavedTranslationState.languageInitCopy);
        setUnsavedUpdate(unsavedTranslationState.unsavedUpdate);
        setFromTheLanguage(unsavedTranslationState.fromLanguage);
        setSyncChangesOn(unsavedTranslationState.syncChangesOn);
        setUpdatedValues(unsavedTranslationState.updatedValues);
        setReset(unsavedTranslationState.reset);
      }
    },
    [headerRef],
  );

  React.useEffect(
    /**
     * Saves the translation state to the local storage
     *
     * @returns Cleanup function
     */
    (): (() => void) | undefined => {
      if (syncChangesOn) {
        const timeout = setTimeout(() => {
          setSyncChangeStart(true);
          gs_1_setLanguage(gs_1_selectedLanguage, newTranslation);
        }, SYNC_DEBOUNCE_TIME);
        return () => {
          setSyncChangeStart(false);
          clearTimeout(timeout);
        };
      }
    },
    [rerenderComponet, syncChangesOn, newTranslation, gs_1_selectedLanguage, gs_1_setLanguage],
  );

  React.useEffect(
    /**
     * This effect saves the state of the translation table to local storage when the unsaved
     * translation state changes. It uses a debouncing mechanism to prevent too many write
     * operations to local storage.
     *
     * @returns Cleanup function
     */
    () => {
      const timeout = setTimeout(() => {
        if (Object.keys(newTranslation).length !== 0) {
          const unsavedTranslationState = {
            newTranslation,
            latestSave,
            languageInitCopy,
            unsavedUpdate,
            fromLanguage: fromTheLanguage,
            syncChangesOn,
            updatedValues,
            reset,
            translateTableHeader: {
              langName: headerRef?.current?.getState()?.langName ?? '',
              loadNew: headerRef?.current?.getState()?.loadNew ?? false,
              createNew: headerRef?.current?.getState()?.createNew ?? false,
              disableLangSelect: headerRef?.current?.getState()?.disableLangSelect ?? false,
              selectedFileName: headerRef?.current?.getState()?.selectedFileName ?? '',
              editLanguageName: headerRef?.current?.getState().editLanguageName ?? false,
              disableLangInput: headerRef?.current?.getState().disableLangInput ?? false,
            },
          };

          localStorage.setItem(
            UNSAVED_TRANSLATION_LOCAL_STORAGE,
            JSON.stringify(unsavedTranslationState),
          );
        }
      }, LOCAL_STORAGE_DEBOUNCE_TIME);
      return () => {
        clearTimeout(timeout);
      };
    },
    [
      rerenderComponet,
      fromTheLanguage,
      languageInitCopy,
      latestSave,
      newTranslation,
      syncChangesOn,
      unsavedUpdate,
      updatedValues,
      reset,
    ],
  );

  React.useEffect(() => {
    if (!syncChangesOn) {
      setSyncChangeStart(false);
      gs_1_setLanguage(gs_1_selectedLanguage);
    }
  }, [syncChangesOn, gs_1_selectedLanguage, gs_1_setLanguage]);
  const processLangNameChange = React.useCallback(
    /**
     * Updates the language state based on the new language name.
     *
     * If the language name is being edited or reset is active, it initializes the state. If the
     * language has already been loaded and xists in available languages, it gets it local state of
     * new translation. Otherwise, it clears the current new translation language state and only
     * sets the language name.
     *
     * @param lang {string} The new language name
     */
    (lang: string) => {
      if (!headerRef?.current?.getState().editLanguageName || reset) {
        setReset(false);
        if (gs_1_availableLanguages[lang]) {
          (async () => {
            const existLang = await gs_1_getLanguage(lang);
            setNewTranslation({ ...existLang, lang: lang });
            setLanguageInitCopy({ ...existLang, lang: lang });
            setUpdatedValues({});
            setUnsavedUpdate({});
            setLatestSave({});
            setRerenderComponent(`langName-${lang}`);
            if (displayingInitCopy) {
              setFromTheLanguage({ ...existLang, lang: lang });
            }
          })();
        } else {
          if (Object.keys(languageInitCopy).length > 0) {
            setNewTranslation({});
            setLanguageInitCopy({ lang: lang });
            setUpdatedValues({});
            setUnsavedUpdate({});
            setLatestSave({});
            setRerenderComponent(`langName-${lang}`);
            if (displayingInitCopy) {
              setFromTheLanguage({ lang: lang });
            }
          }
        }
      } else {
        newTranslation.lang = lang;
      }
    },
    [
      gs_1_availableLanguages,
      languageInitCopy,
      gs_1_getLanguage,
      reset,
      newTranslation,
      displayingInitCopy,
    ],
  );

  const onFileLoad = React.useCallback(
    (language: LanguageText) => {
      setNewTranslation({ ...language });
      newTranslation['lang'] = language.lang;

      if (gs_1_availableLanguages[language.lang]) {
        (async () => {
          const existLang = await gs_1_getLanguage(language.lang);
          const newUpdateVal: LanguageUpdateValues = {};
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
          if (displayingInitCopy) {
            setFromTheLanguage(existLang ?? {});
          }
        })();
      } else {
        setLanguageInitCopy({ ...language });
        setUpdatedValues({});
        setUnsavedUpdate({});
        setLatestSave({});
        if (displayingInitCopy) {
          setFromTheLanguage({ ...language });
        }
      }
    },
    [gs_1_availableLanguages, gs_1_getLanguage, newTranslation, displayingInitCopy],
  );
  /** Handles the change in the translation text and updates the state accordingly */
  const translateOnChange = React.useCallback(
    /**
     * Processes the change in the translation text and updates the state accordingly
     *
     * @param e {React.ChangeEvent<HTMLTextAreaElement>} event object
     * @param key {string} index/key of the item which text is requested for
     */
    (e: React.ChangeEvent<HTMLTextAreaElement>, key: string) => {
      const valueTrimmed = e.target.value?.trim() ?? '';

      headerRef?.current?.setEditLanguageName(true);
      updatedValues[key] = valueTrimmed !== (languageInitCopy[key]?.trim() ?? '');

      unsavedUpdate[key] =
        valueTrimmed !== (latestSave[key]?.trim() ?? '') &&
        valueTrimmed !== (languageInitCopy[key]?.trim() ?? '');

      if (
        Object.keys(updatedValues).some((k) => updatedValues[k] && !latestSave[k]) ||
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
    [newTranslation, languageInitCopy, updatedValues, unsavedUpdate, latestSave],
  );
  const saveChanges = React.useCallback(async () => {
    const { f_1_savedChanges } = await f_1_saveTranslationChanges({
      newTranslation,
      updatedValues,
      allIdsSet: gs_1_allIdsSet,
    });
    headerRef?.current?.setDisableLangSelect(false);
    setLatestSave(f_1_savedChanges);
    setUnsavedUpdate({});
  }, [newTranslation, updatedValues, gs_1_allIdsSet]);

  const toggleSync = React.useCallback(() => {
    setSyncChangesOn((value) => !value);
  }, []);

  const turnResetOn = React.useCallback(() => {
    setReset(true);
  }, []);

  return {
    ch_1_displayingInitCopy: displayingInitCopy,
    ch_1_fromLanguage: fromTheLanguage,
    ch_1_newTranslation: newTranslation,
    ch_1_updatedValues: updatedValues,
    ch_1_unsavedUpdate: unsavedUpdate,
    ch_1_reset: reset,
    ch_1_syncChangesOn: syncChangesOn,
    ch_1_headerRef: headerRef,
    ch_1_syncChangeStart: syncChangeStart,
    ch_1_saveChanges: saveChanges,
    ch_1_onFileLoad: onFileLoad,
    ch_1_toggleSync: toggleSync,
    ch_1_processLangNameChange: processLangNameChange,
    ch_1_updateTheFromLanguage: updateTheFromLanguage,
    ch_1_translateOnChange: translateOnChange,
    ch_1_turnResetOn: turnResetOn,
  };
}

type ReturnType = {
  ch_1_displayingInitCopy: boolean;
  ch_1_fromLanguage: LanguageText;
  ch_1_newTranslation: LanguageText;
  ch_1_updatedValues: { [key: string]: boolean };
  ch_1_unsavedUpdate: { [key: string]: boolean };
  ch_1_reset: boolean;
  ch_1_syncChangesOn: boolean;
  ch_1_headerRef: React.MutableRefObject<TableHeaderRefType | null>;
  ch_1_syncChangeStart: boolean;
  ch_1_saveChanges: () => Promise<void>;
  ch_1_onFileLoad: (language: LanguageText) => void;
  ch_1_toggleSync: () => void;
  ch_1_processLangNameChange: (lang: string) => void;
  ch_1_updateTheFromLanguage: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  ch_1_translateOnChange: (e: React.ChangeEvent<HTMLTextAreaElement>, key: string) => void;
  ch_1_turnResetOn: () => void;
};
