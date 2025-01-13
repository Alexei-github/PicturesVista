'use client';

import React from 'react';
import useLanguageText_gs_1 from '@/components/language/globalStores/gs_1_languageLoad';

type Props = {
  p_selectorClassName: string;
  p_onChangePassed?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children?: React.ReactNode;
  p_disabledSelect?: boolean;
  p_defaultLanguage: string;
};

//Provide detailed comments for this function in JSDoc format.

const LanguageSelectorUser = ({
  p_selectorClassName,
  p_onChangePassed,
  children,
  p_disabledSelect = false,
  p_defaultLanguage,
}: Props) => {
  const { gs_1_availableLanguages, gs_1_setLanguage } = useLanguageText_gs_1(
    'availableLanguages',
    'setLanguage',
  );

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      gs_1_setLanguage(e.target.value);
    },
    [gs_1_setLanguage],
  );

  const selectTagId = React.useId();

  return (
    <select
      id={`clickedLanguage_${selectTagId}`}
      name="language"
      defaultValue={p_defaultLanguage}
      onChange={p_onChangePassed ? p_onChangePassed : onChange}
      className={p_selectorClassName}
      disabled={p_disabledSelect}
    >
      {children}

      {Object.keys(gs_1_availableLanguages ?? []).map((language, idx) => {
        return (
          <optgroup key={language + idx}>
            <option value={language} style={{ padding: '20px' }}>
              {language}
            </option>
          </optgroup>
        );
      })}
    </select>
  );
};

export default LanguageSelectorUser;
