"use client";

import { useState, useEffect } from "react";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Input, NumericTextBox, Checkbox } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { api } from "@/services/api";
import { Supplier, Product } from "@/types";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function ProductForm({ productId }: { productId?: number }) {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<Partial<Product>>({
    productName: "",
    package: "",
    unitPrice: 0,
    isDiscontinued: false,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const suppliersRes = await api.getSuppliers({ limit: 100 });
        setSuppliers(suppliersRes.data);

        if (productId) {
          const product = await api.getProductById(productId);
          setInitialData({
            productName: product.productName,
            package: product.package,
            unitPrice: product.unitPrice,
            supplierId: product.supplierId,
            isDiscontinued: product.isDiscontinued,
          });
        }
      } catch (error) {
        console.error("Error loading form data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [productId]);

  const handleSubmit = async (data: any) => {
    try {
      const payload = {
        productName: data.productName,
        package: data.package,
        unitPrice: data.unitPrice,
        supplierId: data.supplierId,
        isDiscontinued: data.isDiscontinued || false,
      };

      if (productId) {
        await api.updateProduct(productId, payload);
        toast.success("Producto actualizado correctamente");
      } else {
        await api.createProduct(payload);
        toast.success("Producto creado con éxito");
      }
      router.push("/products");
    } catch (error) {
      toast.error("Error al guardar el producto");
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-6 rounded-2xl shadow-xl shadow-indigo-500/5 dark:shadow-none border border-white/20 dark:border-white/5 max-w-2xl mx-auto">
      <Form
        onSubmit={handleSubmit}
        initialValues={initialData}
        render={(formRenderProps) => (
          <FormElement>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                    Nombre del Producto
                  </label>
                  <Field
                    name="productName"
                    component={Input}
                    required={true}
                    placeholder="Ej. Queso Cabrales"
                    className="w-full"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                    Proveedor
                  </label>
                  <DropDownList
                    data={suppliers}
                    textField="companyName"
                    dataItemKey="id"
                    label="Seleccionar Proveedor"
                    onChange={(e) => formRenderProps.onChange("supplierId", { value: e.target.value.id })}
                    value={suppliers.find(s => s.id === formRenderProps.valueGetter("supplierId"))}
                    required={true}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                    Empaque
                  </label>
                  <Field
                    name="package"
                    component={Input}
                    required={true}
                    placeholder="Ej. 1 kg pkg."
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                    Precio Unitario ($)
                  </label>
                  <Field
                    name="unitPrice"
                    component={NumericTextBox}
                    required={true}
                    min={0}
                    format="c2"
                    className="w-full"
                  />
                </div>

                {productId && (
                  <div className="md:col-span-2 flex items-center mt-2">
                    <Field
                      name="isDiscontinued"
                      component={Checkbox}
                      label="Marcar como discontinuado"
                      className="mr-2"
                    />
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 dark:border-zinc-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!formRenderProps.allowSubmit}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-lg shadow-indigo-500/30 text-white bg-indigo-600 hover:bg-indigo-700 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Producto
                </button>
              </div>
            </div>
          </FormElement>
        )}
      />
    </div>
  );
}
