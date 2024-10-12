import React from "react";

import DisplayOneImg from "@/components/imgsDisplay/displayOneImg";
import { useClickedFileName, useStoredFiles } from "@/stores/storedFiles";
import imgsDisplayStyle from "@/components/imgsDisplay/imgsDisplay.module.css";
import { useLayout } from "@/stores/layoutStore";
import useElementSizeObserver from "@/customHooks/useElementSizeObserver";
import { calculateImgSides } from "@/components/imgsDisplay/getImgSize";
import SortFnAscend from "@/lib/sortFn";
import ImagesOneDir from "@/components/imgsDisplay/imagesOneDir";
import ScaleBtn from "@/components/imgsDisplay/scaleBtn";

function ImgsPane() {
  const { clickedImg } = useClickedFileName();
  const { loadedFilesDirs } = useStoredFiles();
  const { setImgsPaneSize } = useLayout();
  const { imgsPaneSize, imgsPaneScaleFactor } = useLayout();

  const [sizeObserverRef] =
    useElementSizeObserver<HTMLUListElement>(setImgsPaneSize);

  const calculateImgSize = React.useCallback(
    (imgWidth: number, imgHeight: number) => {
      return calculateImgSides(
        imgWidth,
        imgHeight,
        imgsPaneScaleFactor,
        imgsPaneSize.height,
        imgsPaneSize.width
      );
    },
    [imgsPaneScaleFactor, imgsPaneSize]
  );

  return (
    <ul ref={sizeObserverRef} className={imgsDisplayStyle.imgs_pane}>
      <ScaleBtn minScale={2} />
      {Object.keys(loadedFilesDirs)
        .sort(SortFnAscend)
        .map((dir, idx_dir) => {
          const indent = dir.replace(/^\//, "").split("/").length - 1;
          // const indent = Math.floor((dir.split("/").length - 1) / 2);
          return (
            <ImagesOneDir
              key={`${dir}_${idx_dir}`}
              dir={dir}
              dirImgs={Object.keys(loadedFilesDirs[dir])}
              indent={indent}
            />
          );
        })}
    </ul>
  );
}

export default ImgsPane;
