import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import MainWithTouches from "@/components/layout/mainWithTouches";

import styles from "./page.module.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
        {/* <main
          className={styles.main}
          onTouchMove={(e) => {
            if (
              e.touches[0].clientX < 16 &&
              e.touches[e.touches.length - 1].clientX - e.touches[0].clientX >
                50
            ) {
            }
          }}
        >
          <Sidebar openSidebar={false} />
          {children}
        </main> */}
      </body>
    </html>
  );
}
