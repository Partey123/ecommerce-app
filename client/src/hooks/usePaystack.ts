type PaystackHandlerArgs = {
  email: string;
  amountInPesewas: number;
  reference: string;
  metadata?: Record<string, unknown>;
};

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ?? "";

export const usePaystack = () => {
  const isConfigured = PAYSTACK_PUBLIC_KEY.length > 0;

  const initialize = async (_args: PaystackHandlerArgs) => {
    if (!isConfigured) {
      throw new Error("Missing VITE_PAYSTACK_PUBLIC_KEY");
    }

    // Placeholder for popup SDK integration; this removes the stub and centralizes the API.
    throw new Error("Paystack popup integration is not implemented yet");
  };

  return { initialize, isConfigured };
};

