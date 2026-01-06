"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useAppStore } from "@/store";
import { api, type UserOrdersResponse } from "@/lib/api";

interface Order {
  order_id: string;
  product_amount: number;
  product_name: string;
  product_image: string;
  created_date: string;
  product_mrp: number;
}

export default function ProfilePage() {
  const { isAuthenticated, token } = useAuthStore();
  const { orders, setOrders } = useAppStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const result: UserOrdersResponse = await api.getUserOrders(token!);
        setOrders(result.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, token, router, setOrders]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-nike-black py-8">
      <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">My Orders</h1>
        </div>

        {loading ? (
          <div className="text-center text-gray-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-400">No orders found</div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: Order) => (
              <div key={order.order_id} className="bg-gray-900 rounded-lg p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0">
                    <img
                      src={order.product_image}
                      alt={order.product_name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">{order.product_name}</h3>
                    <p className="text-gray-400 text-sm">{order.created_date}</p>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <p className="text-white font-semibold">₹{order.product_amount}</p>
                    <p className="text-gray-400 text-sm line-through">₹{order.product_mrp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
