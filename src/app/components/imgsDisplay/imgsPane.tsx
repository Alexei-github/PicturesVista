import React from "react";

import { useStoredFiles } from "@/stores/storedFiles";
import imgsDisplayStyle from "@/components/imgsDisplay/imgsDisplay.module.css";
import { useLayout } from "@/stores/layoutStore";
import useElementSizeObserver from "@/customHooks/useElementSizeObserver";
import SortFnAscend from "@/lib/sortFn";
import ImagesOneDir from "@/components/imgsDisplay/imagesOneDir";
import ScaleBtn from "@/components/imgsDisplay/scaleBtn";
import DisplayOneImg from "@/components/imgsDisplay/displayOneImg";
import { calculateImgSides } from "@/components/imgsDisplay/getImgSize";

import { useClickedFileName } from "@/stores/storedFiles";

function ImgsPane() {
  const { loadedFilesDirs } = useStoredFiles();
  const { setImgsPaneSize } = useLayout();
  const { clickedImg } = useClickedFileName();
  const [sizeObserverRef] =
    useElementSizeObserver<HTMLUListElement>(setImgsPaneSize);
  const { imgsPaneSize, imgsPaneScaleFactor, setImgsPaneScaleFactor } =
    useLayout();

  const calculateImgSize = React.useCallback(
    (imgWidth: number, imgHeight: number) => {
      return calculateImgSides(
        imgWidth,
        imgHeight,
        imgsPaneScaleFactor,
        3000,
        3000
      );
    },
    [imgsPaneScaleFactor, imgsPaneSize]
  );

  React.useEffect(() => {
    if (sizeObserverRef.current) {
      const zoomFn = (e: WheelEvent) => {
        if (e.ctrlKey) {
          e.preventDefault();
          if (e.deltaY < 0) {
            setImgsPaneScaleFactor(-1, 2);
          } else if (e.deltaY > 0) {
            setImgsPaneScaleFactor(1, 2);
          }
        }
      };

      sizeObserverRef.current.addEventListener("wheel", zoomFn, {
        passive: false,
      });

      return () => {
        if (sizeObserverRef.current) {
          sizeObserverRef.current.removeEventListener("wheel", zoomFn);
        }
      };
    }
  }, [setImgsPaneScaleFactor]);

  return (
    <>
      <ScaleBtn minScale={2} />
      <ul ref={sizeObserverRef} className={imgsDisplayStyle.imgs_pane}>
        {Object.keys(loadedFilesDirs)
          .sort(SortFnAscend)
          .map((dir, idx_dir) => {
            const indent = dir.replace(/^\//, "").split("/").length - 1;
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
    </>
    // <>
    //   {clickedImg.dir && (
    //     <DisplayOneImg
    //       // key={`image_${idx}`}
    //       imgFile={loadedFilesDirs[clickedImg.dir][clickedImg.name]}
    //       imgName={clickedImg.name}
    //       calculateImgSize={calculateImgSize}
    //       className={imgsDisplayStyle.one_img}
    //     />
    //   )}
    // </>
  );
}

export default ImgsPane;
