import { ACCEPTED_IMGS_TYPES } from "@/lib/acceptedImgsTypes";

export function processFilesOldFS(imgs: FileWithDirectoryAndFileHandle[]) {
  const processedFiles: LoadedFilesDirs = {};

  for (const img of imgs) {
    if (img.hasOwnProperty("webkitRelativePath")) {
      const imgWebkt = img as FileWithDirectoryAndFileHandle;
      if (!ACCEPTED_IMGS_TYPES.includes(imgWebkt.type)) continue;
      const dirPath = imgWebkt.webkitRelativePath.slice(
        0,
        imgWebkt.webkitRelativePath.length - imgWebkt.name.length - 1
      );

      if (!processedFiles[dirPath]) {
        processedFiles[dirPath] = {};
      }
      if (!processedFiles[dirPath][imgWebkt.name]) {
        processedFiles[dirPath][imgWebkt.name] = imgWebkt;
      }
    }
  }
  return { processedFiles };
}
