import type { Metadata } from "next";
import type { ReactNode } from "react";
import Header from "../components/layout/header";
import { Providers } from "./providers";
import "../index.css";

export const metadata = {
  title: "UMCine",
  description: "영화를 검색하고 즐겨찾기와 평점을 관리하세요.",
} satisfies Metadata;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
