"use client";

import { useState, useEffect, useCallback } from "react";
import { Grid, GridColumn, GridCellProps } from "@progress/kendo-react-grid";
import { api } from "@/services/api";
import { Customer } from "@/types";
import { Plus, X, Loader2, ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import { LocalizationProvider } from "@progress/kendo-react-intl";
import toast from "react-hot-toast";

const PAGE_SIZE = 10;

const EMPTY_FORM: Omit<Customer, "id"> = {
  firstName: "",
  lastName: "",
  city: "",
  country: "",
  phone: "",
};

/**
 * En KendoReact 14+, la propiedad 'cell' ha sido reemplazada por 'cells={{ data: MyCell }}'.
 * Esta es la forma correcta de definir celdas personalizadas ahora.
 */
const ActionCell = (props: any) => {
  const { dataItem, onEdit, onDelete } = props;
  
  if (!dataItem || !dataItem.id) return <td {...props.tdProps}></td>;

  return (
    <td {...props.tdProps} className="text-center k-command-cell">
      <div className="flex gap-2 justify-center">
        <button 
          onClick={() => onEdit(dataItem)}
          className="p-1 text-blue-600 hover:bg-blue-50 rounded dark:hover:bg-blue-900/20"
          title="Editar"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onDelete(dataItem.id)}
          className="p-1 text-red-600 hover:bg-red-50 rounded dark:hover:bg-red-900/20"
          title="Borrar"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </td>
  );
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Omit<Customer, "id">>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCustomers = useCallback((targetPage: number) => {
    setLoading(true);
    api
      .getCustomers({ page: targetPage, limit: PAGE_SIZE })
      .then((res) => {
        if (res && res.data) {
          setCustomers(res.data);
          setTotalItems(res.totalItems || 0);
          setTotalPages(res.totalPages || 1);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Error al cargar los clientes.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadCustomers(page);
  }, [page, loadCustomers]);

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  const openModal = (customer?: Customer) => {
    if (customer) {
      setForm({
        firstName: customer.firstName,
        lastName: customer.lastName,
        city: customer.city,
        country: customer.country,
        phone: customer.phone,
      });
      setEditingId(customer.id);
    } else {
      setForm(EMPTY_FORM);
      setEditingId(null);
    }
    setError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("El nombre y apellido son obligatorios.");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await api.updateCustomer(editingId, form);
        toast.success("Cliente actualizado");
        setShowModal(false);
        loadCustomers(page);
      } else {
        await api.createCustomer(form);
        toast.success("Cliente creado con éxito");
        setShowModal(false);
        const newTotal = totalItems + 1;
        const newLastPage = Math.ceil(newTotal / PAGE_SIZE);
        if (page === newLastPage) {
          loadCustomers(newLastPage);
        } else {
          setPage(newLastPage);
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar el cliente.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este cliente?")) return;
    
    setLoading(true);
    try {
      await api.deleteCustomer(id);
      toast.success("Cliente eliminado");
      const newTotal = totalItems - 1;
      const newMaxPages = Math.ceil(newTotal / PAGE_SIZE);
      if (page > newMaxPages && page > 1) {
        setPage(page - 1);
      } else {
        loadCustomers(page);
      }
    } catch (err) {
      toast.error("Error al eliminar el cliente.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-6 rounded-2xl shadow-xl shadow-indigo-500/5 dark:shadow-none border border-white/20 dark:border-white/5">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 tracking-tight">
            Clientes
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 mt-1">
            Gestión de la base de datos de clientes, contactos y ubicaciones.
          </p>
        </div>
        <button 
          onClick={() => openModal()}
          className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-lg shadow-indigo-500/30 text-white bg-indigo-600 hover:bg-indigo-700 transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Cliente
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl -z-10 rounded-3xl" />
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-5 rounded-2xl shadow-xl shadow-indigo-500/5 dark:shadow-none border border-white/20 dark:border-white/5 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10 dark:bg-black/50">
            <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
          </div>
        )}

        <LocalizationProvider language="es-ES">
          <Grid data={customers} style={{ height: "500px" }} className="k-grid-custom">
            <GridColumn field="id" title="ID" width="60px" />
            <GridColumn field="firstName" title="Nombre" />
            <GridColumn field="lastName" title="Apellido" />
            <GridColumn field="city" title="Ciudad" />
            <GridColumn field="country" title="País" />
            <GridColumn field="phone" title="Teléfono" />
            {/* USANDO EL NUEVO SISTEMA 'CELLS' DE KENDOREACT 14+ */}
            <GridColumn
              title="Acciones"
              width="100px"
              cells={{
                data: (props) => (
                  <ActionCell 
                    {...props} 
                    onEdit={openModal} 
                    onDelete={handleDelete} 
                  />
                )
              }}
            />
          </Grid>
        </LocalizationProvider>

        <div className="p-4 flex justify-between items-center text-sm bg-gray-50 dark:bg-zinc-800/50 border-t dark:border-zinc-800">
          <span className="text-gray-500">Total: {totalItems} clientes</span>
          <div className="flex gap-2">
            <button 
              onClick={() => goToPage(page - 1)} 
              disabled={page === 1 || loading} 
              className="px-3 py-1 border rounded bg-white dark:bg-zinc-800 disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-2 py-1 dark:text-zinc-300 font-medium">Página {page} de {totalPages}</span>
            <button 
              onClick={() => goToPage(page + 1)} 
              disabled={page === totalPages || loading} 
              className="px-3 py-1 border rounded bg-white dark:bg-zinc-800 disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md p-6 border dark:border-zinc-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold dark:text-white">{editingId ? "Editar" : "Nuevo"} Cliente</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Nombre</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} className="w-full p-2.5 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Apellido</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} className="w-full p-2.5 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Ciudad</label>
                <input name="city" value={form.city} onChange={handleChange} className="w-full p-2.5 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">País</label>
                <input name="country" value={form.country} onChange={handleChange} className="w-full p-2.5 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Teléfono</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full p-2.5 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
              <div className="flex justify-end gap-3 pt-6 border-t dark:border-zinc-800 mt-6">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-500 hover:text-gray-700">Cancelar</button>
                <button type="submit" disabled={saving} className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 disabled:opacity-70 flex items-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
