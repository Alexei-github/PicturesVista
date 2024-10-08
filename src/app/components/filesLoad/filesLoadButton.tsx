import React from "react";
import { fileOpen } from "browser-fs-access";
import useStoreFiles from "@/customHooks/useStoreFiles";
import compStyles from "@/components/components.module.css";
import { ACCEPTED_IMGS_TYPES } from "@/lib/acceptedImgsTypes";

const FilesLoadButton = () => {
  const { loadedImgs, storeFiles, setLoadedImgs } = useStoreFiles();

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
    <button
      className={compStyles.btn_opn_files}
      onClick={onClickLoadImgs}
      onTouchEnd={onClickLoadImgs}
    >
      Load images
    </button>
  );
};

export default FilesLoadButton;
