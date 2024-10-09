"use client";
import React from "react";
import Sidebar from "@/components/layout/sidebar";
import { useBrowserCanUse } from "@/stores/browserDetect";

import styles from "@/components/components.module.css";

const MainWithTouches = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [openSidebar, setOpenSidebar] = React.useState(true);
  const [pinnedOpen, setPinnedOpen] = React.useState(true);
  const [touchStartClientX, setTouchStartClientX] = React.useState(0);
  const ref = React.useRef<HTMLElement>(null);
  const { setBrowserCanUse } = useBrowserCanUse();

  React.useEffect(() => {
    setBrowserCanUse();
  }, [setBrowserCanUse]);

  React.useEffect(() => {
    const main = ref.current;
    if (main) {
      main.addEventListener(
        "touchstart",
        (e) => {
          e.preventDefault();
        },
        {
          passive: false,
        }
      );
      return main.removeEventListener("touchstart", (e) => e.preventDefault());
    }
  }, [ref]);

  return (
    <main
      ref={ref}
      className={styles.main}
      onTouchStart={(e) => {
        // e.preventDefault;
        setTouchStartClientX(e.touches[0].clientX);
      }}
      onTouchMove={(e) => {
        e.preventDefault;
        if (document.body.style.cursor !== "col-resize" && !pinnedOpen) {
          if (
            touchStartClientX < 64 &&
            e.touches[0].clientX - touchStartClientX > 50
          ) {
            setOpenSidebar(true);
          } else if (e.touches[0].clientX - touchStartClientX < -50) {
            setOpenSidebar(false);
          }
        }
      }}
    >
      <Sidebar
        openSidebar={openSidebar}
        pinnedOpen={pinnedOpen}
        setPinnedOpen={setPinnedOpen}
        setOpenSidebar={setOpenSidebar}
      />
      {/* {openSidebar && (
        <SidebarDragLine
          setSidebarSize={setSidebarSize}
          setEffectiveSidebarSize={setEffectiveSidebarSize}
          resizeMargin={resizeMargin}
        />
      )} */}
      <div>{children}</div>
    </main>
  );
};

export default MainWithTouches;
