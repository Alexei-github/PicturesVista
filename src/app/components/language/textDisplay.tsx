'use client';
import React from 'react';
import useLanguageText_gs_1 from '@/components/language/globalStores/gs_1_languageLoad';
import languageStyles from '@/components/language/language.module.css';

type Props = {
  p_elementId: string;
};

const TextDisplay = ({ p_elementId }: Props) => {
  // const { gs_1_editMode, gs_1_getTextForComponent, gs_1_selectedIdx, gs_1_setSelectedIdx } =
  //   useLanguageText_gs_1(
  //     'getTextForComponent',
  //     'editMode',
  //     'setSelectedIdx',
  //     'selectedIdx',
  //     'currLangText', //"currLangText" is for rerender on its change
  //   );

  return (
    <>
      {gs_1_editMode ? (
        <>
          <sup
            className={languageStyles.text_idx}
            style={{
              ...(gs_1_selectedIdx === p_elementId && {
                borderColor: 'red',
              }),
            }}
            onClick={(e) => {
              e.stopPropagation();
              gs_1_setSelectedIdx(p_elementId);
            }}
          >
            {p_elementId}
          </sup>
          {gs_1_getTextForComponent(p_elementId)}
        </>
      ) : (
        gs_1_getTextForComponent(p_elementId)
      )}
    </>
  );
};

export default React.memo(TextDisplay);
