import { create } from "zustand";
import availableLanguages from "@/components/language/lib/text/languagesRegistry.json";
import { LanguageText } from "@/components/language/types";
import exportStore from "@/components/language/globalStores/storeExportFn";

const STORE_ID = "gs_1_" as const;

const useLanguageText = create<UseLanguageText>((set, get) => ({
  currLangText: undefined,
  availableLanguages,
  selectedLanguage: "1",
  editMode: true,
  allLoadedLanguages: {},
  allIdsSet: new Set(),
  selectedIdx: "",

  /**
   * Sets the currently activated translation item index.
   * @param idx {string} index of the active translation item.
   */
  setSelectedIdx: (idx: string): void => {
    set(() => {
      return { selectedIdx: idx };
    });
  },

  /**
   * Loads a language from the language registry and returns the language text.
   * If the language is already loaded, it just returns the already loaded language text.
   * @param newLanguage {string} name of the language.
   * @returns a promise of the loaded language text or undefined if the language text is not available.
   */
  getLanguage: async (
    newLanguage: string
  ): Promise<LanguageText | undefined> => {
    if (get().allLoadedLanguages?.[newLanguage]) {
      return get().allLoadedLanguages?.[newLanguage];
    }

    try {
      const newLanguageText = await import(
        `@/components/language/lib/text/${
          get().availableLanguages[newLanguage]
        }`,
        {
          assert: { type: "json" },
        }
      );
      if (newLanguageText) {
        const newLanguageTextDefault: LanguageText = newLanguageText.default;
        delete newLanguageTextDefault["0"];
        set((state) => {
          const newAllLoadedLanguages = state.allLoadedLanguages;
          newAllLoadedLanguages[newLanguage] = newLanguageTextDefault;
          return {
            allLoadedLanguages: newAllLoadedLanguages,
            allIdsSet: new Set([
              ...Array.from(state.allIdsSet),
              ...Object.keys(newLanguageTextDefault),
            ]),
          };
        });

        return newLanguageTextDefault;
      }
    } catch {} //do nothing and execute below code removing language from the list of available

    set((state) => {
      const newAvailableLanguages = state.availableLanguages;
      delete newAvailableLanguages[newLanguage];
      return {
        availableLanguages: newAvailableLanguages,
      };
    });
  },
  // /**
  //  * Sets current langugae text.
  //  * @param newLanguage {string} name of the language.
  //  * @param newTranslation (optiional) {LanguageText}. Text of new currently developed new translation
  //  *                        items which will be displayed instead of original translation.
  //  */

  /**
   * Sets current language text. If newTranslation is provided, it will be used to override text of the selected language.
   * @param newLanguage {string} name of the language.
   * @param newTranslation (optional) {LanguageText} Text of new currently developed new translation items which will be displayed instead of original translation.
   */
  setLanguage: async (newLanguage: string, newTranslation?: LanguageText) => {
    const newLang = {
      ...(await get().getLanguage(newLanguage)),
      ...newTranslation,
    };
    if (newLang) {
      set(() => {
        return {
          selectedLanguage: newLanguage,
          currLangText: newLang,
        };
      });
    }
  },
  /**
   *
   * @param elementId {string} index of the item which text is requested for.
   * @returns {string | undefined} text of the requested item
   */
  getTextForComponent: (elementId: string): string | undefined => {
    return get().currLangText?.[elementId];
  },
  /**
   *
   * @param elementId {string} index of the item which text is requested for.
   * @returns {string | undefined} text of the requested item with added index in front of it
   *                                in case if (editMode === true)
   */
  getTextForString: (elementId: string): string | undefined => {
    return get().editMode
      ? `( ${elementId} ) ${get().currLangText?.[elementId] ?? ""}`
      : get().currLangText?.[elementId] ?? "";
  },
}));

/**
 * Export sotres variables in a way that allow less verbose import and enforces
 * store's index in front of the variables names once variables destructured in components.
 */
const useLanguageText_gs_1 = exportStore(useLanguageText, STORE_ID);
export default useLanguageText_gs_1;

/**
 * Below are types and interfaces definitions
 */
interface UseLanguageText {
  currLangText: LanguageText | undefined;
  allLoadedLanguages: { [lang: string]: LanguageText };
  availableLanguages: { [language: string]: string };
  selectedLanguage: string;
  editMode: boolean;
  allIdsSet: Set<string>;
  selectedIdx: string;
  setSelectedIdx: (idx: string) => void;
  setLanguage: (setLanguage: string, newTranslation?: LanguageText) => void;
  getLanguage: (setLanguage: string) => Promise<LanguageText | undefined>;
  getTextForComponent: (elementId: string) => string | undefined;
  getTextForString: (elementId: string) => string | undefined;
}
