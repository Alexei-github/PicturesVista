import { create } from "zustand";
import languages from "@/lib/text/languagesRegistry.json";

type UseLanguageText = {
  currLangText: { [element: string]: string } | undefined;
  allLoadedLanguages: { [lang: string]: { [element: string]: string } };
  availableLanguages: { [language: string]: string };
  selectedLanguage: string;
  editMode: boolean;
  allIdsSet: Set<string>;
  setLanguage: (setLanguage: string) => void;
  getLanguage: (
    setLanguage: string
  ) => Promise<{ [key: string]: string } | undefined>;
  getText: (getElementNumber: string) => string | undefined;
};

export const useLanguageText = create<UseLanguageText>((set, get) => ({
  currLangText: undefined,
  availableLanguages: languages,
  selectedLanguage: "1",
  editMode: true,
  allLoadedLanguages: {},
  allIdsSet: new Set(),
  getLanguage: async (newLanguage: string) => {
    if (get().allLoadedLanguages?.[newLanguage]) {
      return get().allLoadedLanguages?.[newLanguage];
    }

    try {
      const newLanguageText = await import(
        `@/lib/text/${get().availableLanguages[newLanguage]}`,
        {
          assert: { type: "json" },
        }
      );
      if (newLanguageText) {
        const newLanguageTextDefault: { [key: string]: string } =
          newLanguageText.default;
        delete newLanguageTextDefault["0"];
        set((state) => {
          const newAllLoadedLanguages = state.allLoadedLanguages;
          newAllLoadedLanguages[newLanguage] = newLanguageTextDefault;
          return {
            ...state,
            allLoadedLanguages: newAllLoadedLanguages,
            allIdsSet: new Set(Object.keys(newLanguageTextDefault)),
          };
        });

        return newLanguageTextDefault;
      }
    } catch {} //do nothing and remove language from list of available

    set((state) => {
      const newAvailableLanguages = state.availableLanguages;
      delete newAvailableLanguages[newLanguage];
      return {
        ...state,
        availableLanguages: newAvailableLanguages,
      };
    });
  },
  setLanguage: async (newLanguage: string) => {
    const newLang = await get().getLanguage(newLanguage);
    if (newLang) {
      set((state) => {
        return {
          ...state,
          selectedLanguage: newLanguage,
          currLangText: newLang,
        };
      });
    }
  },
  getText: (getElementNumber: string) => {
    return get().currLangText?.[getElementNumber];
  },
}));
