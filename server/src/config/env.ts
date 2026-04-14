type RequiredEnvVars = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  PAYSTACK_SECRET_KEY: string;
  PAYSTACK_WEBHOOK_SECRET: string;
  RESEND_API_KEY: string;
  CLIENT_URL: string;
  PORT: number;
};

const readEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const portValue = process.env.PORT ?? "5000";
const parsedPort = Number(portValue);
if (!Number.isFinite(parsedPort) || parsedPort <= 0) {
  throw new Error("Invalid PORT value. PORT must be a positive number.");
}

export const env: RequiredEnvVars = {
  SUPABASE_URL: readEnvVar("SUPABASE_URL"),
  SUPABASE_SERVICE_ROLE_KEY: readEnvVar("SUPABASE_SERVICE_ROLE_KEY"),
  PAYSTACK_SECRET_KEY: readEnvVar("PAYSTACK_SECRET_KEY"),
  PAYSTACK_WEBHOOK_SECRET: readEnvVar("PAYSTACK_WEBHOOK_SECRET"),
  RESEND_API_KEY: readEnvVar("RESEND_API_KEY"),
  CLIENT_URL: readEnvVar("CLIENT_URL"),
  PORT: parsedPort,
};

