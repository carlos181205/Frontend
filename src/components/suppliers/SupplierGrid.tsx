"use client";

import { useState, useEffect } from "react";
import { Grid, GridColumn as Column, GridDataStateChangeEvent } from "@progress/kendo-react-grid";
import { process, State } from "@progress/kendo-data-query";
import { api } from "@/services/api";
import { Supplier } from "@/types";
import { Edit, Trash2, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { LocalizationProvider } from "@progress/kendo-react-intl";
import toast from "react-hot-toast";

export function SupplierGrid() {
  const [allData, setAllData] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [dataState, setDataState] = useState<State>({
    skip: 0,
    take: 10,
    sort: [{ field: "companyName", dir: "asc" }]
  });

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await api.getSuppliers({
        page: 1,
        limit: 100,
      });
      setAllData(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      toast.error("Error al cargar proveedores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const onDataStateChange = (e: GridDataStateChangeEvent) => {
    setDataState(e.dataState);
  };

  const deleteSupplier = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este proveedor definitivamente?")) {
      try {
        await api.deleteSupplier(id);
        toast.success("Proveedor eliminado");
        fetchSuppliers();
      } catch (error) {
        console.error("Error deleting supplier:", error);
        toast.error("Error al eliminar el proveedor. Verifique si tiene productos asociados.");
      }
    }
  };

  const ActionCell = (props: any) => {
    const id = props.dataItem.id;
    
    return (
      <td className="k-command-cell">
        <div className="flex space-x-2">
          <Link 
            href={`/suppliers/${id}/edit`}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded dark:hover:bg-blue-900/20"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </Link>
          
          <button 
            className="p-1 text-red-600 hover:bg-red-50 rounded dark:hover:bg-red-900/20"
            onClick={() => deleteSupplier(id)}
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    );
  };

  const ContactCell = (props: any) => (
    <td>
      <div className="text-sm">
        <div className="font-medium text-gray-900 dark:text-white">{props.dataItem.contactName}</div>
        <div className="text-gray-500 text-xs">{props.dataItem.contactTitle}</div>
      </div>
    </td>
  );

  const LocationCell = (props: any) => (
    <td>
      <div className="flex items-center text-xs text-gray-500">
        <MapPin className="w-3 h-3 mr-1" />
        {props.dataItem.city}, {props.dataItem.country}
      </div>
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
          <Column field="id" title="ID" width="70px" filter="numeric" />
          <Column field="companyName" title="Empresa" />
          <Column title="Contacto" width="200px" cells={{ data: ContactCell }} />
          <Column title="Ubicación" width="200px" cells={{ data: LocationCell }} />
          <Column 
            field="phone" 
            title="Teléfono" 
            width="150px"
            cells={{
              data: (props) => (
                <td>
                  <div className="flex items-center text-xs">
                    <Phone className="w-3 h-3 mr-1 text-gray-400" />
                    {props.dataItem.phone}
                  </div>
                </td>
              )
            }}
          />
          <Column 
            title="Acciones" 
            width="120px" 
            cells={{ data: ActionCell }}
          />
        </Grid>
      </LocalizationProvider>
    </div>
  );
}
