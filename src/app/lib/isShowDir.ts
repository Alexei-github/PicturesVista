export default function isShowDirFn(dirName: string, openDirs: { [dirName: string]: boolean }) {
  let checkDir = '';
  for (const item of dirName.split('/')) {
    checkDir = checkDir ? checkDir + '/' + item : item;
    // it checks all parent directories and if any of them are closed then currently
    // checked directory does not need to be shown.
    // Comparison to undefined as initially no directories are defined in "openDirs".
    if (!(openDirs[checkDir] === undefined || openDirs[checkDir]) && checkDir !== dirName) {
      return false;
    }
  }
  return true;
}
