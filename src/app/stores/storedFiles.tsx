import { create } from 'zustand';

type UseStoredFiles = {
  loadedFilesDirs: LoadedFilesDirs;
  // eslint-disable-next-line
  storeLoadedFiles: (newImgsDirs: LoadedFilesDirs) => Promise<any>;
};

export const useStoredFiles = create<UseStoredFiles>((set) => ({
  loadedFilesDirs: {},

  storeLoadedFiles: async (newFilesDirs: LoadedFilesDirs) =>
    set((state) => {
      return { ...state, loadedFilesDirs: newFilesDirs };
    }),
}));

type OpenDir = {
  openDirs: { [dirName: string]: boolean };
  setOpenDir: (dirName: string, setValue: boolean) => void;
};
export const useOpenDir = create<OpenDir>((set) => ({
  openDirs: {},
  setOpenDir: (dirName: string, setValue: boolean) => {
    set((state) => {
      const updatedOpenDirs = { ...state.openDirs };
      updatedOpenDirs[dirName] = setValue;

      return { ...state, openDirs: updatedOpenDirs };
    });
  },
}));

type LastClickedFileName = {
  clickedImg: { dir: string; name: string };
  setClickedImgName: (imgDir: string, imgName: string) => void;
};

export const useClickedFileName = create<LastClickedFileName>((set) => ({
  clickedImg: { dir: '', name: '' },

  setClickedImgName: (imgDir: string, imgName: string) => {
    set((state) => {
      // console.log(imgDir, imgName);
      return { ...state, clickedImg: { name: imgName, dir: imgDir } };
    });
  },
}));
