import React from "react";
import { useLanguageText } from "@/stores/languageLoad";
import languageStyles from "@/components/language/language.module.css";
import Modal from "@/components/modal/modal";
import LanguageSelectorUser from "@/components/language/languageSelectorUser";

const LanguageDevModal = () => {
  const {
    availableLanguages,
    setLanguage,
    selectedLanguage,
    currLangText,
    allLoadedLanguages,
    getLanguage,
  } = useLanguageText();

  const [newTranslation, setNewTranslation] = React.useState<{
    [key: string]: string;
  }>({});

  console.log(newTranslation);
  const [createNew, setCreateNew] = React.useState(false);
  const [loadNew, setLoadNew] = React.useState(false);

  const [disableInput, setDisableInput] = React.useState(false);
  const [updatedValues, setUpdatedValues] = React.useState<{
    [key: string]: boolean;
  }>({});
  const [existingLanguageInitCopy, setExistingLanguageInitCopy] =
    React.useState<{ [key: string]: string } | undefined>(undefined);

  const langNameOnChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const timeout = setTimeout(() => {
        console.log(newTranslation, e.target.value);
        if (e.target.value) {
          if (availableLanguages[e.target.value]) {
            (async () => {
              const existLang = await getLanguage(e.target.value);
              setExistingLanguageInitCopy(existLang);
              setNewTranslation({ ...existLang, lang: e.target.value });
            })();
          } else {
            setExistingLanguageInitCopy(undefined);
            setNewTranslation({});
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
      const timeout = setTimeout(() => {
        const newUpdatedValues = updatedValues;
        if (e.target.value) {
          setNewTranslation({
            ...newTranslation,
            [key]: e.target.value,
          });
          if (!existingLanguageInitCopy) {
            newUpdatedValues[key] = true;
          } else {
            if (existingLanguageInitCopy[key] === e.target.value) {
              newUpdatedValues[key] = false;
            } else {
              newUpdatedValues[key] = true;
            }
          }
        } else {
          const updateNewTranslation = newTranslation;
          delete updateNewTranslation[key];
          setNewTranslation(updateNewTranslation);

          // const newUpdatedValues = updatedValues;
          delete newUpdatedValues[key];
        }
        setUpdatedValues(newUpdatedValues);
        if (Object.values(newUpdatedValues).some((v) => v === true)) {
          setDisableInput(true);
        } else {
          setDisableInput(false);
        }
      }, 500);
      return () => {
        clearTimeout(timeout);
      };
    },
    [newTranslation, existingLanguageInitCopy, updatedValues]
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
        setCreateNew(false);
      }
    },
    []
  );

  return (
    <div>
      <Modal sizeScale={0.8}>
        <table className={languageStyles.table}>
          {/* <colgroup>
              <col className={languageStyles.first_column} />
              <col className={languageStyles.other_column} />
              <col className={languageStyles.other_column} />
            </colgroup> */}
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
              <LanguageSelectorUser
                selectorClassName={`${languageStyles.language_selector} ${languageStyles.language_selector_navbar}`}
                onChangePassed={onChangePassed}
                disabledSelect={disableInput}
              >
                <optgroup>
                  <option value="create_new">Create New</option>
                  <option value="load_new">Load From File</option>
                </optgroup>
                <optgroup
                  style={{ fontSize: "1.1rem" }}
                  label="Available:"
                ></optgroup>
              </LanguageSelectorUser>
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
                  className={languageStyles.textarea}
                  type="text"
                  onChange={langNameOnChange}
                  disabled={disableInput}
                />
              )}
            </th>
          </thead>
          {currLangText &&
            Object.entries(currLangText).map(([key, value], idx) => {
              return (
                <tr key={"translation " + idx}>
                  <td className={languageStyles.first_column}>
                    <p>{key}</p>
                  </td>
                  <td className={languageStyles.second_column}>
                    <p>{value}</p>
                  </td>
                  <td className={languageStyles.third_column}>
                    <textarea
                      className={languageStyles.textarea}
                      onKeyUp={(e) => {
                        translateOnChange(e, key);
                      }}
                      // value={newTranslation[key] ? newTranslation[key] : ""}
                    >
                      {newTranslation[key] ? newTranslation[key] : ""}
                    </textarea>
                  </td>
                </tr>
              );
            })}
        </table>
      </Modal>
    </div>
  );
};

export default LanguageDevModal;
