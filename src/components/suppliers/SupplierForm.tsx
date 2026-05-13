"use client";

import { useState, useEffect } from "react";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Input } from "@progress/kendo-react-inputs";
import { api } from "@/services/api";
import { Supplier } from "@/types";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function SupplierForm({ supplierId }: { supplierId?: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<Partial<Supplier>>({
    companyName: "",
    contactName: "",
    contactTitle: "",
    city: "",
    country: "",
    phone: "",
    fax: "",
  });

  useEffect(() => {
    async function loadData() {
      if (!supplierId) {
        setLoading(false);
        return;
      }
      try {
        const supplier = await api.getSupplierById(supplierId);
        setInitialData(supplier);
      } catch (error) {
        console.error("Error loading supplier:", error);
        toast.error("Error al cargar datos del proveedor");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [supplierId]);

  const handleSubmit = async (data: any) => {
    try {
      if (supplierId) {
        await api.updateSupplier(supplierId, data);
        toast.success("Proveedor actualizado");
      } else {
        await api.createSupplier(data);
        toast.success("Proveedor creado con éxito");
      }
      router.push("/suppliers");
    } catch (error) {
      toast.error("Error al guardar el proveedor");
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
                    Nombre de la Empresa
                  </label>
                  <Field
                    name="companyName"
                    component={Input}
                    required={true}
                    placeholder="Ej. Exotic Liquids"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                    Nombre de Contacto
                  </label>
                  <Field
                    name="contactName"
                    component={Input}
                    required={true}
                    placeholder="Ej. Charlotte Cooper"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                    Título de Contacto
                  </label>
                  <Field
                    name="contactTitle"
                    component={Input}
                    placeholder="Ej. Purchasing Manager"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                    Ciudad
                  </label>
                  <Field
                    name="city"
                    component={Input}
                    placeholder="Ej. London"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                    País
                  </label>
                  <Field
                    name="country"
                    component={Input}
                    placeholder="Ej. UK"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                    Teléfono
                  </label>
                  <Field
                    name="phone"
                    component={Input}
                    placeholder="Ej. (171) 555-2222"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                    Fax (Opcional)
                  </label>
                  <Field
                    name="fax"
                    component={Input}
                    placeholder="Ej. (171) 555-2223"
                    className="w-full"
                  />
                </div>
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
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-lg shadow-indigo-500/30 text-white bg-indigo-600 hover:bg-indigo-700 transition-all hover:-translate-y-0.5"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Proveedor
                </button>
              </div>
            </div>
          </FormElement>
        )}
      />
    </div>
  );
}
