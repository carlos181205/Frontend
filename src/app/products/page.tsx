"use client";

import { useState, useEffect } from "react";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { api } from "@/services/api";
import { Product } from "@/types";
import { Package } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts({ limit: 100 })
      .then(res => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Productos</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Catálogo de productos disponibles.
          </p>
        </div>
      </div>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10 dark:bg-black/50">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow dark:bg-zinc-900">
        <Grid
          data={products}
          style={{ height: "500px" }}
        >
          <Column field="id" title="ID" width="60px" />
          <Column field="productName" title="Nombre del Producto" />
          <Column field="package" title="Empaque" />
          <Column 
            field="unitPrice" 
            title="Precio Unit." 
            cells={{
              data: (props) => (
                <td>${props.dataItem.unitPrice.toFixed(2)}</td>
              )
            }}
          />
          <Column 
            field="isDiscontinued" 
            title="Estado" 
            cells={{
              data: (props) => (
                <td>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    props.dataItem.isDiscontinued 
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" 
                      : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  }`}>
                    {props.dataItem.isDiscontinued ? "Discontinuado" : "Activo"}
                  </span>
                </td>
              )
            }}
          />

        </Grid>
      </div>
    </div>
  );
}
