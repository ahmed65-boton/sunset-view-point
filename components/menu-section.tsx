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
      { id: 1, name: "Chicken Tikka Boti (5 Pieces)", description: "", price: 450, image: "/tikk.jpg" },
      { id: 2, name: "Chicken Green Tikka Boti (5 Pieces)", description: "", price: 470, image: "/greentikk.jpg" },
      { id: 3, name: "Chicken Malai Boti (5 Pieces)", description: "", price: 590, image: "/malai.jpg" },
      { id: 4, name: "Reshmi Kebab (2 Pieces)", description: "", price: 460, image: "/reshmi.jpg" },
    ],
  },
  {
    name: "Traditional",
    items: [
      { id: 5, name: "Chicken Karahi (Half)", description: "", price: 950, image: "/chick.jpg" },
      { id: 6, name: "Chicken Karahi (Full)", description: "", price: 1800, image: "/chick.jpg" },
      { id: 7, name: "Chicken White Karahi (Half)", description: "", price: 1050, image: "/white.webp" },
      { id: 8, name: "Chicken White Karahi (Full)", description: "", price: 1950, image: "/white.webp" },
      { id: 9, name: "Chicken Handi Boneless (Half)", description: "", price: 1050, image: "/handi.jpg" },
      { id: 10, name: "Chicken Handi Boneless (Full)", description: "", price: 2000, image: "/handi.jpg" },
      { id: 11, name: "Chicken Ginger Handi (Half)", description: "", price: 1050, image: "/ginger.jpg" },
      { id: 12, name: "Chicken Ginger Handi (Full)", description: "", price: 2000, image: "/ginger.jpg" },
      { id: 13, name: "Mutton Karahi (Half)", description: "", price: 1550, image: "/karahim.webp" },
      { id: 14, name: "Mutton Karahi (Full)", description: "", price: 3000, image: "/karahim.webp" },
      { id: 15, name: "Kabuli Pulao (One Plate)", description: "", price: 850, image: "/kabuli.webp" },
      { id: 16, name: "Russian Salad (One Bowl)", description: "", price: 520, image: "/russ.jpg" },
      { id: 17, name: "Fresh Salad (One Plate)", description: "", price: 150, image: "/fresh.jpg" },
      { id: 18, name: "Dahi Raita (One Bowl)", description: "", price: 300, image: "/dahi.jpg" },
      { id: 19, name: "Chutney (One Bowl)", description: "", price: 100, image: "/ch.jpg" },
    ],
  },
  {
    name: "Dessert",
    items: [
      { id: 20, name: "Gajar ka Halwa single serving", description: "", price: 580, image: "/gajar.jpg" },
      { id: 21, name: "Gulabjammun (2 pieces)", description: "", price: 80, image: "/gulab.jpg" },
      { id: 22, name: "Gulabjammun (4 pieces)", description: "", price: 150, image: "/gulab1.jpg" },
    ],
  },
  {
    name: "Beverages",
    items: [
      { id: 23, name: "Cappuchino", description: "", price: 400, image: "/Cuppuchino.webp" },
      { id: 24, name: "Hot Latte", description: "", price: 400, image: "/Latte.jpg" },
      { id: 25, name: "Expresso", description: "", price: 400, image: "/Espresso.webp" },
      { id: 26, name: "Black coffee", description: "", price: 250, image: "/Black_Coffee.jpg" },
      { id: 27, name: "Green Tea", description: "", price: 80, image: "/Green_Tea.webp" },
      { id: 28, name: "Karak Tea", description: "", price: 160, image: "/Karak Tea.jpg" },
      { id: 29, name: "Cardomom Tea", description: "", price: 160, image: "/Cardmom Tea.jpg" },
      { id: 30, name: "Black Tea", description: "", price: 80, image: "/Black Tea.webp" },
      { id: 31, name: "Juice", description: "", price: 80, image: "/Juice.webp" },
      { id: 32, name: "Mineral water(1.5 lit)", description: "", price: 140, image: "/Mineral Water (1.5 Litres).jpg" },
      { id: 33, name: "Mineral water(330 ml)", description: "", price: 70, image: "/Mineral Bottle (330 ml).jpg" },
      { id: 34, name: "Sting", description: "", price: 120, image: "/Sting.jpg" },
      { id: 35, name: "Cold Drink (Tin)", description: "", price: 100, image: "/Cold Drink (Tin).jpg" },
      { id: 36, name: "Cold Drink (1.5 lit)", description: "", price: 180, image: "/Cold Drinks.jpg" },
      { id: 37, name: "Fresh Lime", description: "", price: 150, image: "/fresh-lime-soda.png" },
      { id: 38, name: "Mint Margarita", description: "", price: 270, image: "/Mint Margarita.jpg" },
    ],
  },
  {
    name: "Pizza",
    items: [
      { id: 39, name: "SVP Special Medium (9 inch)", description: "", price: 1400, image: "/svp.jpg" },
      { id: 40, name: "SVP Special Large (14 inch)", description: "", price: 1900, image: "/svp.jpg" },
      { id: 41, name: "Chicken Fajita Medium (9 Inch)", description: "", price: 1400, image: "/chicken fajita medium.webp" },
      { id: 42, name: "Chicken Fajita Large (14 Inch)", description: "", price: 1850, image: "/chicken fajita medium.webp" },
      { id: 43, name: "Cheese Lovers Medium (9 Inch)", description: "", price: 1400, image: "/cheese lovers.webp" },
      { id: 44, name: "Cheese Lovers Large (14 Inch)", description: "", price: 1850, image: "/cheese lovers.webp" },
      { id: 45, name: "Spicy Tikka Medium (9 inch)", description: "", price: 1400, image: "/spicy tikka.webp" },
      { id: 46, name: "Spicy Tikka Large (14 inch)", description: "", price: 1850, image: "/spicy tikka.webp" },
      { id: 47, name: "Chicken Supreme Medium (9 inch)", description: "", price: 1400, image: "/chicken supreme.webp" },
      { id: 48, name: "Chicken Supreme Large (14 inch)", description: "", price: 1850, image: "/chicken supreme.webp" },
      { id: 49, name: "Extra Toppings (Cheese/ Chicken & Vegetables)", description: "", price: 200, image: "/Extra Toppings.webp" },
    ],
  },
  {
    name: "Snacks",
    items: [
      { id: 50, name: "Alu Samosa", description: "", price: 50, image: "/alusam.jpg" },
      { id: 51, name: "Mix Pakoray", description: "", price: 230, image: "/pako.jpg" },
      { id: 52, name: "Nuggets (3 Pieces)", description: "", price: 150, image: "/nuggs.jpg" },
      { id: 53, name: "Veg Roll", description: "", price: 50, image: "/ve.jpg" },
      { id: 54, name: "French Fries", description: "", price: 250, image: "/fire.jpg" },
      { id: 55, name: "Loaded Fries", description: "", price: 400, image: "/le.jpg" },
      { id: 56, name: "Anda Shami Burger Special", description: "", price: 450, image: "/anda.jpg" },
      { id: 57, name: "Burger Crunch", description: "", price: 500, image: "/bur.webp" },
      { id: 58, name: "Club Sandwich", description: "", price: 480, image: "/c.jpg" },
    ],
  },
  {
    name: "Brunch",
    items: [
      { id: 59, name: "Chicken Haleem", description: "", price: 280, image: "/chickeh.jpg" },
      { id: 60, name: "Chicken Nihari", description: "", price: 320, image: "/checkeh.jpg" },
      { id: 61, name: "Beef Haleem", description: "", price: 320, image: "/bch.jpg" },
      { id: 62, name: "Shahi Murgh Channa", description: "", price: 320, image: "/shahichanna.jpg" },
      { id: 63, name: "Saada Channa", description: "", price: 240, image: "/channa.jpg" },
      { id: 64, name: "Alu Bhujiya", description: "", price: 145, image: "/aluu bu.jpg" },
      { id: 65, name: "Fried Egg", description: "", price: 45, image: "/egg.jpg" },
      { id: 66, name: "Simple Omlete", description: "", price: 70, image: "/omle.jpg" },
      { id: 67, name: "Cheese Omlete", description: "", price: 130, image: "/chese.jpg" },
      { id: 68, name: "Fluffy Omlete", description: "", price: 110, image: "/fluff.jpg" },
      { id: 69, name: "Halwa (Suji)", description: "", price: 250, image: "/sujo.jpg" },
      { id: 70, name: "Puri", description: "", price: 80, image: "/puri.jpg" },
      { id: 71, name: "Paratha", description: "", price: 80, image: "/pr.jpg" },
      { id: 72, name: "Alu Paratha", description: "", price: 120, image: "/alupr.jpg" },
      { id: 73, name: "Lassi (One Glass)", description: "", price: 80, image: "/lass.jpg" },
      { id: 74, name: "Lassi (One Jug)", description: "", price: 390, image: "/jug.jpg" },
      { id: 75, name: "Naan Roghni", description: "", price: 70, image: "/nAM.jpg" },
      { id: 76, name: "Naan Saada", description: "", price: 50, image: "/nas.jpg" },
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
