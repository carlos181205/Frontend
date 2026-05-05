import { OrderForm } from "@/components/orders/OrderForm";

export default function NewOrderPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nuevo Pedido</h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          Crea una nueva orden de compra seleccionando el cliente y los productos.
        </p>
      </div>

      <OrderForm />
    </div>
  );
}
