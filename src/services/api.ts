import { Order, PaginatedResponse, Product, Customer } from "@/types";

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

  // Customers
  async getCustomers(): Promise<PaginatedResponse<Customer>> {
    const response = await fetch(`${API_BASE_URL}/customers`);
    if (!response.ok) throw new Error("Failed to fetch customers");
    return response.json();
  },
};
