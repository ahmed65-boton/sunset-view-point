"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus } from "lucide-react";

const menuCategories = [
  {
    name: "Appetizers",
    items: [
      {
        id: 1,
        name: "Truffle Arancini",
        description: "Crispy risotto balls with black truffle and parmesan",
        price: 450,
        image: "/truffle-arancini-appetizer.png",
      },
      {
        id: 2,
        name: "Seared Scallops",
        description: "Pan-seared scallops with cauliflower puree and pancetta",
        price: 600,
        image: "/seared-scallops-appetizer.png",
      },
      {
        id: 3,
        name: "Burrata Caprese",
        description: "Fresh burrata with heirloom tomatoes and basil oil",
        price: 400,
        image: "/burrata-caprese-appetizer.png",
      },
    ],
  },
  {
    name: "Main Courses",
    items: [
      {
        id: 4,
        name: "Grilled Chicken Tenderloin",
        description: "Grilled chicken with roasted vegetables and herb sauce",
        price: 850,
        image: "/wagyu-beef-tenderloin.png",
      },
      {
        id: 5,
        name: "Pan-Seared Salmon",
        description: "Atlantic salmon with lemon herb risotto and asparagus",
        price: 950,
        image: "/pan-seared-salmon.png",
      },
      {
        id: 6,
        name: "Duck Confit",
        description:
          "Slow-cooked duck leg with cherry gastrique and potato gratin",
        price: 1050,
        image: "/duck-confit-main.png",
      },
    ],
  },
  {
    name: "Desserts",
    items: [
      {
        id: 7,
        name: "Chocolate Soufflé",
        description: "Warm chocolate soufflé with vanilla bean ice cream",
        price: 350,
        image: "/chocolate-souffle-dessert.png",
      },
      {
        id: 8,
        name: "Tiramisu",
        description: "Classic Italian tiramisu with espresso and mascarpone",
        price: 300,
        image: "/tiramisu-dessert.png",
      },
    ],
  },
  {
    name: "Beverages",
    items: [
      {
        id: 9,
        name: "Fresh Lime Soda",
        description: "Refreshing lime soda with mint and ice",
        price: 120,
        image: "/fresh-lime-soda.png",
      },
      {
        id: 10,
        name: "Mango Lassi",
        description: "Traditional yogurt-based mango drink",
        price: 150,
        image: "/mango-lassi.png",
      },
      {
        id: 11,
        name: "Masala Chai",
        description: "Aromatic spiced tea with milk",
        price: 80,
        image: "/masala-chai.png",
      },
    ],
  },
];

export function MenuSection() {
  const [selectedItems, setSelectedItems] = useState<{ [key: number]: number }>(
    {}
  );
  const [activeCategory, setActiveCategory] = useState("Appetizers");

  const updateQuantity = (itemId: number, change: number) => {
    setSelectedItems((prev) => {
      const currentQty = prev[itemId] || 0;
      const newQty = Math.max(0, currentQty + change);
      if (newQty === 0) {
        const { [itemId]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: newQty };
    });
  };

  const getTotalItems = () => {
    return Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(selectedItems).reduce((total, [itemId, qty]) => {
      const item = menuCategories
        .flatMap((cat) => cat.items)
        .find((item) => item.id === Number.parseInt(itemId));
      return total + (item ? item.price * qty : 0);
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Our Menu</h2>
        {getTotalItems() > 0 && (
          <Badge variant="secondary" className="text-sm">
            {getTotalItems()} items selected • Rs {getTotalPrice()}
          </Badge>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {menuCategories.map((category) => (
          <Button
            key={category.name}
            variant={activeCategory === category.name ? "default" : "outline"}
            onClick={() => setActiveCategory(category.name)}
            className="text-sm"
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {menuCategories
          .find((cat) => cat.name === activeCategory)
          ?.items.map((item) => (
            <Card
              key={item.id}
              className="group hover:shadow-md transition-all duration-200"
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={item.image || "/placeholder.svg?height=80&width=80"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-foreground text-balance">
                        {item.name}
                      </h3>
                      <span className="font-bold text-primary">
                        Rs {item.price}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 text-pretty">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-2">
                      {selectedItems[item.id] ? (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {selectedItems[item.id]}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-sm"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
