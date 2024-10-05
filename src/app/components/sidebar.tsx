"use client";
import React from "react";
import compStyles from "@/components/components.module.css";
import PinButton from "./pinButton";
import SidebarDragLine from "@/components/sidebarDragLine";

type Props = {
  openSidebar: boolean;
  pinnedOpen: boolean;
  setPinnedOpen: (pinned: boolean) => void;
};

/**
 * Sidebar component whith adjustable width.
 * It will open once user hovers over left edge of the page and close once user moves cursor away.
 * Users have an option to pin sidebar so that it does not close on moving cuosor away.
 * @returns Sidebar component
 */
export default function Sidebar({
  openSidebar,
  pinnedOpen,
  setPinnedOpen,
}: Props) {
  const [preventDelayAction, setPreventDelayAction] = React.useState(true);
  const [resizeMargin] = React.useState(50);
  const [closedSize] = React.useState(1);
  const [remSize, setRemSize] = React.useState(16);
  const [effectiveSidebarSize, setEffectiveSidebarSize] = React.useState(
    remSize * 13
  );
  const [sidebarSize, setSidebarSize] = React.useState(remSize * 16);

  React.useEffect(
    /**
     * Setting size of the sidebar upon the opening page.
     */
    () => {
      const remSize: number = parseInt(
        getComputedStyle(document.documentElement).fontSize.replace("px", ""),
        10
      );
      setRemSize(remSize);
      setSidebarSize(remSize * 13);
      setEffectiveSidebarSize(remSize * 13);
    },
    []
  );

  React.useEffect(() => {
    if (openSidebar && !pinnedOpen) {
      setEffectiveSidebarSize(sidebarSize);
      setPreventDelayAction(true);
    } else if (!openSidebar && !pinnedOpen) {
      setEffectiveSidebarSize(closedSize);
      setPreventDelayAction(true);
    }
  }, [
    openSidebar,
    pinnedOpen,
    setEffectiveSidebarSize,
    setPreventDelayAction,
    sidebarSize,
    closedSize,
  ]);

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
                preventDelayAction ? "flex-basis 0.5s" : "flex-basis 0.5s 0.5s"
              }`,
            }
      }
      onMouseEnter={() => {
        if (!pinnedOpen) {
          setEffectiveSidebarSize(sidebarSize);
          setPreventDelayAction(true);
        }
      }}
      onMouseLeave={() => {
        if (!pinnedOpen && document.body.style.cursor !== "col-resize") {
          setEffectiveSidebarSize(closedSize);
          setPreventDelayAction(false);
        }
      }}
    >
      {openSidebar && (
        <SidebarDragLine
          setSidebarSize={setSidebarSize}
          setEffectiveSidebarSize={setEffectiveSidebarSize}
          resizeMargin={resizeMargin}
        />
      )}
      <PinButton pinned={pinnedOpen} setPinned={setPinnedOpen} />
    </nav>
  );
}
