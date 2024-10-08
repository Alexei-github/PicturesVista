import { create } from "zustand";
import React from "react";
import Bowser from "bowser";

type UseBrowserCanUse = {
  canAccessDirectory: boolean;
  setBrowserCanUse: () => void;
};

export const useBrowserCanUse = create<UseBrowserCanUse>((set) => ({
  canAccessDirectory: false,
  setBrowserCanUse: () =>
    set((state: UseBrowserCanUse) => {
      let browser = Bowser.getParser(window.navigator.userAgent);
      // console.log(browser.getBrowser());
      // console.log(browser.getPlatform());
      const supportsDirLoad = browser.satisfies({
        // mobile: {
        //   chrome: ">120",
        // },
        desktop: {
          chrome: ">120",
        },
      });

      return { ...state, canAccessDirectory: supportsDirLoad };
    }),
}));
