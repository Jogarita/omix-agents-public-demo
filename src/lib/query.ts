/* eslint-disable @typescript-eslint/no-explicit-any */

/** AND-logic filter: every key in `filters` must match the record's value */
export function queryData<T>(
  data: T[],
  filters: Partial<Record<string, unknown>>
): T[] {
  return data.filter((item) =>
    Object.entries(filters).every(([key, value]) => (item as any)[key] === value)
  );
}

/** Case-insensitive text search across all string fields */
export function searchData<T>(
  data: T[],
  term: string
): T[] {
  const lower = term.toLowerCase();
  return data.filter((item) =>
    Object.values(item as any).some(
      (v: any) => typeof v === "string" && v.toLowerCase().includes(lower)
    )
  );
}

/** Find a single record by `id` field */
export function findById<T extends { id: string }>(
  data: T[],
  id: string
): T | undefined {
  return data.find((item) => item.id === id);
}

/** Group records by a field value */
export function groupBy<T>(
  data: T[],
  field: keyof T
): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const item of data) {
    const key = String(item[field]);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }
  return groups;
}

/** Filter by ISO date-string range (inclusive) */
export function filterByDateRange<T>(
  data: T[],
  dateField: keyof T,
  start: string,
  end: string
): T[] {
  return data.filter((item) => {
    const val = item[dateField];
    if (typeof val !== "string") return false;
    return val >= start && val <= end;
  });
}
