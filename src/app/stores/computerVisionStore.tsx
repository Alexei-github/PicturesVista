import { create } from 'zustand';

type VisionModels = {
  // eslint-disable-next-line
  mobileNetModel: any;
  // eslint-disable-next-line
  cocoSsd: any;
  computerVisionOn: boolean;
  // eslint-disable-next-line
  loadMobileNet: (model: any) => void;
  // eslint-disable-next-line
  loadCocoSsd: (model: any) => void;
  setComputerVisionOn: (setOn: boolean) => void;
};
export const useVision = create<VisionModels>((set) => ({
  mobileNetModel: null,
  cocoSsd: null,
  computerVisionOn: false,

  // eslint-disable-next-line
  loadMobileNet: (model: any) => {
    set((state) => {
      return { ...state, mobileNetModel: model };
    });
  },
  // eslint-disable-next-line
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
