"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Order, Product } from "@/types";
import { 
  ShoppingBag, 
  Users, 
  Package, 
  TrendingUp,
  AlertCircle,
  Plus,
  ArrowRight,
  ReceiptText,
  UserPlus
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    averageTicket: 0,
    activeProducts: 0,
    recentOrders: [] as Order[],
    chartData: [] as any[],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          api.getOrders({ limit: 50, sort: "-orderDate" }),
          api.getProducts({ limit: 100 }),
        ]);

        const allFetchedOrders = ordersRes.data;
        const totalSales = allFetchedOrders.reduce((acc, order) => acc + order.totalAmount, 0);
        const avgTicket = ordersRes.totalItems > 0 ? totalSales / allFetchedOrders.length : 0;
        
        // Prepare chart data (Group sales by date)
        const groupedData: Record<string, number> = {};
        // Reverse to have chronological order for the chart (oldest to newest among the latest 50)
        [...allFetchedOrders].reverse().forEach(order => {
          const date = new Date(order.orderDate).toLocaleDateString("es-ES", { day: '2-digit', month: 'short' });
          groupedData[date] = (groupedData[date] || 0) + order.totalAmount;
        });

        const chartData = Object.keys(groupedData).map(date => ({
          name: date,
          Ventas: groupedData[date]
        }));

        setStats({
          totalOrders: ordersRes.totalItems,
          totalSales: totalSales,
          averageTicket: avgTicket,
          activeProducts: productsRes.totalItems,
          recentOrders: allFetchedOrders.slice(0, 5), // Only show top 5 in table
          chartData: chartData,
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
    <div className="space-y-8">
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Panel de Control</h1>
          <p className="text-gray-500 dark:text-zinc-400 mt-1">Resumen general y métricas clave de tu negocio.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            href="/customers"
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-xl text-sm font-medium text-gray-700 dark:text-zinc-300 bg-white/80 dark:bg-zinc-800/80 hover:bg-gray-50 dark:hover:bg-zinc-700 backdrop-blur-sm transition-all shadow-sm"
          >
            <UserPlus className="w-4 h-4 mr-2 text-gray-500 dark:text-zinc-400" />
            Nuevo Cliente
          </Link>
          <Link 
            href="/orders/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear Pedido
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r-xl backdrop-blur-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-400">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Vendido" 
          value={`$${stats.totalSales.toFixed(2)}`} 
          icon={TrendingUp} 
          gradient="from-emerald-400 to-emerald-600"
          href="/reports"
        />
        <StatCard 
          title="Total Pedidos" 
          value={stats.totalOrders} 
          icon={ShoppingBag} 
          gradient="from-blue-400 to-blue-600"
          href="/orders"
        />
        <StatCard 
          title="Ticket Promedio" 
          value={`$${stats.averageTicket.toFixed(2)}`} 
          icon={ReceiptText} 
          gradient="from-amber-400 to-orange-500"
          href="/reports"
        />
        <StatCard 
          title="Productos Activos" 
          value={stats.activeProducts} 
          icon={Package} 
          gradient="from-purple-400 to-indigo-600"
          href="/products"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-6 rounded-2xl shadow-xl shadow-indigo-500/5 dark:shadow-none border border-white/20 dark:border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Tendencia de Ventas
            </h3>
            <span className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300 rounded-full">
              Últimos 50 pedidos
            </span>
          </div>
          <div className="h-72 w-full">
            {stats.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888" strokeOpacity={0.2} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#888', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#888', fontSize: 12 }} 
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`$${value}`, "Ventas"]}
                    labelFormatter={(label) => `Fecha: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Ventas" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorVentas)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No hay datos suficientes
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl shadow-xl shadow-indigo-500/5 dark:shadow-none border border-white/20 dark:border-white/5 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Últimos Pedidos
            </h3>
            <Link href="/orders" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
              Ver todos
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {stats.recentOrders.length > 0 ? (
              <ul className="divide-y divide-gray-100 dark:divide-zinc-800">
                {stats.recentOrders.map((order) => (
                  <li key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                    <Link href={`/orders/${order.id}`} className="block p-4">
                      <div className="flex items-center justify-between">
                        <div className="truncate">
                          <div className="flex text-sm">
                            <p className="font-medium text-indigo-600 dark:text-indigo-400 truncate">
                              {order.orderNumber}
                            </p>
                            <p className="ml-2 flex-shrink-0 font-normal text-gray-500 dark:text-zinc-400">
                              {new Date(order.orderDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="mt-2 flex">
                            <div className="flex items-center text-sm text-gray-600 dark:text-zinc-300">
                              <Users className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              <span className="truncate">
                                {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : `Cliente #${order.customerId}`}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            ${order.totalAmount.toFixed(2)}
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-sm text-gray-500 dark:text-zinc-400">
                No hay pedidos recientes.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, gradient, href }: { title: string; value: string | number; icon: any; gradient: string; href?: string }) {
  const content = (
    <div className="p-5 h-full">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
          <Icon className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate dark:text-zinc-400">
              {title}
            </dt>
            <dd className="text-2xl font-bold text-gray-900 dark:text-white mt-1 tracking-tight">
              {value}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md overflow-hidden rounded-2xl shadow-xl shadow-indigo-500/5 dark:shadow-none border border-white/20 dark:border-white/5 transition-transform hover:-translate-y-1 duration-300">
      {href ? (
        <Link href={href} className="block h-full hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 transition-colors">
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  );
}
