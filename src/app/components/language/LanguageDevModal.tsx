'use client';
import React from 'react';
import useLanguageText_gs_1 from '@/components/language/globalStores/gs_1_languageLoad';
import languageStyles from '@/components/language/language.module.css';
import Modal from '@/components/modal/Modal';
import TranslationTableRow from '@/components/language/TranslationTableRow';
import TranslateTableHeader from '@/components/language/TranslateTableHeader';
import useLanguageDevState_ch_1 from './customHooks/ch_1_useLanguageDevState';

type Props = {
  p_onClose: () => void;
};

const LanguageDevModal = ({ p_onClose }: Props) => {
  const { gs_1_currLangText, gs_1_allIdsSet } = useLanguageText_gs_1('currLangText', 'allIdsSet');

  const {
    ch_1_displayingInitCopy,
    ch_1_fromLanguage,
    ch_1_newTranslation,
    ch_1_updatedValues,
    ch_1_unsavedUpdate,
    ch_1_reset,
    ch_1_syncChangesOn,
    ch_1_headerRef,
    ch_1_syncProgressStart,
    ch_1_saveChanges,
    ch_1_onFileLoad,
    ch_1_toggleSync,
    ch_1_processLangNameChange,
    ch_1_updateTheFromLanguage,
    ch_1_translateOnChange,
    ch_1_turnResetOn,
  } = useLanguageDevState_ch_1();

  return (
    <Modal sizeScale={0.8} onClose={p_onClose}>
      <table className={languageStyles.table}>
        <TranslateTableHeader
          ref={ch_1_headerRef}
          p_reset={ch_1_reset}
          p_turnResetOn={ch_1_turnResetOn}
          p_saveChanges={ch_1_saveChanges}
          p_onFileLoad={ch_1_onFileLoad}
          p_updateTheFromLanguage={ch_1_updateTheFromLanguage}
          p_syncChangesOn={ch_1_syncChangesOn}
          p_toggleSync={ch_1_toggleSync}
          p_syncProgressStart={ch_1_syncProgressStart}
          p_processLangNameChange={ch_1_processLangNameChange}
          p_fromLanguageName={ch_1_displayingInitCopy ? ch_1_fromLanguage.lang : ''}
        />
        <tbody>
          {gs_1_currLangText &&
            (Array.from(gs_1_allIdsSet) as string[])
              .sort((a: string, b: string) => parseInt(a) - parseInt(b))
              .map((key: string) => {
                return (
                  <TranslationTableRow
                    key={'translate_row_' + key}
                    id={'translate_row_' + key}
                    key_val={key}
                    fromLangValue={ch_1_fromLanguage[key]}
                    onChange={ch_1_translateOnChange}
                    updatedTransaltion={ch_1_newTranslation ? ch_1_newTranslation[key] : ''}
                    updated={ch_1_updatedValues[key]}
                    updatedAfterLatestSave={ch_1_unsavedUpdate[key]}
                  />
                );
              })}
        </tbody>
      </table>
    </Modal>
  );
};

export default LanguageDevModal;
