import { Order, PaginatedResponse, Product, Customer, Supplier } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const api = {
  // Orders
  async getOrders(params: {
    page?: number;
    limit?: number;
    customerId?: number;
    dateFrom?: string;
    dateTo?: string;
    sort?: string;
  } = {}): Promise<PaginatedResponse<Order>> {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.customerId) query.append("customerId", params.customerId.toString());
    if (params.dateFrom) query.append("dateFrom", params.dateFrom);
    if (params.dateTo) query.append("dateTo", params.dateTo);
    if (params.sort) query.append("sort", params.sort);

    const response = await fetch(`${API_BASE_URL}/orders?${query.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch orders");
    return response.json();
  },

  async getOrderById(id: number): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`);
    if (!response.ok) throw new Error("Failed to fetch order");
    return response.json();
  },

  async createOrder(data: { customerId: number; items: { productId: number; quantity: number }[] }): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create order");
    return response.json();
  },

  async updateOrder(id: number, data: Partial<Order>): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update order");
    return response.json();
  },

  async deleteOrder(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete order");
  },

  // Products
  async getProducts(params: { page?: number; limit?: number; search?: string } = {}): Promise<PaginatedResponse<Product>> {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.search) query.append("search", params.search);

    const response = await fetch(`${API_BASE_URL}/products?${query.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },

  async getProductById(id: number): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error("Failed to fetch product");
    return response.json();
  },

  async createProduct(data: Omit<Product, "id" | "supplier">): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create product");
    return response.json();
  },

  async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update product");
    return response.json();
  },

  async deleteProduct(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete product");
  },

  // Suppliers
  async getSuppliers(params: { page?: number; limit?: number; search?: string } = {}): Promise<PaginatedResponse<Supplier>> {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.search) query.append("search", params.search);

    const response = await fetch(`${API_BASE_URL}/suppliers?${query.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch suppliers");
    return response.json();
  },

  async getSupplierById(id: number): Promise<Supplier> {
    const response = await fetch(`${API_BASE_URL}/suppliers/${id}`);
    if (!response.ok) throw new Error("Failed to fetch supplier");
    return response.json();
  },

  async createSupplier(data: Omit<Supplier, "id">): Promise<Supplier> {
    const response = await fetch(`${API_BASE_URL}/suppliers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create supplier");
    return response.json();
  },

  async updateSupplier(id: number, data: Partial<Supplier>): Promise<Supplier> {
    const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update supplier");
    return response.json();
  },

  async deleteSupplier(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete supplier");
  },

  // Customers
  async getCustomers(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<Customer>> {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());
    const response = await fetch(`${API_BASE_URL}/customers?${query.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch customers");
    return response.json();
  },

  async createCustomer(data: Omit<Customer, "id">): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create customer");
    return response.json();
  },

  async updateCustomer(id: number, data: Partial<Omit<Customer, "id">>): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update customer");
    return response.json();
  },

  async deleteCustomer(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete customer");
  },
};
