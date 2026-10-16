import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-sans",
});

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
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`h-full ${plusJakartaSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="h-full antialiased text-slate-800 dark:text-slate-100 bg-[#fafaf9] dark:bg-[#0c0e14] flex flex-col font-sans select-none transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
