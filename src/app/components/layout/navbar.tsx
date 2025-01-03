"use client";
import React from "react";
import type { Metadata } from "next";
import compStyles from "@/components/components.module.css";
import MainLangSelect from "@/components/language/mainLangSelect";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};
export default function Navbar() {
  return (
    <nav className={compStyles.navbar}>
      <h1 className={compStyles.h1}>PicsVista</h1>
      <div style={{ display: "flex", flexDirection: "row", gap: "0.2rem" }}>
        <MainLangSelect />
      </div>

      <a
        className={compStyles.navbar_links}
        href="https://github.com/Alexei-github/PicturesVista"
        target="_blank"
      >
        Website&apos;s Github
      </a>
      <a
        className={compStyles.navbar_links}
        href="https://www.linkedin.com/in/aliakseiberaziuk/"
        target="_blank"
      >
        Author&apos;s LinkedIn
      </a>
    </nav>
  );
}
