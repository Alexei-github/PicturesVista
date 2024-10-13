import React from "react";
import { useLayout } from "@/stores/layoutStore";
import imgsDisplayStyles from "@/components/imgsDisplay/imgsDisplay.module.css";

type Props = { minScale: number };

export default function ScaleBtn({ minScale }: Props) {
  const { setImgsPaneScaleFactor } = useLayout();

  const incrementScaleFactor = React.useCallback(() => {
    setImgsPaneScaleFactor(+1, minScale);
  }, []);
  const decrementScaleFactor = React.useCallback(() => {
    setImgsPaneScaleFactor(-1, minScale);
  }, []);

  return (
    <div
      className={imgsDisplayStyles.buton_scale_size}
      data-tooltip="Ctrl+Scroll"
    >
      <button
        className={imgsDisplayStyles.half_buton_scale_size}
        onClick={decrementScaleFactor}
      >
        +
      </button>
      <button
        className={imgsDisplayStyles.half_buton_scale_size}
        onClick={incrementScaleFactor}
      >
        -
      </button>
    </div>
  );
}
