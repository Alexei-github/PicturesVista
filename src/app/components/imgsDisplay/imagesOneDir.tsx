import React from "react";
import Image from "next/image";
import OpenDirBtn from "@/components/sidebar/openDirBtn";
import { useStoredFiles, useOpenDir } from "@/stores/storedFiles";
import imgsDisplayStyle from "@/components/imgsDisplay/imgsDisplay.module.css";
import { useLayout } from "@/stores/layoutStore";
import { calculateImgSides } from "@/components/imgsDisplay/getImgSize";
import SortFnAscend from "@/lib/sortFn";
import { getImgNaturalSizeFn } from "@/components/imgsDisplay/getImgSize";

import isShowDirFn from "@/lib/isShowDir";

import DisplayOneImg from "@/components/imgsDisplay/displayOneImg";

type Props = { dir: string; indent: number };

type ImgsData = {
  [imgName: string]: {
    imgURL: string;
    imgNaturalSize: { width: number; height: number };
  };
};

export default function ImagesOneDir({ dir, indent }: Props) {
  const { loadedFilesDirs } = useStoredFiles();
  const { openDirs } = useOpenDir();
  const { imgsPaneSize, imgsPaneScaleFactor } = useLayout();
  const [imgsData, setImgsData] = React.useState<ImgsData>({});
  const [loadingImgsNames, setLoadingImgsNames] = React.useState<string[]>([]);
  const [batchSize] = React.useState(10);

  React.useEffect(() => {
    setImgsData({});
    setLoadingImgsNames(
      Object.keys(loadedFilesDirs[dir]).sort(SortFnAscend).reverse()
    );
  }, [loadedFilesDirs, dir]);

  React.useEffect(() => {
    if (loadingImgsNames.length === 0) {
      return;
    }
    // const remainedToLoad = loadingImgsNames;
    const remainedToLoad = [...loadingImgsNames];

    const nextLoad: string[] = [];
    for (let i: number = 0; i < batchSize; i++) {
      const pop = remainedToLoad.pop();
      if (!pop) {
        break;
      }
      nextLoad.push(pop);
    }

    requestIdleCallback(async () => {
      const imgsDataPromises = nextLoad.map(async (imgName) => {
        const imgFile = loadedFilesDirs[dir][imgName];
        const imgURL = URL.createObjectURL(imgFile);
        const imgNaturalSize = await getImgNaturalSizeFn(imgURL);
        return [imgName, { imgURL, imgNaturalSize }];
      });
      setImgsData({
        ...imgsData,
        ...Object.fromEntries(await Promise.all(imgsDataPromises)),
      });
      setLoadingImgsNames(remainedToLoad);
    });
  }, [imgsData, batchSize, dir, loadedFilesDirs, loadingImgsNames]);

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
        Object.keys(imgsData)
          .sort(SortFnAscend)
          .map((imgName: string, idx) => {
            return (
              <DisplayOneImg
                id={`${dir}/${imgName}`}
                key={`${dir}/${imgName}`}
                imgURL={imgsData[imgName].imgURL}
                imgName={imgName}
                imgCalculatedSize={calculateImgSize(
                  imgsData[imgName].imgNaturalSize.width,
                  imgsData[imgName].imgNaturalSize.height
                )}
                className={imgsDisplayStyle.one_img}
              />
            );
          })}
    </ul>
  );
}
