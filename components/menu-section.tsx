// D:\CO Laptop Data\sunset-view-point-main\components\menu-section.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus } from "lucide-react";

const menuCategories = [
  {
    name: "BBQ",
    items: [
      { id: 1, name: "Chicken Tikka Boti (5 Pieces)", description: "", price: 450, image: "/truffle-arancini-appetizer.png" },
      { id: 2, name: "Chicken Green Tikka Boti (5 Pieces)", description: "", price: 470, image: "/truffle-arancini-appetizer.png" },
      { id: 3, name: "Chicken Malai Boti (5 Pieces)", description: "", price: 590, image: "/truffle-arancini-appetizer.png" },
      { id: 4, name: "Reshmi Kebab (2 Pieces)", description: "", price: 460, image: "/truffle-arancini-appetizer.png" },
    ],
  },
  {
    name: "Traditional",
    items: [
      { id: 5, name: "Chicken Karahi (Half)", description: "", price: 950, image: "/wagyu-beef-tenderloin.png" },
      { id: 6, name: "Chicken Karahi (Full)", description: "", price: 1800, image: "/wagyu-beef-tenderloin.png" },
      { id: 7, name: "Chicken White Karahi (Half)", description: "", price: 1050, image: "/wagyu-beef-tenderloin.png" },
      { id: 8, name: "Chicken White Karahi (Full)", description: "", price: 1950, image: "/wagyu-beef-tenderloin.png" },
      { id: 9, name: "Chicken Handi Boneless (Half)", description: "", price: 1050, image: "/wagyu-beef-tenderloin.png" },
      { id: 10, name: "Chicken Handi Boneless (Full)", description: "", price: 2000, image: "/wagyu-beef-tenderloin.png" },
      { id: 11, name: "Chicken Ginger Handi (Half)", description: "", price: 1050, image: "/wagyu-beef-tenderloin.png" },
      { id: 12, name: "Chicken Ginger Handi (Full)", description: "", price: 2000, image: "/wagyu-beef-tenderloin.png" },
      { id: 13, name: "Mutton Karahi (Half)", description: "", price: 1550, image: "/wagyu-beef-tenderloin.png" },
      { id: 14, name: "Mutton Karahi (Full)", description: "", price: 3000, image: "/wagyu-beef-tenderloin.png" },
      { id: 15, name: "Kabuli Pulao (One Plate)", description: "", price: 850, image: "/wagyu-beef-tenderloin.png" },
      { id: 16, name: "Russian Salad (One Bowl)", description: "", price: 520, image: "/wagyu-beef-tenderloin.png" },
      { id: 17, name: "Fresh Salad (One Plate)", description: "", price: 150, image: "/wagyu-beef-tenderloin.png" },
      { id: 18, name: "Dahi Raita (One Bowl)", description: "", price: 300, image: "/wagyu-beef-tenderloin.png" },
      { id: 19, name: "Chutney (One Bowl)", description: "", price: 100, image: "/wagyu-beef-tenderloin.png" },
    ],
  },
  {
    name: "Dessert",
    items: [
      { id: 20, name: "Gajar ka Halwa single serving", description: "", price: 580, image: "/chocolate-souffle-dessert.png" },
      { id: 21, name: "Gulabjammun (2 pieces)", description: "", price: 80, image: "/chocolate-souffle-dessert.png" },
      { id: 22, name: "Gulabjammun (4 pieces)", description: "", price: 150, image: "/chocolate-souffle-dessert.png" },
    ],
  },
  {
    name: "Beverages",
    items: [
      { id: 23, name: "Cappuchino", description: "", price: 400, image: "/fresh-lime-soda.png" },
      { id: 24, name: "Hot Latte", description: "", price: 400, image: "/fresh-lime-soda.png" },
      { id: 25, name: "Expresso", description: "", price: 400, image: "/fresh-lime-soda.png" },
      { id: 26, name: "Black coffee", description: "", price: 250, image: "/fresh-lime-soda.png" },
      { id: 27, name: "Green Tea", description: "", price: 80, image: "/fresh-lime-soda.png" },
      { id: 28, name: "Karak Tea", description: "", price: 160, image: "/fresh-lime-soda.png" },
      { id: 29, name: "Cardomom Tea", description: "", price: 160, image: "/fresh-lime-soda.png" },
      { id: 30, name: "Black Tea", description: "", price: 80, image: "/fresh-lime-soda.png" },
      { id: 31, name: "Juice", description: "", price: 80, image: "/fresh-lime-soda.png" },
      { id: 32, name: "Mineral water(1.5 lit)", description: "", price: 140, image: "/fresh-lime-soda.png" },
      { id: 33, name: "Mineral water(330 ml)", description: "", price: 70, image: "/fresh-lime-soda.png" },
      { id: 34, name: "Sting", description: "", price: 120, image: "/fresh-lime-soda.png" },
      { id: 35, name: "Cold Drink (Tin)", description: "", price: 100, image: "/fresh-lime-soda.png" },
      { id: 36, name: "Cold drink (1.5 lit)", description: "", price: 180, image: "/fresh-lime-soda.png" },
      { id: 37, name: "Fresh Lime", description: "", price: 150, image: "/fresh-lime-soda.png" },
      { id: 38, name: "Mint Margarita", description: "", price: 270, image: "/fresh-lime-soda.png" },
    ],
  },
  {
    name: "Pizza",
    items: [
      { id: 39, name: "SVP Special Medium (9 inch)", description: "", price: 1400, image: "/pan-seared-salmon.png" },
      { id: 40, name: "SVP Special Large (14 inch)", description: "", price: 1900, image: "/pan-seared-salmon.png" },
      { id: 41, name: "Chicken Fajita Medium (9 Inch)", description: "", price: 1400, image: "/pan-seared-salmon.png" },
      { id: 42, name: "Chicken Fajita Large (14 Inch)", description: "", price: 1850, image: "/pan-seared-salmon.png" },
      { id: 43, name: "Cheese Lovers Medium (9 Inch)", description: "", price: 1400, image: "/pan-seared-salmon.png" },
      { id: 44, name: "Cheese Lovers Medium (9 Inch)", description: "", price: 1850, image: "/pan-seared-salmon.png" },
      { id: 45, name: "Spicy Tikka Medium (9 inch)", description: "", price: 1400, image: "/pan-seared-salmon.png" },
      { id: 46, name: "Spicy Tikka Medium (9 inch)", description: "", price: 1850, image: "/pan-seared-salmon.png" },
      { id: 47, name: "Chicken Supreme Medium (9 inch)", description: "", price: 1400, image: "/pan-seared-salmon.png" },
      { id: 48, name: "Chicken Supreme Medium (9 inch)", description: "", price: 1850, image: "/pan-seared-salmon.png" },
      { id: 49, name: "Extra Toppings (Cheese/ Chicken & Vegetables)", description: "", price: 200, image: "/pan-seared-salmon.png" },
    ],
  },
  {
    name: "Snacks",
    items: [
      { id: 50, name: "Alu Samosa", description: "", price: 50, image: "/seared-scallops-appetizer.png" },
      { id: 51, name: "Mix Pakoray", description: "", price: 230, image: "/seared-scallops-appetizer.png" },
      { id: 52, name: "Nuggets (3 Pieces)", description: "", price: 150, image: "/seared-scallops-appetizer.png" },
      { id: 53, name: "Veg Roll", description: "", price: 50, image: "/seared-scallops-appetizer.png" },
      { id: 54, name: "French Fries", description: "", price: 250, image: "/seared-scallops-appetizer.png" },
      { id: 55, name: "Loaded Fries", description: "", price: 400, image: "/seared-scallops-appetizer.png" },
      { id: 56, name: "Anda Shami Burger Special", description: "", price: 450, image: "/seared-scallops-appetizer.png" },
      { id: 57, name: "Burger Crunch", description: "", price: 500, image: "/seared-scallops-appetizer.png" },
      { id: 58, name: "Club Sandwich", description: "", price: 480, image: "/seared-scallops-appetizer.png" },
    ],
  },
  {
    name: "Brunch",
    items: [
      { id: 59, name: "Chicken Haleem", description: "", price: 280, image: "/duck-confit-main.png" },
      { id: 60, name: "Chicken Nihari", description: "", price: 320, image: "/duck-confit-main.png" },
      { id: 61, name: "Beef Haleem", description: "", price: 320, image: "/duck-confit-main.png" },
      { id: 62, name: "Shahi Murgh Channa", description: "", price: 320, image: "/duck-confit-main.png" },
      { id: 63, name: "Saada Channa", description: "", price: 240, image: "/duck-confit-main.png" },
      { id: 64, name: "Alu Bhujiya", description: "", price: 145, image: "/duck-confit-main.png" },
      { id: 65, name: "Fried Egg", description: "", price: 45, image: "/duck-confit-main.png" },
      { id: 66, name: "Simple Omlete", description: "", price: 70, image: "/duck-confit-main.png" },
      { id: 67, name: "Cheese Omlete", description: "", price: 130, image: "/duck-confit-main.png" },
      { id: 68, name: "Fluffy Omlete", description: "", price: 110, image: "/duck-confit-main.png" },
      { id: 69, name: "Halwa (Suji)", description: "", price: 250, image: "/duck-confit-main.png" },
      { id: 70, name: "Puri", description: "", price: 80, image: "/duck-confit-main.png" },
      { id: 71, name: "Paratha", description: "", price: 80, image: "/duck-confit-main.png" },
      { id: 72, name: "Alu Paratha", description: "", price: 120, image: "/duck-confit-main.png" },
      { id: 73, name: "Lassi (One Glass)", description: "", price: 80, image: "/duck-confit-main.png" },
      { id: 74, name: "Lassi (One Jug)", description: "", price: 390, image: "/duck-confit-main.png" },
      { id: 75, name: "Naan Roghni", description: "", price: 70, image: "/duck-confit-main.png" },
      { id: 76, name: "Naan Saada", description: "", price: 50, image: "/duck-confit-main.png" },
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
                    {item.description ? (
                    <p className="text-sm text-muted-foreground mb-3 text-pretty">
                      {item.description}
                    </p>
                    ) : null}

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
