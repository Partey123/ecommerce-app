import { supabase } from "../config/supabase";
import { OrderModel, PaymentStatus } from "../models/Order";

export const paymentService = {
  async recordTransaction(payload: {
    orderId: string;
    providerReference: string;
    amountGhs: number;
    status: PaymentStatus;
    rawPayload: Record<string, unknown>;
  }) {
    const { data, error } = await supabase
      .from("payment_transactions")
      .upsert(
        {
          order_id: payload.orderId,
          provider_reference: payload.providerReference,
          amount_ghs: payload.amountGhs,
          status: payload.status,
          payload: payload.rawPayload,
        },
        { onConflict: "provider_reference" }
      )
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },

  async markOrderPaid(orderId: string) {
    return OrderModel.updatePaymentStatus(orderId, "PAID", "PAID");
  },
};

