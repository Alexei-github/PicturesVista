"use client";

import React from "react";
import { useLanguageText_gs_1 } from "@/components/language/globalStores/gs_1_languageLoad";
import languageStyles from "@/components/language/language.module.css";

type Props = {
  key_val: string;
  fromLangValue: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>, key: string) => void;
  updatedTransaltion: string;
  updated: boolean;
  updatedAfterLatestSave: boolean;
  id: string;
};

const TranslationTableRow = ({
  key_val,
  fromLangValue,
  onChange,
  updatedTransaltion,
  updated,
  updatedAfterLatestSave,
  id,
}: Props) => {
  const gs_1_selectedIdx = useLanguageText_gs_1((s) => s.selectedIdx);
  const gs_1_setSelectedIdx = useLanguageText_gs_1((s) => s.setSelectedIdx);

  return (
    <tr
      className={gs_1_selectedIdx == key_val ? languageStyles.active_row : ""}
      id={id}
      onClick={(e) => {
        e.preventDefault();
        gs_1_setSelectedIdx(key_val);
      }}
    >
      <td className={languageStyles.first_column}>
        <p>{key_val}</p>
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
                display: "inline-block",
                position: "relative",
                left: "10%",
              }}
            >
              &#10004;
            </span>{" "}
            <span
              style={{
                position: "absolute",
                left: "0%",
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
            onChange(e, key_val);
          }}
          value={updatedTransaltion ? updatedTransaltion : ""}
        ></textarea>
      </td>
    </tr>
  );
};

export default React.memo(TranslationTableRow);
