"use client";

import { OrderForm } from "@/components/orders/OrderForm";
import { useParams } from "next/navigation";

export default function EditOrderPage() {
  const params = useParams();
  const id = parseInt(params.id as string);

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Editar Pedido #{id}</h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          Modifica los detalles del pedido o agrega/elimina productos.
        </p>
      </div>

      <OrderForm orderId={id} />
    </div>
  );
}
