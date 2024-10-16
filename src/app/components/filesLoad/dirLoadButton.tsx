import React from "react";
import { directoryOpen } from "browser-fs-access";
import useStoreFilesCustomHook from "@/customHooks/useStoreFiles";
import compStyles from "@/components/components.module.css";
import { processFilesOldFS } from "@/components/filesLoad/processFilesOldFS";

const DirLoadButton = () => {
  const storeFiles = useStoreFilesCustomHook();

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
      try {
        const imgs = await directoryOpen({
          recursive: true,
        });
        let { processedFiles } = processFilesOldFS(
          imgs as FileWithDirectoryAndFileHandle[]
        );

        await storeFiles(processedFiles);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          throw error;
        } else {
          console.log("Directory picker was closed");
        }
      }
    },
    [storeFiles]
  );
  return (
    <button className={compStyles.btn_opn_files} onClick={onClickLoadDir}>
      Load Folder(s)
    </button>
  );
};

export default DirLoadButton;
