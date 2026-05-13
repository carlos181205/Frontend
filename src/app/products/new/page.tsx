import { ProductForm } from "@/components/products/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Premium */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-6 rounded-2xl shadow-xl shadow-indigo-500/5 dark:shadow-none border border-white/20 dark:border-white/5">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 tracking-tight">
          Nuevo Producto
        </h1>
        <p className="text-gray-500 dark:text-zinc-400 mt-2">
          Agrega un nuevo producto al catálogo. Asegúrate de asociarlo con un proveedor existente.
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 blur-2xl -z-10 rounded-3xl" />
        <ProductForm />
      </div>
    </div>
  );
}
