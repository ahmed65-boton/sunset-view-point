import type { MenuCategory, MenuItem } from "@/lib/menu";
import { menuCategories } from "@/lib/menu";

export type CmsMenuItem = MenuItem & {
  category: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export function getStaticMenuItemRows(): CmsMenuItem[] {
  let index = 0;

  return menuCategories.flatMap((category) =>
    category.items.map((item) => ({
      ...item,
      category: category.name,
      sortOrder: index++,
      isActive: true,
    }))
  );
}

export function groupMenuItems(items: CmsMenuItem[]): MenuCategory[] {
  const grouped = new Map<string, MenuItem[]>();

  items
    .filter((item) => item.isActive !== false)
    .sort((a, b) => {
      if (a.category === b.category) return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      return a.category.localeCompare(b.category);
    })
    .forEach((item) => {
      const currentItems = grouped.get(item.category) ?? [];
      currentItems.push({
        id: item.id,
        name: item.name,
        description: item.description || "",
        price: item.price,
        image: item.image || "/placeholder.svg?height=108&width=108",
      });
      grouped.set(item.category, currentItems);
    });

  return Array.from(grouped.entries()).map(([name, items]) => ({ name, items }));
}

export function mergeStaticAndCmsMenu(cmsItems: CmsMenuItem[]) {
  const staticRows = getStaticMenuItemRows();
  const cmsById = new Map(cmsItems.map((item) => [String(item.id), item]));
  const staticIds = new Set(staticRows.map((item) => String(item.id)));

  const mergedStatic = staticRows
    .map((item) => {
      const override = cmsById.get(String(item.id));
      return override ? { ...item, ...override } : item;
    })
    .filter((item) => item.isActive !== false);

  const extraCmsItems = cmsItems.filter(
    (item) => !staticIds.has(String(item.id)) && item.isActive !== false
  );

  return [...mergedStatic, ...extraCmsItems].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}
