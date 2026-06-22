"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CalendarClock,
  Check,
  Edit3,
  Plus,
  RefreshCw,
  Save,
  ShoppingBag,
  Trash2,
  Utensils,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/navigation";
import { formatCurrency } from "@/lib/menu";
import { cn } from "@/lib/utils";

type StatsWindow = {
  totalBookings: number;
  subtotalMade: number;
  totalMade: number;
};

type DashboardStats = {
  lastDay: StatsWindow;
  lastWeek: StatsWindow;
  lastMonth: StatsWindow;
  lastYear: StatsWindow;
};

type BookingOrderItem = {
  id?: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  lineTotal?: number;
};

type CmsBooking = {
  id: string;
  customerId: string;
  fullName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  numberOfGuests: number;
  specialRequests: string;
  order: BookingOrderItem[];
  pricing: {
    subtotal: number;
    discount: number;
    total: number;
    memberDiscountRate: number;
    currency: string;
  };
  isMember: boolean;
  createdAt: string | null;
};

type CmsMenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
};

type DashboardResponse = {
  ok: boolean;
  message?: string;
  stats: DashboardStats;
  bookings: CmsBooking[];
};

type MenuResponse = {
  ok: boolean;
  message?: string;
  items: CmsMenuItem[];
  categories: string[];
};

const blankStats: DashboardStats = {
  lastDay: { totalBookings: 0, subtotalMade: 0, totalMade: 0 },
  lastWeek: { totalBookings: 0, subtotalMade: 0, totalMade: 0 },
  lastMonth: { totalBookings: 0, subtotalMade: 0, totalMade: 0 },
  lastYear: { totalBookings: 0, subtotalMade: 0, totalMade: 0 },
};

const statCards: Array<{ key: keyof DashboardStats; title: string; subtitle: string }> = [
  { key: "lastDay", title: "Last day", subtitle: "Rolling 24 hours" },
  { key: "lastWeek", title: "Last week", subtitle: "Rolling 7 days" },
  { key: "lastMonth", title: "Last month", subtitle: "Rolling 30 days" },
  { key: "lastYear", title: "Last year", subtitle: "Rolling 365 days" },
];

const blankMenuForm = {
  name: "",
  category: "",
  description: "",
  price: "",
  image: "/placeholder.svg?height=108&width=108",
};

function formatDateTime(value: string | null) {
  if (!value) return "No timestamp";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "No timestamp";
  return dt.toLocaleString();
}

function getStatusClass(status: string) {
  const lower = status.toLowerCase();
  if (lower.includes("saved") || lower.includes("loaded") || lower.includes("added") || lower.includes("removed")) {
    return "border-primary/25 bg-primary/10 text-primary";
  }
  if (lower.includes("loading") || lower.includes("saving")) {
    return "border-border bg-muted/70 text-muted-foreground";
  }
  return "border-destructive/25 bg-destructive/10 text-destructive";
}

function recalculateOrder(order: BookingOrderItem[]) {
  return order.map((item) => ({
    ...item,
    price: Number(item.price || 0),
    quantity: Math.max(1, Number(item.quantity || 1)),
    lineTotal: Number(item.price || 0) * Math.max(1, Number(item.quantity || 1)),
  }));
}

export default function CmsPage() {
  const [tokenInput, setTokenInput] = useState("");
  const [cmsToken, setCmsToken] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "menu">("overview");
  const [stats, setStats] = useState<DashboardStats>(blankStats);
  const [bookings, setBookings] = useState<CmsBooking[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [orderDraft, setOrderDraft] = useState<BookingOrderItem[]>([]);
  const [specialRequestsDraft, setSpecialRequestsDraft] = useState("");
  const [menuItems, setMenuItems] = useState<CmsMenuItem[]>([]);
  const [menuDrafts, setMenuDrafts] = useState<Record<number, CmsMenuItem>>({});
  const [newMenuItem, setNewMenuItem] = useState(blankMenuForm);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = window.sessionStorage.getItem("svp_cms_token") || "";
    if (storedToken) {
      setTokenInput(storedToken);
      setCmsToken(storedToken);
    }
  }, []);

  const selectedBooking = useMemo(
    () => bookings.find((booking) => booking.id === selectedBookingId) ?? bookings[0] ?? null,
    [bookings, selectedBookingId]
  );

  const groupedMenuItems = useMemo(() => {
    const groups = new Map<string, CmsMenuItem[]>();
    menuItems.forEach((item) => {
      const current = groups.get(item.category) ?? [];
      current.push(item);
      groups.set(item.category, current);
    });
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [menuItems]);

  const loadDashboard = async (token = cmsToken) => {
    if (!token) return;

    setLoading(true);
    setStatus("Loading CMS data...");

    try {
      const [dashboardRes, menuRes] = await Promise.all([
        fetch("/api/cms/dashboard", { headers: { "x-cms-token": token } }),
        fetch("/api/cms/menu", { headers: { "x-cms-token": token } }),
      ]);

      const dashboardData = (await dashboardRes.json()) as DashboardResponse;
      const menuData = (await menuRes.json()) as MenuResponse;

      if (!dashboardRes.ok || !dashboardData.ok) {
        throw new Error(dashboardData.message || "Dashboard load failed.");
      }
      if (!menuRes.ok || !menuData.ok) {
        throw new Error(menuData.message || "Menu load failed.");
      }

      setStats(dashboardData.stats ?? blankStats);
      setBookings(dashboardData.bookings ?? []);
      setSelectedBookingId((current) => current || dashboardData.bookings?.[0]?.id || "");
      setMenuItems(menuData.items ?? []);
      setMenuDrafts(
        Object.fromEntries((menuData.items ?? []).map((item) => [item.id, { ...item }]))
      );
      setStatus("CMS data loaded.");
    } catch (err: any) {
      setStatus(err?.message || "CMS load failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cmsToken) {
      void loadDashboard(cmsToken);
    }
  }, [cmsToken]);

  useEffect(() => {
    if (selectedBooking) {
      setOrderDraft(recalculateOrder(selectedBooking.order || []));
      setSpecialRequestsDraft(selectedBooking.specialRequests || "");
    }
  }, [selectedBooking]);

  const unlockCms = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = tokenInput.trim();
    if (!trimmed) {
      setStatus("Enter your CMS passcode.");
      return;
    }
    window.sessionStorage.setItem("svp_cms_token", trimmed);
    setCmsToken(trimmed);
  };

  const updateOrderItem = (index: number, field: keyof BookingOrderItem, value: string) => {
    setOrderDraft((current) =>
      recalculateOrder(
        current.map((item, itemIndex) => {
          if (itemIndex !== index) return item;
          if (field === "price" || field === "quantity") return { ...item, [field]: Number(value) };
          return { ...item, [field]: value };
        })
      )
    );
  };

  const removeOrderItem = (index: number) => {
    setOrderDraft((current) => recalculateOrder(current.filter((_, itemIndex) => itemIndex !== index)));
  };

  const addOrderItem = () => {
    setOrderDraft((current) =>
      recalculateOrder([
        ...current,
        { name: "New item", description: "", price: 0, quantity: 1 },
      ])
    );
  };

  const saveBookingOrder = async () => {
    if (!selectedBooking) return;

    setLoading(true);
    setStatus("Saving booking items...");

    try {
      const res = await fetch(`/api/cms/bookings/${selectedBooking.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json", "x-cms-token": cmsToken },
        body: JSON.stringify({
          customerId: selectedBooking.customerId,
          order: recalculateOrder(orderDraft),
          specialRequests: specialRequestsDraft,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) throw new Error(data.message || "Booking save failed.");

      setStatus("Booking items saved.");
      await loadDashboard();
    } catch (err: any) {
      setStatus(err?.message || "Booking save failed.");
    } finally {
      setLoading(false);
    }
  };

  const updateMenuDraft = (itemId: number, field: keyof CmsMenuItem, value: string | boolean) => {
    setMenuDrafts((current) => ({
      ...current,
      [itemId]: {
        ...current[itemId],
        [field]: field === "price" || field === "sortOrder" ? Number(value) : value,
      },
    }));
  };

  const saveMenuItem = async (itemId: number) => {
    const draft = menuDrafts[itemId];
    if (!draft) return;

    setLoading(true);
    setStatus("Saving menu item...");

    try {
      const res = await fetch(`/api/cms/menu/${itemId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json", "x-cms-token": cmsToken },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || "Menu item save failed.");

      setStatus("Menu item saved.");
      await loadDashboard();
    } catch (err: any) {
      setStatus(err?.message || "Menu item save failed.");
    } finally {
      setLoading(false);
    }
  };

  const removeMenuItem = async (itemId: number) => {
    setLoading(true);
    setStatus("Removing menu item...");

    try {
      const res = await fetch(`/api/cms/menu/${itemId}`, {
        method: "DELETE",
        headers: { "x-cms-token": cmsToken },
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || "Menu item remove failed.");

      setStatus("Menu item removed.");
      await loadDashboard();
    } catch (err: any) {
      setStatus(err?.message || "Menu item remove failed.");
    } finally {
      setLoading(false);
    }
  };

  const addMenuItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus("Adding menu item...");

    try {
      const res = await fetch("/api/cms/menu", {
        method: "POST",
        headers: { "content-type": "application/json", "x-cms-token": cmsToken },
        body: JSON.stringify({ ...newMenuItem, price: Number(newMenuItem.price) }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || "Menu item add failed.");

      setNewMenuItem(blankMenuForm);
      setStatus("Menu item added.");
      await loadDashboard();
    } catch (err: any) {
      setStatus(err?.message || "Menu item add failed.");
    } finally {
      setLoading(false);
    }
  };

  const localOrderSubtotal = orderDraft.reduce((sum, item) => sum + Number(item.lineTotal || 0), 0);
  const localDiscount = selectedBooking ? Math.round(localOrderSubtotal * selectedBooking.pricing.memberDiscountRate) : 0;
  const localTotal = Math.max(0, localOrderSubtotal - localDiscount);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="py-12 md:py-16">
        <div className="svp-container space-y-8">
          <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card p-6 shadow-xl shadow-primary/10 sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,183,77,0.22),transparent_24rem)]" />
            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="section-kicker"><BarChart3 className="mr-2 h-3.5 w-3.5" /> CMS dashboard</span>
                <h1 className="mt-3 text-balance text-4xl font-black tracking-tight text-foreground md:text-5xl">
                  Bookings, revenue, and menu control.
                </h1>
                <p className="mt-3 max-w-2xl text-pretty text-sm leading-6 text-muted-foreground">
                  View subtotal made, total made, and booking count for the last day, week, month, and year. Edit booking order items and update the live menu from one place.
                </p>
              </div>

              <form onSubmit={unlockCms} className="grid gap-3 rounded-3xl border border-border/70 bg-background/70 p-4 shadow-sm sm:min-w-80">
                <Label htmlFor="cms-token">CMS passcode</Label>
                <Input
                  id="cms-token"
                  type="password"
                  value={tokenInput}
                  onChange={(event) => setTokenInput(event.target.value)}
                  placeholder="CMS_ACCESS_TOKEN"
                />
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading} className="flex-1">
                    <Check className="h-4 w-4" /> Unlock
                  </Button>
                  <Button type="button" variant="outline" onClick={() => loadDashboard()} disabled={!cmsToken || loading}>
                    <RefreshCw className="h-4 w-4" /> Refresh
                  </Button>
                </div>
              </form>
            </div>
          </section>

          {status && <p className={cn("rounded-2xl border px-4 py-3 text-sm font-medium", getStatusClass(status))}>{status}</p>}

          <div className="flex flex-wrap gap-2 rounded-2xl border border-border/70 bg-card p-2 shadow-sm">
            {[
              ["overview", "Overview", BarChart3],
              ["bookings", "Booking items", ShoppingBag],
              ["menu", "Menu items", Utensils],
            ].map(([key, label, Icon]) => {
              const IconComponent = Icon as typeof BarChart3;
              return (
                <Button
                  key={key as string}
                  type="button"
                  variant={activeTab === key ? "default" : "ghost"}
                  onClick={() => setActiveTab(key as typeof activeTab)}
                  className="rounded-xl"
                >
                  <IconComponent className="h-4 w-4" /> {label as string}
                </Button>
              );
            })}
          </div>

          {activeTab === "overview" && (
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => {
                const windowStats = stats[card.key] ?? blankStats[card.key];
                return (
                  <Card key={card.key} className="surface-card">
                    <CardContent className="p-6">
                      <div className="mb-5 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-foreground">{card.title}</p>
                          <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                        </div>
                        <div className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                          <CalendarClock className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground">Bookings</span>
                          <span className="font-black text-foreground">{windowStats.totalBookings}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground">Subtotal made</span>
                          <span className="font-black text-foreground">{formatCurrency(windowStats.subtotalMade)}</span>
                        </div>
                        <div className="flex justify-between gap-4 border-t border-border/70 pt-3">
                          <span className="text-muted-foreground">Total made</span>
                          <span className="font-black text-primary">{formatCurrency(windowStats.totalMade)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </section>
          )}

          {activeTab === "bookings" && (
            <section className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(28rem,1.1fr)]">
              <Card className="surface-card overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-2xl font-black">Recent bookings</CardTitle>
                  <p className="text-sm text-muted-foreground">Showing the latest 200 booking records.</p>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[42rem] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.map((booking) => (
                          <TableRow
                            key={booking.id}
                            className={cn("cursor-pointer", selectedBooking?.id === booking.id && "bg-primary/10")}
                            onClick={() => setSelectedBookingId(booking.id)}
                          >
                            <TableCell>
                              <p className="font-bold text-foreground">{booking.fullName || booking.email}</p>
                              <p className="text-xs text-muted-foreground">{formatDateTime(booking.createdAt)}</p>
                            </TableCell>
                            <TableCell>
                              <p>{booking.date}</p>
                              <p className="text-xs text-muted-foreground">{booking.time} · {booking.numberOfGuests} guests</p>
                            </TableCell>
                            <TableCell className="font-black text-primary">{formatCurrency(booking.pricing.total)}</TableCell>
                          </TableRow>
                        ))}
                        {!bookings.length && (
                          <TableRow>
                            <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                              No bookings found yet.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <Card className="surface-card">
                <CardHeader>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <CardTitle className="text-2xl font-black">Edit booking items</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Change item name, price, description, quantity, add items, or remove items.
                      </p>
                    </div>
                    {selectedBooking?.isMember && <Badge variant="secondary">Member discount</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  {selectedBooking ? (
                    <>
                      <div className="grid gap-3 rounded-2xl border border-border/70 bg-muted/35 p-4 text-sm sm:grid-cols-2">
                        <p><strong>Customer:</strong> {selectedBooking.fullName || selectedBooking.email}</p>
                        <p><strong>Phone:</strong> {selectedBooking.phone || "Not provided"}</p>
                        <p><strong>Date:</strong> {selectedBooking.date} at {selectedBooking.time}</p>
                        <p><strong>Guests:</strong> {selectedBooking.numberOfGuests}</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="booking-special-requests">Special requests</Label>
                        <Textarea
                          id="booking-special-requests"
                          value={specialRequestsDraft}
                          onChange={(event) => setSpecialRequestsDraft(event.target.value)}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-4">
                        {orderDraft.map((item, index) => (
                          <div key={`${item.id ?? "new"}-${index}`} className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
                            <div className="grid gap-3 md:grid-cols-[1fr_7rem_6rem_auto] md:items-end">
                              <div className="space-y-2">
                                <Label>Name</Label>
                                <Input value={item.name} onChange={(event) => updateOrderItem(index, "name", event.target.value)} />
                              </div>
                              <div className="space-y-2">
                                <Label>Price</Label>
                                <Input type="number" min="0" value={item.price} onChange={(event) => updateOrderItem(index, "price", event.target.value)} />
                              </div>
                              <div className="space-y-2">
                                <Label>Qty</Label>
                                <Input type="number" min="1" value={item.quantity} onChange={(event) => updateOrderItem(index, "quantity", event.target.value)} />
                              </div>
                              <Button type="button" variant="outline" onClick={() => removeOrderItem(index)}>
                                <Trash2 className="h-4 w-4" /> Remove
                              </Button>
                            </div>
                            <div className="mt-3 space-y-2">
                              <Label>Description</Label>
                              <Textarea
                                value={item.description || ""}
                                onChange={(event) => updateOrderItem(index, "description", event.target.value)}
                                rows={2}
                              />
                            </div>
                            <p className="mt-3 text-right text-sm font-bold text-primary">Line total: {formatCurrency(item.lineTotal || 0)}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="grid gap-1 text-sm sm:grid-cols-3 sm:gap-6">
                          <p><span className="text-muted-foreground">Subtotal:</span> <strong>{formatCurrency(localOrderSubtotal)}</strong></p>
                          <p><span className="text-muted-foreground">Discount:</span> <strong>{formatCurrency(localDiscount)}</strong></p>
                          <p><span className="text-muted-foreground">Total:</span> <strong className="text-primary">{formatCurrency(localTotal)}</strong></p>
                        </div>
                        <div className="flex gap-2">
                          <Button type="button" variant="outline" onClick={addOrderItem}>
                            <Plus className="h-4 w-4" /> Add item
                          </Button>
                          <Button type="button" onClick={saveBookingOrder} disabled={loading}>
                            <Save className="h-4 w-4" /> Save booking
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="rounded-2xl border border-border/70 p-6 text-center text-sm text-muted-foreground">
                      Select a booking to edit its order items.
                    </p>
                  )}
                </CardContent>
              </Card>
            </section>
          )}

          {activeTab === "menu" && (
            <section className="space-y-6">
              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="text-2xl font-black">Add menu item</CardTitle>
                  <p className="text-sm text-muted-foreground">New items appear on the public booking menu after saving.</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={addMenuItem} className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_8rem_auto] xl:items-end">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input value={newMenuItem.name} onChange={(event) => setNewMenuItem((current) => ({ ...current, name: event.target.value }))} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Input value={newMenuItem.category} onChange={(event) => setNewMenuItem((current) => ({ ...current, category: event.target.value }))} placeholder="BBQ, Pizza, Drinks..." required />
                    </div>
                    <div className="space-y-2">
                      <Label>Price</Label>
                      <Input type="number" min="0" value={newMenuItem.price} onChange={(event) => setNewMenuItem((current) => ({ ...current, price: event.target.value }))} required />
                    </div>
                    <Button type="submit" disabled={loading}>
                      <Plus className="h-4 w-4" /> Add
                    </Button>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Description</Label>
                      <Textarea value={newMenuItem.description} onChange={(event) => setNewMenuItem((current) => ({ ...current, description: event.target.value }))} rows={2} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Image path</Label>
                      <Input value={newMenuItem.image} onChange={(event) => setNewMenuItem((current) => ({ ...current, image: event.target.value }))} placeholder="/image-name.jpg" />
                    </div>
                  </form>
                </CardContent>
              </Card>

              {groupedMenuItems.map(([category, items]) => (
                <Card key={category} className="surface-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl font-black">
                      {category}
                      <Badge variant="secondary">{items.length} items</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item) => {
                      const draft = menuDrafts[item.id] ?? item;
                      return (
                        <div key={item.id} className={cn("rounded-2xl border border-border/70 bg-card p-4 shadow-sm", !draft.isActive && "opacity-60")}>
                          <div className="grid gap-3 lg:grid-cols-[1fr_12rem_8rem_7rem_auto] lg:items-end">
                            <div className="space-y-2">
                              <Label>Name</Label>
                              <Input value={draft.name} onChange={(event) => updateMenuDraft(item.id, "name", event.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label>Category</Label>
                              <Input value={draft.category} onChange={(event) => updateMenuDraft(item.id, "category", event.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label>Price</Label>
                              <Input type="number" min="0" value={draft.price} onChange={(event) => updateMenuDraft(item.id, "price", event.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label>Sort</Label>
                              <Input type="number" value={draft.sortOrder} onChange={(event) => updateMenuDraft(item.id, "sortOrder", event.target.value)} />
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button type="button" onClick={() => saveMenuItem(item.id)} disabled={loading}>
                                <Save className="h-4 w-4" /> Save
                              </Button>
                              <Button type="button" variant="outline" onClick={() => removeMenuItem(item.id)} disabled={loading}>
                                <Trash2 className="h-4 w-4" /> Remove
                              </Button>
                            </div>
                          </div>

                          <div className="mt-3 grid gap-3 lg:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea value={draft.description || ""} onChange={(event) => updateMenuDraft(item.id, "description", event.target.value)} rows={2} />
                            </div>
                            <div className="space-y-2">
                              <Label>Image path</Label>
                              <Input value={draft.image || ""} onChange={(event) => updateMenuDraft(item.id, "image", event.target.value)} />
                              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <input
                                  type="checkbox"
                                  checked={draft.isActive}
                                  onChange={(event) => updateMenuDraft(item.id, "isActive", event.target.checked)}
                                />
                                Active on booking menu
                              </label>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
