"use client";
import React from "react";
import { gs_1_useLanguageText } from "@/components/language/stores/gs_1_languageLoad";
import languageStyles from "@/components/language/language.module.css";

type Props = {
  // elementType: TextAreaType;
  p_elementNumber: string;
};

const TextDisplay = ({ p_elementNumber }: Props) => {
  const {
    getText: getText,
    editMode: editMode,
    setSelectedIdx: setSelectedIdx,
  } = gs_1_useLanguageText();
  //   console.log(text);
  return (
    <>
      {editMode ? (
        <>
          <sup
            className={languageStyles.text_idx}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIdx(p_elementNumber);
            }}
          >
            {p_elementNumber}
          </sup>
          {getText(p_elementNumber)}
        </>
      ) : (
        getText(p_elementNumber)
      )}
    </>
  );
};

export default TextDisplay;
