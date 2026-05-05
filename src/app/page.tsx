"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Order, Product } from "@/types";
import { 
  ShoppingBag, 
  Users, 
  Package, 
  TrendingUp,
  AlertCircle
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    activeProducts: 0,
    recentOrders: [] as Order[],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          api.getOrders({ limit: 5, sort: "-orderDate" }),
          api.getProducts({ limit: 100 }),
        ]);

        const totalSales = ordersRes.data.reduce((acc, order) => acc + order.totalAmount, 0);
        
        setStats({
          totalOrders: ordersRes.totalItems,
          totalSales: totalSales,
          activeProducts: productsRes.totalItems,
          recentOrders: ordersRes.data,
        });
      } catch (err) {
        console.error(err);
        setError("No se pudo conectar con el backend. Asegúrate de que la API esté corriendo.");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Panel de Control</h1>
      </div>

      {error && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 dark:bg-amber-900/20 dark:border-amber-600">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700 dark:text-amber-300">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Total Pedidos" 
          value={stats.totalOrders} 
          icon={ShoppingBag} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Total Vendido" 
          value={`$${stats.totalSales.toFixed(2)}`} 
          icon={TrendingUp} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Productos Activos" 
          value={stats.activeProducts} 
          icon={Package} 
          color="bg-purple-500" 
        />
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white shadow rounded-lg dark:bg-zinc-900">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-zinc-800">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Pedidos Recientes
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
            <thead className="bg-gray-50 dark:bg-zinc-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-zinc-400">
                  Nro Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-zinc-400">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-zinc-400">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-zinc-400">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-zinc-900 dark:divide-zinc-800">
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">
                      {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : `ID: ${order.customerId}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-zinc-400">
                    No hay pedidos recientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: any; color: string }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg dark:bg-zinc-900">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 p-3 rounded-md ${color}`}>
            <Icon className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate dark:text-zinc-400">
                {title}
              </dt>
              <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                {value}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
