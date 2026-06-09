import { useCallback, useEffect, useRef, useState } from "react";
import { ShoppingCart, Check, ZoomIn, ZoomOut, X, ChevronLeft, ChevronRight, Maximize2, RotateCcw, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

export interface QuickViewProduct {
  id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  backImage?: string;
  images?: string[];
  badge?: string;
  description?: string;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  slug?: string;
  variantId?: string;
  variants?: any[];
}

interface Props {
  product: QuickViewProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DEFAULT_SIZES = ["S", "M", "L", "XL", "XXL"];

const QuickViewDialog = ({ product, open, onOpenChange }: Props) => {
  const { addToCart, isAdding } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [colorIdx, setColorIdx] = useState(0);

  // Inline hover-pan zoom
  const [hoverZoom, setHoverZoom] = useState(false);
  const [origin, setOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  // Lightbox
  const [lightbox, setLightbox] = useState(false);
  const [lbZoom, setLbZoom] = useState(1);
  const [lbPan, setLbPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null);

  useEffect(() => {
    if (product) {
      setActiveImage(0);
      setSize(null);
      setColorIdx(0);
      setHoverZoom(false);
    }
  }, [product]);

  const resetLightbox = useCallback(() => {
    setLbZoom(1);
    setLbPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (!lightbox) resetLightbox();
  }, [lightbox, resetLightbox]);

  if (!product) return null;

  const gallery =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];
  const sizes = product.sizes ?? DEFAULT_SIZES;
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : null;

  const goPrev = () => setActiveImage((i) => (i - 1 + gallery.length) % gallery.length);
  const goNext = () => setActiveImage((i) => (i + 1) % gallery.length);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hoverZoom) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x, y });
  };

  const handleAddToCart = () => {
    if (!product) return;

    let selectedVariantId = product.variantId;

    // If the product has multiple variants, resolve by selected size
    if (product.variants && product.variants.length > 0) {
      if (!size) {
        toast.error("Please select a size first.");
        return;
      }
      const match = product.variants.find((v) =>
        v.title?.toLowerCase() === size.toLowerCase() ||
        v.options?.some((opt: any) => opt.value?.toLowerCase() === size.toLowerCase())
      );
      if (match) {
        selectedVariantId = match.id;
      } else {
        toast.error("Selected size is not available. Please choose another.");
        return;
      }
    }

    if (!selectedVariantId) {
      toast.error("This product is not yet available for online purchase.");
      return;
    }

    addToCart(
      { variantId: selectedVariantId, quantity: 1 },
      {
        onSuccess: () => {
          toast.success(`${product.name} added to cart!`);
          onOpenChange(false);
          window.dispatchEvent(new CustomEvent("open-cart"));
        },
        onError: () => {
          toast.error("Failed to add to cart. Please try again.");
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card border-emerald-tint/60">
        <div className="grid md:grid-cols-2">
          {/* Gallery */}
          <div className="relative bg-emerald-tint/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(var(--emerald-tint-deep)/0.30),_transparent_70%)] pointer-events-none" />
            {product.badge && (
              <span className="absolute top-3 left-3 z-10 bg-accent text-accent-foreground text-xs font-body font-semibold px-2.5 py-1 rounded-full">
                {product.badge}
              </span>
            )}
            {discount && (
              <span className="absolute top-3 right-12 z-10 bg-destructive text-destructive-foreground text-xs font-body font-semibold px-2.5 py-1 rounded-full">
                {discount}% OFF
              </span>
            )}

            <div className="absolute bottom-[5.5rem] right-3 z-10 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setHoverZoom((v) => !v)}
                className={`h-9 w-9 rounded-full flex items-center justify-center backdrop-blur border transition ${
                  hoverZoom
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background/80 text-foreground border-emerald-tint hover:bg-background"
                }`}
                aria-label={hoverZoom ? "Disable hover zoom" : "Enable hover zoom"}
                title={hoverZoom ? "Disable hover zoom" : "Hover to zoom"}
              >
                {hoverZoom ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setLightbox(true)}
                className="h-9 w-9 rounded-full flex items-center justify-center bg-background/80 backdrop-blur border border-emerald-tint text-foreground hover:bg-background transition"
                aria-label="Open lightbox"
                title="Fullscreen view"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            <div
              className={`aspect-[4/5] w-full overflow-hidden ${hoverZoom ? "cursor-zoom-out" : "cursor-zoom-in"}`}
              onMouseMove={handleMove}
              onMouseLeave={() => setOrigin({ x: 50, y: 50 })}
              onClick={() => (hoverZoom ? setLightbox(true) : setHoverZoom(true))}
            >
              <img
                src={gallery[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-200 ease-out"
                style={{
                  transform: hoverZoom ? "scale(2.25)" : "scale(1)",
                  transformOrigin: `${origin.x}% ${origin.y}%`,
                }}
                draggable={false}
              />
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-2 p-3 bg-background/40 backdrop-blur-sm border-t border-emerald-tint/40">
                {gallery.map((src, i) => (
                  <button
                    key={src + i}
                    onClick={() => setActiveImage(i)}
                    className={`h-14 w-14 rounded-md overflow-hidden border-2 transition ${
                      i === activeImage
                        ? "border-accent"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 md:p-8 flex flex-col">
            <span className="uppercase tracking-[0.35em] text-[10px] font-body font-semibold text-emerald-light mb-2">
              Sunnah For Ummah
            </span>
            <DialogTitle className="font-display text-2xl md:text-3xl font-bold text-foreground leading-snug">
              {product.name}
            </DialogTitle>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-body font-bold text-primary text-2xl">
                ৳ {product.price}
              </span>
              {product.originalPrice && (
                <span className="font-body text-base text-muted-foreground line-through">
                  ৳ {product.originalPrice}
                </span>
              )}
            </div>

            <DialogDescription className="mt-4 font-body text-sm text-muted-foreground">
              {product.description ??
                "Crafted with premium fabric and modest tailoring — designed for everyday Sunnah-inspired wear."}
            </DialogDescription>

            {product.colors && product.colors.length > 0 && (
              <div className="mt-5">
                <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Color · <span className="text-foreground">{product.colors[colorIdx].name}</span>
                </p>
                <div className="flex gap-2">
                  {product.colors.map((c, i) => (
                    <button
                      key={c.name}
                      onClick={() => setColorIdx(i)}
                      aria-label={c.name}
                      className={`h-8 w-8 rounded-full border-2 transition ${
                        i === colorIdx
                          ? "border-accent ring-2 ring-accent/30"
                          : "border-emerald-tint"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5">
              <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Size
              </p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-[2.75rem] px-3 py-2 rounded-md border font-body text-sm transition ${
                      size === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-emerald-tint hover:border-emerald-tint-deep text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-6 flex items-center gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!size || isAdding}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-body font-semibold py-3 rounded-full hover:bg-emerald-light transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : (size ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />)}
                {isAdding ? "Adding..." : (size ? `Add ${size} to Cart` : "Select a size")}
              </button>
            </div>

            <p className="mt-3 font-body text-[11px] uppercase tracking-[0.3em] text-emerald-light text-center">
              Cash on Delivery · Free shipping over ৳ 2000
            </p>
            {product.slug && (
              <Link
                href={`/product/${product.slug}`}
                className="mt-2 font-body text-xs text-center text-primary hover:underline"
              >
                View full product page →
              </Link>
            )}
          </div>
        </div>
      </DialogContent>

      {lightbox && (
        <div
          className="fixed inset-0 z-[80] bg-black/95 flex items-center justify-center"
          role="dialog"
          aria-label="Image viewer"
          onClick={() => setLightbox(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setLightbox(false);
            if (e.key === "ArrowLeft") goPrev();
            if (e.key === "ArrowRight") goNext();
          }}
          tabIndex={-1}
        >
          <div
            className="absolute top-4 right-4 flex items-center gap-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLbZoom((z) => Math.max(1, +(z - 0.5).toFixed(2)))}
              className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="font-body text-xs text-white/80 tabular-nums w-12 text-center">
              {Math.round(lbZoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setLbZoom((z) => Math.min(5, +(z + 0.5).toFixed(2)))}
              className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={resetLightbox}
              className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur"
              aria-label="Reset zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setLightbox(false)}
              className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  resetLightbox();
                  goPrev();
                }}
                className="absolute left-4 md:left-8 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  resetLightbox();
                  goNext();
                }}
                className="absolute right-4 md:right-8 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            className="relative max-w-[92vw] max-h-[88vh] overflow-hidden select-none"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => {
              e.preventDefault();
              setLbZoom((z) => Math.min(5, Math.max(1, +(z - e.deltaY * 0.002).toFixed(2))));
            }}
            onDoubleClick={() => {
              setLbZoom((z) => (z === 1 ? 2 : 1));
              setLbPan({ x: 0, y: 0 });
            }}
            onMouseDown={(e) => {
              if (lbZoom === 1) return;
              dragRef.current = {
                startX: e.clientX,
                startY: e.clientY,
                baseX: lbPan.x,
                baseY: lbPan.y,
              };
            }}
            onMouseMove={(e) => {
              if (!dragRef.current) return;
              setLbPan({
                x: dragRef.current.baseX + (e.clientX - dragRef.current.startX),
                y: dragRef.current.baseY + (e.clientY - dragRef.current.startY),
              });
            }}
            onMouseUp={() => (dragRef.current = null)}
            onMouseLeave={() => (dragRef.current = null)}
            style={{ cursor: lbZoom > 1 ? (dragRef.current ? "grabbing" : "grab") : "zoom-in" }}
          >
            <img
              src={gallery[activeImage]}
              alt={product.name}
              draggable={false}
              className="max-w-[92vw] max-h-[88vh] object-contain transition-transform duration-150"
              style={{
                transform: `translate(${lbPan.x}px, ${lbPan.y}px) scale(${lbZoom})`,
              }}
            />
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/70 font-body text-xs">
            {gallery.length > 1 && (
              <span className="tabular-nums">
                {activeImage + 1} / {gallery.length}
              </span>
            )}
            <span className="uppercase tracking-[0.3em] text-[10px]">
              Scroll · Double-click · Drag to pan
            </span>
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default QuickViewDialog;
