// Pricing rules module placeholder: you can implement keystone multipliers, shipping buffers, etc.
export function applyPricingRules(cost: number, msrp?: number) {
  // Example: 2.2x markup with min margin
  const price = Math.max(cost * 2.2, 999); // PKR minimal price example
  return { price, compareAt: msrp ?? undefined };
}
