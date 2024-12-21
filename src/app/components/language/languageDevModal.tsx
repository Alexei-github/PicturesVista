import React from "react";
import { useLanguageText } from "@/stores/languageLoad";
import languageStyles from "@/components/language/language.module.css";
import Modal from "@/components/modal/modal";
import LanguageSelectorUser from "@/components/language/languageSelectorUser";
import TranslationTableRow from "@/components/language/translationTableRow";
import TranslateTableHeader from "@/components/language/translateTableHeader";
import { fileOpen, fileSave } from "browser-fs-access";

const LanguageDevModal = () => {
  const { availableLanguages, currLangText, getLanguage } = useLanguageText();

  const [newTranslation, setNewTranslation] = React.useState<
    | {
        [key: string]: string;
      }
    | undefined
  >(undefined);

  const [disableInput, setDisableInput] = React.useState(false);
  const [updatedValues, setUpdatedValues] = React.useState<{
    [key: string]: boolean;
  }>({});
  const [existingLanguageInitCopy, setExistingLanguageInitCopy] =
    React.useState<{ [key: string]: string } | undefined>(undefined);
  const [_, setRerenderComponent] = React.useState("");

  const langNameOnChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const timeout = setTimeout(() => {
        if (e.target.value) {
          if (availableLanguages[e.target.value]) {
            (async () => {
              const existLang = await getLanguage(e.target.value);
              setExistingLanguageInitCopy(existLang);
              setNewTranslation({ ...existLang, lang: e.target.value });
            })();
          } else {
            setExistingLanguageInitCopy(undefined);
            setNewTranslation({ lang: e.target.value });
          }
        }
      }, 500);
      return () => {
        clearTimeout(timeout);
      };
    },
    [availableLanguages, getLanguage]
  );

  const translateOnChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>, key: string) => {
      const newUpdatedValues = updatedValues;
      if (e.target.value) {
        let updateNewTranslation = newTranslation;
        if (updateNewTranslation) {
          updateNewTranslation[key] = e.target.value;
        } else {
          updateNewTranslation = {};
          updateNewTranslation[key] = e.target.value;
        }
        setNewTranslation(updateNewTranslation);
        if (!existingLanguageInitCopy) {
          if (e.target.value.trim()) {
            newUpdatedValues[key] = true;
          } else {
            newUpdatedValues[key] = false;
          }
        } else {
          if (existingLanguageInitCopy[key] === e.target.value.trim()) {
            newUpdatedValues[key] = false;
          } else {
            newUpdatedValues[key] = true;
          }
        }
      } else {
        const updateNewTranslation = newTranslation;

        if (updateNewTranslation) {
          delete updateNewTranslation[key];
        }
        setNewTranslation(updateNewTranslation);
        delete newUpdatedValues[key];
      }
      setUpdatedValues(newUpdatedValues);
      if (Object.values(newUpdatedValues).some((v) => v === true)) {
        setDisableInput(true);
      } else {
        setDisableInput(false);
      }
      setRerenderComponent(`${key}-${e.target.value}`);
    },
    [newTranslation, existingLanguageInitCopy, updatedValues]
  );

  const saveChanges = React.useCallback(async () => {
    if (newTranslation && currLangText) {
      const fileName = `${newTranslation.lang
        ?.trim()
        ?.toLowerCase()
        ?.replace(" ", "_")}.json`;

      let all = "no";
      if (existingLanguageInitCopy) {
        if (
          Object.entries(existingLanguageInitCopy).every(
            ([key, value]) =>
              newTranslation[key] || newTranslation[key] === value
          )
        ) {
          all = "yes";
        }
      } else {
        if (Object.keys(currLangText).every((key) => newTranslation[key])) {
          all = "yes";
        }
      }
      const recorNewTranslation = { ...newTranslation };
      recorNewTranslation[
        "0"
      ] = `{ lang: ${recorNewTranslation.lang}, complete: ${all} }`;
      delete recorNewTranslation.lang;
      for (const key in recorNewTranslation) {
        recorNewTranslation[key] = recorNewTranslation[key].trim();
      }
      const jsonString = JSON.stringify(recorNewTranslation, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });

      try {
        await fileSave(blob, {
          fileName: fileName ?? "undefined.json",
          extensions: [".json"],
        });
      } catch {}
    }
  }, [newTranslation]);

  return (
    <div>
      <Modal sizeScale={0.8}>
        <table className={languageStyles.table}>
          <TranslateTableHeader
            disableInput={disableInput}
            langNameOnChange={langNameOnChange}
            saveChanges={saveChanges}
          />
          {currLangText &&
            Object.entries(currLangText).map(([key, value], idx) => {
              return (
                <TranslationTableRow
                  key={"translation " + idx}
                  key_val={key}
                  value={value}
                  onChange={translateOnChange}
                  updatedTransaltion={newTranslation ? newTranslation[key] : ""}
                  updated={updatedValues[key]}
                />
              );
            })}
        </table>
      </Modal>
    </div>
  );
};

export default LanguageDevModal;
