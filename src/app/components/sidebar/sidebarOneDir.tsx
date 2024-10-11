"use client";
import React from "react";
import SidebarItem from "@/components/sidebar/sidebarOneItem";
import sidebarStyles from "@/components/sidebar/sidebar.module.css";
import styled from "styled-components";

import { useStoredFiles, useOpenDir } from "@/stores/storedFiles";
import SortFnAscend from "@/lib/sortFn";

import OpenDirBtn from "@/components/sidebar/openDirBtn";

type Props = { dirName: string; indent: number; sidebarSize: number };

function SidebarDir({
  dirName,
  indent,
  sidebarSize: effectiveSidebarSize,
}: Props) {
  const { openDirs } = useOpenDir();
  const { loadedFilesDirs } = useStoredFiles();
  const [itemWidth] = React.useState(170);
  const [gridColGap] = React.useState(16);

  const numberOfColumns = React.useMemo(() => {
    return Math.floor(
      (effectiveSidebarSize - gridColGap * 2) / (itemWidth + gridColGap)
    );
  }, [effectiveSidebarSize, gridColGap, itemWidth]);

  const isShowDir = React.useMemo(() => {
    let checkDir = "";
    for (const item of dirName.split("/")) {
      checkDir = checkDir ? checkDir + "/" + item : item;
      if (
        !(openDirs[checkDir] === undefined || openDirs[checkDir]) &&
        checkDir !== dirName
      ) {
        return false;
      }
    }
    return true;
  }, [dirName, openDirs]);

  return (
    <div style={{ margin: `0.3rem 0.3rem 0.3rem ${indent + 0.3}rem` }}>
      {isShowDir && <OpenDirBtn dirName={dirName} />}
      <GridUl $colnumb={numberOfColumns}>
        {(openDirs[dirName] === undefined || openDirs[dirName]) &&
          isShowDir &&
          Object.keys(loadedFilesDirs[dirName])
            .sort(SortFnAscend)
            .map((imgName, idx_img) => {
              return (
                <SidebarItem
                  className={sidebarStyles.sidebar_item}
                  key={`${imgName}_${idx_img}`}
                  imgName={imgName}
                  dirName={dirName}
                />
              );
            })}
      </GridUl>
    </div>
  );
}

const GridUl = styled.ul<{ $colnumb: number }>`
  padding: 0.3rem 0.7rem 0rem 0rem;
  display: grid;
  grid-template-columns: repeat(${(p) => p.$colnumb}, 1fr);
  grid-column-gap: 0.5rem;
  grid-row-gap: 0.2rem;
`;

export default React.memo(SidebarDir);
