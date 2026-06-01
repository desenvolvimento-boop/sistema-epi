export type SortDirection = 'asc' | 'desc';

export type SortState<K extends string = string> = {
  key: K;
  direction: SortDirection;
};

export function compareNullable<T>(
  a: T | null | undefined,
  b: T | null | undefined,
  compare: (x: T, y: T) => number,
): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return compare(a, b);
}

export function compareStrings(a: string, b: string): number {
  return a.localeCompare(b, 'pt-BR', { sensitivity: 'base' });
}

export function compareNumbers(a: number, b: number): number {
  return a - b;
}

export function sortListRows<T, K extends string>(
  items: T[],
  sort: SortState<K>,
  comparators: Record<K, (a: T, b: T) => number>,
): T[] {
  const compare = comparators[sort.key];
  if (!compare) return [...items];

  const sorted = [...items].sort((a, b) => {
    const result = compare(a, b);
    return sort.direction === 'asc' ? result : -result;
  });

  return sorted;
}
