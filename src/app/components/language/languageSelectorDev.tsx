import React from "react";
import { useLanguageText } from "@/stores/languageLoad";
import languageStyles from "@/components/language/language.module.css";
import Modal from "@/components/modal/modal";
import LanguageDevModal from "@/components/language/languageDevModal";

const defaultLanguage = "Español";
const select = "Language:";

const LanguageSelector = () => {
  const {
    getText,
    availableLanguages,
    setLanguage,
    selectedLanguage,
    currLangText: text,
  } = useLanguageText();

  const [editTranslate, setEditTranslate] = React.useState(false);
  const [selectLanguageToEditTranslate, setSelectLanguageToEditTranslate] =
    React.useState("");
  const [locallySelectedLanguage, setLocallySelectedLanguage] =
    React.useState(selectedLanguage);

  const [newTranslation, setNewTranslation] = React.useState<{
    [key: string]: string;
  }>({});

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (e.target.value === "add_new") {
        const newOption = prompt("New language name:");
        return;
      }

      setLanguage(e.target.value);
      setLocallySelectedLanguage(e.target.value);
    },

    [setLanguage]
  );

  React.useEffect(() => {
    setLanguage(defaultLanguage);
  }, [setLanguage]);

  const switchLanugageEdit = React.useCallback(() => {
    if (editTranslate) {
      setSelectLanguageToEditTranslate("");
      setLocallySelectedLanguage(selectedLanguage);
    } else {
      setLocallySelectedLanguage(select);
    }
    setEditTranslate(!editTranslate);
  }, [editTranslate, selectedLanguage]);

  return (
    <div>
      <select
        className={languageStyles.select}
        id="clickedLanguage"
        name="language"
        defaultValue={defaultLanguage}
        onChange={onChange}
        value={locallySelectedLanguage}
        style={
          editTranslate && locallySelectedLanguage !== select
            ? { backgroundColor: `red` }
            : {}
        }
      >
        <option
          className={languageStyles.select_option}
          value={select}
          disabled
        >
          {select}
        </option>
        {/* <option value={selectedLanguage} disabled selected></option> */}
        {Object.keys(availableLanguages).map((language, idx) => {
          return (
            <option
              className={languageStyles.select_option}
              // onClick={onOptionClick}
              style={{ backgroundColor: `white` }}
              key={language + idx}
              value={language}
            >
              {editTranslate && <>✍️| </>}
              {language}
            </option>
          );
        })}
        <option value="add_new"> + New</option>
      </select>
      <button onClick={switchLanugageEdit}>✏️</button>
      {editTranslate && <LanguageDevModal />}
    </div>
  );
};

export default LanguageSelector;
