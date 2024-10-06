import React from "react";
import SortFnAscend from "@/lib/sortFn";

const useStoreFiles = () => {
  const [loadedImgs, setLoadedImgs] = React.useState<LoadedImgsDirs>({
    "/": {},
  });

  const findIfDirAlreadyStored = React.useCallback(
    async (
      newDir: string,
      existingDirsWORoot: string[],
      newDirsHandles: LoadedDirsHandles,
      newImgsDirs: LoadedImgsDirs
    ) => {
      const sameDirExistingEntryPromises: Promise<string | undefined>[] =
        existingDirsWORoot.map(async (dir) => {
          if (dir.endsWith(newDir) || newDir.endsWith(dir)) {
            if (
              JSON.stringify(
                Object.keys(newImgsDirs[newDir]).sort(SortFnAscend)
              ) ===
              JSON.stringify(Object.keys(loadedImgs[dir]).sort(SortFnAscend))
            ) {
              return dir;
            }
          }
        });
      return (await Promise.all(sameDirExistingEntryPromises)).find(
        (dir) => dir
      );
    },
    [loadedImgs]
  );

  const storeFiles = React.useCallback(
    /**
     * Checks whether newly loaded images and directories were loaded earlier and takes appropritae
     * actions to load new images/directories. It identifies children or parents of newly loaded
     * directories and merges them appropriately.
     * @param newImgsDirs - newly loaded images
     * @param newDirsHandles - newly loaded directories
     */
    async (newImgsDirs: LoadedImgsDirs, newDirsHandles: LoadedDirsHandles) => {
      const imgsToStore = { ...loadedImgs };

      const existingDirsWORoot = Object.keys(loadedImgs).filter(
        (path) => path !== "/"
      );
      const newDirsWORoot = Object.keys(newImgsDirs).filter(
        (path) => path !== "/"
      );
      for (const newDir of newDirsWORoot) {
        const sameDirExistingEntry = await findIfDirAlreadyStored(
          newDir,
          existingDirsWORoot,
          newDirsHandles,
          newImgsDirs
        );
        if (
          // check if directory has already been opened
          sameDirExistingEntry
        ) {
          if (sameDirExistingEntry.length < newDir.length) {
            delete imgsToStore[sameDirExistingEntry];
            imgsToStore[newDir] = newImgsDirs[newDir];
          }
        } else {
          imgsToStore[newDir] = newImgsDirs[newDir];
        }
      }

      // store separately loaded images (i.e. images not inside directories)
      // prevent image name collision by ignoring images with names idential to already loaded images
      if (newImgsDirs["/"]) {
        const imgsInRoot = { ...loadedImgs["/"] };
        for (const img in newImgsDirs["/"]) {
          if (!imgsInRoot[img]) {
            imgsInRoot[img] = newImgsDirs["/"][img];
          }
        }
        imgsToStore["/"] = imgsInRoot;
      }
      setLoadedImgs(imgsToStore);
    },
    [loadedImgs, findIfDirAlreadyStored]
  );

  return { loadedImgs, storeFiles, setLoadedImgs };
};

export default useStoreFiles;
