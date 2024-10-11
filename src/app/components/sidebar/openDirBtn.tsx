"use client";
import React from "react";
import { Property } from "csstype";
import { useOpenDir } from "@/stores/storedFiles";

type Props = { dirName: string };

export default function OpenFolderBtn({ dirName }: Props) {
  const { setOpenDir, openDirs } = useOpenDir();

  const closeOpenDir = () => {
    if (openDirs[dirName] !== undefined && openDirs[dirName] === false) {
      setOpenDir(dirName, true);
    } else {
      setOpenDir(dirName, false);
    }
  };

  return openDirs[dirName] === undefined || openDirs[dirName] ? (
    <button style={styleBtn} onClick={closeOpenDir}>
      &#11167;&nbsp;{dirName.split("/").pop() ?? ""}
    </button>
  ) : (
    <button style={styleBtn} onClick={closeOpenDir}>
      {" "}
      &#11166;&nbsp;{dirName.split("/").pop() ?? ""}
    </button>
  );
}

const styleBtn = {
  padding: "0rem 0rem",
  width: "100%",
  textAlign: "left" as Property.TextAlign,
  border: "var(--border-sidebar-itms)",
  borderRadius: "0.3rem",
  backgroundColor: "var(--dir-btn-color-rgb)",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  minWidth: "0",
  fontSize: "1.1rem",
};
