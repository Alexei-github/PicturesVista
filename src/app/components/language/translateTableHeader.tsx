import React from "react";
import { useLanguageText } from "@/stores/languageLoad";
import Modal from "@/components/modal/modal";
import LanguageSelectorUser from "@/components/language/languageSelectorUser";
import TranslationTableRow from "@/components/language/translationTableRow";
import libStyles from "@/lib/lib.module.css";
import languageStyles from "@/components/language/language.module.css";

type Props = {
  disableInput: boolean;
  langNameOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  saveChanges: () => void;
};

const TranslateTableHeader = ({
  disableInput,
  langNameOnChange,
  saveChanges,
}: Props) => {
  const [createNew, setCreateNew] = React.useState(false);
  const [loadNew, setLoadNew] = React.useState(false);

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
        setCreateNew(false);
      }
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
            disabledSelect={disableInput}
            
          >
            <optgroup>
              <option value="create_new">Create New</option>
              <option value="load_new">Load From File</option>
            </optgroup>
            <optgroup style={{ fontSize: "1.1rem" }} label="Available:" />
          </LanguageSelectorUser>
          {disableInput && (
            <button
              className={` ${libStyles.btn_main_navbar} ${languageStyles.save_btn}`}
              onClick={saveChanges}
            >
              <span>Save Changes</span>
            </button>
          )}
        </div>
        {loadNew && (
          <input
            style={{ fontSize: "calc(var(--btn_font_size)*1.1)" }}
            className={languageStyles.textarea}
            type="file"
          />
        )}
        {createNew && (
          <input
            {...(createNew && !loadNew && { autoFocus: true })}
            style={{
              ...(disableInput && { color: "grey", borderColor: "grey" }),
            }}
            className={languageStyles.textarea}
            type="text"
            onChange={langNameOnChange}
            disabled={disableInput}
          />
        )}
      </th>
    </thead>
  );
};

export default React.memo(TranslateTableHeader);
