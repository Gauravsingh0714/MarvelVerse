export const unique = <T>(arr: T[]): T[] => Array.from(new Set(arr));

export const chunk = <T>(arr: T[], size: number): T[][] => {
  if (size <= 0) return [arr];
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

export const compact = <T>(
  arr: (T | null | undefined | false | 0 | '')[]
): T[] => arr.filter((item): item is T => Boolean(item));

export const groupBy = <T, K extends string | number | symbol>(
  arr: T[],
  keyFn: (item: T) => K
): Record<K, T[]> => {
  return arr.reduce(
    (acc, item) => {
      const key = keyFn(item);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    },
    {} as Record<K, T[]>
  );
};
