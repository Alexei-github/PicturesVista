"use client";
import React from "react";
import { useLanguageText } from "@/stores/languageLoad";
import languageStyles from "@/components/language/language.module.css";

type Props = {
  elementType: TextAreaType;
  elementNumber: string;
};

const TextDisplay = ({ elementType, elementNumber }: Props) => {
  const { getText, editMode, setSelectedIdx } = useLanguageText();
  //   console.log(text);
  return (
    <>
      {editMode ? (
        <>
          <sup
            className={languageStyles.text_idx}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIdx(elementNumber);
            }}
          >
            {elementNumber}
          </sup>
          {getText(elementNumber)}
        </>
      ) : (
        getText(elementNumber)
      )}
    </>
  );
};

export default TextDisplay;
