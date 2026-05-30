import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';
import './DualList.css';

export interface DualListItem {
  id: number;
  label: string;
}

interface DualListProps {
  available: DualListItem[];
  selectedIds: number[];
  onChange: (selectedIds: number[]) => void;
  availableTitle?: string;
  selectedTitle?: string;
  loading?: boolean;
  emptyAvailableMessage?: string;
  emptySelectedMessage?: string;
  searchPlaceholder?: string;
}

const filterBySearch = (items: DualListItem[], query: string) => {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((item) => item.label.toLowerCase().includes(q));
};

export const DualList = ({
  available,
  selectedIds,
  onChange,
  availableTitle = 'Disponíveis',
  selectedTitle = 'Selecionados',
  loading = false,
  emptyAvailableMessage = 'Nenhum item disponível',
  emptySelectedMessage = 'Nenhum item selecionado',
  searchPlaceholder = 'Buscar...',
}: DualListProps) => {
  const [pickedAvailable, setPickedAvailable] = useState<number[]>([]);
  const [pickedSelected, setPickedSelected] = useState<number[]>([]);
  const [availableSearch, setAvailableSearch] = useState('');
  const [selectedSearch, setSelectedSearch] = useState('');

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const availableItems = useMemo(
    () => available.filter((item) => !selectedSet.has(item.id)),
    [available, selectedSet],
  );

  const selectedItems = useMemo(
    () =>
      selectedIds
        .map((id) => available.find((item) => item.id === id))
        .filter((item): item is DualListItem => item != null),
    [available, selectedIds],
  );

  const filteredAvailableItems = useMemo(
    () => filterBySearch(availableItems, availableSearch),
    [availableItems, availableSearch],
  );

  const filteredSelectedItems = useMemo(
    () => filterBySearch(selectedItems, selectedSearch),
    [selectedItems, selectedSearch],
  );

  const togglePick = (list: 'available' | 'selected', id: number) => {
    if (list === 'available') {
      setPickedAvailable((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      );
      return;
    }
    setPickedSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const moveToSelected = (ids: number[]) => {
    if (ids.length === 0) return;
    const next = [...selectedIds];
    for (const id of ids) {
      if (!next.includes(id)) next.push(id);
    }
    onChange(next);
    setPickedAvailable([]);
  };

  const moveToAvailable = (ids: number[]) => {
    if (ids.length === 0) return;
    const remove = new Set(ids);
    onChange(selectedIds.filter((id) => !remove.has(id)));
    setPickedSelected([]);
  };

  const renderList = (
    items: DualListItem[],
    picked: number[],
    list: 'available' | 'selected',
    emptyMessage: string,
  ) => (
    <ul className="dual-list-items" role="listbox" aria-multiselectable="true">
      {items.length === 0 ? (
        <li className="dual-list-empty">{emptyMessage}</li>
      ) : (
        items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={`dual-list-item ${picked.includes(item.id) ? 'dual-list-item--picked' : ''}`}
              onClick={() => togglePick(list, item.id)}
              onDoubleClick={() =>
                list === 'available'
                  ? moveToSelected([item.id])
                  : moveToAvailable([item.id])
              }
            >
              {item.label}
            </button>
          </li>
        ))
      )}
    </ul>
  );

  const renderSearch = (value: string, onChangeSearch: (v: string) => void) => (
    <div className="dual-list-search">
      <Search className="dual-list-search-icon" size={16} aria-hidden />
      <input
        type="text"
        className="dual-list-search-input"
        placeholder={searchPlaceholder}
        value={value}
        onChange={(e) => onChangeSearch(e.target.value)}
        aria-label={searchPlaceholder}
      />
    </div>
  );

  const listEmptyMessage = (
    filtered: DualListItem[],
    all: DualListItem[],
    search: string,
    defaultMessage: string,
  ) => {
    if (filtered.length > 0) return defaultMessage;
    if (search.trim() && all.length > 0) return 'Nenhum resultado encontrado';
    return defaultMessage;
  };

  const renderPanel = (
    title: string,
    search: string,
    onSearchChange: (v: string) => void,
    items: DualListItem[],
    allItems: DualListItem[],
    picked: number[],
    list: 'available' | 'selected',
    emptyMessage: string,
  ) => (
    <div className="dual-list-panel">
      <span className="dual-list-panel-title">{title}</span>
      {renderSearch(search, onSearchChange)}
      {renderList(
        items,
        picked,
        list,
        listEmptyMessage(items, allItems, search, emptyMessage),
      )}
    </div>
  );

  return (
    <div className={`dual-list ${loading ? 'dual-list--loading' : ''}`}>
      {renderPanel(
        availableTitle,
        availableSearch,
        setAvailableSearch,
        filteredAvailableItems,
        availableItems,
        pickedAvailable,
        'available',
        emptyAvailableMessage,
      )}

      <div className="dual-list-actions">
        <button
          type="button"
          className="dual-list-action-btn"
          title="Adicionar selecionados"
          disabled={pickedAvailable.length === 0}
          onClick={() => moveToSelected(pickedAvailable)}
        >
          <ChevronRight className="dual-list-action-icon" />
        </button>
        <button
          type="button"
          className="dual-list-action-btn"
          title="Adicionar todos"
          disabled={availableItems.length === 0}
          onClick={() => moveToSelected(availableItems.map((i) => i.id))}
        >
          <ChevronsRight className="dual-list-action-icon" />
        </button>
        <button
          type="button"
          className="dual-list-action-btn"
          title="Remover selecionados"
          disabled={pickedSelected.length === 0}
          onClick={() => moveToAvailable(pickedSelected)}
        >
          <ChevronLeft className="dual-list-action-icon" />
        </button>
        <button
          type="button"
          className="dual-list-action-btn"
          title="Remover todos"
          disabled={selectedItems.length === 0}
          onClick={() => moveToAvailable(selectedItems.map((i) => i.id))}
        >
          <ChevronsLeft className="dual-list-action-icon" />
        </button>
      </div>

      {renderPanel(
        selectedTitle,
        selectedSearch,
        setSelectedSearch,
        filteredSelectedItems,
        selectedItems,
        pickedSelected,
        'selected',
        emptySelectedMessage,
      )}
    </div>
  );
};
