import imgsDisplayStyles from '@/components/imgsDisplay/imgsDisplay.module.css';
import { useLayout } from '@/stores/layoutStore';
import React from 'react';

type Props = { minScale: number };

export default function ScaleBtn({ minScale }: Props) {
  const { setImgsPaneScaleFactor } = useLayout();

  const incrementScaleFactor = React.useCallback(() => {
    setImgsPaneScaleFactor(+1, minScale);
  }, [minScale, setImgsPaneScaleFactor]);

  const decrementScaleFactor = React.useCallback(() => {
    setImgsPaneScaleFactor(-1, minScale);
  }, [minScale, setImgsPaneScaleFactor]);

  return (
    <div className={imgsDisplayStyles.buton_scale_size} data-tooltip="Ctrl+Scroll">
      <button className={imgsDisplayStyles.half_buton_scale_size} onClick={decrementScaleFactor}>
        +
      </button>
      <button className={imgsDisplayStyles.half_buton_scale_size} onClick={incrementScaleFactor}>
        -
      </button>
    </div>
  );
}
