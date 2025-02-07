'use client';
import compStyles from '@/components/components.module.css';
import FilesLoadButton from '@/components/filesLoad/FilesLoadButton';
import dynamic from 'next/dynamic';
import React from 'react';

const LoadDirButton = dynamic(() => import('@/components/filesLoad/DirLoadButton'), {
  ssr: false,
});

import { useBrowserCanUse } from '@/stores/browserDetect';

/** Component which allows users to upload images into browser. */
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
