import { UseBoundStore, StoreApi } from "zustand";

// export default function exportStore<StoreType>(
export default function exportStore<
  StoreType extends Record<string, any>,
  S extends string
>(store: UseBoundStore<StoreApi<StoreType>>, storeId: S) {
  //   type StoreTypeWithPrefix = `${typeof storeId}${keyof StoreType & string}`;

  type StoreTypeWithPrefix = {
    [K in keyof StoreType as `${typeof storeId}${string & K}`]: StoreType[K];
  };

  return function useLanguageText_gs_1_t<
    T extends (keyof StoreTypeWithPrefix & string)[]
  >(...requestedImports: T) {
    // type Check<I> = I extends keyof UseLanguageText ? I : never;

    type RequestedItems = {
      [K in T[number] as `${string & K}`]: StoreTypeWithPrefix[K];
    };

    const selectedExportItems: any = {};

    for (const item of requestedImports) {
      const itemClear = item.replace(storeId, "");
      selectedExportItems[item] = store((s) => s[itemClear]);
    }

    return selectedExportItems as RequestedItems;
  };
}

//   type type1 = {
//     [K in keyof StoreType as `${typeof storeId}${string & K}`]: any;
//   };

//   type StoreTypeWithPrefix = keyof type1;
