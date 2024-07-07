export const isPositiveNumber = (value: string | undefined): boolean => {
  if (!value) return false;
  const num = Number(value);
  return !!(num === 0 || (num && num >= 0));
};
