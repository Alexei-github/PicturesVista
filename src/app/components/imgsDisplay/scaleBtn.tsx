import React from "react";
import { useLayout } from "@/stores/layoutStore";
import imgsDisplayStyles from "@/components/imgsDisplay/imgsDisplay.module.css";

type Props = { minScale: number };

export default function ScaleBtn({ minScale }: Props) {
  const { imgsPaneScaleFactor, setImgsPaneScaleFactor } = useLayout();

  const adjustSizeOfPopup = React.useCallback(
    (adjustment: number, minPopupFactor: number) => {
      if (adjustment < 1) {
        if (imgsPaneScaleFactor > 1) {
          const updatedValue = imgsPaneScaleFactor / 1.1;
          setImgsPaneScaleFactor(updatedValue);
        }
      } else {
        const updatedValue =
          (minPopupFactor > imgsPaneScaleFactor
            ? minPopupFactor
            : imgsPaneScaleFactor) * 1.1;
        if (updatedValue < 500) {
          setImgsPaneScaleFactor(updatedValue);
        }
      }
    },
    [imgsPaneScaleFactor, setImgsPaneScaleFactor]
  );

  return (
    <div className={imgsDisplayStyles.buton_scale_size}>
      <button
        className={imgsDisplayStyles.half_buton_scale_size}
        onClick={() => adjustSizeOfPopup(+1, minScale)}
      >
        -
      </button>
      <button
        className={imgsDisplayStyles.half_buton_scale_size}
        onClick={() => adjustSizeOfPopup(-1, minScale)}
      >
        +
      </button>
    </div>
  );
}
