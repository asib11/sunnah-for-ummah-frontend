import type { Metadata } from "next";
import NiqabClient from "./NiqabClient";

export const metadata: Metadata = {
  title: "Niqab Collection | Sunnah for Ummah",
  description: "Premium and elegant niqabs - soft, breathable, and designed for comfortable modest wear.",
};

export default function Page() {
  return <NiqabClient />;
}
