import React from "react";
import { useLanguageText } from "@/stores/languageLoad";
import languageStyles from "@/components/language/language.module.css";
import Modal from "@/components/modal/modal";
import LanguageSelectorUser from "@/components/language/languageSelectorUser";
import TranslationTableRow from "@/components/language/translationTableRow";
import TranslateTableHeader from "@/components/language/translateTableHeader";
import { fileOpen, fileSave } from "browser-fs-access";
import { LanguageText } from "@/components/language/types";

const LanguageDevModal = () => {
  const { availableLanguages, currLangText, getLanguage, allIdsSet } =
    useLanguageText();

  const [newTranslation, setNewTranslation] = React.useState<LanguageText>({});
  const [disableLangSelect, setDisableLangSelect] = React.useState(false);
  const [disableLangInput, setDisableLangInput] = React.useState(false);
  const [updatedValues, setUpdatedValues] = React.useState<{
    [key: string]: boolean;
  }>({});
  const [doubleUpdatedValues, setDoubleUpdatedValues] = React.useState<{
    [key: string]: boolean;
  }>({});
  const [languageInitCopy, setLanguageInitCopy] = React.useState<LanguageText>(
    {}
  );

  const [latestSave, setLatestSave] = React.useState<LanguageText>({});

  const [_, setRerenderComponent] = React.useState("");

  const langNameOnChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const timeout = setTimeout(() => {
        if (e.target.value) {
          if (availableLanguages[e.target.value]) {
            (async () => {
              const existLang = await getLanguage(e.target.value);
              setLanguageInitCopy(existLang ?? {});
              setNewTranslation({ ...existLang, lang: e.target.value });
            })();
          } else {
            if (Object.keys(languageInitCopy).length > 0) {
              setLanguageInitCopy({});
              setUpdatedValues({});
              setDoubleUpdatedValues({});
              setLatestSave({});
              setNewTranslation({});
            }
            newTranslation["lang"] = e.target.value;
          }
        }
      }, 500);
      return () => {
        clearTimeout(timeout);
      };
    },
    [availableLanguages, languageInitCopy, getLanguage]
  );

  const onFileLoad = React.useCallback(
    (language: { [keyof: string]: string }) => {
      // setLanguageInitCopy({ ...language });
      setNewTranslation({ ...language });
      if (availableLanguages[language.lang]) {
        (async () => {
          const existLang = await getLanguage(language.lang);
          setLanguageInitCopy(existLang ?? {});
          const newUpdateVal: { [key: string]: boolean } = {};
          const newLatestSave: LanguageText = {};
          for (const key in existLang) {
            if (existLang && existLang[key] !== language[key]) {
              newUpdateVal[key] = true;
              newLatestSave[key] = language[key];
            }
          }
          setUpdatedValues(newUpdateVal);
          setLatestSave(newLatestSave);
          setDoubleUpdatedValues({});
        })();
      } else {
        if (Object.keys(languageInitCopy).length > 0) {
          setLanguageInitCopy({ ...language });
          setUpdatedValues({});
          setDoubleUpdatedValues({});
          setLatestSave({});
        }
        newTranslation["lang"] = language.lang;
      }
    },
    []
  );

  const translateOnChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>, key: string) => {
      if (e.target.value) {
        newTranslation[key] = e.target.value;

        updatedValues[key] =
          newTranslation[key]?.trim() !== languageInitCopy[key]?.trim();
        if (latestSave[key]) {
          doubleUpdatedValues[key] =
            newTranslation[key]?.trim() !== latestSave[key]?.trim();
        }

        if (
          Object.keys(updatedValues).some(
            (k) => updatedValues[k] && !latestSave[k]
          ) ||
          Object.values(doubleUpdatedValues).some((v) => v)
        ) {
          setDisableLangSelect(true);
          setDisableLangInput(true);
        } else {
          setDisableLangSelect(false);
        }
      }
      setRerenderComponent(`${key}-${e.target.value}`);
    },
    [
      newTranslation,
      languageInitCopy,
      updatedValues,
      doubleUpdatedValues,
      latestSave,
    ]
  );

  const saveChanges = React.useCallback(async () => {
    const fileName = `${newTranslation.lang
      ?.trim()
      ?.toLowerCase()
      ?.replace(" ", "_")}.json`;

    const all = Array.from(allIdsSet).every((key) => newTranslation[key])
      ? "yes"
      : "no";

    const recordNewTranslation = { ...newTranslation };
    // recordNewTranslation["0"] = JSON.stringify({
    //   lang: recordNewTranslation.lang,
    //   complete: all,
    // });
    const savedChanges: { [key: string]: string } = {};

    for (const key in recordNewTranslation) {
      recordNewTranslation[key] = recordNewTranslation[key].trim();
      if (updatedValues[key]) {
        savedChanges[key] = recordNewTranslation[key];
      }
    }
    recordNewTranslation[
      "0"
    ] = `{ 'lang': '${recordNewTranslation.lang}', 'complete': '${all}' }`;
    delete recordNewTranslation.lang;
    const jsonString = JSON.stringify(recordNewTranslation, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });

    try {
      await fileSave(blob, {
        fileName: fileName ?? "undefined.json",
        extensions: [".json"],
      });
      setDisableLangSelect(false);
      setLatestSave({ ...savedChanges });
      setDoubleUpdatedValues({});
    } catch {}
  }, [newTranslation, updatedValues]);

  return (
    <div>
      <Modal sizeScale={0.8}>
        <table className={languageStyles.table}>
          <TranslateTableHeader
            disableLangSelect={disableLangSelect}
            disableLangInput={disableLangInput}
            langNameOnChange={langNameOnChange}
            setDisableLangInput={setDisableLangInput}
            saveChanges={saveChanges}
            onFileLoad={onFileLoad}
          />
          {currLangText &&
            Array.from(allIdsSet)
              .sort((a, b) => parseInt(a) - parseInt(b))
              .map((key, idx) => {
                return (
                  <TranslationTableRow
                    key={"translation " + idx}
                    key_val={key}
                    value={currLangText[key]}
                    onChange={translateOnChange}
                    updatedTransaltion={
                      newTranslation ? newTranslation[key] : ""
                    }
                    updated={updatedValues[key]}
                    updatedAfterLatestSave={doubleUpdatedValues[key]}
                    // updated={updatedValues[key]}
                  />
                );
              })}
        </table>
      </Modal>
    </div>
  );
};

export default LanguageDevModal;
