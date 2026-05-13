"use client";

import { useState, useEffect } from "react";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Error } from "@progress/kendo-react-labels";
import { Input, NumericTextBox } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { api } from "@/services/api";
import { Customer, Product, OrderItem } from "@/types";
import { Plus, Trash2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function OrderForm({ orderId }: { orderId?: number }) {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<Partial<OrderItem>[]>([{ productId: 0, quantity: 1, unitPrice: 0 }]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [customersRes, productsRes] = await Promise.all([
          api.getCustomers(),
          api.getProducts({ limit: 100 }),
        ]);
        setCustomers(customersRes.data);
        // Filtrar productos para que solo se puedan seleccionar los que están activos
        setProducts(productsRes.data.filter(p => !p.isDiscontinued));

        if (orderId) {
          const order = await api.getOrderById(orderId);
          // Setup form with order data
          setItems(order.items || []);
        }
      } catch (error) {
        console.error("Error loading form data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [orderId]);

  const addItem = () => {
    setItems([...items, { productId: 0, quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === "productId") {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].unitPrice = product.unitPrice;
      }
    }
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + (item.unitPrice || 0) * (item.quantity || 0), 0);
  };

  const handleSubmit = async (data: any) => {
    try {
      const payload = {
        customerId: data.customerId,
        items: items.map(item => ({
          productId: item.productId as number,
          quantity: item.quantity as number
        }))
      };

      if (orderId) {
        await api.updateOrder(orderId, payload as any);
        toast.success("Pedido actualizado con éxito");
      } else {
        await api.createOrder(payload);
        toast.success("Pedido creado correctamente");
      }
      router.push("/orders");
    } catch (error) {
      toast.error("Error al guardar el pedido");
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-6 rounded-2xl shadow-xl shadow-indigo-500/5 dark:shadow-none border border-white/20 dark:border-white/5 max-w-4xl mx-auto">
      <Form
        onSubmit={handleSubmit}
        render={(formRenderProps) => (
          <FormElement>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                    Cliente
                  </label>
                  <DropDownList
                    data={customers}
                    textField="firstName"
                    dataItemKey="id"
                    label="Seleccionar Cliente"
                    onChange={(e) => formRenderProps.onChange("customerId", { value: e.target.value.id })}
                    value={customers.find(c => c.id === formRenderProps.valueGetter("customerId"))}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Ítems del Pedido</h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar Producto
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-end space-x-3 p-3 bg-gray-50 rounded dark:bg-zinc-800/50">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Producto</label>
                        <DropDownList
                          data={products}
                          textField="productName"
                          dataItemKey="id"
                          value={products.find(p => p.id === item.productId)}
                          onChange={(e) => updateItem(index, "productId", e.target.value.id)}
                        />
                      </div>
                      <div className="w-24">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Cant.</label>
                        <NumericTextBox
                          value={item.quantity}
                          min={1}
                          onChange={(e) => updateItem(index, "quantity", e.value)}
                        />
                      </div>
                      <div className="w-32">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Precio Unit.</label>
                        <div className="h-8 flex items-center px-2 bg-gray-100 rounded dark:bg-zinc-800 text-sm">
                          ${item.unitPrice?.toFixed(2)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 dark:border-zinc-800 flex justify-between items-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  Total: <span className="text-indigo-600 dark:text-indigo-400">${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Pedido
                  </button>
                </div>
              </div>
            </div>
          </FormElement>
        )}
      />
    </div>
  );
}
