import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import MainWithTouches from "@/components/layout/mainWithTouches";
import React from "react";

import styles from "./page.module.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PicsVista",
  description:
    "This website allows to open local images and see them in the browser. It as well allows to detect some objects on the uploaded images.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${styles.body}`}>
        <Navbar />
        <MainWithTouches>{children}</MainWithTouches>
      </body>
    </html>
  );
}
