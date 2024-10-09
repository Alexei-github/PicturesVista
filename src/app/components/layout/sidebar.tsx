"use client";
import React from "react";
import compStyles from "@/components/components.module.css";
import PinButton from "./pinButton";
import SidebarDragLine from "@/components/layout/sidebarDragLine";
import FileUploader from "@/components/filesLoad/filesUploader";

type Props = {
  openSidebar: boolean;
  pinnedOpen: boolean;
  setPinnedOpen: (pinned: boolean) => void;
  setOpenSidebar: (open: boolean) => void;
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
  setOpenSidebar,
}: Props) {
  const [preventDelayAction, setPreventDelayAction] = React.useState(true);
  const [resizeMargin] = React.useState(50);
  const [closedSize] = React.useState(1);
  const [remSize, setRemSize] = React.useState(16);
  const [effectiveSidebarSize, setEffectiveSidebarSize] = React.useState(
    remSize * 13
  );
  const [sidebarSize, setSidebarSize] = React.useState(remSize * 16);
  const refSideBarNav = React.useRef<HTMLElement>(null);

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

  React.useEffect(() => {
    const sideBarNav = refSideBarNav.current;
    if (sideBarNav) {
      console.log(refSideBarNav, effectiveSidebarSize);
      // const sidebarOpenFn = (e: any) => {
      //   e.stopPropagation();
      // };
      sideBarNav.addEventListener(
        "touchstart",
        (e: any) => {
          e.stopPropagation();
        },
        {
          passive: true,
          capture: true,
        }
      );
      return sideBarNav.removeEventListener(
        "touchstart",
        (e: any) => {
          e.stopPropagation();
        },
        {
          capture: true,
        }
      );
    }
  }, [refSideBarNav, openSidebar]);

  return (
    <nav
      className={compStyles.sidebar_div}
      style={
        typeof document !== "undefined" &&
        document.body.style.cursor === "col-resize"
          ? {
              flex: `0 0 max(min(${effectiveSidebarSize}px, calc(100% - ${resizeMargin}px)), ${resizeMargin}px)`,
            }
          : {
              flex: `0 0 ${effectiveSidebarSize}px`,
              transition: `${
                preventDelayAction ? "flex-basis 0.3s" : "flex-basis 0.2s 0.5s"
              }`,
            }
      }
      onMouseEnter={() => {
        if (!pinnedOpen) {
          setEffectiveSidebarSize(sidebarSize);
          setPreventDelayAction(true);
          setOpenSidebar(true);
        }
      }}
      onMouseLeave={() => {
        if (!pinnedOpen && document.body.style.cursor !== "col-resize") {
          setEffectiveSidebarSize(closedSize);
          setPreventDelayAction(false);
          setOpenSidebar(false);
        }
      }}
    >
      {openSidebar && (
        <>
          <PinButton pinned={pinnedOpen} setPinned={setPinnedOpen} />
          <nav ref={refSideBarNav} className={compStyles.sidebar}>
            <FileUploader />
          </nav>
          <SidebarDragLine
            setSidebarSize={setSidebarSize}
            setEffectiveSidebarSize={setEffectiveSidebarSize}
            resizeMargin={resizeMargin}
          />
        </>
      )}
    </nav>
  );
}
