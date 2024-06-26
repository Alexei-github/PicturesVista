import React from "react";
import compStyles from "@/components/components.module.css";

type Props = {
  setSidebarSize: (size: number) => void;
  setEffectiveSidebarSize: (size: number) => void;
  resizeMargin: number;
  className?: string;
};
/**
 * SidebarDragLine component which allows user to adjust size of sidebar (click and drag)
 * @param setSidebarSize - function to set sidebar size
 * @param setEffectiveSidebarSize - function to set effective sidebar size
 * @returns SidebarDragLine component
 */
export default function SidebarDragLine({
  setSidebarSize,
  setEffectiveSidebarSize,
  resizeMargin,
  className,
}: Props) {
  const [dragging, setDragging] = React.useState(false);

  const recordSizeOfSideBar = React.useCallback(
    /**
     * Records size of sidebar.
     * @param e - maouse event
     */
    (e: MouseEvent) => {
      e.preventDefault();
      let size = Math.max(e.pageX, resizeMargin);
      setEffectiveSidebarSize(size);
      setSidebarSize(size);
    },
    [setSidebarSize, setEffectiveSidebarSize, resizeMargin]
  );

  const setDragingCurosorOnBody = React.useCallback(
    /**
     * Sets "col-resize" cursor on `body` element.
     */
    () => {
      document.body.style.cursor = "col-resize";
    },
    []
  );

  const removeDragingCurosorOnBody = React.useCallback(
    /**
     * Removes `cursor` style property on body element.
     */
    () => {
      document.body.style.removeProperty("cursor");
    },
    []
  );

  const mouseUp = React.useCallback(
    /**
     * Performs nesessary actions on `mouse up` event (i.e. once dragging has been completed).
     */
    () => {
      setDragging(false);
      removeDragingCurosorOnBody();
    },
    [removeDragingCurosorOnBody]
  );

  React.useEffect(
    /**
     * Adds appropriate event listeners on start of dragging.
     * @returns Remves its event listeners.
     */
    () => {
      if (dragging) {
        window.addEventListener("mousemove", recordSizeOfSideBar);
        window.addEventListener("mouseup", mouseUp);
        return () => {
          window.removeEventListener("mousemove", recordSizeOfSideBar);
          window.addEventListener("mouseup", mouseUp);
        };
      }
    },
    [dragging, recordSizeOfSideBar, mouseUp]
  );

  return (
    <hr
      className={
        className
          ? className
          : `${compStyles.vertical_line} ${
              dragging ? compStyles.hover_drag_line_vertic : ""
            }`
      }
      // style={{ width: "4px" }}
      onMouseDown={() => {
        setDragging(true);
        setDragingCurosorOnBody();
      }}
    />
  );
}
