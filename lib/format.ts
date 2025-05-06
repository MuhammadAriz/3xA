/**
 * Format a number as PKR currency
 */
export function formatPrice(price: number): string {
  return `PKR ${price.toLocaleString("en-PK")}`
}

/**
 * Format a number as currency with the specified currency code
 * @param amount The amount to format
 * @param currency The currency code (default: 'PKR')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency = "PKR"): string {
  return `${currency} ${amount.toLocaleString("en-PK")}`
}
