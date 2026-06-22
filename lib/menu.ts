export type MenuItem = {
  id: number;
  name: string;
  description?: string;
  price: number;
  image: string;
};

export type MenuCategory = {
  name: string;
  items: MenuItem[];
};

export type SelectedMenuItems = Record<number, number>;

export type OrderLine = MenuItem & {
  quantity: number;
  lineTotal: number;
};

export const MEMBER_DISCOUNT_RATE = 0.25;

export const menuCategories: MenuCategory[] = [
  {
    name: "BBQ",
    items: [
      { id: 1, name: "Chicken Tikka Boti (5 Pieces)", price: 450, image: "/tikk.jpg" },
      { id: 2, name: "Chicken Green Tikka Boti (5 Pieces)", price: 470, image: "/greentikk.jpg" },
      { id: 3, name: "Chicken Malai Boti (5 Pieces)", price: 590, image: "/malai.jpg" },
      { id: 4, name: "Reshmi Kebab (2 Pieces)", price: 460, image: "/reshmi.jpg" },
    ],
  },
  {
    name: "Traditional",
    items: [
      { id: 5, name: "Chicken Karahi (Half)", price: 950, image: "/chick.jpg" },
      { id: 6, name: "Chicken Karahi (Full)", price: 1800, image: "/chick.jpg" },
      { id: 7, name: "Chicken White Karahi (Half)", price: 1050, image: "/white.webp" },
      { id: 8, name: "Chicken White Karahi (Full)", price: 1950, image: "/white.webp" },
      { id: 9, name: "Chicken Handi Boneless (Half)", price: 1050, image: "/handi.jpg" },
      { id: 10, name: "Chicken Handi Boneless (Full)", price: 2000, image: "/handi.jpg" },
      { id: 11, name: "Chicken Ginger Handi (Half)", price: 1050, image: "/ginger.jpg" },
      { id: 12, name: "Chicken Ginger Handi (Full)", price: 2000, image: "/ginger.jpg" },
      { id: 13, name: "Mutton Karahi (Half)", price: 1550, image: "/karahim.webp" },
      { id: 14, name: "Mutton Karahi (Full)", price: 3000, image: "/karahim.webp" },
      { id: 15, name: "Kabuli Pulao (One Plate)", price: 850, image: "/kabuli.webp" },
      { id: 16, name: "Russian Salad (One Bowl)", price: 520, image: "/russ.jpg" },
      { id: 17, name: "Fresh Salad (One Plate)", price: 150, image: "/fresh.jpg" },
      { id: 18, name: "Dahi Raita (One Bowl)", price: 300, image: "/dahi.jpg" },
      { id: 19, name: "Chutney (One Bowl)", price: 100, image: "/ch.jpg" },
    ],
  },
  {
    name: "Dessert",
    items: [
      { id: 20, name: "Gajar ka Halwa single serving", price: 580, image: "/gajar.jpg" },
      { id: 21, name: "Gulab Jamun (2 Pieces)", price: 80, image: "/gulab.jpg" },
      { id: 22, name: "Gulab Jamun (4 Pieces)", price: 150, image: "/gulab1.jpg" },
    ],
  },
  {
    name: "Beverages",
    items: [
      { id: 23, name: "Cappuccino", price: 400, image: "/Cuppuchino.webp" },
      { id: 24, name: "Hot Latte", price: 400, image: "/Latte.jpg" },
      { id: 25, name: "Espresso", price: 400, image: "/Espresso.webp" },
      { id: 26, name: "Black Coffee", price: 250, image: "/Black_Coffee.jpg" },
      { id: 27, name: "Green Tea", price: 80, image: "/Green_Tea.webp" },
      { id: 28, name: "Karak Tea", price: 160, image: "/Karak Tea.jpg" },
      { id: 29, name: "Mineral Bottle (1.5 Lit)", price: 150, image: "/Mineral Water (1.5 Litres).jpg" },
      { id: 30, name: "Mineral Bottle (330 ml)", price: 70, image: "/Mineral Bottle (330 ml).jpg" },
      { id: 34, name: "Sting", price: 120, image: "/Sting.jpg" },
      { id: 35, name: "Cold Drink (Tin)", price: 100, image: "/Cold Drink (Tin).jpg" },
      { id: 36, name: "Cold Drink (1.5 Lit)", price: 180, image: "/Cold Drinks.jpg" },
      { id: 37, name: "Fresh Lime", price: 150, image: "/fresh-lime-soda.png" },
      { id: 38, name: "Mint Margarita", price: 270, image: "/Mint Margarita.jpg" },
    ],
  },
  {
    name: "Pizza",
    items: [
      { id: 39, name: "SVP Special Medium (9 Inch)", price: 1400, image: "/svp.jpg" },
      { id: 40, name: "SVP Special Large (14 Inch)", price: 1900, image: "/svp.jpg" },
      { id: 41, name: "Chicken Fajita Medium (9 Inch)", price: 1400, image: "/chicken fajita medium.webp" },
      { id: 42, name: "Chicken Fajita Large (14 Inch)", price: 1850, image: "/chicken fajita medium.webp" },
      { id: 43, name: "Cheese Lovers Medium (9 Inch)", price: 1400, image: "/cheese lovers.webp" },
      { id: 44, name: "Cheese Lovers Large (14 Inch)", price: 1850, image: "/cheese lovers.webp" },
      { id: 45, name: "Spicy Tikka Medium (9 Inch)", price: 1400, image: "/spicy tikka.webp" },
      { id: 46, name: "Spicy Tikka Large (14 Inch)", price: 1850, image: "/spicy tikka.webp" },
      { id: 47, name: "Chicken Supreme Medium (9 Inch)", price: 1400, image: "/chicken supreme.webp" },
      { id: 48, name: "Chicken Supreme Large (14 Inch)", price: 1850, image: "/chicken supreme.webp" },
      { id: 49, name: "Extra Toppings (Cheese, Chicken & Vegetables)", price: 200, image: "/Extra Toppings.webp" },
    ],
  },
  {
    name: "Snacks",
    items: [
      { id: 50, name: "Alu Samosa", price: 50, image: "/alusam.jpg" },
      { id: 51, name: "Mix Pakoray", price: 230, image: "/pako.jpg" },
      { id: 52, name: "Nuggets (3 Pieces)", price: 150, image: "/nuggs.jpg" },
      { id: 53, name: "Veg Roll", price: 50, image: "/ve.jpg" },
      { id: 54, name: "French Fries", price: 250, image: "/fire.jpg" },
      { id: 55, name: "Loaded Fries", price: 400, image: "/le.jpg" },
      { id: 56, name: "Anda Shami Burger Special", price: 450, image: "/anda.jpg" },
      { id: 57, name: "Burger Crunch", price: 500, image: "/bur.webp" },
      { id: 58, name: "Club Sandwich", price: 480, image: "/c.jpg" },
    ],
  },
  {
    name: "Brunch",
    items: [
      { id: 59, name: "Chicken Haleem", price: 280, image: "/chickeh.jpg" },
      { id: 60, name: "Chicken Nihari", price: 320, image: "/checkeh.jpg" },
      { id: 61, name: "Beef Haleem", price: 320, image: "/bch.jpg" },
      { id: 62, name: "Shahi Murgh Channa", price: 320, image: "/shahichanna.jpg" },
      { id: 63, name: "Saada Channa", price: 240, image: "/channa.jpg" },
      { id: 64, name: "Alu Bhujiya", price: 145, image: "/aluu bu.jpg" },
      { id: 65, name: "Fried Egg", price: 45, image: "/egg.jpg" },
      { id: 66, name: "Simple Omelette", price: 70, image: "/omle.jpg" },
      { id: 67, name: "Cheese Omelette", price: 130, image: "/chese.jpg" },
      { id: 68, name: "Fluffy Omelette", price: 110, image: "/fluff.jpg" },
      { id: 69, name: "Halwa (Suji)", price: 250, image: "/sujo.jpg" },
      { id: 70, name: "Puri", price: 80, image: "/puri.jpg" },
      { id: 71, name: "Paratha", price: 80, image: "/pr.jpg" },
      { id: 72, name: "Alu Paratha", price: 120, image: "/alupr.jpg" },
      { id: 73, name: "Lassi (One Glass)", price: 80, image: "/lass.jpg" },
      { id: 74, name: "Lassi (One Jug)", price: 390, image: "/jug.jpg" },
      { id: 75, name: "Naan Roghni", price: 70, image: "/nAM.jpg" },
      { id: 76, name: "Naan Saada", price: 50, image: "/nas.jpg" },
    ],
  },
];

export function getAllMenuItems(categories: MenuCategory[] = menuCategories) {
  return categories.flatMap((category) => category.items);
}

export function getOrderLines(
  selectedItems: SelectedMenuItems,
  categories: MenuCategory[] = menuCategories
): OrderLine[] {
  const allMenuItems = getAllMenuItems(categories);

  return Object.entries(selectedItems)
    .map(([itemId, quantity]) => {
      const item = allMenuItems.find((candidate) => candidate.id === Number(itemId));
      if (!item || quantity <= 0) return null;
      return {
        ...item,
        quantity,
        lineTotal: item.price * quantity,
      };
    })
    .filter((line): line is OrderLine => Boolean(line));
}

export function getOrderSubtotal(
  selectedItems: SelectedMenuItems,
  categories: MenuCategory[] = menuCategories
) {
  return getOrderLines(selectedItems, categories).reduce((total, line) => total + line.lineTotal, 0);
}

export function getTotalQuantity(selectedItems: SelectedMenuItems) {
  return Object.values(selectedItems).reduce((total, quantity) => total + quantity, 0);
}

export function getMemberDiscount(subtotal: number, isMember: boolean) {
  return isMember ? Math.round(subtotal * MEMBER_DISCOUNT_RATE) : 0;
}

export function formatCurrency(amount: number) {
  return `Rs ${amount.toLocaleString("en-PK")}`;
}
