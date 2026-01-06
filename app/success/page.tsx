"use client";

import { useAppStore } from "@/store";
export default function SuccessPage() {
  const { lastPurchasedProduct } = useAppStore();
  const formatDate = () => {
    const now = new Date();
    return now.toLocaleString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-nike-black flex items-center justify-center">
      <div className="text-center">
        <img
          src="/images/nike-logo.svg"
          alt="Nike"
          className="nike-logo mx-auto mb-8"
          style={{ width: "106.28px", height: "56px" }}
        />

        <h1 className="text-3xl font-bold text-white mb-4">Successfully Ordered!</h1>
        <p className="text-gray-400 mb-8">{formatDate()}</p>

        <div className="bg-gray-900 rounded-lg p-6 max-w-md mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg flex items-center justify-center">
              <img
                src={lastPurchasedProduct?.image}
                alt={lastPurchasedProduct?.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-white font-semibold">{lastPurchasedProduct?.name}</h3>
              <p className="text-gray-400 text-sm">
                {lastPurchasedProduct?.size} | {lastPurchasedProduct?.productId}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">₹{lastPurchasedProduct?.price}</p>
              {lastPurchasedProduct?.originalPrice &&
                lastPurchasedProduct.originalPrice > lastPurchasedProduct.price && (
                  <p className="text-gray-400 text-sm line-through">₹{lastPurchasedProduct.originalPrice}</p>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
