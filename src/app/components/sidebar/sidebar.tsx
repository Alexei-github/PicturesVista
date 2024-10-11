"use client";
import React from "react";
import sidebarStyles from "@/components/sidebar/sidebar.module.css";
import PinButton from "@/components/sidebar/pinButton";
import SidebarDragLine from "@/components/sidebar/sidebarDragLine";
import FileUploader from "@/components/filesLoad/filesUploader";
import SidebarDir from "@/components/sidebar/sidebarOneDir";
import { useStoredFiles } from "@/stores/storedFiles";
import SortFnAscend from "@/lib/sortFn";

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
  const [sidebarSize, setSidebarSize] = React.useState(0);
  const refSideBarNav = React.useRef<HTMLElement>(null);
  const { loadedFilesDirs } = useStoredFiles();

  const [openCloseTime] = React.useState(0.3);
  const [closeDelayTime] = React.useState(0.7);
  const [completelyClosed, setCompletelyClosed] = React.useState(openSidebar);

  React.useEffect(() => {
    if (!openSidebar) {
      const timeoutClose = setTimeout(() => {
        setCompletelyClosed(!openSidebar);
      }, (closeDelayTime + openCloseTime) * 1000);
      return () => {
        clearTimeout(timeoutClose);
      };
    } else {
      setCompletelyClosed(false);
    }
  }, [openSidebar]);

  React.useEffect(
    /**
     * Setting size of the sidebar upon the opening page.
     */
    () => {
      const remSize: number = parseInt(
        getComputedStyle(document.documentElement).fontSize.replace("px", ""),
        10
      );
      setSidebarSize(remSize * 13);
    },
    []
  );

  React.useEffect(() => {
    if (openSidebar && !pinnedOpen) {
      setPreventDelayAction(true);
    } else if (!openSidebar && !pinnedOpen) {
      setPreventDelayAction(true);
    }
  }, [openSidebar, pinnedOpen, setPreventDelayAction]);

  React.useEffect(() => {
    const sideBarNav = refSideBarNav.current;
    if (sideBarNav) {
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
  }, [refSideBarNav]);
  // }, [refSideBarNav, openSidebar]);

  return (
    <nav
      className={sidebarStyles.sidebar_div}
      style={
        typeof document !== "undefined" &&
        document.body.style.cursor === "col-resize"
          ? {
              flex: `0 0 max(min(${
                openSidebar ? sidebarSize : closedSize
              }px, calc(100% - ${resizeMargin}px)), ${resizeMargin}px)`,
            }
          : {
              flex: `0 0 ${openSidebar ? sidebarSize : closedSize}px`,
              transition: `${
                preventDelayAction
                  ? `flex-basis ${openCloseTime}s`
                  : `flex-basis ${openCloseTime}s ${closeDelayTime}s`
              }`,
            }
      }
      onMouseEnter={() => {
        if (!pinnedOpen) {
          setPreventDelayAction(true);
          setOpenSidebar(true);
        }
      }}
      onMouseLeave={() => {
        if (!pinnedOpen && document.body.style.cursor !== "col-resize") {
          setPreventDelayAction(false);
          setOpenSidebar(false);
        }
      }}
    >
      {(openSidebar || !completelyClosed) && (
        <>
          <PinButton pinned={pinnedOpen} setPinned={setPinnedOpen} />
          <nav ref={refSideBarNav} className={sidebarStyles.sidebar}>
            {Object.keys(loadedFilesDirs)
              .sort(SortFnAscend)
              .map((dir, idx_dir) => {
                const indent = Math.floor((dir.split("/").length - 1) / 2);
                return (
                  <SidebarDir
                    key={`${dir}_${idx_dir}`}
                    dirName={dir}
                    indent={indent}
                    sidebarSize={sidebarSize}
                  />
                );
              })}
            <FileUploader />
          </nav>
          <SidebarDragLine
            setSidebarSize={setSidebarSize}
            resizeMargin={resizeMargin}
          />
        </>
      )}
    </nav>
  );
}
