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
import { useStoredFiles } from "@/stores/storedFiles";

const LoadDirButton = dynamic(
  () => import("@/components/filesLoad/dirLoadButton"),
  {
    ssr: false,
  }
);

import { useBrowserCanUse } from "@/stores/browserDetect";

/**
 * Component which allows users to upload images into browser.
 */
const FileUploader = () => {
  const { canAccessDirectory } = useBrowserCanUse();

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
