import { create } from "zustand";
import languages from "@/lib/text/languagesRegistry.json";
import { LanguageText } from "@/components/language/types";

type UseLanguageText = {
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
  getText: (getElementNumber: string) => string | undefined;
};

export const useLanguageText = create<UseLanguageText>((set, get) => ({
  currLangText: undefined,
  availableLanguages: languages,
  selectedLanguage: "1",
  editMode: true,
  allLoadedLanguages: {},
  allIdsSet: new Set(),
  selectedIdx: "",
  setSelectedIdx: (idx: string) => {
    set((state) => {
      return { ...state, selectedIdx: idx };
    });
  },
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
        const newLanguageTextDefault: LanguageText = newLanguageText.default;
        delete newLanguageTextDefault["0"];
        set((state) => {
          const newAllLoadedLanguages = state.allLoadedLanguages;
          newAllLoadedLanguages[newLanguage] = newLanguageTextDefault;
          return {
            ...state,
            allLoadedLanguages: newAllLoadedLanguages,
            allIdsSet: new Set([
              ...Array.from(state.allIdsSet),
              ...Object.keys(newLanguageTextDefault),
            ]),
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
  setLanguage: async (newLanguage: string, newTranslation?: LanguageText) => {
    const newLang = {
      ...(await get().getLanguage(newLanguage)),
      ...newTranslation,
    };
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
