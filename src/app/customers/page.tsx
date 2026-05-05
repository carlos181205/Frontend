"use client";

import { useState, useEffect } from "react";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { api } from "@/services/api";
import { Customer } from "@/types";
import { Users, Plus } from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCustomers()
      .then(res => setCustomers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Clientes</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Administración básica de clientes.
          </p>
        </div>
        <button 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          onClick={() => alert("Función de creación de cliente en desarrollo")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Cliente
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow dark:bg-zinc-900 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10 dark:bg-black/50">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}
        <Grid
          data={customers}
          style={{ height: "500px" }}
        >
          <Column field="id" title="ID" width="60px" />
          <Column field="firstName" title="Nombre" />
          <Column field="lastName" title="Apellido" />
          <Column field="city" title="Ciudad" />
          <Column field="country" title="País" />
          <Column field="phone" title="Teléfono" />
        </Grid>
      </div>
    </div>
  );
}
