import type { Metadata } from "next";
import EidCollectionClient from "./EidCollectionClient";

export const metadata: Metadata = {
  title: "Eid Collection 1447 | Sunnah for Ummah",
  description:
    "Drop shoulder calligraphy tees, baggy sweatpants and our newest arrivals — crafted for Eid 1447.",
};

// Thin server component — resolves instantly so navigation is immediate.
// All data fetching happens client-side inside EidCollectionClient with skeletons.
export default function EidCollectionPage() {
  return <EidCollectionClient />;
}
