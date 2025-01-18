'use client';

import React from 'react';
import useLanguageText_gs_1 from '@/components/language/globalStores/gs_1_languageLoad';

/**
 * A component that renders a dropdown menu for selecting the user's preferred language.
 *
 * @property p_selectorClassName - A string representing the class name of the select element.
 * @property p_onChangePassed - A function that will be called when the user selects a new language.
 *   If this function is not passed, then the component will call the `gs_1_setLanguage` function
 *   from the `useLanguageText_gs_1` hook.
 * @property children - The children of the component.
 * @property p_disabledSelect - A boolean indicating if the select element should be disabled.
 *   Defaults to `false`.
 * @property p_defaultLanguage - A string representing the language that should be selected by
 *   default.
 * @returns A JSX element representing the select element.
 */
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

  const [selectTagId] = React.useState(React.useId());

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      gs_1_setLanguage(e.target.value);
    },
    [gs_1_setLanguage],
  );

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

export default React.memo(LanguageSelectorUser);

type Props = {
  p_selectorClassName: string;
  p_onChangePassed?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children?: React.ReactNode;
  p_disabledSelect?: boolean;
  p_defaultLanguage: string;
};
