import React from "react";
import { useLanguageText } from "@/stores/languageLoad";
import languageStyles from "@/components/language/language.module.css";
import Modal from "@/components/modal/modal";
import LanguageSelectorUser from "@/components/language/languageSelectorUser";

type Props = {
  key_val: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>, key: string) => void;
  updatedTransaltion: string;
  updated: boolean;
  updatedAfterLatestSave: boolean;
};

const TranslationTableRow = ({
  key_val,
  value,
  onChange,
  updatedTransaltion,
  updated,
  updatedAfterLatestSave,
}: Props) => {
  return (
    <tr>
      <td className={languageStyles.first_column}>
        <p>{key_val}</p>
      </td>
      <td className={languageStyles.second_column}>
        <p>{value}</p>
      </td>
      <td className={languageStyles.third_column}>
        {updated && !updatedAfterLatestSave && (
          <div className={languageStyles.green_tick}>&#10004;</div>
        )}
        {updated && updatedAfterLatestSave && (
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
