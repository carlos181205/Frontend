import { SupplierForm } from "@/components/suppliers/SupplierForm";
import { use } from "react";

export default function EditSupplierPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-6 rounded-2xl shadow-xl shadow-indigo-500/5 dark:shadow-none border border-white/20 dark:border-white/5">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 tracking-tight">
          Editar Proveedor
        </h1>
        <p className="text-gray-500 dark:text-zinc-400 mt-2">
          Actualiza la información de la empresa proveedora.
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-red-500/5 blur-2xl -z-10 rounded-3xl" />
        <SupplierForm supplierId={Number(resolvedParams.id)} />
      </div>
    </div>
  );
}
