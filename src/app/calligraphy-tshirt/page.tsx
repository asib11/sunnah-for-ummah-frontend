import type { Metadata } from "next";
import CalligraphyTshirtClient from "./CalligraphyTshirtClient";

export const metadata: Metadata = {
  title: "Calligraphy T-Shirt | Sunnah for Ummah",
  description: "Premium calligraphy t-shirts with Arabic script designs - modest, comfortable and stylish Islamic wear.",
};

export default function Page() {
  return <CalligraphyTshirtClient />;
}
