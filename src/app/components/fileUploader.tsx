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

  const onClickLoadDir = React.useCallback(
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
      // const imgs = directoryOpen();
      // const imgs = fileOpen({
      //   description: "Image files",
      //   mimeTypes: ACCEPTED_IMGS_TYPES,
      // });
      const imgs = await directoryOpen();
      // const imgs = await directoryOpen({
      //   recursive: true,
      // });
      console.log("ings", imgs);
      console.log("showPicker" in HTMLInputElement.prototype);
      const imgs_awaiten = await imgs;
      console.log("ings", imgs_awaiten);

      // let { processedFiles, dirsHandles } = processFilesOldFS(
      //   imgs as FileWithDirectoryAndFileHandle[]
      // );

      // await storeFiles(processedFiles, dirsHandles);
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
          (Array.isArray(imgs) ? imgs : [imgs])
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
      {/* {console.log(
        FSASupported,
        "webkitdirectory" in document.createElement("input")
      )} */}
      {console.log(FSASupported, window.navigator.userAgent.toLowerCase())}
      {/* {console.log(
        FSASupported,
        window.navigator.userAgent.toLowerCase().includes("mobi")
      )} */}
      {/* {console.log(window.screenX)} */}
      <div className={`${compStyles.img_drop_area}`}>
        <button
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
          onClick={onClickLoadDir}
          onTouchEnd={onClickLoadDir}
        >
          Load Folder
        </button>
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
