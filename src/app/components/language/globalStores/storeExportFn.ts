import { UseBoundStore, StoreApi } from "zustand";

/**
 * Helper function which prepares function to export slices from zustand store
 * in a way that is less verbose and adds store's index in front of the exported parameters
 * so that those parameters could be easily recognised inside components.
 * @param store - zustand store
 * @param storeId - store's ID
 * @returns returns fucntion which with appropriate types checking whihc in turn will be exported 
 *          out of the store
 */
export default function exportStore<
  StoreType extends Record<string, any>,
  S extends string
>(store: UseBoundStore<StoreApi<StoreType>>, storeId: S) {
  return function <T extends (keyof StoreType & string)[]>(
    ...requestedItems: CheckUnique<T> extends T ? T : CheckUnique<T>
  ) {
    type RequestedItems = {
      [K in T[number] as `${typeof storeId}${string & K}`]: StoreType[K];
    };

    const selectedExportItems: any = {};

    for (const item of requestedItems) {
      selectedExportItems[`${storeId}${item}`] = store((s) => s[item]);
    }
    return selectedExportItems as RequestedItems;
  };
}

/**
 * Checks that parameters passed to a fnction are unique.
 */
type CheckUnique<T extends string[], U extends string[] = []> = T extends [
  infer F extends string,
  ...infer R extends string[]
]
  ? F extends U[number]
    ? CheckUnique<R, [...U, `Remove duplicate of item: ${F}`]>
    : CheckUnique<R, [...U, F]>
  : U;

// export default function exportStore<
//   StoreType extends Record<string, any>,
//   S extends string
// >(store: UseBoundStore<StoreApi<StoreType>>, storeId: S) {
//   type StoreTypeWithPrefix = {
//     [K in keyof StoreType as `${typeof storeId}${string & K}`]: StoreType[K];
//   };

//   return <T extends (keyof StoreTypeWithPrefix & string)[]>(
//     ...requestedItems: T
//   ) => {

//     type RequestedItems = {
//       [K in T[number] as `${string & K}`]: StoreTypeWithPrefix[K];
//     };

//     const selectedExportItems: any = {};

//     for (const item of requestedItems) {
//       const itemClear = item.replace(storeId, "");
//       selectedExportItems[item] = store((s) => s[itemClear]);
//     }

//     return selectedExportItems as RequestedItems;
//   };
// }
