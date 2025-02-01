import React from 'react';

import { useStoredFiles } from '@/stores/storedFiles';
import imgsDisplayStyle from '@/components/imgsDisplay/imgsDisplay.module.css';
import { useLayout } from '@/stores/layoutStore';
import useElementSizeObserver from '@/customHooks/useElementSizeObserver';
import SortFnAscend from '@/lib/sortFn';
import ImagesOneDir from '@/components/imgsDisplay/ImagesOneDir';
import ScaleBtn from '@/components/imgsDisplay/ScaleBtn';
import TextDisplay from '@/components/language/TextDisplay';

function ImgsPane() {
  const { loadedFilesDirs } = useStoredFiles();
  const { setImgsPaneSize } = useLayout();
  const [sizeObserverRef] = useElementSizeObserver<HTMLUListElement>(setImgsPaneSize);
  const { setImgsPaneScaleFactor } = useLayout();

  React.useEffect(() => {
    const paneElement = sizeObserverRef.current;
    if (paneElement) {
      const zoomFn = (e: WheelEvent) => {
        if (e.ctrlKey) {
          e.preventDefault();
          if (e.deltaY < 0) {
            setImgsPaneScaleFactor(-1, 2);
          } else if (e.deltaY > 0) {
            setImgsPaneScaleFactor(1, 2);
          }
        }
      };

      paneElement.addEventListener('wheel', zoomFn, {
        passive: false,
      });

      return () => {
        if (paneElement) {
          paneElement.removeEventListener('wheel', zoomFn);
        }
      };
    }
  }, [setImgsPaneScaleFactor, sizeObserverRef]);

  return (
    <>
      <ScaleBtn minScale={2} />
      <ul ref={sizeObserverRef} className={imgsDisplayStyle.imgs_pane}>
        {Object.keys(loadedFilesDirs).length ? (
          Object.keys(loadedFilesDirs)
            .sort(SortFnAscend)
            .map((dir, idx_dir) => {
              const indent = dir.replace(/^\//, '').split('/').length - 1;
              return <ImagesOneDir key={`${dir}_${idx_dir}`} dir={dir} indent={indent} />;
            })
        ) : (
          <div
            style={{
              height: '100%',
              margin: 'auto auto',
              padding: '0.3rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <p>
              <TextDisplay p_elementId="4" />
            </p>
          </div>
        )}
      </ul>
    </>
  );
}

export default ImgsPane;
