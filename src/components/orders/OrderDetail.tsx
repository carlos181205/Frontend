"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Order } from "@/types";
import { Calendar, User, ShoppingCart, ArrowLeft, Edit, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function OrderDetail({ orderId }: { orderId: number }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchOrder() {
      try {
        const data = await api.getOrderById(orderId);
        setOrder(data);
      } catch (error) {
        console.error("Error loading order:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Pedido no encontrado</h2>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Pedidos
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Action Bar */}
      <div className="flex items-center justify-between bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-4 rounded-2xl shadow-xl shadow-indigo-500/5 dark:shadow-none border border-white/20 dark:border-white/5">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </button>
        <Link
          href={`/orders/${orderId}/edit`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <Edit className="w-4 h-4 mr-2" />
          Editar Pedido
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Details (2 columns) */}
        <div className="md:col-span-2 space-y-6">
          {/* Order Header Info */}
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-6 rounded-2xl shadow-xl shadow-indigo-500/5 dark:shadow-none border border-white/20 dark:border-white/5">
            <div className="flex justify-between items-start mb-6 border-b border-gray-100 dark:border-zinc-800 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  Pedido #{order.orderNumber}
                </h2>
                <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-zinc-400">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  {new Date(order.orderDate).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Completado
                </span>
              </div>
            </div>

            {/* Items List */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2 text-indigo-500" />
                Ítems del Pedido
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-zinc-400">
                        Producto
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-zinc-400">
                        Precio Unit.
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-zinc-400">
                        Cantidad
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-zinc-400">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                    {order.items?.map((item, index) => (
                      <tr key={item.id || index} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.product?.productName || `Producto ID: ${item.productId}`}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-zinc-400">
                          ${item.unitPrice?.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-zinc-400">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info (1 column) */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-6 rounded-2xl shadow-xl shadow-indigo-500/5 dark:shadow-none border border-white/20 dark:border-white/5">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-indigo-500" />
              Información del Cliente
            </h3>
            {order.customer ? (
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {order.customer.firstName} {order.customer.lastName}
                  </div>
                </div>
                <div className="flex items-start text-sm text-gray-500 dark:text-zinc-400">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                  <span>
                    {order.customer.city}, {order.customer.country}
                  </span>
                </div>
                {order.customer.phone && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-zinc-400">
                    <Phone className="w-4 h-4 mr-2 shrink-0" />
                    <span>{order.customer.phone}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-zinc-400">
                Cliente no especificado
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-6 rounded-2xl shadow-xl shadow-indigo-500/5 dark:shadow-none border border-white/20 dark:border-white/5">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Resumen</h3>
            <div className="space-y-3 mb-4 text-sm text-gray-500 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal ({order.items?.length || 0} ítems)</span>
                <span>${order.totalAmount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Impuestos / Envío</span>
                <span>$0.00</span>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-zinc-800 pt-4 flex justify-between items-center">
              <span className="text-base font-medium text-gray-900 dark:text-white">Total</span>
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                ${order.totalAmount?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
