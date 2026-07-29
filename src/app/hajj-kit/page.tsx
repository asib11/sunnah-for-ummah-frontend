import type { Metadata } from "next";
import HajjKitClient from "./HajjKitClient";

export const metadata: Metadata = {
  title: "Interactive Hajj Kit Builder | Sunnah for Ummah",
  description:
    "Build your custom Hajj kit — select exactly what you need for your blessed journey. Quality-assured essentials for men and women.",
};

// Thin server component — resolves instantly so navigation is immediate.
// All data fetching happens client-side inside HajjKitClient with skeletons.
export default function HajjKitPage() {
  return <HajjKitClient />;
}
