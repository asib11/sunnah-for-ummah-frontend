import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eid Collection 1447 — Limited Drop | Sunnah for Ummah",
  description: "Eid 1447 limited drop: calligraphy tees, drop-shoulder panjabi, baggy sweatpants and more. Exclusive Eid styles in premium fabrics.",
};

export default function EidCollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
