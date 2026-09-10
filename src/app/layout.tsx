import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abhishek S Nair — Full-Stack Developer | Web, Mobile & AI",
  description: "Personal developer portfolio of Abhishek S Nair. Full-Stack Engineer with 3+ years experience building React, React Native, Flutter, Node.js, WebSockets, and AI applications.",
  keywords: [
    "Abhishek S Nair",
    "Full-Stack Developer",
    "React Developer",
    "React Native Developer",
    "Flutter Developer",
    "Node.js Developer",
    "AI Engineer",
    "MERN Stack",
    "WebSockets",
    "Software Engineer Portfolio"
  ],
  authors: [{ name: "Abhishek S Nair" }],
  openGraph: {
    title: "Abhishek S Nair — Full-Stack Developer",
    description: "Full-Stack Software Developer building production Web, Mobile & AI products.",
    url: "https://github.com/abhisheksureshnair",
    siteName: "Abhishek S Nair Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abhishek S Nair — Full-Stack Developer",
    description: "Building production Web, Mobile & AI applications.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#09090b] text-[#f4f4f5] antialiased min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
