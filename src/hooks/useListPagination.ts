import { useEffect, useMemo, useState } from 'react';

export const LIST_PAGE_SIZE_OPTIONS = [20, 50, 100] as const;
export type ListPageSize = (typeof LIST_PAGE_SIZE_OPTIONS)[number];

export function useListPagination<T>(items: T[], initialPageSize: ListPageSize = 20) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<ListPageSize>(initialPageSize);

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);

  useEffect(() => {
    setPage(1);
  }, [items, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedItems = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize],
  );

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const handlePageSizeChange = (size: ListPageSize) => {
    setPageSize(size);
  };

  return {
    page,
    setPage,
    pageSize,
    setPageSize: handlePageSizeChange,
    paginatedItems,
    total,
    totalPages,
    from,
    to,
  };
}
