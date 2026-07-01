import type { Metadata } from "next";
import HijabClient from "./HijabClient";

export const metadata: Metadata = {
  title: "Hijab Collection | Sunnah for Ummah",
  description: "Premium chiffon and everyday hijabs - elegant, lightweight, and comfortable modest wear for women.",
};

export default function Page() {
  return <HijabClient />;
}
