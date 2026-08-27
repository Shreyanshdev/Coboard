import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coboard | Virtual Collaborative Whiteboard",
  description:
    "An ultra-fast, virtual collaborative whiteboard with organic hand-drawn roughness, instant WebSocket synchronization, and zero friction.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Architects+Daughter&family=Caveat:wght@400..700&family=JetBrains+Mono:wght@400;500;600;700&family=Kalam:wght@300;400;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=chillax@400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#dedcd9] text-[#27221e] min-h-screen relative selection:bg-[#c9753c]/20 selection:text-[#382012]">
        {children}
      </body>
    </html>
  );
}
