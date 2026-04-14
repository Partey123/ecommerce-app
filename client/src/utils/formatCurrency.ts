export const formatCurrency = (amount: number, currency = "GHS"): string =>
  new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);

