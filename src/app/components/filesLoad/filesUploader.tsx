"use client";
import {
  fileOpen,
  directoryOpen,
  fileSave,
  supported as FSASupported,
} from "browser-fs-access";
import Bowser from "bowser";
import React from "react";
import compStyles from "@/components/components.module.css";
import dynamic from "next/dynamic";
import FilesLoadButton from "@/components/filesLoad/filesLoadButton";
const LoadDirButton = dynamic(
  () => import("@/components/filesLoad/dirLoadButton"),
  {
    ssr: false,
  }
);

import { useBrowserCanUse } from "@/stores/browserDetect";

import useStoreFiles from "@/customHooks/useStoreFiles";

import { ACCEPTED_IMGS_TYPES } from "@/lib/acceptedImgsTypes";
import { processFilesOldFS } from "@/components/filesLoad/processFilesOldFS";
type Props = {};
/**
 * Component which allows users to upload images into browser.
 */
const FileUploader = () => {
  const { loadedImgs, storeFiles, setLoadedImgs } = useStoreFiles();
  const { canAccessDirectory, setBrowserCanUse } = useBrowserCanUse();
  const [supportsDirLoad, setSupportsDirLoad] = React.useState(false);

  React.useEffect(
    /**
     * for debuggin only
     */
    () => {
      console.log(loadedImgs);
    },
    [loadedImgs]
  );
  React.useEffect(() => {
    setBrowserCanUse();
  }, [setBrowserCanUse]);

  return (
    <>
      <div className={`${compStyles.img_drop_area}`}>
        <FilesLoadButton />
        {canAccessDirectory && <LoadDirButton />}
      </div>
    </>
  );
};

export default FileUploader;
