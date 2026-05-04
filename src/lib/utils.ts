import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getProductPrices(product: any) {
  if (!product) return { price: 0, oldPrice: null };
  
  const firstVariant = product?.variants?.[0];
  let price = 0;
  let oldPrice = product?.metadata?.oldPrice ? Number(product.metadata.oldPrice) : null;

  if (firstVariant?.prices?.length) {
    const bdtPrices = firstVariant.prices
      .filter((p: any) => p.currency_code === "bdt")
      .map((p: any) => p.amount)
      .sort((a: number, b: number) => a - b);

    if (bdtPrices.length >= 2) {
      price = bdtPrices[0];
      oldPrice = bdtPrices[bdtPrices.length - 1];
    } else {
      price = bdtPrices[0] ?? firstVariant.prices[0]?.amount ?? 0;
    }
  } else {
    price = product?.metadata?.price ? Number(product.metadata.price) : 0;
  }

  return { price, oldPrice };
}
