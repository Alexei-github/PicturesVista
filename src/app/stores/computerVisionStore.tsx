import { create } from "zustand";

type VisionModels = {
  mobileNetModel: any;
  cocoSsd: any;
  computerVisionOn: boolean;

  loadMobileNet: (model: any) => void;
  loadCocoSsd: (model: any) => void;
  setComputerVisionOn: (setOn: boolean) => void;
};
export const useVision = create<VisionModels>((set) => ({
  mobileNetModel: null,
  cocoSsd: null,
  computerVisionOn: false,

  loadMobileNet: (model: any) => {
    set((state) => {
      return { ...state, mobileNetModel: model };
    });
  },
  loadCocoSsd: (model: any) => {
    set((state) => {
      return { ...state, cocoSsd: model };
    });
  },
  setComputerVisionOn: (setOn: boolean) => {
    set((state) => {
      return { ...state, computerVisionOn: setOn };
    });
  },
}));
