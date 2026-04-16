/**
 * Sortable data table with configurable columns and number formatting.
 */

import React, { useState, useMemo } from 'react';

interface Column {
 key: string;
 label: string;
 format?: (value: unknown) => string;
 align?: 'left' | 'right';
}

interface DataTableProps {
 columns: Column[];
 data: Record<string, unknown>[];
 caption?: string;
 highlightBest?: string;
}

function defaultFormat(value: unknown): string {
 if (typeof value === 'number') {
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(2);
 }
 return String(value ?? '');
}

export default function DataTable({
 columns,
 data,
 caption,
 highlightBest,
}: DataTableProps): React.ReactElement {
 const [sortKey, setSortKey] = useState<string | null>(null);
 const [sortAsc, setSortAsc] = useState(true);

 const sorted = useMemo(() => {
  if (!sortKey) return data;
  return [...data].sort((a, b) => {
   const av = a[sortKey];
   const bv = b[sortKey];
   if (typeof av === 'number' && typeof bv === 'number') {
    return sortAsc ? av - bv : bv - av;
   }
   return sortAsc
    ? String(av).localeCompare(String(bv))
    : String(bv).localeCompare(String(av));
  });
 }, [data, sortKey, sortAsc]);

 const bestValues = useMemo(() => {
  if (!highlightBest) return new Map<number, boolean>();
  const maxVal = Math.max(
   ...data.map((d) => {
    const v = d[highlightBest];
    return typeof v === 'number' ? v : -Infinity;
   }),
  );
  const result = new Map<number, boolean>();
  sorted.forEach((d, i) => {
   if (d[highlightBest] === maxVal) result.set(i, true);
  });
  return result;
 }, [sorted, highlightBest, data]);

 const handleSort = (key: string) => {
  if (sortKey === key) {
   setSortAsc(!sortAsc);
  } else {
   setSortKey(key);
   setSortAsc(false);
  }
 };

 return (
  <table>
   {caption && <caption>{caption}</caption>}
   <thead>
    <tr>
     {columns.map((col) => (
      <th
       key={col.key}
       onClick={() => handleSort(col.key)}
       style={{ cursor: 'pointer', textAlign: col.align ?? 'left' }}
      >
       {col.label}
       {sortKey === col.key ? (sortAsc ? ' \u25B2' : ' \u25BC') : ''}
      </th>
     ))}
    </tr>
   </thead>
   <tbody>
    {sorted.map((row, i) => (
     <tr key={i}>
      {columns.map((col) => (
       <td
        key={col.key}
        style={{
         textAlign: col.align ?? 'left',
         fontWeight: bestValues.get(i) && col.key === highlightBest ? 'bold' : 'normal',
        }}
       >
        {(col.format ?? defaultFormat)(row[col.key])}
       </td>
      ))}
     </tr>
    ))}
   </tbody>
  </table>
 );
}
