"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, Search, ShoppingBag, Trash2, Utensils } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  formatCurrency,
  getOrderSubtotal,
  getTotalQuantity,
  menuCategories,
  type SelectedMenuItems,
} from "@/lib/menu";
import { cn } from "@/lib/utils";

type MenuSectionProps = {
  selectedItems: SelectedMenuItems;
  onSelectedItemsChange: (items: SelectedMenuItems) => void;
};

export function MenuSection({ selectedItems, onSelectedItemsChange }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState(menuCategories[0]?.name ?? "");
  const [searchTerm, setSearchTerm] = useState("");

  const totalItems = getTotalQuantity(selectedItems);
  const subtotal = getOrderSubtotal(selectedItems);

  const visibleItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (normalizedSearch) {
      return menuCategories
        .flatMap((category) => category.items.map((item) => ({ ...item, category: category.name })))
        .filter((item) => item.name.toLowerCase().includes(normalizedSearch));
    }

    return (
      menuCategories
        .find((category) => category.name === activeCategory)
        ?.items.map((item) => ({ ...item, category: activeCategory })) ?? []
    );
  }, [activeCategory, searchTerm]);

  const activeCategoryCount = menuCategories.find((category) => category.name === activeCategory)?.items.length ?? 0;

  const updateQuantity = (itemId: number, change: number) => {
    const currentQty = selectedItems[itemId] ?? 0;
    const newQty = Math.max(0, currentQty + change);

    if (newQty === 0) {
      const { [itemId]: removed, ...rest } = selectedItems;
      onSelectedItemsChange(rest);
      return;
    }

    onSelectedItemsChange({ ...selectedItems, [itemId]: newQty });
  };

  return (
    <div className="space-y-6">
      <div className="surface-card p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="section-kicker mb-3"><Utensils className="mr-2 h-3.5 w-3.5" /> Select your order</span>
            <h2 className="text-3xl font-black tracking-tight text-foreground">Explore the menu</h2>
            <p className="mt-2 max-w-2xl text-pretty text-sm leading-6 text-muted-foreground">
              Add dishes to your reservation and your booking summary will update automatically.
            </p>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm">
            <p className="font-bold text-primary">{totalItems} item{totalItems === 1 ? "" : "s"}</p>
            <p className="text-muted-foreground">Subtotal: {formatCurrency(subtotal)}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search BBQ, karahi, pizza, tea..."
              className="pl-11"
              aria-label="Search menu"
            />
          </div>

          {totalItems > 0 && (
            <Badge variant="secondary" className="w-fit rounded-full px-4 py-2 text-sm">
              <ShoppingBag className="mr-1 h-4 w-4" /> {formatCurrency(subtotal)} selected
            </Badge>
          )}
        </div>
      </div>

      {!searchTerm && (
        <div className="sticky top-20 z-20 -mx-4 overflow-x-auto bg-background/85 px-4 py-3 backdrop-blur md:rounded-2xl md:border md:border-border/60 md:shadow-sm">
          <div className="flex min-w-max gap-2">
            {menuCategories.map((category) => (
              <Button
                key={category.name}
                type="button"
                variant={activeCategory === category.name ? "default" : "outline"}
                onClick={() => setActiveCategory(category.name)}
                className="h-10 text-sm"
              >
                {category.name}
                <span className="rounded-full bg-background/25 px-2 py-0.5 text-xs">{category.items.length}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-muted-foreground">
          {searchTerm ? `${visibleItems.length} search result${visibleItems.length === 1 ? "" : "s"}` : `${activeCategory} - ${activeCategoryCount} item${activeCategoryCount === 1 ? "" : "s"}`}
        </p>
        {searchTerm && (
          <Button type="button" variant="ghost" size="sm" onClick={() => setSearchTerm("")}>Clear search</Button>
        )}
      </div>

      <div className="scrollbar-soft max-h-[42rem] space-y-4 overflow-y-auto pr-1">
        {visibleItems.length === 0 ? (
          <Card className="surface-card">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              No menu items matched your search. Try a different dish name or category.
            </CardContent>
          </Card>
        ) : (
          visibleItems.map((item) => {
            const quantity = selectedItems[item.id] ?? 0;
            const isSelected = quantity > 0;

            return (
              <Card
                key={item.id}
                className={cn(
                  "group overflow-hidden py-0 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
                  isSelected && "border-primary/35 bg-primary/5 shadow-md shadow-primary/10"
                )}
              >
                <CardContent className="p-4">
                  <div className="grid gap-4 sm:grid-cols-[6.75rem_1fr]">
                    <div className="relative overflow-hidden rounded-2xl">
                      <img
                        src={item.image || "/placeholder.svg?height=108&width=108"}
                        alt={item.name}
                        className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110 sm:h-[6.75rem]"
                      />
                      {isSelected && (
                        <div className="absolute right-2 top-2 rounded-full bg-primary px-2 py-1 text-xs font-bold text-primary-foreground shadow-sm">
                          x{quantity}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-balance font-bold text-foreground">{item.name}</h3>
                          {searchTerm && <p className="mt-1 text-xs font-medium text-muted-foreground">{item.category}</p>}
                        </div>
                        <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-sm font-black text-primary">
                          {formatCurrency(item.price)}
                        </span>
                      </div>

                      {item.description ? (
                        <p className="mb-3 text-pretty text-sm leading-6 text-muted-foreground">{item.description}</p>
                      ) : (
                        <p className="mb-3 text-sm text-muted-foreground">Freshly prepared for your table.</p>
                      )}

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                          {isSelected ? (
                            <>
                              <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, -1)}
                                className="size-9"
                                aria-label={`Remove one ${item.name}`}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-10 text-center text-lg font-black">{quantity}</span>
                              <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, 1)}
                                className="size-9"
                                aria-label={`Add one ${item.name}`}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <Button type="button" size="sm" onClick={() => updateQuantity(item.id, 1)}>
                              <Plus className="h-4 w-4" /> Add to order
                            </Button>
                          )}
                        </div>

                        {isSelected && (
                          <span className="rounded-full bg-card px-3 py-1 text-sm font-bold text-foreground shadow-sm">
                            Line total: {formatCurrency(item.price * quantity)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {totalItems > 0 && (
        <Card className="border-primary/25 bg-primary/10 shadow-lg shadow-primary/10">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-black text-foreground">Current order subtotal: {formatCurrency(subtotal)}</p>
              <p className="text-sm text-muted-foreground">Members receive 25% off selected food at checkout.</p>
            </div>
            <Button type="button" variant="outline" onClick={() => onSelectedItemsChange({})}>
              <Trash2 className="h-4 w-4" /> Clear order
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
