"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Order, Product } from "@/types";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, Legend, LineChart, Line 
} from "recharts";
import { 
  Calendar, TrendingUp, Package, Users, DollarSign, 
  ArrowUpRight, Award, ShoppingCart, Globe 
} from "lucide-react";
import toast from "react-hot-toast";

export default function ReportsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          api.getOrders({ limit: 100, sort: "-orderDate" }),
          api.getProducts({ limit: 100 }),
        ]);
        setOrders(ordersRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        toast.error("Error al cargar los datos financieros");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // --- CÁLCULOS PARA EL CLIENTE ---

  // 1. Ventas por País
  const salesByCountry = orders.reduce((acc: any, order) => {
    const country = order.customer?.country || "Otros";
    acc[country] = (acc[country] || 0) + order.totalAmount;
    return acc;
  }, {});

  const countryData = Object.entries(salesByCountry)
    .map(([name, value]) => ({ name, value: Number(value) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // 2. Mejores Clientes (Por volumen de compra)
  const customerStats = orders.reduce((acc: any, order) => {
    const name = order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : "Cliente Especial";
    if (!acc[name]) acc[name] = { name, total: 0, count: 0 };
    acc[name].total += order.totalAmount;
    acc[name].count += 1;
    return acc;
  }, {});

  const topCustomers = Object.values(customerStats)
    .sort((a: any, b: any) => b.total - a.total)
    .slice(0, 5);

  // 3. Productos más Vendidos (Necesita recorrer items)
  const productSales: any = {};
  orders.forEach(order => {
    order.items?.forEach(item => {
      const pName = item.product?.productName || `Producto #${item.productId}`;
      if (!productSales[pName]) productSales[pName] = { name: pName, total: 0, qty: 0 };
      productSales[pName].total += item.unitPrice * item.quantity;
      productSales[pName].qty += item.quantity;
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a: any, b: any) => b.total - a.total)
    .slice(0, 5);

  // 4. Tendencia Temporal
  const trendData = orders.slice().reverse().reduce((acc: any[], order) => {
    const date = new Date(order.orderDate).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    const last = acc[acc.length - 1];
    if (last && last.name === date) {
      last.total += order.totalAmount;
    } else {
      acc.push({ name: date, total: order.totalAmount });
    }
    return acc;
  }, []).slice(-10);

  const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'];

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  const totalRevenue = orders.reduce((a, b) => a + b.totalAmount, 0);

  return (
    <div className="space-y-10 pb-12">
      {/* Header Informativo */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-8 rounded-3xl shadow-xl shadow-indigo-500/5 border border-white/20 dark:border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <TrendingUp size={120} className="text-indigo-600" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Análisis de Rendimiento
          </h1>
          <p className="text-lg text-gray-500 dark:text-zinc-400 mt-2 max-w-2xl">
            Informe detallado sobre la salud comercial de su empresa. Aquí puede observar sus mercados más fuertes y productos estrella.
          </p>
        </div>
      </div>

      {/* Tarjetas de Resumen de Impacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Ingresos Totales", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "emerald", desc: "Capital total generado" },
          { label: "Volumen de Pedidos", value: orders.length, icon: ShoppingCart, color: "indigo", desc: "Transacciones completadas" },
          { label: "Alcance Global", value: `${Object.keys(salesByCountry).length} Países`, icon: Globe, color: "blue", desc: "Presencia internacional" },
          { label: "Ticket Promedio", value: `$${(totalRevenue / orders.length || 0).toFixed(2)}`, icon: Award, color: "amber", desc: "Gasto medio por cliente" },
        ].map((stat, i) => (
          <div key={i} className="group bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 dark:border-white/5 hover:border-indigo-500/30 transition-all">
            <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{stat.value}</div>
            <div className="text-sm font-bold text-gray-800 dark:text-zinc-200 mt-1">{stat.label}</div>
            <div className="text-xs text-gray-500 dark:text-zinc-400 mt-1">{stat.desc}</div>
          </div>
        ))}
      </div>

      {/* Gráficas Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tendencia Temporal */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20 dark:border-white/5 h-[450px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Flujo de Ingresos</h3>
              <p className="text-xs text-gray-500">Histórico de ventas por día</p>
            </div>
            <ArrowUpRight className="text-emerald-500" />
          </div>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} tickFormatter={(v) => `$${v}`} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={4} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Mercados */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20 dark:border-white/5 h-[450px]">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Fortaleza de Mercado</h3>
            <p className="text-xs text-gray-500">Distribución geográfica de sus ventas</p>
          </div>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={countryData}
                innerRadius={70}
                outerRadius={110}
                paddingAngle={8}
                dataKey="value"
              >
                {countryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tablas de Éxito */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Productos */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20 dark:border-white/5">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Package className="text-indigo-500" />
            Productos Estrella
          </h3>
          <div className="space-y-4">
            {topProducts.map((p: any, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 dark:bg-white/5 border border-transparent hover:border-indigo-500/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.qty} unidades vendidas</div>
                  </div>
                </div>
                <div className="text-right font-black text-indigo-600 dark:text-indigo-400">
                  ${p.total.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Clientes */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20 dark:border-white/5">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Users className="text-purple-500" />
            Clientes más Valiosos
          </h3>
          <div className="space-y-4">
            {topCustomers.map((c: any, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 dark:bg-white/5 border border-transparent hover:border-purple-500/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white flex items-center justify-center font-bold">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.count} pedidos realizados</div>
                  </div>
                </div>
                <div className="text-right font-black text-purple-600 dark:text-purple-400">
                  ${c.total.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
