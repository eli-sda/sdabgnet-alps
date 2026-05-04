export const filterSectionedData = <
  ItemType extends Record<string, unknown>,
  SectionType extends { items?: ItemType[] }
>(
  data: SectionType[],
  query: string,
  searchKeys: (keyof ItemType)[] = ['title' as keyof ItemType]
): SectionType[] => {
  const q = query?.trim().toLowerCase() || '';

  if (!q) return data;

  const mapped = data
    .map((section) => {
      const items: ItemType[] = section.items ?? [];
      const matchedItems = items.filter((item) => {
        // Check if any of the provided keys match the query
        return searchKeys.some((key) => {
          const raw = item[key];
          const val = String(raw ?? '').toLowerCase();
          return val.includes(q);
        });
      });

      return matchedItems.length > 0
        ? ({ ...section, items: matchedItems } as SectionType & {
            items: ItemType[];
          })
        : null;
    })
    .filter((s): s is SectionType & { items: ItemType[] } => s !== null);

  return mapped as SectionType[];
};
