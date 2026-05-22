export const filterSectionedData = <
  ItemType extends Record<string, unknown>,
  SectionType extends Record<string, unknown>
>(
  data: SectionType[],
  query: string,
  searchKeys: string[] = ['title'],
  childrenKey: string = 'items'
): SectionType[] => {
  const q = query?.trim().toLowerCase() || '';

  if (!q) return data;

  return data.reduce<SectionType[]>((acc, item) => {
    // Check if the parent object matches the query
    const itemMatches = searchKeys.some((key) => {
      const rawVal = item[key];
      // Only perform string search on primitives (strings or numbers)
      if (typeof rawVal === 'string' || typeof rawVal === 'number') {
        return String(rawVal).toLowerCase().includes(q);
      }
      return false;
    });

    // Extract and safely type-cast the nested children array
    const rawChildren = item[childrenKey];
    const children = Array.isArray(rawChildren)
      ? (rawChildren as ItemType[])
      : [];

    // Filter the nested children using the same search keys
    const matchedChildren = children.filter((child) =>
      searchKeys.some((key) => {
        const rawVal = child[key];
        // Only perform string search on primitives (strings or numbers)
        if (typeof rawVal === 'string' || typeof rawVal === 'number') {
          return String(rawVal).toLowerCase().includes(q);
        }
        return false;
      })
    );

    // Keep the entire item if it matches, or keep it with only the matching children
    if (itemMatches) {
      acc.push(item);
    } else if (matchedChildren.length > 0) {
      acc.push({ ...item, [childrenKey]: matchedChildren } as SectionType);
    }

    return acc;
  }, []);
};
