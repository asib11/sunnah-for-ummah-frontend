"use client";

import { useState, useEffect, useCallback } from "react";
import ProductCard from "./ProductCard";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import product7 from "@/assets/product-7.jpg";
import product8 from "@/assets/product-8.jpg";

const products = [
  { name: "Premium Black Embroidered Panjabi", price: 2490, image: product1.src, badge: "New" as const },
  { name: "Classic White Thobe - Premium Cotton", price: 1990, image: product2.src },
  { name: "Dawah T-Shirt - Calligraphy Edition", price: 590, image: product3.src, badge: "New" as const },
  { name: "Navy Blue Embroidered Panjabi", price: 2290, originalPrice: 2790, image: product4.src },
  { name: "Premium Attar Perfume Oil Set", price: 1250, image: product5.src, badge: "Bestseller" as const },
  { name: "Beige Cotton Panjabi - Classic Fit", price: 1690, originalPrice: 1990, image: product6.src },
  { name: "Olive Green Chino Pants", price: 890, image: product7.src },
  { name: "Solid Premium T-Shirt - Gray", price: 490, originalPrice: 590, image: product8.src },
];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const NewArrivals = () => {
  const [displayProducts, setDisplayProducts] = useState(products);

  const shuffle = useCallback(() => {
    setDisplayProducts(prev => {
      const shuffled = [...prev];
      // Shuffle only images among the products
      const images = shuffled.map(p => p.image);
      for (let i = images.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [images[i], images[j]] = [images[j], images[i]];
      }
      return shuffled.map((p, idx) => ({ ...p, image: images[idx] }));
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(shuffle, 3000);
    return () => clearInterval(interval);
  }, [shuffle]);

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          New Arrivals
        </h2>
        <a
          href="#"
          className="font-body text-sm font-medium text-primary hover:text-emerald-light transition-colors underline underline-offset-4"
        >
          View All
        </a>
      </div>
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {displayProducts.map((product, i) => (
          <ProductCard key={product.name} {...product} />
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;
