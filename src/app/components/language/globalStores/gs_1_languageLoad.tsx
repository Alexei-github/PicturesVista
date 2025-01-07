import { create, UseBoundStore, StoreApi } from "zustand";
import availableLanguages from "@/components/language/lib/text/languagesRegistry.json";
import { LanguageText } from "@/components/language/types";
import exportStore from "@/components/language/globalStores/storeExportFn";

const STORE_ID = "gs_1_" as const;

export const useLanguageText_gs_1 = create<UseLanguageText>((set, get) => ({
  currLangText: undefined,
  availableLanguages,
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
  getTextForComponent: (elementId: string) => {
    return get().currLangText?.[elementId];
  },
  getTextForString: (elementId: string) => {
    return get().editMode && get().selectedIdx === elementId
      ? `( ${elementId} ) ${get().currLangText?.[elementId] ?? ""}`
      : get().currLangText?.[elementId] ?? "";
  },
}));

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * @param requesteImports
 * @returns
 */

// export function useLanguageText_gs_1_t<StoreType ,T extends `${keyof UseLanguageText}`[]>(
//   ...requestedImports: T
// ) {
//   type ExportUnion = (typeof requestedImports)[number];
//   // type Check<I> = I extends keyof UseLanguageText ? I : never;

//   type ImportedItems = {
//     [K in ExportUnion as `${typeof STORE_ID}${string & K}`]: UseLanguageText[K];
//   };

//   const selectedExportItems: any = {};

//   for (const item of requestedImports) {
//     selectedExportItems[item] = useLanguageText_gs_1((s) => s[item]);
//   }

//   return selectedExportItems as ImportedItems;
// }

// function exportStore<StoreType>(
//   store: UseBoundStore<StoreApi<StoreType>>,
//   storeId: string
// ) {
//   return function useLanguageText_gs_1_t<T extends (keyof StoreType)[]>(
//     ...requestedImports: T
//   ) {
//     // type Check<I> = I extends keyof UseLanguageText ? I : never;

//     type RequestedItems = {
//       [K in T[number] as `${typeof storeId}${string & K}`]: StoreType[K];
//     };

//     const selectedExportItems: any = {};

//     for (const item of requestedImports) {
//       selectedExportItems[item] = store((s) => s[item]);
//     }

//     return selectedExportItems as RequestedItems;
//   };
// }

export const useLanguageText_gs_1_t = exportStore(
  useLanguageText_gs_1,
  STORE_ID
);

// export function useLanguageText_gs_1_t<UseLanguageText>()

// export const useLanguageText_gs_1_t = (...requestedImports: Exports[]) => {
//   const selectedExportItems: any = {};
//   // const selectedExportItems: Record<ExportsWithPrefix, any> = {} as Record<
//   //   ExportsWithPrefix,
//   //   any
//   // >;
//   for (const item of requestedImports) {
//     selectedExportItems[`${STORE_ID}${item}`] = useLanguageText_gs_1(
//       (s) => s[item]
//     );
//   }
//   return selectedExportItems as typeof selectedExportItems;
// };

// type Exports = keyof UseLanguageText;
// type ExportsWithPrefix = `${typeof STORE_ID}${keyof UseLanguageText}`;

// export const useLanguageText_gs_1_t1 = (
//   ...requestedImports: (keyof Exports1)[]
// ) => {
//   const selectedExportItems: Partial<Exports1> = {};
//   for (const item of requestedImports) {
//     const key = item.replace(STORE_ID, "") as keyof UseLanguageText;
//     selectedExportItems[item] = useLanguageText_gs_1(
//       (s) => s[key]
//     ) as Exports1[typeof item];
//   }
//   return selectedExportItems  as Exports1;
// };

// export const useLanguageText_gs_1_t1 = (
//   ...requestedImports: (keyof Exports1)[]
// ) => {
//   const selectedExportItems: any = {};

//   type ExportType = {
//     [K in (typeof requestedImports)[number]]: UseLanguageText[K];
//   };

//   for (const item of requestedImports) {
//     const key = item.replace(STORE_ID, "") as keyof UseLanguageText;

//     if (typeof item in selectedExportItems) {
//       const reqestedItem = useLanguageText_gs_1((s) => s[key]);
//       selectedExportItems[item] = reqestedItem;
//     }
//   }

//   return selectedExportItems as ExportType;
// };

// type Exports1 = {
//   [K in keyof UseLanguageText as `${typeof STORE_ID}${string &
//     K}`]: UseLanguageText[K];
// };

// export const useLanguageText_gs_1_t1 = (
//   ...requestedImports: (keyof Exports1)[]
// ) => {
//   const selectedExportItems: Record<string, any> = {};

//   // Build a dynamic type based on the requested imports
//   type ExportType = {
//     [K in (typeof requestedImports)[number]]: UseLanguageText[ExtractKey<K>];
//   };

//   for (const item of requestedImports) {
//     const key = item.replace(STORE_ID, "") as keyof UseLanguageText;

//     if (!(item in selectedExportItems)) {
//       // Get the requested item from the Zustand store
//       const requestedItem = useLanguageText_gs_1((s) => s[key]);
//       selectedExportItems[item] = requestedItem;
//     }
//   }

//   return selectedExportItems as ExportType;
// };

// type Exports1 = {
//   [K in keyof UseLanguageText as `${typeof STORE_ID}${string &
//     K}`]: UseLanguageText[K];
// };
// type ExtractKey<T extends string> = T extends `${typeof STORE_ID}${infer Rest}`
//   ? Rest
//   : never;

// type Exports1 = `${typeof STORE_ID}${keyof UseLanguageText}`;
// // const exportItems = [
// //   "currLangText",
// //   "allLoadedLanguages",
// //   "availableLanguages",
// //   "selectedLanguage",
// //   "editMode",
// //   "allIdsSet",
// //   "selectedIdx",
// //   "setSelectedIdx",
// //   "setLanguage",
// //   "getLanguage",
// //   "getTextForComponent",
// //   "getTextForString",
// // ] as const;
// // // type Exports = (typeof exportItems)[number];
// export const enum gs_1 {
//   currLangText = "currLangText",
//   allLoadedLanguages = "allLoadedLanguages",
//   availableLanguages = "availableLanguages",
//   selectedLanguage = "selectedLanguage",
//   editMode = "editMode",
//   allIdsSet = "allIdsSet",
//   selectedIdx = "selectedIdx",
//   setSelectedIdx = "setSelectedIdx",
//   setLanguage = "setLanguage",
//   getLanguage = "getLanguage",
//   getTextForComponent = "getTextForComponent",
//   getTextForString = "getTextForString",
// }

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
