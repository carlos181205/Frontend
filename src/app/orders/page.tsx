import { OrderGrid } from "@/components/orders/OrderGrid";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pedidos</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Gestiona las órdenes de compra de tus clientes.
          </p>
        </div>
        <Link 
          href="/orders/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Pedido
        </Link>
      </div>

      <OrderGrid />
    </div>
  );
}
