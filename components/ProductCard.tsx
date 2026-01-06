"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { useAuthStore, useAppStore } from "@/store";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface ProductImage {
  image: string;
}

interface VariationColor {
  color_id: number;
  color_name: string;
  color_images: string[];
  status: boolean;
  sizes: Array<{
    size_id: number;
    variation_product_id: number;
    size_name: string;
    status: boolean;
    price: number;
  }>;
}

interface Product {
  id: string;
  name: string;
  product_images: ProductImage[];
  variations_exist: boolean;
  variation_colors: VariationColor[];
  sale_price: number;
  mrp: number;
  new: boolean;
  discount: number;
  out_of_stock: boolean;
  slug: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState<VariationColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { isAuthenticated, token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Reset selections when product changes
    setSelectedColor(null);
    setSelectedSize(null);
  }, [product.id]);

  useEffect(() => {
    const card = cardRef.current;
    const image = imageRef.current;
    const overlay = overlayRef.current;

    if (!card || !image || !overlay) return;

    const handleMouseEnter = () => {
      gsap.to(image, {
        y: -140,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(image, {
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!selectedColor || !selectedSize) return;

    const selectedVariation = selectedColor.sizes.find((s) => s.size_name === selectedSize);
    const { setLastPurchasedProduct } = useAppStore.getState();

    // Store product details for success page
    setLastPurchasedProduct({
      name: product.name,
      image: selectedColor.color_images[0] || product.product_images[0]?.image,
      price: selectedVariation?.price || product.sale_price,
      originalPrice: product.mrp,
      size: selectedSize,
      productId: product.id,
    });

    try {
      const result = await api.purchaseProduct(product.id, selectedVariation?.variation_product_id.toString(), token!);

      if (result.order) {
        router.push(`/success`);
      }
    } catch (error) {}
  };

  const mainImage =
    selectedColor?.color_images?.[0] ||
    product.variation_colors?.[0]?.color_images?.[0] ||
    product.product_images?.[0]?.image;
  const gradientColors = selectedColor ? [selectedColor] : product.variation_colors?.slice(0, 2) || [];
  const canBuyNow = selectedColor && selectedSize;

  return (
    <div ref={cardRef} className="w-[312px] h-[405px] bg-gray-900 rounded-lg overflow-hidden cursor-pointer relative">
      <div
        className=""
        style={{
          background:
            gradientColors.length >= 2
              ? `linear-gradient(135deg, ${gradientColors[0].color_name.toLowerCase()}, ${gradientColors[1].color_name.toLowerCase()})`
              : gradientColors.length === 1
              ? gradientColors[0].color_name.toLowerCase()
              : "#6B7280",
        }}
      >
        {mainImage && (
          <img ref={imageRef} src={mainImage} alt={product.name} className="w-full h-[405px] object-cover" />
        )}

        {/* Hover Overlay */}
        <div
          ref={overlayRef}
          className="absolute bottom-0 left-0 right-0 h-[140px] bg-black bg-opacity-80 px-3 py-4 opacity-0 flex flex-col justify-between"
        >
          <div className="space-y-1">
            {selectedColor && (
              <div>
                <p className="text-gray-400 text-[10px] mb-1">SIZE:</p>
                <div className="flex gap-1">
                  {selectedColor?.sizes.map((size) => (
                    <button
                      key={`${product.id}-${size.size_id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSize(size.size_name);
                      }}
                      className={`px-1.5 py-0.5 text-[10px] border rounded ${
                        selectedSize === size.size_name
                          ? "border-white text-black bg-white"
                          : "border-gray-600 text-gray-400"
                      }`}
                    >
                      {size.size_name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-gray-400 text-[10px] mb-1">COLOR:</p>
              <div className="flex gap-1">
                {product.variation_colors.map((color) => (
                  <button
                    key={`${product.id}-${color.color_id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColor(color);
                      setSelectedSize(null);
                    }}
                    className={`w-3 h-3 rounded-full border-2 ${
                      selectedColor?.color_id === color.color_id ? "border-white" : "border-gray-600"
                    }`}
                    style={{ backgroundColor: color.color_name.toLowerCase() }}
                  />
                ))}
              </div>
            </div>
          </div>

          {canBuyNow && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleBuyNow();
              }}
              className="w-full bg-white text-black py-1.5 px-4 rounded font-semibold hover:bg-gray-200 transition-colors text-xs"
            >
              Buy Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
