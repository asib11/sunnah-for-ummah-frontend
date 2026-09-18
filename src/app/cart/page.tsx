import type { Metadata } from "next";
import CartClient from "./CartClient";

export const metadata: Metadata = {
  title: "Shopping Cart | Sunnah for Ummah",
};

// Thin server component — resolves instantly so navigation is immediate.
export default function CartPage() {
  return <CartClient />;
}
