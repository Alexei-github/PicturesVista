import React from "react";
import Image from "next/image";
import OpenDirBtn from "@/components/sidebar/openDirBtn";
import { useStoredFiles, useOpenDir } from "@/stores/storedFiles";
import imgsDisplayStyle from "@/components/imgsDisplay/imgsDisplay.module.css";
import { useLayout } from "@/stores/layoutStore";
import { calculateImgSides } from "@/components/imgsDisplay/getImgSize";

import isShowDirFn from "@/lib/isShowDir";

import DisplayOneImg from "@/components/imgsDisplay/displayOneImg";

type Props = { dir: string; dirImgs: string[]; indent: number };

export default function ImagesOneDir({ dir, dirImgs, indent }: Props) {
  const { loadedFilesDirs } = useStoredFiles();
  const { openDirs } = useOpenDir();
  const { imgsPaneSize, imgsPaneScaleFactor } = useLayout();

  const showDirResult = React.useMemo(() => {
    return isShowDirFn(dir, openDirs);
  }, [dir, openDirs]);

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
    <ul
      className={imgsDisplayStyle.imgs_list_dir}
      style={{
        margin: `0.3rem 0.3rem 0.3rem ${indent + 0.3}rem`,
      }}
    >
      {showDirResult && <OpenDirBtn dirName={dir} />}
      {(openDirs[dir] === undefined || openDirs[dir]) &&
        showDirResult &&
        dirImgs.map((imgName: string, idx) => {
          // const imageHandle = getImgsInfo[dir][imgName].handle;

          return (
            <DisplayOneImg
              id={`${dir}/${imgName}`}
              key={`image_${idx}`}
              imgFile={loadedFilesDirs[dir][imgName]}
              imgName={imgName}
              calculateImgSize={calculateImgSize}
              className={imgsDisplayStyle.one_img}
            />
          );
        })}
    </ul>
  );
}
