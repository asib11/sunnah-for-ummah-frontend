import type { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout | Sunnah for Ummah",
};

// Thin server component — resolves instantly so navigation is immediate.
export default function CheckoutPage() {
  return <CheckoutClient />;
}
