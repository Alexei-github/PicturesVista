'use client';

import React from 'react';
import Btn from '@/lib/buttons/btn';
import LanguageDevModal from '@/components/language/LanguageDevModal';

/**
 * Component to render a button for language edit translate, which opens a modal with the
 * translation table when clicked.
 *
 * @returns A JSX element rendering the button and the modal.
 */
const LanguageEditTransalte = () => {
  const [editTranslate, setEditTranslate] = React.useState(false);

  const openLanguageEdit = React.useCallback(() => {
    setEditTranslate(true);
  }, []);

  const closeLanguageEdit = React.useCallback(() => {
    setEditTranslate(false);
  }, []);

  return (
    <>
      <Btn onClick={openLanguageEdit}>✏️</Btn>
      {editTranslate && <LanguageDevModal p_onClose={closeLanguageEdit} />}
    </>
  );
};

export default LanguageEditTransalte;
