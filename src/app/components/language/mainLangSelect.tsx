'use client';
import React from 'react';
import LanguageSelectorUser from '@/components/language/languageSelectorUser';
import languageStyles from '@/components/language/language.module.css';
import LanguageEditTransalte from '@/components/language/languageEditTranslate';
import useLanguageText_gs_1 from '@/components/language/globalStores/gs_1_languageLoad';
import { DEFAULT_LANGUAGE } from '@/components/language/lib/constants';

const MainLangSelect = (): React.ReactNode => {
  const { gs_1_setLanguage } = useLanguageText_gs_1('setLanguage');

  React.useEffect(() => {
    gs_1_setLanguage(DEFAULT_LANGUAGE);
  }, [gs_1_setLanguage]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '0.2rem' }}>
      <LanguageSelectorUser
        p_defaultLanguage={DEFAULT_LANGUAGE}
        p_selectorClassName={`${languageStyles.language_selector} ${languageStyles.language_selector_navbar}`}
      />
      <LanguageEditTransalte />
    </div>
  );
};

export default MainLangSelect;
