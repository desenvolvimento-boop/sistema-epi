export type FieldMatcher<T> = (row: T, filterValue: string) => boolean;

export interface ListFilterConfig<T> {
  searchText: (row: T) => string;
  fields?: Record<string, FieldMatcher<T>>;
}

export function filterListRows<T>(
  rows: T[],
  search: string,
  fieldValues: Record<string, string>,
  config: ListFilterConfig<T>,
): T[] {
  const q = search.trim().toLowerCase();

  return rows.filter((row) => {
    if (q) {
      const text = config.searchText(row).toLowerCase();
      if (!text.includes(q)) return false;
    }

    if (config.fields) {
      for (const [id, matcher] of Object.entries(config.fields)) {
        const value = fieldValues[id];
        if (value && !matcher(row, value)) return false;
      }
    }

    return true;
  });
}

export function activeStatusMatcher<T>(
  getActive: (row: T) => number | boolean,
): FieldMatcher<T> {
  return (row, value) => {
    const active = typeof getActive(row) === 'boolean' ? getActive(row) : getActive(row) === 1;
    return value === '1' ? active : !active;
  };
}
