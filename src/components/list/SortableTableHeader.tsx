import React from 'react';
import clsx from 'clsx';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import type { SortDirection, SortState } from '../../utils/listSort';
import './SortableTableHeader.css';

interface SortableTableHeaderProps<K extends string> {
  label: string;
  sortKey: K;
  activeSort: SortState<K>;
  onSort: (key: K) => void;
  className?: string;
  align?: 'left' | 'right';
}

export function SortableTableHeader<K extends string>({
  label,
  sortKey,
  activeSort,
  onSort,
  className,
  align = 'left',
}: SortableTableHeaderProps<K>) {
  const isActive = activeSort.key === sortKey;
  const direction: SortDirection | null = isActive ? activeSort.direction : null;

  const SortIcon = isActive
    ? direction === 'asc'
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown;

  return (
    <th
      className={clsx('sortable-th', align === 'right' && 'sortable-th--right', className)}
      aria-sort={
        isActive ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'
      }
    >
      <button
        type="button"
        className="sortable-th-btn"
        onClick={() => onSort(sortKey)}
      >
        <span>{label}</span>
        <SortIcon
          className={clsx('sortable-th-icon', !isActive && 'sortable-th-icon--muted')}
          aria-hidden
        />
      </button>
    </th>
  );
}
