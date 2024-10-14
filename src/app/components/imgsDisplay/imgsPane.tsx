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
        {Object.keys(loadedFilesDirs).length ? (
          Object.keys(loadedFilesDirs)
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
            })
        ) : (
          <p
            style={{
              margin: "auto",
              padding: "0.3rem",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Upload images / folders to see them here.
          </p>
        )}
      </ul>
    </>
  );
}

export default ImgsPane;
