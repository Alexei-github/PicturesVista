'use client';
import BBox from '@/components/imgsDisplay/BBox';
import imgsDisplayStyle from '@/components/imgsDisplay/imgsDisplay.module.css';
import { useVision } from '@/stores/computerVisionStore';
import Image from 'next/image';
import React from 'react';

type Props = {
  imgURL: string;
  imgName: string;
  imgCalculatedSize: { width: number; height: number };
  className: string;
  id: string;
};

//transparent one pixel to prevent next.js throwing error that src does not exist taken from here: https://css-tricks.com/snippets/html/base64-encode-of-1x1px-transparent-gif/
const imgPlaceHolder =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

// https://medialab.github.io/iwanthue/
const distinctColors = [
  '#d74f2a',
  '#5066d7',
  '#59b648',
  '#a14ac3',
  '#96b233',
  '#9f76e8',
  '#c0ab39',
  '#d963c9',
  '#52be7e',
  '#d4408c',
  '#3e7f47',
  '#734fa6',
  '#df952f',
  '#7092e1',
  '#9f7027',
  '#b990dd',
  '#6c6f29',
  '#9d4e96',
  '#9ab067',
  '#d64059',
  '#4ebcad',
  '#a8452c',
  '#4fa7d6',
  '#e58054',
  '#5365a5',
  '#d4a468',
  '#d585ba',
  '#9f6242',
  '#9f4766',
  '#e3828d',
];

const distinctColorsLen = distinctColors.length;

function DisplayOneImg({ imgURL: imgURL, imgName, imgCalculatedSize, className, id }: Props) {
  const { mobileNetModel: _, cocoSsd, computerVisionOn } = useVision();
  const [imgLoaded, setImgLoaded] = React.useState(false);
  const [imgVisible, setImgVisible] = React.useState(false);
  const [detectedObjects, setDetectedObjects] = React.useState<
    | {
        bbox: number[];
        objClass: string;
        score: number;
      }[]
    | null
  >(null);

  const [latestImgURL, setLatestImgURL] = React.useState<string | null>(null);

  const imgRef = React.useRef<HTMLImageElement | null>(null);

  React.useEffect(() => {
    if (imgURL !== latestImgURL) {
      setLatestImgURL(imgURL);
      setDetectedObjects(null);
      setImgLoaded(false);
    }
  }, [imgURL, latestImgURL]);

  // React.useEffect(() => {
  //   if (
  //     mobileNetModel &&
  //     computerVisionOn &&
  //     imgRef.current &&
  //     imgRef.current.src !== imgPlaceHolder &&
  //     imgVisible &&
  //     imgLoaded &&
  //     !predictedTags
  //   ) {
  //     requestIdleCallback(async () => {
  //       if (imgRef.current) {
  //         const predictions = await mobileNetModel.classify(imgRef.current);
  //         setPredictedTags(predictions);
  //       }
  //     });
  //   }
  // }, [mobileNetModel, imgVisible, imgLoaded, predictedTags, computerVisionOn]);

  React.useEffect(() => {
    if (
      cocoSsd &&
      computerVisionOn &&
      imgRef.current &&
      imgRef.current.src !== imgPlaceHolder &&
      imgVisible &&
      imgLoaded &&
      !detectedObjects
    ) {
      requestIdleCallback(async () => {
        if (imgRef.current) {
          let predictions = await cocoSsd.detect(imgRef.current);
          predictions = predictions.map(
            ({
              bbox,
              class: objClass,
              score,
            }: {
              bbox: number[];
              class: string;
              score: number;
            }) => {
              let newBBox;
              if (imgRef.current?.width && imgRef.current?.height) {
                newBBox = [
                  bbox[0] / imgRef.current?.width,
                  bbox[1] / imgRef.current?.height,
                  bbox[2] / imgRef.current?.width,
                  bbox[3] / imgRef.current?.height,
                ];
              } else {
                newBBox = [0, 0, 0, 0];
              }
              return { bbox: newBBox, objClass, score };
            }
          );

          setDetectedObjects(predictions);
        }
      });
    }
  }, [cocoSsd, imgVisible, imgLoaded, detectedObjects, computerVisionOn]);

  React.useEffect(() => {
    if (imgRef.current) {
      const observer = new IntersectionObserver(([entry]) => setImgVisible(entry.isIntersecting));
      observer.observe(imgRef.current);
      return () => {
        observer.disconnect();
      };
    }
  }, [imgCalculatedSize]);

  const onLoad = React.useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setImgLoaded(e.currentTarget.complete);
    },
    [setImgLoaded]
  );
  return (
    <>
      {imgCalculatedSize && (
        <figure id={id} className={imgsDisplayStyle.one_fig}>
          <Image
            ref={imgRef}
            src={imgURL}
            className={className}
            alt={imgName}
            onLoad={onLoad}
            style={{
              minWidth: `${Math.min(imgCalculatedSize.width, imgCalculatedSize.height)}px`,
              maxWidth: `${imgCalculatedSize.width}px`,
              maxHeight: `${imgCalculatedSize.height}px`,
            }}
            width={0}
            height={0}
            // https://www.youtube.com/watch?v=2U7yZ3wvFBM 11:30
          />
          {computerVisionOn &&
            detectedObjects?.map(({ bbox, objClass, score }, idx) => {
              return (
                <BBox
                  key={`${objClass}_${idx}`}
                  x={bbox[0]}
                  y={bbox[1]}
                  width={bbox[2]}
                  height={bbox[3]}
                  objectName={objClass}
                  confidence={(score * 100).toFixed(1)}
                  color={
                    distinctColors[
                      objClass.split('').reduce((total, cur) => {
                        return total + cur.charCodeAt(0);
                      }, 0) % distinctColorsLen
                    ]
                  }
                />
              );
            })}
        </figure>
      )}
    </>
  );
}

export default React.memo(DisplayOneImg);
