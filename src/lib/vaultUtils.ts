export function mergeListById<T extends { id: string; updatedAt: string }>(
  a: T[],
  b: T[],
): T[] {
  const map = new Map<string, T>();
  for (const item of a) map.set(item.id, item);
  for (const item of b) {
    const existing = map.get(item.id);
    if (!existing || new Date(item.updatedAt) >= new Date(existing.updatedAt)) {
      map.set(item.id, item);
    }
  }
  return Array.from(map.values());
}
