import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { SmoothScrollProvider } from "@/components/smooth-scroll";
import { CartDrawer } from "@/components/CartDrawer";
import { PageTracker } from "@/components/PageTracker";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const LOGO_CDN = "https://res.cloudinary.com/mhkmpeii/image/upload/v1785468127/Sunnah_For_Ummah_Logo_-_fnl_ux0oyy.png";

export const metadata: Metadata = {
  title: "Sunnah for Ummah - Islamic Clothing & Accessories",
  description:
    "Premium Islamic clothing, panjabi, thobe, dawah t-shirts, attar perfume oil and accessories. Spread Dawah, Look Good.",
  authors: [{ name: "Sunnah for Ummah" }],
  icons: {
    icon: LOGO_CDN,
    shortcut: LOGO_CDN,
    apple: LOGO_CDN,
  },
  openGraph: {
    type: "website",
    title: "Sunnah for Ummah - Islamic Clothing & Accessories",
    description:
      "Premium Islamic clothing, panjabi, thobe, dawah t-shirts, attar perfume oil and accessories. Spread Dawah, Look Good.",
    images: [LOGO_CDN],
  },
  twitter: {
    card: "summary_large_image",
    site: "@sunnahforummah",
    title: "Sunnah for Ummah - Islamic Clothing & Accessories",
    description:
      "Premium Islamic clothing, panjabi, thobe, dawah t-shirts, attar perfume oil and accessories. Spread Dawah, Look Good.",
    images: [LOGO_CDN],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <PageTracker />
          <SmoothScrollProvider />
          <Toaster />
          <Sonner />
          <CartDrawer />
          {children}
        </Providers>
      </body>
    </html>
  );
}
