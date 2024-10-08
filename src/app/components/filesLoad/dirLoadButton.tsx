import React from "react";
import { directoryOpen } from "browser-fs-access";
import useStoreFiles from "@/customHooks/useStoreFiles";
import compStyles from "@/components/components.module.css";

const DirLoadButton = () => {
  const { loadedImgs, storeFiles, setLoadedImgs } = useStoreFiles();

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
  return (
    <button
      className={compStyles.btn_opn_files}
      // onMouseDown={onClickLoadImgs}
      onClick={onClickLoadDir}
      onTouchEnd={onClickLoadDir}
    >
      Load Folder
    </button>
  );
};

export default DirLoadButton;
