export const vehicleRules = {
  base: {
    year: { min: 1900, max: new Date().getFullYear() + 1 },
    price: { min: 1, max: 10_000_000 },
  },
};
