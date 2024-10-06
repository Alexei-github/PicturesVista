"use client";
import {
  fileOpen,
  directoryOpen,
  fileSave,
  supported as FSASupported,
} from "browser-fs-access";

import React from "react";
import compStyles from "@/components/components.module.css";

import useStoreFiles from "@/customHooks/useStoreFiles";

import { ACCEPTED_IMGS_TYPES } from "@/lib/acceptedImgsTypes";
import { processFilesOldFS } from "@/lib/filesLoad/processFilesOldFS";
type Props = {};
/**
 * Component which allows users to upload images into browser.
 */
const FileUploader = () => {
  const { loadedImgs, storeFiles, setLoadedImgs } = useStoreFiles();

  React.useEffect(
    /**
     * for debuggin only
     */
    () => {
      console.log(loadedImgs);
    },
    [loadedImgs]
  );

  const onDirClickLoadDir = React.useCallback(
    /**
     * Loads images from click of a button event.
     * Directory picker will open and user will be able to select one directory.
     */
    async (
      e:
        | React.MouseEvent<HTMLButtonElement, MouseEvent>
        | React.TouchEvent<HTMLButtonElement>
    ) => {
      // e.preventDefault();
      console.log("hello");
      // const dirHandle = await window.showDirectoryPicker();
      const imgs = await directoryOpen();
      // const imgs = await directoryOpen({
      //   recursive: true,
      // });
      console.log("ings", imgs);

      let { processedFiles, dirsHandles } = processFilesOldFS(
        imgs as FileWithDirectoryAndFileHandle[]
      );

      await storeFiles(processedFiles, dirsHandles);
    },
    [storeFiles]
  );

  const onClickLoadImgs = React.useCallback(
    async (
      e:
        | React.MouseEvent<HTMLButtonElement, MouseEvent>
        | React.TouchEvent<HTMLButtonElement>
    ) => {
      // e.preventDefault();
      const imgs = await fileOpen({
        description: "Image files",
        mimeTypes: ACCEPTED_IMGS_TYPES,
        extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
        multiple: true,
      });
      const updatedImgs = {
        ...loadedImgs["/"],
        ...Object.fromEntries(
          imgs
            .filter((img) => !loadedImgs["/"][img.name])
            .map((img) => [img.name, img])
        ),
      };
      setLoadedImgs({ ...loadedImgs, "/": updatedImgs });
    },
    [setLoadedImgs, loadedImgs]
  );

  return (
    <>
      {console.log(FSASupported)}
      <div className={`${compStyles.img_drop_area}`}>
        {/* <button
          className={compStyles.btn_opn_files}
          // onMouseDown={onClickLoadImgs}
          onClick={onClickLoadImgs}
          onTouchEnd={onClickLoadImgs}
        >
          Load files
        </button>
        <button
          className={compStyles.btn_opn_files}
          // onMouseDown={onClickLoadImgs}
          onClick={onDirClickLoadDir}
          onTouchEnd={onDirClickLoadDir}
        >
          Load Folder
        </button> */}
        <input
          type="file"
          id="filepicker"
          name="fileList"
          webkitdirectory="true"
          multiple
          style={{ zIndex: "100 !important" }}
          // onTouchEnd={()=>{console.log}}
        />
      </div>
    </>
  );
};

export default FileUploader;
