import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
}

const ProductCard = ({ name, price, originalPrice, image, badge }: ProductCardProps) => {
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  return (
    <div className="group relative bg-card rounded-xl overflow-hidden border border-border hover:shadow-[var(--shadow-hover)] transition-shadow duration-300">
      {/* Badge */}
      {badge && (
        <span className="absolute top-3 left-3 z-10 bg-accent text-accent-foreground text-xs font-body font-semibold px-2.5 py-1 rounded-full">
          {badge}
        </span>
      )}
      {discount && (
        <span className="absolute top-3 right-3 z-10 bg-destructive text-destructive-foreground text-xs font-body font-semibold px-2.5 py-1 rounded-full">
          {discount}% OFF
        </span>
      )}

      {/* Image */}
      <div className="aspect-[4/5] overflow-hidden">
        <img
          src={image}
          alt={name}
          loading="lazy"
          width={640}
          height={800}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-body text-sm font-medium text-foreground line-clamp-2 mb-2 min-h-[2.5rem]">
          {name}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-body font-bold text-primary text-lg">৳ {price}</span>
            {originalPrice && (
              <span className="font-body text-sm text-muted-foreground line-through">
                ৳ {originalPrice}
              </span>
            )}
          </div>
          <button className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-emerald-light transition-colors">
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
