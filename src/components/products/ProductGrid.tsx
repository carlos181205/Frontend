"use client";

import { useState, useEffect } from "react";
import { Grid, GridColumn as Column, GridDataStateChangeEvent } from "@progress/kendo-react-grid";
import { process, State } from "@progress/kendo-data-query";
import { api } from "@/services/api";
import { Product } from "@/types";
import { Edit, Trash2, PowerOff, Power } from "lucide-react";
import Link from "next/link";
import { LocalizationProvider } from "@progress/kendo-react-intl";
import toast from "react-hot-toast";

export function ProductGrid() {
  const [allData, setAllData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [dataState, setDataState] = useState<State>({
    skip: 0,
    take: 10,
    sort: [{ field: "productName", dir: "asc" }]
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.getProducts({
        page: 1,
        limit: 100, // Cargar hasta 100 para permitir filtrado local
      });

      // Mapeamos los datos para facilitar el filtrado
      const mappedData = response.data.map(product => ({
        ...product,
        unitPriceStr: product.unitPrice.toString(),
        statusStr: product.isDiscontinued ? "Discontinuado" : "Activo"
      }));

      setAllData(mappedData);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onDataStateChange = (e: GridDataStateChangeEvent) => {
    setDataState(e.dataState);
  };

  const toggleDiscontinued = async (id: number, currentStatus: boolean) => {
    try {
      await api.updateProduct(id, { isDiscontinued: !currentStatus });
      toast.success(currentStatus ? "Producto activado" : "Producto desactivado");
      fetchProducts();
    } catch (error) {
      console.error("Error toggling product status:", error);
      toast.error("Error al actualizar el estado del producto.");
    }
  };

  const deleteProduct = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este producto definitivamente?")) {
      try {
        await api.deleteProduct(id);
        toast.success("Producto eliminado");
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Error al eliminar el producto.");
      }
    }
  };

  const ActionCell = (props: any) => {
    const id = props.dataItem.id;
    const isDiscontinued = props.dataItem.isDiscontinued;
    
    return (
      <td className="k-command-cell">
        <div className="flex space-x-2">
          <Link 
            href={`/products/${id}/edit`}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded dark:hover:bg-blue-900/20"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </Link>
          
          <button 
            className={`p-1 rounded ${
              isDiscontinued 
                ? "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20" 
                : "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
            }`}
            onClick={() => toggleDiscontinued(id, isDiscontinued)}
            title={isDiscontinued ? "Activar Producto" : "Desactivar Producto"}
          >
            {isDiscontinued ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
          </button>

          <button 
            className="p-1 text-red-600 hover:bg-red-50 rounded dark:hover:bg-red-900/20"
            onClick={() => deleteProduct(id)}
            title="Eliminar Definitivamente"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    );
  };

  const StatusCell = (props: any) => (
    <td>
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
        props.dataItem.isDiscontinued 
          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" 
          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      }`}>
        {props.dataItem.isDiscontinued ? "Discontinuado" : "Activo"}
      </span>
    </td>
  );

  const result = process(allData, dataState);

  return (
    <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-5 rounded-2xl shadow-xl shadow-indigo-500/5 dark:shadow-none border border-white/20 dark:border-white/5 relative overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10 dark:bg-black/50 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}
      <LocalizationProvider language="es-ES">
        <Grid
          pageable={true}
          sortable={true}
          filterable={true}
          data={result.data}
          total={result.total}
          skip={dataState.skip}
          take={dataState.take}
          sort={dataState.sort}
          filter={dataState.filter}
          onDataStateChange={onDataStateChange}
          className="k-grid-custom"
          style={{ height: "500px" }}
        >
          <Column field="id" title="ID" width="80px" filter="numeric" />
          <Column field="productName" title="Nombre" />
          <Column field="package" title="Empaque" />
          <Column 
            field="unitPriceStr" 
            title="Precio" 
            filter="text"
            width="120px"
            cells={{
              data: (props) => (
                <td className="font-semibold text-gray-900">
                  ${Number(props.dataItem.unitPrice).toFixed(2)}
                </td>
              )
            }}
          />
          <Column 
            field="statusStr" 
            title="Estado" 
            width="130px"
            cells={{ data: StatusCell }} 
          />
          <Column 
            title="Acciones" 
            width="140px" 
            cells={{ data: ActionCell }}
          />
        </Grid>
      </LocalizationProvider>
    </div>
  );
}
