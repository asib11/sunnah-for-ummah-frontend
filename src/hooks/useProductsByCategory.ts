"use client";

import { useQuery } from "@tanstack/react-query";
import { storeApi } from "@/lib/api";
import type { QuickViewProduct } from "@/components/QuickViewDialog";

/**
 * A Medusa product variant as returned by the store API.
 */
interface MedusaVariant {
  id: string;
  title: string;
  options?: { value: string }[];
  prices?: { amount: number; currency_code: string }[];
}

/**
 * A Medusa product as returned by the store API.
 */
interface MedusaProduct {
  id: string;
  title: string;
  handle: string;
  subtitle?: string;
  description?: string;
  thumbnail?: string;
  images?: { url: string }[];
  variants?: MedusaVariant[];
}

/**
 * Maps a single Medusa product to the QuickViewProduct shape expected by
 * ProductCard and QuickViewDialog.
 *
 * - If the product has only ONE variant, `variantId` is set directly (enables
 *   one-click add-to-cart).
 * - If the product has MULTIPLE variants, `variants` is set so QuickViewDialog
 *   can resolve the correct variant after the user picks a size.
 * - Falls back to the provided `staticFallback` image when no thumbnail exists.
 */
function medusaProductToQuickView(
  product: MedusaProduct,
  staticFallback?: Partial<QuickViewProduct>
): QuickViewProduct {
  const variants = product.variants ?? [];

  // Collect size labels from variants
  const sizes = variants
    .map((v) => {
      const sizeOpt = v.options?.find((o) =>
        ["s", "m", "l", "xl", "xxl", "size"].some((k) =>
          o.value?.toLowerCase().includes(k)
        )
      );
      return sizeOpt?.value ?? v.title;
    })
    .filter(Boolean);

  const gallery: string[] = [];
  if (product.images && product.images.length > 0) {
    gallery.push(...product.images.map((i) => i.url));
  } else if (product.thumbnail) {
    gallery.push(product.thumbnail);
  }

  const image = gallery[0] ?? staticFallback?.image ?? "";
  const backImage = gallery[1] ?? staticFallback?.backImage;

  // Prefer the BDT price; fall back to the first available price in paisa→taka
  const lowestVariant = variants[0];
  let price = staticFallback?.price ?? 0;
  let originalPrice = staticFallback?.originalPrice;

  if (lowestVariant?.prices) {
    const bdtPrices = lowestVariant.prices.filter(
      (p) => p.currency_code === "bdt"
    );
    if (bdtPrices.length > 0) {
      const amounts = bdtPrices.map((p) => p.amount);
      const minPrice = Math.min(...amounts);
      const maxPrice = Math.max(...amounts);
      price = minPrice;
      if (maxPrice > minPrice) {
        originalPrice = maxPrice;
      }
    }
  }

  return {
    id: product.id,
    name: product.title,
    price,
    description:
      product.description ?? product.subtitle ?? staticFallback?.description,
    image,
    backImage,
    images: gallery.length > 0 ? gallery : staticFallback?.images,
    sizes: sizes.length > 0 ? sizes : staticFallback?.sizes,
    slug: product.handle,
    handle: product.handle,
    // Single variant → one-click add-to-cart; multi-variant → let dialog pick
    variantId: variants.length === 1 ? variants[0].id : undefined,
    variants: variants.length > 1 ? variants : undefined,
    // Carry through static extras
    badge: staticFallback?.badge,
    originalPrice,
    colors: staticFallback?.colors,
  };
}

/**
 * Fetches all products in a Medusa category (by handle) and converts them to
 * QuickViewProduct objects with real variant IDs.
 *
 * @param categoryHandle  The Medusa category handle (e.g. "calligraphy-drop-shoulder-tees")
 * @param staticFallbacks Optional map of product handle → static fallback data
 *                        (images, badge, colors) to supplement the API response.
 */
export function useProductsByCategory(
  categoryHandle: string,
  staticFallbacks?: Record<string, Partial<QuickViewProduct>>
) {
  return useQuery<QuickViewProduct[]>({
    queryKey: ["products-by-category", categoryHandle],
    queryFn: async () => {
      const data = await storeApi.getProductsByCategoryHandle(categoryHandle);
      const medusaProducts: MedusaProduct[] = data.products ?? [];
      return medusaProducts.map((p) =>
        medusaProductToQuickView(p, staticFallbacks?.[p.handle] ?? {})
      );
    },
    staleTime: 5 * 60 * 1000, // cache for 5 min
  });
}
