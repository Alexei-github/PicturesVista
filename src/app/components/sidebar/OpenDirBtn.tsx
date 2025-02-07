'use client';
import compStyle from '@/components/components.module.css';
import { useOpenDir } from '@/stores/storedFiles';
import React from 'react';

type Props = { dirName: string; style?: React.CSSProperties };

export default function OpenDirBtn({ dirName, style }: Props) {
  const { setOpenDir, openDirs } = useOpenDir();
  const [dirNameToShow] = React.useState(
    dirName.split('/').pop() ? dirName.split('/').pop() : 'w/o folder'
  );

  const closeOpenDir = () => {
    if (openDirs[dirName] !== undefined && openDirs[dirName] === false) {
      setOpenDir(dirName, true);
    } else {
      setOpenDir(dirName, false);
    }
  };

  return openDirs[dirName] === undefined || openDirs[dirName] ? (
    <button className={compStyle.open_dir_btn} onClick={closeOpenDir} style={style}>
      &#11167;&nbsp;{dirNameToShow}
    </button>
  ) : (
    <button className={compStyle.open_dir_btn} onClick={closeOpenDir} style={style}>
      {' '}
      &#11166;&nbsp;{dirNameToShow}
    </button>
  );
}
