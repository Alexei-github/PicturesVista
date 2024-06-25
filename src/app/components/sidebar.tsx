"use client";
import React from "react";
import compStyles from "@/components/components.module.css";
import PinButton from "./pinButton";
import SidebarDragLine from "@/components/sidebarDragLine";

/**
 * Sidebar component whith adjustable width.
 * It will open once user hovers over left edge of the page and close once user moves cursor away.
 * Users have an option to pin sidebar so that it does not close on moving cuosor away.
 * @returns Sidebar component
 */
export default function Sidebar() {
  const [sidebarSize, setSidebarSize] = React.useState(13 * 16);
  const [oepningInAction, setOpeningInAction] = React.useState(true);
  const [pinnedOpen, setPinnedOpen] = React.useState(true);
  const [resizeMargin] = React.useState(50);
  const [effectiveSidebarSize, setEffectiveSidebarSize] = React.useState(
    13 * 16
  );
  const [remSize, setRemSize] = React.useState(16);

  React.useEffect(
    /**
     * Setting size of the sidebar upon the opening page.
     */
    () => {
      const remSize: string = getComputedStyle(
        document.documentElement
      ).fontSize.replace("px", "");
      setRemSize(parseInt(remSize, 10));
      setSidebarSize(parseInt(remSize, 10) * 13);
      setEffectiveSidebarSize(parseInt(remSize, 10) * 13);
    },
    [setSidebarSize, setEffectiveSidebarSize]
  );

  return (
    <nav
      className={compStyles.sidebar}
      style={
        typeof document !== "undefined" &&
        document.body.style.cursor === "col-resize"
          ? {
              flex: `0 0 max(min(${effectiveSidebarSize}px, calc(100% - ${resizeMargin}px)), ${resizeMargin}px)`,
            }
          : {
              flex: `0 0 ${effectiveSidebarSize}px`,
              transition: `${
                oepningInAction ? "flex-basis 0.5s" : "flex-basis 0.5s 0.5s"
              }`,
            }
      }
      onMouseEnter={() => {
        if (!pinnedOpen) {
          setEffectiveSidebarSize(sidebarSize);
          setOpeningInAction(true);
        }
      }}
      onMouseLeave={() => {
        if (!pinnedOpen && document.body.style.cursor !== "col-resize") {
          setEffectiveSidebarSize(5);
          setOpeningInAction(false);
        }
      }}
    >
      <SidebarDragLine
        setSidebarSize={setSidebarSize}
        setEffectiveSidebarSize={setEffectiveSidebarSize}
        resizeMargin={resizeMargin}
      />
      <PinButton pinned={pinnedOpen} setPinned={setPinnedOpen} />
    </nav>
  );
}
