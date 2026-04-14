import { resend } from "../config/resend";

export const emailService = {
  async sendOrderConfirmation(params: {
    to: string;
    orderId: string;
    amountGhs: number;
  }) {
    await resend.emails.send({
      from: "LuxeMart <no-reply@luxemart.dev>",
      to: params.to,
      subject: `Order confirmation #${params.orderId}`,
      html: `<p>Thanks for your order.</p><p>Order ID: ${params.orderId}</p><p>Total: GHS ${params.amountGhs.toFixed(
        2
      )}</p>`,
    });
  },
};

