import Bowser from 'bowser';
import { create } from 'zustand';

type UseBrowserCanUse = {
  canAccessDirectory: boolean;
  setBrowserCanUse: () => void;
};

export const useBrowserCanUse = create<UseBrowserCanUse>((set) => ({
  canAccessDirectory: false,
  setBrowserCanUse: () =>
    set((state: UseBrowserCanUse) => {
      const browser = Bowser.getParser(window.navigator.userAgent);
      const supportsDirLoad = browser.satisfies({
        // https://caniuse.com/input-file-directory
        desktop: {
          chrome: '>30',
          edge: '>14',
          safari: '>11.1',
          firefox: '>50',
          opera: '>17',
        },
      });

      return { ...state, canAccessDirectory: supportsDirLoad };
    }),
}));
