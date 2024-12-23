import React from "react";
import { useLanguageText } from "@/stores/languageLoad";
import Modal from "@/components/modal/modal";
import LanguageSelectorUser from "@/components/language/languageSelectorUser";
import TranslationTableRow from "@/components/language/translationTableRow";
import libStyles from "@/lib/lib.module.css";
import languageStyles from "@/components/language/language.module.css";
import { fileOpen, fileSave } from "browser-fs-access";

type Props = {
  disableLangSelect: boolean;
  disableLangInput: boolean;
  setDisableLangInput: React.Dispatch<React.SetStateAction<boolean>>;
  langNameOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  saveChanges: () => void;
  onFileLoad: (language: { [keyof: string]: string }) => void;
};

const TranslateTableHeader = ({
  disableLangSelect,
  disableLangInput,
  setDisableLangInput,
  langNameOnChange,
  saveChanges,
  onFileLoad,
}: Props) => {
  const [createNew, setCreateNew] = React.useState(false);
  const [loadNew, setLoadNew] = React.useState(false);
  const [defaultLangName, setDefaultLangName] = React.useState("");
  const useRef = React.useRef<HTMLInputElement>(null);

  const loadFromFile = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        // const blobLang = await fileOpen({
        //   description: "JSON file",
        //   extensions: [".json"],
        //   multiple: false,
        // });
        const blobLang = e.target.files?.[0];
        if (blobLang) {
          const language = await new Response(blobLang).json();
          console.log(language["0"].replaceAll("'", '"'));
          language.lang = JSON.parse(language["0"].replaceAll("'", '"')).lang;
          delete language["0"];
          onFileLoad(language);
          setDefaultLangName(language.lang);
        }
      } catch {
        console.log("read error");
      }
    },
    []
  );

  const onChangePassed = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (e.target.value === "create_new") {
        setCreateNew(true);
        setLoadNew(false);
      } else if (e.target.value === "load_new") {
        setLoadNew(true);
        setCreateNew(true);
      } else {
        setLoadNew(false);
        setCreateNew(true);
        setDefaultLangName(e.target.value);
        console.log("event0", useRef);
        if (useRef?.current) {
          console.log("event");
          useRef.current.value = e.target.value;
          const event = new Event("change", { bubbles: true });
          useRef.current.dispatchEvent(event);
        }
      }
      setDisableLangInput(false);
      e.target.value = "lang";
    },
    []
  );

  return (
    <thead>
      <th className={languageStyles.first_column}>
        <p>id</p>
      </th>
      <th className={languageStyles.second_column}>
        <LanguageSelectorUser
          selectorClassName={`${languageStyles.language_selector} ${languageStyles.language_selector_navbar}`}
        />
      </th>
      <th className={languageStyles.third_column}>
        <div className={languageStyles.select_save_div}>
          <LanguageSelectorUser
            selectorClassName={`${languageStyles.language_selector} ${languageStyles.language_selector_navbar}`}
            onChangePassed={onChangePassed}
            disabledSelect={disableLangSelect}
          >
            <optgroup>
              <option value="lang" selected disabled>
                Language:
              </option>
              <option value="create_new">Create New</option>
              <option value="load_new">Load From File</option>
            </optgroup>
            <optgroup style={{ fontSize: "1.1rem" }} label="Available:" />
          </LanguageSelectorUser>
          {disableLangSelect && (
            <button
              className={` ${libStyles.btn_main_navbar} ${languageStyles.save_btn}`}
              onClick={saveChanges}
            >
              <span>Save Changes</span>
            </button>
          )}
        </div>
        {loadNew && (
          <>
            <input
              style={{
                fontSize: "calc(var(--btn_font_size)*1.1)",
              }}
              className={
                languageStyles.textarea + " " + languageStyles.file_input
              }
              type="file"
              onChange={loadFromFile}
              disabled={disableLangInput}
            />
          </>
        )}
        {createNew && (
          <input
            ref={useRef}
            {...(createNew && !loadNew && { autoFocus: true })}
            style={{
              ...(disableLangInput && { color: "grey", borderColor: "grey" }),
            }}
            className={languageStyles.textarea}
            type="text"
            onChange={langNameOnChange}
            disabled={disableLangInput}
            defaultValue={defaultLangName}
          />
        )}
      </th>
    </thead>
  );
};

export default React.memo(TranslateTableHeader);
