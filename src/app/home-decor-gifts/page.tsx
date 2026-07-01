import type { Metadata } from "next";
import HomeDecorGiftsClient from "./HomeDecorGiftsClient";

export const metadata: Metadata = {
  title: "Home Decor & Gifts | Sunnah for Ummah",
  description: "Exquisite Islamic home decor and premium gift items - Quran stands, calligraphy plaques, prayer mats and Islamic lifestyle essentials.",
};

export default function Page() {
  return <HomeDecorGiftsClient />;
}
