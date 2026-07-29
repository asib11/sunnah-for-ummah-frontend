import type { Metadata } from "next";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = {
  title: "My Account | Sunnah for Ummah",
};

// Thin server component — resolves instantly so navigation is immediate.
export default function ProfilePage() {
  return <ProfileClient />;
}
