import { supabase } from "../config/supabase";

export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type OrderRow = {
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

export type OrderItemInsert = {
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price_ghs: number;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price_ghs: number;
  created_at: string;
};

export const OrderModel = {
  async listByUser(userId: string): Promise<OrderRow[]> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as OrderRow[];
  },

  async listAll(): Promise<OrderRow[]> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as OrderRow[];
  },

  async getById(orderId: string): Promise<OrderRow | null> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();
    if (error) throw error;
    return (data as OrderRow | null) ?? null;
  },

  async listItems(orderId: string): Promise<OrderItemRow[]> {
    const { data, error } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as OrderItemRow[];
  },

  async create(payload: {
    user_id: string;
    subtotal_ghs: number;
    shipping_ghs: number;
    total_ghs: number;
    shipping_address?: Record<string, unknown> | null;
    notes?: string | null;
  }): Promise<OrderRow> {
    const { data, error } = await supabase
      .from("orders")
      .insert(payload)
      .select("*")
      .single();
    if (error) throw error;
    return data as OrderRow;
  },

  async insertItems(items: OrderItemInsert[]): Promise<void> {
    if (items.length === 0) return;
    const { error } = await supabase.from("order_items").insert(items);
    if (error) throw error;
  },

  async updatePaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus,
    orderStatus?: OrderStatus
  ): Promise<OrderRow> {
    const payload: Partial<OrderRow> = { payment_status: paymentStatus };
    if (orderStatus) payload.status = orderStatus;

    const { data, error } = await supabase
      .from("orders")
      .update(payload)
      .eq("id", orderId)
      .select("*")
      .single();
    if (error) throw error;
    return data as OrderRow;
  },
};

