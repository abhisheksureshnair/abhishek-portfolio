import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#030508",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Abhishek S Nair | Software Developer",
  description:
    "Software Developer focused on building modern web, mobile, desktop and AI-powered applications with a focus on practical product development, real-time systems and clean user experiences.",
  keywords: [
    "Abhishek S Nair",
    "Software Developer",
    "Full-Stack Development",
    "Web Applications",
    "React.js",
    "React Native",
    "Flutter",
    "Node.js",
    "MongoDB",
    "Socket.IO",
    "AI Applications",
    "Software Engineer Portfolio"
  ],
  authors: [{ name: "Abhishek S Nair", url: "https://github.com/abhisheksureshnair" }],
  creator: "Abhishek S Nair",
  metadataBase: new URL("https://github.com/abhisheksureshnair"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Abhishek S Nair | Software Developer",
    description:
      "Software Developer focused on building modern web, mobile, desktop and AI-powered applications.",
    url: "https://github.com/abhisheksureshnair",
    siteName: "Abhishek S Nair Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/profile.webp",
        width: 1200,
        height: 630,
        alt: "Abhishek S Nair — Software Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abhishek S Nair | Software Developer",
    description:
      "Software Developer focused on building modern web, mobile, desktop and AI-powered applications.",
    images: ["/profile.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Abhishek S Nair",
    alternateName: "ASN",
    jobTitle: "Software Developer",
    description:
      "Software Developer focused on building modern web, mobile, desktop and AI-powered applications with a focus on practical product development, real-time systems and clean user experiences.",
    url: "https://github.com/abhisheksureshnair",
    sameAs: [
      "https://github.com/abhisheksureshnair",
      "https://www.linkedin.com/in/abhisheksnair",
    ],
    knowsAbout: [
      "Software Development",
      "Full Stack Development",
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "React Native",
      "Flutter",
      "Socket.IO",
      "WebSockets",
      "AI / LLM Integration",
      "Electron.js",
      "REST APIs"
    ],
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Manipal University Jaipur",
      },
      {
        "@type": "CollegeOrUniversity",
        name: "Mannam Memorial NSS College",
      },
    ],
    worksFor: {
      "@type": "Organization",
      name: "InnSpark Solutions Pvt. Ltd.",
    },
  };

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className="bg-[#030508] text-[#f8fafc] antialiased min-h-screen selection:bg-indigo-500/30 selection:text-white"
        suppressHydrationWarning
      >
        <script
          id="structured-data-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
