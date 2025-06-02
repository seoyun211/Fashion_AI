import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fashion AI",
  description: "패션 트렌드 분석 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-white dark:bg-gray-900">
        {children}
      </body>
    </html>
  );
}
