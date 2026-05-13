import { ProductGrid } from "@/components/products/ProductGrid";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  return (
    <div className="space-y-8">
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-6 rounded-2xl shadow-xl shadow-indigo-500/5 dark:shadow-none border border-white/20 dark:border-white/5">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 tracking-tight">
            Productos
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 mt-1">
            Gestiona el catálogo de productos, disponibilidad, precios y agrega nuevos ítems.
          </p>
        </div>
        <Link 
          href="/products/new"
          className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-lg shadow-indigo-500/30 text-white bg-indigo-600 hover:bg-indigo-700 transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Producto
        </Link>
      </div>

      {/* Grid Container */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl -z-10 rounded-3xl" />
        <ProductGrid />
      </div>
    </div>
  );
}
