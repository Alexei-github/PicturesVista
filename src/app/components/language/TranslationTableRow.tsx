'use client';

import React from 'react';
import useLanguageText_gs_1 from '@/components/language/globalStores/gs_1_languageLoad';
import languageStyles from '@/components/language/language.module.css';

/**
 * A React component that renders a single row of a table for editing language translations.
 *
 * @property keyVal - The key (key in JSON file) value of the translation.
 * @property fromLangValue - The value of the translation in the language from which translation is
 *   being made.
 * @property onChange - A function to handle changes to the translation.
 * @property updatedTransaltion - The updated translation value to be displayed in the text area.
 * @property updated - A flag to indicate if the translation has been updated copmared to intitial
 *   value.
 * @property updatedAfterLatestSave - A flag to indicate if the translation has been updated after
 *   the latest save.
 * @property id - The id of the row (needed for finding it in a DOM and scrolling to it).
 * @returns A JSX element representing the table row.
 */
const TranslationTableRow = ({
  keyVal,
  fromLangValue,
  onChange,
  updatedTransaltion,
  updated,
  updatedAfterLatestSave,
  id,
}: Props) => {
  const { gs_1_selectedIdx, gs_1_setSelectedIdx } = useLanguageText_gs_1(
    'selectedIdx',
    'setSelectedIdx',
  );

  return (
    <tr
      className={gs_1_selectedIdx == keyVal ? languageStyles.active_row : ''}
      id={'translate_row_' + keyVal}
      onClick={(e) => {
        e.preventDefault();
        gs_1_setSelectedIdx(keyVal);
      }}
    >
      <td className={languageStyles.first_column}>
        <p>{keyVal}</p>
      </td>
      <td className={languageStyles.second_column}>
        <p>{fromLangValue}</p>
      </td>
      <td className={languageStyles.third_column}>
        {updated && !updatedAfterLatestSave && (
          <div className={languageStyles.green_tick}>&#10004;</div>
        )}
        {updatedAfterLatestSave && (
          <div className={languageStyles.green_tick}>
            <span
              style={{
                display: 'inline-block',
                position: 'relative',
                left: '10%',
              }}
            >
              &#10004;
            </span>{' '}
            <span
              style={{
                position: 'absolute',
                left: '0%',
              }}
            >
              &#10004;
            </span>
          </div>
        )}
        <textarea
          id={`newTranslate_textArea_${id}`}
          className={languageStyles.textarea}
          onChange={(e) => {
            onChange(e, keyVal);
          }}
          value={updatedTransaltion ?? ''}
        ></textarea>
      </td>
    </tr>
  );
};

export default React.memo(TranslationTableRow);

type Props = {
  keyVal: string;
  fromLangValue: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>, key: string) => void;
  updatedTransaltion: string;
  updated: boolean;
  updatedAfterLatestSave: boolean;
  id: string;
};
