import { OrderDetail } from "@/components/orders/OrderDetail";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // In Next.js 15+ (or Next 13+ app router with some setups), params might need to be awaited or used directly. 
  // However, since we are doing client side fetching inside OrderDetail, we just need to pass the ID.
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Detalle de Pedido</h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          Consulta la información completa del pedido, incluyendo los productos y datos del cliente.
        </p>
      </div>

      <OrderDetail orderId={id} />
    </div>
  );
}
