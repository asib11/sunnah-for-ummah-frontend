import type { QuickViewProduct } from "@/components/QuickViewDialog";

import _product1 from "@/assets/product-1.jpg";
const product1 = _product1.src;
import _product2 from "@/assets/product-2.jpg";
const product2 = _product2.src;
import _product3 from "@/assets/product-3.jpg";
const product3 = _product3.src;
import _product4 from "@/assets/product-4.jpg";
const product4 = _product4.src;
import _product5 from "@/assets/product-5.jpg";
const product5 = _product5.src;
import _product6 from "@/assets/product-6.jpg";
const product6 = _product6.src;
import _product7 from "@/assets/product-7.jpg";
const product7 = _product7.src;
import _product8 from "@/assets/product-8.jpg";
const product8 = _product8.src;

import _dropFront from "@/assets/calligraphy-drop-shoulder-front.png";
const dropFront = _dropFront.src;
import _dropBack from "@/assets/calligraphy-drop-shoulder-back.png";
const dropBack = _dropBack.src;
import _dropTee from "@/assets/calligraphy-drop-shoulder-tshirt.png";
const dropTee = _dropTee.src;
import _dropTeeBack from "@/assets/calligraphy-drop-shoulder-studio-back.png";
const dropTeeBack = _dropTeeBack.src;
import _muslimPair from "@/assets/muslim-tee-pair.png";
const muslimPair = _muslimPair.src;
import _muslimFB from "@/assets/muslim-tshirt-front-back.png";
const muslimFB = _muslimFB.src;
import _sabrFB from "@/assets/sabr-tshirt-front-back.png";
const sabrFB = _sabrFB.src;
import _tawakkul from "@/assets/tawakkul-tshirt.png";
const tawakkul = _tawakkul.src;
import _tawakkulBack from "@/assets/tawakkul-tshirt-back.png";
const tawakkulBack = _tawakkulBack.src;
import _timesFront from "@/assets/times-of-success-tshirt.png";
const timesFront = _timesFront.src;
import _timesBack from "@/assets/times-of-success-tshirt-back.png";
const timesBack = _timesBack.src;

import _baggyBlack from "@/assets/baggy-sweatpants-black.png";
const baggyBlack = _baggyBlack.src;
import _baggyWashed from "@/assets/baggy-sweatpants-washed.png";
const baggyWashed = _baggyWashed.src;
import _baggyWhite from "@/assets/baggy-sweatpants-white.png";
const baggyWhite = _baggyWhite.src;
import _baggyBack from "@/assets/baggy-sweatpants-back.png";
const baggyBack = _baggyBack.src;

export type ProductCategory =
  | "Drop Shoulder Tees"
  | "Baggy Sweatpants"
  | "New Arrivals";

export interface CatalogProduct extends QuickViewProduct {
  slug: string;
  category: ProductCategory;
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[—–]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const teeColors = [
  { name: "Black", hex: "#111111" },
  { name: "White", hex: "#f5f5f0" },
  { name: "Acid Wash", hex: "#b0b0b0" },
];

const pantsColors = [
  { name: "Black", hex: "#111111" },
  { name: "White", hex: "#f5f5f0" },
  { name: "Acid Wash", hex: "#b0b0b0" },
];

const drop: Omit<CatalogProduct, "slug" | "category">[] = [
  {
    name: "Calligraphy Drop Shoulder Tee",
    price: 890,
    image: dropFront,
    backImage: dropBack,
    images: [dropFront, dropBack, dropTee],
    badge: "New",
    colors: teeColors,
    description:
      "Hand-rendered Arabic calligraphy on heavyweight cotton — oversized drop shoulder cut for relaxed Sunnah-inspired wear.",
  },
  {
    name: "Calligraphy Drop Shoulder — Studio",
    price: 890,
    image: dropTee,
    backImage: dropTeeBack,
    images: [dropTee, dropTeeBack],
    colors: teeColors,
  },
  {
    name: "Muslim Tee — Pair Edition",
    price: 990,
    image: muslimPair,
    backImage: muslimFB,
    images: [muslimPair, muslimFB],
    badge: "Eid",
    colors: teeColors,
  },
  { name: "Sabr Drop Shoulder", price: 990, image: sabrFB, badge: "Bestseller", colors: teeColors },
  {
    name: "Tawakkul Drop Shoulder Tee",
    price: 990,
    image: tawakkul,
    backImage: tawakkulBack,
    images: [tawakkul, tawakkulBack],
    badge: "Eid",
    colors: teeColors,
  },
  {
    name: "Times of Success Tee",
    price: 1090,
    image: timesFront,
    backImage: timesBack,
    images: [timesFront, timesBack],
    badge: "New",
    colors: teeColors,
  },
];

const pants: Omit<CatalogProduct, "slug" | "category">[] = [
  {
    name: "Baggy Sweatpants — Black",
    price: 1490,
    image: baggyBlack,
    images: [baggyBlack, baggyBack],
    badge: "New",
    colors: pantsColors,
    description:
      "Relaxed, modest-fit sweatpants with a tapered ankle and deep pockets — built for comfort from fajr to isha.",
  },
  { name: "Baggy Sweatpants — Washed", price: 1490, originalPrice: 1790, image: baggyWashed, images: [baggyWashed, baggyBack], colors: pantsColors },
  { name: "Baggy Sweatpants — White", price: 1490, image: baggyWhite, images: [baggyWhite, baggyBack], badge: "Eid", colors: pantsColors },
  { name: "Baggy Sweatpants — Back View", price: 1490, image: baggyBack, images: [baggyBack, baggyBlack], colors: pantsColors },
];

const arrivals: Omit<CatalogProduct, "slug" | "category">[] = [
  { name: "Premium Black Embroidered Panjabi", price: 2490, image: product1, badge: "New" },
  { name: "Classic White Thobe — Premium Cotton", price: 1990, image: product2 },
  { name: "Dawah T-Shirt — Calligraphy Edition", price: 590, image: product3, badge: "New", colors: teeColors },
  { name: "Navy Blue Embroidered Panjabi", price: 2290, originalPrice: 2790, image: product4 },
  { name: "Premium Attar Perfume Oil Set", price: 1250, image: product5, badge: "Bestseller", sizes: ["6ml", "12ml", "20ml"] },
  { name: "Beige Cotton Panjabi — Classic Fit", price: 1690, originalPrice: 1990, image: product6 },
  { name: "Olive Green Chino Pants", price: 890, image: product7 },
  { name: "Solid Premium T-Shirt — Gray", price: 490, originalPrice: 590, image: product8, colors: teeColors },
];

const tag = (
  list: Omit<CatalogProduct, "slug" | "category">[],
  category: ProductCategory
): CatalogProduct[] => list.map((p) => ({ ...p, slug: slugify(p.name), category }));

export const dropShoulderProducts = tag(drop, "Drop Shoulder Tees");
export const baggyPantsProducts = tag(pants, "Baggy Sweatpants");
export const newArrivalsProducts = tag(arrivals, "New Arrivals");

export const allProducts: CatalogProduct[] = [
  ...dropShoulderProducts,
  ...baggyPantsProducts,
  ...newArrivalsProducts,
];

export const getProductBySlug = (slug: string) =>
  allProducts.find((p) => p.slug === slug);
