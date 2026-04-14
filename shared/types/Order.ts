export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type Order = {
  id: string;
  user_id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal_ghs: number;
  shipping_ghs: number;
  total_ghs: number;
  shipping_address: Record<string, unknown> | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

