'use client';
import LanguageEditTransalte from '@/components/language/LanguageEditTranslate';
import LanguageSelectorUser from '@/components/language/LanguageSelectorUser';
import useLanguageText_gs_1 from '@/components/language/globalStores/gs_1_languageLoad';
import languageStyles from '@/components/language/language.module.css';
import { DEFAULT_LANGUAGE } from '@/components/language/lib/constants';
import React from 'react';

/**
 * A component that renders a language selector and if edit mode is enabled, an edit translate
 * button. When the component mounts, it sets the language to the default language.
 *
 * @returns A JSX element representing the language selector and edit translate button.
 */
const MainLangSelect = (): React.ReactNode => {
  const { gs_1_setLanguage, gs_1_editMode } = useLanguageText_gs_1('setLanguage', 'editMode');

  React.useEffect(() => {
    gs_1_setLanguage(DEFAULT_LANGUAGE);
  }, [gs_1_setLanguage]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '0.2rem' }}>
      <LanguageSelectorUser
        p_defaultLanguage={DEFAULT_LANGUAGE}
        p_selectorClassName={`${languageStyles.language_selector} ${languageStyles.language_selector_navbar}`}
      />
      {gs_1_editMode && <LanguageEditTransalte />}
    </div>
  );
};

export default MainLangSelect;
