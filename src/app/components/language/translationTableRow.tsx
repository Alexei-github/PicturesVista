"use client";

import React from "react";
// import { useLanguageText_gs_1 } from "@/components/language/globalStores/gs_1_languageLoad";
import {
  useLanguageText_gs_1,
  useLanguageText_gs_1_t,
} from "@/components/language/globalStores/gs_1_languageLoad";
import languageStyles from "@/components/language/language.module.css";

const TranslationTableRow = ({
  key_val,
  fromLangValue,
  onChange,
  updatedTransaltion,
  updated,
  updatedAfterLatestSave,
  id,
}: Props) => {
  const {
    gs_1_selectedIdx,
    gs_1_setSelectedIdx,
  } = useLanguageText_gs_1_t(
    "gs_1_selectedIdx",
    "gs_1_setSelectedIdx",
  );

  // const { gs_1_selectedIdx, gs_1_setSelectedIdx, gs_1_allIdsSet } =
  //   useLanguageText_gs_1_t([
  //     "gs_1_selectedIdx",
  //     "gs_1_allIdsSet",
  //     "gs_1_allIdsSet",
  //   ] as const);
  // const { gs_1_selectedIdx, gs_1_setSelectedIdx } =
  //   useLanguageText_gs_1_t1("gs_1_selectedIdx", "gs_1_allIdsSet");
  // console.log(gs_1_selectedIdx1);
  // const gs_1_selectedIdx = useLanguageText_gs_1((s) => s.selectedIdx);
  // const gs_1_setSelectedIdx = useLanguageText_gs_1((s) => s.setSelectedIdx);

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

type Props = {
  key_val: string;
  fromLangValue: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>, key: string) => void;
  updatedTransaltion: string;
  updated: boolean;
  updatedAfterLatestSave: boolean;
  id: string;
};
