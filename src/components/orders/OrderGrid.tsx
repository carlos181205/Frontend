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

export function OrderGrid() {
  const [data, setData] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [dataState, setDataState] = useState<State>({
    skip: 0,
    take: 10,
    sort: [{ field: "orderDate", dir: "desc" }]
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const page = Math.floor(dataState.skip! / dataState.take!) + 1;
      const sortField = dataState.sort?.[0]?.field;
      const sortDir = dataState.sort?.[0]?.dir;
      const sortParam = sortField ? `${sortDir === "desc" ? "-" : "+"}${sortField}` : undefined;

      const response = await api.getOrders({
        page,
        limit: dataState.take,
        sort: sortParam
      });

      setData(response.data);
      setTotal(response.totalItems);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [dataState]);

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

  return (
    <div className="bg-white p-4 rounded-lg shadow dark:bg-zinc-900 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10 dark:bg-black/50">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}
      <Grid
        pageable={true}
        sortable={true}
        filterable={true}
        data={data}
        total={total}
        skip={dataState.skip}
        take={dataState.take}
        sort={dataState.sort}
        onDataStateChange={onDataStateChange}
        className="k-grid-custom"
        style={{ height: "500px" }}
      >
        <Column field="orderNumber" title="Nro Pedido" width="150px" />
        <Column 
          field="customer" 
          title="Cliente" 
          cells={{
            data: (props) => (
              <td>
                {props.dataItem.customer 
                  ? `${props.dataItem.customer.firstName} ${props.dataItem.customer.lastName}`
                  : `ID: ${props.dataItem.customerId}`}
              </td>
            )
          }}
        />
        <Column 
          field="orderDate" 
          title="Fecha" 
          format="{0:d}" 
          cells={{
            data: (props) => (
              <td>{new Date(props.dataItem.orderDate).toLocaleDateString()}</td>
            )
          }}
        />
        <Column 
          field="totalAmount" 
          title="Total" 
          format="{0:c}" 
          cells={{
            data: (props) => (
              <td className="font-semibold text-gray-900 dark:text-white">
                ${props.dataItem.totalAmount.toFixed(2)}
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
    </div>
  );
}
