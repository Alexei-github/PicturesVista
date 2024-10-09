import React from "react";
import type { Metadata } from "next";
import compStyles from "@/components/components.module.css";
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function Navbar() {
  return (
    <nav className={compStyles.navbar}>
      <h1 className={compStyles.h1} style={{ marginLeft: "auto" }}>
        PicsVista
      </h1>
      {/* <input
        type="file"
        id="filepicker"
        name="fileList"
        webkitdirectory="true"
        multiple
        style={{ zIndex: "100 !important" }}
        // onTouchEnd={()=>{console.log}}
      /> */}
    </nav>
  );
}