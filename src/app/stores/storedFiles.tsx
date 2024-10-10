import { create } from "zustand";
import React from "react";
import Bowser from "bowser";
import SortFnAscend from "@/lib/sortFn";

type UseStoredFiles = {
  loadedFilesDirs: LoadedFilesDirs;

  storeLoadedFiles: (newImgsDirs: LoadedFilesDirs) => Promise<any>;
};

export const useStoredFiles = create<UseStoredFiles>((set) => ({
  loadedFilesDirs: { "/": {} },

  storeLoadedFiles: async (newFilesDirs: LoadedFilesDirs) =>
    set((state) => {
      // console.log("newFilesDirs", newFilesDirs);
      return { ...state, loadedFilesDirs: newFilesDirs };
    }),
}));
