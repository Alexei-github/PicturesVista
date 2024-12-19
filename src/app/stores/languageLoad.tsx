import { create } from "zustand";
import languages from "@/lib/text/languagesRegistry.json";

type UseLanguageText = {
  text: { [element: string]: string } | undefined;
  availableLanguages: { [language: string]: string };
  selectedLanguage: string;
  editMode: boolean;
  setLanguage: (setLanguage: string) => void;
  getText: (getElementNumber: string) => string | undefined;
};

export const useLanguageText = create<UseLanguageText>((set, get) => ({
  text: undefined,
  availableLanguages: languages,
  selectedLanguage: "1",
  editMode: true,
  setLanguage: async (newLanguage: string) => {
    try {
      const newLanguageText = await import(
        `@/lib/text/${get().availableLanguages[newLanguage]}`,
        {
          assert: { type: "json" },
        }
      );
      if (newLanguageText) {
        set((state) => {
          return {
            ...state,
            selectedLanguage: newLanguage,
            text: newLanguageText.default,
          };
        });
      }
    } catch {
      set((state) => {
        const newAvailableLanguages = state.availableLanguages;
        delete newAvailableLanguages[newLanguage];
        return {
          ...state,
          availableLanguages: newAvailableLanguages,
        };
      });
    }
  },
  getText: (getElementNumber: string) => {
    // const text = get().text;
    // if (text) {
    //   return text[getElement];
    // }
    return get().text?.[getElementNumber];
  },
}));
