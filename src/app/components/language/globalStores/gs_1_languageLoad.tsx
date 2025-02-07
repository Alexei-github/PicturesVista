import exportStore from '@/components/language/globalStores/storeExportFn';
import availableLanguages from '@/components/language/lib/text/languagesRegistry.json';
import { LanguageText } from '@/components/language/types';
import { create } from 'zustand';

const STORE_ID = 'gs_1_' as const;

const useLanguageText = create<UseLanguageText>((set, get) => ({
  currLangText: undefined,
  availableLanguages,
  selectedLanguage: '1',
  editMode: true,
  allLoadedLanguages: {},
  allIdsSet: new Set(),
  selectedIdx: '',

  /**
   * Sets the index of the currently active translation item.
   *
   * @param idx The index of the translation item to select.
   */
  setSelectedIdx: (idx: string): void => {
    set(() => {
      return { selectedIdx: idx };
    });
  },

  /**
   * Asynchronously loads a language from the language registry and returns the language text. If
   * the language is already loaded, it returns the cached language text. If the language text
   * cannot be loaded, it is removed from the list of available languages.
   *
   * @param newLanguage {string} - The name of the language to load.
   * @returns A promise that resolves to the loaded language text, or undefined if the language text
   *   is not available.
   */
  getLanguage: async (newLanguage: string): Promise<LanguageText | undefined> => {
    if (get().allLoadedLanguages?.[newLanguage]) {
      return get().allLoadedLanguages?.[newLanguage];
    }

    try {
      const newLanguageText = await import(
        `@/components/language/lib/text/${get().availableLanguages[newLanguage]}`,
        {
          assert: { type: 'json' },
        }
      );
      if (newLanguageText) {
        const newLanguageTextDefault: LanguageText = newLanguageText.default;
        delete newLanguageTextDefault['0'];
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
    } catch {
      //do nothing and execute below code removing language from the list of available
    }

    set((state) => {
      const newAvailableLanguages = state.availableLanguages;
      delete newAvailableLanguages[newLanguage];
      return {
        availableLanguages: newAvailableLanguages,
      };
    });
  },

  /**
   * Sets current language text. If newTranslation is provided, those items which are available in
   * newTranslation will override items with identical names in the selected language.
   *
   * @param newLanguage Name of the language.
   * @param newTranslation (optional) Text of currently being developed new translation items.
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
   * @param elementId Index of the item which text is requested for.
   * @returns Text of the requested item
   */
  getTextForComponent: (elementId: string): string | undefined => {
    return get().currLangText?.[elementId];
  },

  /**
   * @param elementId Index of the item which text is requested for.
   * @returns Text of the requested item with added index in front of it in case if (editMode ===
   *   true)
   */
  getTextForString: (elementId: string): string | undefined => {
    return get().editMode
      ? `( ${elementId} ) ${get().currLangText?.[elementId] ?? ''}`
      : (get().currLangText?.[elementId] ?? '');
  },
}));

/**
 * Exports a function which returns sotre's variables in a way that allows less verbose import and
 * enforces store's index at the beginning of the variables names (once variables destructured in
 * components).
 */
const useLanguageText_gs_1 = exportStore(useLanguageText, STORE_ID);
export default useLanguageText_gs_1;

/** Below are types and interfaces definitions */

/** Interface which defines useLanguageText store's variables */
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
