import { create } from "zustand";

type UseLanguageText = {
  text: { [element: string]: string } | undefined;
  language: string;
  editMode: boolean;
  setLanguage: (setLanguage: string) => void;
  getText: (getElementNumber: string) => string | undefined;
};

export const useLanguageText = create<UseLanguageText>((set, get) => ({
  text: undefined,
  language: "english",
  editMode: true,
  setLanguage: async (newLanguage: string) => {
    const newLanguageText = await import(`@/lib/text/${newLanguage}.json`, {
      assert: { type: "json" },
    });
    if (newLanguageText) {
      set((state) => {
        return { ...state, language: newLanguage, text: newLanguageText };
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
