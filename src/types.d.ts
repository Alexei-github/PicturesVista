import {
  FileWithHandle,
  FileWithDirectoryAndFileHandle,
} from "browser-fs-access";

declare global {
  type FileWithHandle = FileWithHandle;
  type FileWithDirectoryAndFileHandle = FileWithDirectoryAndFileHandle;
  type LoadedImgsDirs = {
    [dir: string]: {
      [file: string]: FileWithHandle | FileWithDirectoryAndFileHandle;
    };
  };
  type LoadedDirsHandles = {
    [file: string]: FileSystemDirectoryHandle;
  };
}

// https://stackoverflow.com/questions/59728371/typescript-d-ts-file-not-recognized

// There might be two issues here:

// 1.) You need to augment Window interface in global scope.

// Either remove all import/export keywords to make the containing file a non-module/script. Or you can use declare global in a module to mark everything wrapped in it as global declaration:

// import { MyCustomGlobal} from './classes';

// declare global {
//   interface Window {
//     myCustomGlobal: MyCustomGlobal;
//   }
// }

// https://stackoverflow.com/questions/39040108/import-class-in-definition-file-d-ts
