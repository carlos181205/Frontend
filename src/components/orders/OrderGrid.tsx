"use client";

import { useState, useEffect } from "react";
import { 
  Grid, 
  GridColumn as Column, 
  GridPageChangeEvent,
  GridDataStateChangeEvent
} from "@progress/kendo-react-grid";
import { State, process } from "@progress/kendo-data-query";
import { Order, PaginatedResponse } from "@/types";
import { api } from "@/services/api";
import { Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { LocalizationProvider, loadMessages } from "@progress/kendo-react-intl";
import { esMessages } from "@/utils/kendoMessages";

// Cargar los mensajes en español
loadMessages(esMessages, "es-ES");

export function OrderGrid() {
  const [allData, setAllData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [dataState, setDataState] = useState<State>({
    skip: 0,
    take: 10,
    sort: [{ field: "orderDateParsed", dir: "desc" }]
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Obtenemos hasta 100 pedidos (límite máximo del backend) para procesar localmente
      const response = await api.getOrders({
        page: 1,
        limit: 100,
      });

      // Mapeamos los datos para que KendoReact pueda filtrar fácilmente por texto y fechas
      const mappedData = response.data.map(order => ({
        ...order,
        customerFullName: order.customer 
          ? `${order.customer.firstName} ${order.customer.lastName}`
          : `ID: ${order.customerId}`,
        orderDateParsed: new Date(order.orderDate),
        totalAmountStr: order.totalAmount.toString() // Para filtrar como texto
      }));

      setAllData(mappedData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onDataStateChange = (e: GridDataStateChangeEvent) => {
    setDataState(e.dataState);
  };

  const ActionCell = (props: any) => {
    const id = props.dataItem.id;
    return (
      <td className="k-command-cell">
        <div className="flex space-x-2">
          <Link 
            href={`/orders/${id}`}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded dark:hover:bg-blue-900/20"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <Link 
            href={`/orders/${id}/edit`}
            className="p-1 text-green-600 hover:bg-green-50 rounded dark:hover:bg-green-900/20"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button 
            className="p-1 text-red-600 hover:bg-red-50 rounded dark:hover:bg-red-900/20"
            onClick={() => {
              if (confirm("¿Estás seguro de eliminar este pedido?")) {
                api.deleteOrder(id).then(() => fetchOrders());
              }
            }}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    );
  };

  // Procesamos los datos usando la utilidad de Kendo (filtra, ordena, pagina)
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
          <Column field="orderNumber" title="Nro Pedido" width="150px" />
          <Column field="customerFullName" title="Cliente" />
          <Column 
            field="orderDateParsed" 
            title="Fecha" 
            format="{0:d}"
            filter="date"
            cells={{
              data: (props) => (
                <td>{props.dataItem.orderDateParsed.toLocaleDateString()}</td>
              )
            }}
          />
          <Column 
            field="totalAmountStr" 
            title="Total" 
            filter="text"
            cells={{
              data: (props) => (
                <td className="font-semibold text-gray-900">
                  ${Number(props.dataItem.totalAmount).toFixed(2)}
                </td>
              )
            }}
          />
          <Column 
            title="Acciones" 
            width="150px" 
            cells={{
              data: ActionCell
            }}
          />
        </Grid>
      </LocalizationProvider>
    </div>
  );
}
