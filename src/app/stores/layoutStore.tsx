import { create } from "zustand";

type UseLayout = {
  imgsPaneSize: { width: number; height: number };
  imgsPaneScaleFactor: number;
  setImgsPaneSize: ({
    width,
    height,
  }: {
    width: number;
    height: number;
  }) => void;

  setImgsPaneScaleFactor: (scaleFactor: number) => void;
};

export const useLayout = create<UseLayout>((set) => ({
  imgsPaneSize: { width: 0, height: 0 },
  imgsPaneScaleFactor: 13,
  setImgsPaneSize: ({ width, height }: { width: number; height: number }) => {
    set((state: UseLayout) => {
      return { ...state, imgsPaneSize: { width, height } };
    });
  },
  setImgsPaneScaleFactor: (scaleFactor: number) => {
    set((state: UseLayout) => {
      console.log("scaleFactor", scaleFactor);
      return { ...state, imgsPaneScaleFactor: scaleFactor };
    });
  },
}));
