import React from "react";
import { useClickedFileName } from "@/stores/storedFiles";
import imgsDisplayStyle from "@/components/imgsDisplay/imgsDisplay.module.css";

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
    const element = document.getElementById(`${dirName}/${imgName}`);
    if (element) {
      element.scrollIntoView({
        // behavior: "smooth",
        block: "center",
      });
      element.classList.add(imgsDisplayStyle.focused_img);
    }
  }, [setClickedImgName, imgName, dirName]);

  const onBlur = React.useCallback(() => {
    // setClickedImgName("", "");
    const element = document.getElementById(`${dirName}/${imgName}`);
    if (element) {
      element.classList.remove(imgsDisplayStyle.focused_img);
    }
  }, [imgName, dirName]);

  return (
    <li
      tabIndex={0}
      className={className}
      onFocus={onItemClick}
      onBlur={onBlur}
    >
      {imgName}
    </li>
  );
}
export default React.memo(SidebarItem);
