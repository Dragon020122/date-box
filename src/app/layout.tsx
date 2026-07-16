import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "心动计划局｜Date Box";
const description = "为两个人生成一场带有惊喜、任务和回忆的约会计划。";

export const metadata: Metadata = {
  title,
  description,
  applicationName: "心动计划局 Date Box",
  keywords: ["约会计划", "双人互动", "默契测试", "约会灵感", "回忆卡"],
  creator: "Date Box",
  publisher: "Date Box",
  category: "lifestyle",
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    title,
    description,
    siteName: "心动计划局 Date Box",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fff8f5",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
