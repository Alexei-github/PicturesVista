import React from "react";
import { useClickedFileName } from "@/stores/storedFiles";

type Props = {
  imgName: string;
  dirName: string;
  className: string;
};

function SidebarItem({ imgName, dirName, className }: Props) {
  const { setClickedImgName } = useClickedFileName();

  const onItemClick = React.useCallback(() => {
    if (document.body.style.cursor !== "col-resize") {
      setClickedImgName(dirName, imgName);
    }
  }, [setClickedImgName]);

  const onBlur = React.useCallback(() => {
    setClickedImgName("", "");
  }, [setClickedImgName]);

  return (
    <li
      tabIndex={0}
      className={className}
      onClick={onItemClick}
      onBlur={onBlur}
    >
      {imgName}
    </li>
  );
}
export default React.memo(SidebarItem);
