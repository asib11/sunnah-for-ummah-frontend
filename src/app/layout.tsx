import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Sunnah for Ummah - Islamic Clothing & Accessories",
  description:
    "Premium Islamic clothing, panjabi, thobe, dawah t-shirts, attar perfume oil and accessories. Spread Dawah, Look Good.",
  authors: [{ name: "Sunnah for Ummah" }],
  openGraph: {
    type: "website",
    title: "Sunnah for Ummah - Islamic Clothing & Accessories",
    description:
      "Premium Islamic clothing, panjabi, thobe, dawah t-shirts, attar perfume oil and accessories. Spread Dawah, Look Good.",
    images: [
      "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b8a166aa-7f5d-4cff-94db-5009b3fca578/id-preview-51381367--bd6f50da-65b0-43ff-8950-9079266c7d11.lovable.app-1774926021468.png",
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Lovable",
    title: "Sunnah for Ummah - Islamic Clothing & Accessories",
    description:
      "Premium Islamic clothing, panjabi, thobe, dawah t-shirts, attar perfume oil and accessories. Spread Dawah, Look Good.",
    images: [
      "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b8a166aa-7f5d-4cff-94db-5009b3fca578/id-preview-51381367--bd6f50da-65b0-43ff-8950-9079266c7d11.lovable.app-1774926021468.png",
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&family=Noto+Sans+Bengali:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
