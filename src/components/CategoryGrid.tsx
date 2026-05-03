"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { storeApi } from "@/lib/api";
import catPanjabi from "@/assets/cat-panjabi.jpg";
import catThobe from "@/assets/cat-thobe.jpg";
import catTshirt from "@/assets/cat-tshirt.jpg";
import catKifaya from "@/assets/cat-kifaya.jpg";
import catAttar from "@/assets/cat-attar.jpg";
import catAccessories from "@/assets/cat-accessories.jpg";
import catWomens from "@/assets/cat-womens.jpg";

// Static fallback data while loading or if API fails
const fallbackCategories = [
  { name: "Premium Panjabi", image: catPanjabi, desc: "Handcrafted elegance" },
  { name: "Thobe", image: catThobe, desc: "Classic & refined" },
  { name: "Dawah T-Shirt", image: catTshirt, desc: "Wear your message" },
  { name: "Kifaya", image: catKifaya, desc: "Traditional headwear" },
  { name: "Women's Collection", image: catWomens, desc: "Modest & elegant" },
  { name: "Perfume Oil (Attar)", image: catAttar, desc: "Pure fragrances" },
  { name: "Accessories", image: catAccessories, desc: "Complete your look" },
];

const getImageForCategory = (handle: string, index: number) => {
  const imageMap: Record<string, any> = {
    shirts: catPanjabi,
    sweatshirts: catThobe,
    pants: catTshirt,
    merch: catAccessories,
    womens: catWomens,
    attar: catAttar,
  };
  return imageMap[handle] || fallbackCategories[index % fallbackCategories.length].image;
};

const CategoryGrid = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => storeApi.getCategories(),
  });

  // Use API categories if available, otherwise fallback
  const displayCategories = categoriesData?.product_categories?.map((cat: any, index: number) => ({
    name: cat.name,
    desc: cat.description || "View Collection",
    image: cat.metadata?.image_url ? { src: cat.metadata.image_url } : getImageForCategory(cat.handle, index),
    handle: cat.handle,
  })) || fallbackCategories;

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="font-body text-sm font-semibold tracking-[0.2em] uppercase text-accent">
            Collections
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2">
            Shop by Category
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded-full" />
        </div>

        {/* Bento-style asymmetric grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[220px]">
          {displayCategories.map((cat: any, index: number) => {
            // Unique span patterns for visual interest (repeating every 7 items)
            const spanClasses = [
              "lg:col-span-4 lg:row-span-1", // 1
              "lg:col-span-4 lg:row-span-1", // 2
              "lg:col-span-4 lg:row-span-1", // 3
              "lg:col-span-6 lg:row-span-2", // 4 - changed to 6 so it fills nicely if 4 items
              "lg:col-span-6 lg:row-span-2", // 5
              "lg:col-span-6 lg:row-span-1", // 6
              "lg:col-span-6 lg:row-span-1", // 7
            ];
            
            const currentSpan = spanClasses[index % spanClasses.length];

            const isHovered = hoveredIndex === index;
            const isSiblingHovered = hoveredIndex !== null && hoveredIndex !== index;

            return (
              <a
                key={cat.name}
                href={`/categories/${cat.handle || cat.name.toLowerCase().replace(/ /g, '-')}`}
                className={`group relative overflow-hidden rounded-2xl cursor-pointer
                  ${currentSpan}
                  transition-all duration-700 ease-out
                  ${isSiblingHovered ? "opacity-60 scale-[0.98]" : "opacity-100 scale-100"}
                  ${isHovered ? "shadow-2xl z-10" : "shadow-md"}
                `}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Background image with parallax-like zoom */}
                <img
                  src={cat.image.src}
                  alt={cat.name}
                  loading="lazy"
                  width={800}
                  height={800}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out
                    ${isHovered ? "scale-110" : "scale-100"}
                  `}
                />

                {/* Gradient overlay that shifts on hover */}
                <div
                  className={`absolute inset-0 transition-all duration-700
                    ${isHovered
                      ? "bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent"
                      : "bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent"
                    }
                  `}
                />

                {/* Decorative corner accent */}
                <div
                  className={`absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-accent/0 transition-all duration-500
                    ${isHovered ? "border-accent/80 scale-100" : "scale-75"}
                  `}
                />
                <div
                  className={`absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-accent/0 transition-all duration-500
                    ${isHovered ? "border-accent/80 scale-100" : "scale-75"}
                  `}
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                  <div className="overflow-hidden">
                    <span
                      className={`block font-body text-xs tracking-[0.15em] uppercase text-accent transition-all duration-500
                        ${isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
                      `}
                    >
                      {cat.desc}
                    </span>
                  </div>
                  <h3
                    className={`font-display text-lg md:text-xl lg:text-2xl font-bold text-primary-foreground transition-transform duration-500
                      ${isHovered ? "translate-y-0" : "translate-y-1"}
                    `}
                  >
                    {cat.name}
                  </h3>
                  <div
                    className={`h-0.5 bg-accent mt-2 transition-all duration-500 origin-left
                      ${isHovered ? "w-12" : "w-0"}
                    `}
                  />
                </div>

                {/* Explore indicator */}
                <div
                  className={`absolute top-4 left-4 flex items-center gap-2 transition-all duration-500
                    ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}
                  `}
                >
                  <span className="font-body text-xs font-medium text-primary-foreground/80 tracking-wider uppercase">
                    Explore
                  </span>
                  <svg
                    className="w-4 h-4 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
