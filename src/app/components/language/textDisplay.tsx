import React from "react";
import { useLanguageText } from "@/stores/languageLoad";

type Props = {
  elementType: TextAreaType;
  elementNumber: string;
};

const TextDisplay = ({ elementType, elementNumber }: Props) => {
  const { getText, editMode } = useLanguageText();
  //   console.log(text);
  return (
    <>
      {editMode ? (
        <>
          <sup>{elementNumber}✏️</sup>
          {getText(elementNumber)}
        </>
      ) : (
        getText(elementNumber)
      )}
    </>
  );
};

export default TextDisplay;
