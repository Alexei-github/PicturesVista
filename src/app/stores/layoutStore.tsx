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

  setImgsPaneScaleFactor: (adjustment: number, minScaleFactor: number) => void;
};

export const useLayout = create<UseLayout>((set) => ({
  imgsPaneSize: { width: 0, height: 0 },
  imgsPaneScaleFactor: 13,
  setImgsPaneSize: ({ width, height }: { width: number; height: number }) => {
    set((state: UseLayout) => {
      return { ...state, imgsPaneSize: { width, height } };
    });
  },
  setImgsPaneScaleFactor: (adjust: number, minScaleFactor: number) => {
    set((state: UseLayout) => {
      const adjustment: number = 2 * adjust;
      if (adjustment < 1) {
        if (state.imgsPaneScaleFactor > 1) {
          const updatedValue = state.imgsPaneScaleFactor / 1.1;
          return { ...state, imgsPaneScaleFactor: updatedValue };
        }
      } else {
        const updatedValue =
          (minScaleFactor > state.imgsPaneScaleFactor
            ? minScaleFactor
            : state.imgsPaneScaleFactor) * 1.1;
        if (updatedValue < 500) {
          return { ...state, imgsPaneScaleFactor: updatedValue };
        }
      }
      return state;
    });
  },
}));
