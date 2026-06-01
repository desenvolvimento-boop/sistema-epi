import { useCallback, useMemo, useState } from 'react';
import { sortListRows, type SortState } from '../utils/listSort';

export function useListSort<T, K extends string>(
  items: T[],
  comparators: Record<K, (a: T, b: T) => number>,
  defaultSort: SortState<K> = { key: 'id' as K, direction: 'asc' },
) {
  const [sort, setSort] = useState<SortState<K>>(defaultSort);

  const toggleSort = useCallback((key: K) => {
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    );
  }, []);

  const sortedItems = useMemo(
    () => sortListRows(items, sort, comparators),
    [items, sort, comparators],
  );

  return { sort, toggleSort, sortedItems, setSort };
}
