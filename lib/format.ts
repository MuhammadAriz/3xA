/**
 * Format a number as PKR currency
 */
export function formatPrice(price: number): string {
  return `PKR ${price.toLocaleString("en-PK")}`
}
