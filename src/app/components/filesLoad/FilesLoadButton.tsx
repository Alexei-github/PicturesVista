import useStoreFilesCustomHook from '@/customHooks/useStoreFiles';
import { fileOpen } from 'browser-fs-access';
import React from 'react';

import compStyles from '@/components/components.module.css';
import TextDisplay from '@/components/language/TextDisplay';
import { ACCEPTED_IMGS_TYPES } from '@/lib/acceptedImgsTypes';

const FilesLoadButton = () => {
  const storeFiles = useStoreFilesCustomHook();

  const onClickLoadImgs = React.useCallback(async () =>
    // e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.TouchEvent<HTMLButtonElement>,
    {
      try {
        const imgs = await fileOpen({
          description: 'Image files',
          mimeTypes: ACCEPTED_IMGS_TYPES,
          extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
          multiple: true,
        });

        await storeFiles({
          '/': Object.fromEntries(
            (Array.isArray(imgs) ? imgs : [imgs]).map((img) => [img.name, img])
          ),
        });
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          throw error;
        } else {
          console.log('Image picker was closed');
        }
      }
    }, [storeFiles]);

  return (
    <button className={compStyles.btn_opn_files} onClick={onClickLoadImgs}>
      <TextDisplay p_elementId="1" />
    </button>
  );
};

export default FilesLoadButton;
