import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "English in Conversation - AI Roleplay",
  description:
    "Luyện phản xạ giao tiếp tiếng Anh tương tác AI trên iPhone, iPad và Laptop theo chủ đề thực tế.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EngConversation",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full">
      <body className="h-full antialiased text-slate-800 bg-slate-50 flex flex-col font-sans select-none">
        {children}
      </body>
    </html>
  );
}
