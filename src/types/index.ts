export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  phone: string;
}

export interface Supplier {
  id: number;
  companyName: string;
  contactName: string;
  contactTitle: string;
  city: string;
  country: string;
  phone: string;
  fax: string | null;
}

export interface Product {
  id: number;
  productName: string;
  supplierId: number;
  unitPrice: number;
  package: string;
  isDiscontinued: boolean;
  supplier?: Supplier;
}

export interface OrderItem {
  id?: number;
  orderId?: number;
  productId: number;
  unitPrice: number;
  quantity: number;
  product?: Product;
}

export interface Order {
  id: number;
  orderDate: string;
  orderNumber: string;
  customerId: number;
  totalAmount: number;
  customer?: Customer;
  items?: OrderItem[];
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}
