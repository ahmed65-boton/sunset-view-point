export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";

import { requireCmsAccess } from "@/lib/cms-auth";
import { db } from "@/lib/firebase/admin";
import { recordCmsAudit } from "@/lib/cms-audit";
import { MEMBER_DISCOUNT_RATE } from "@/lib/menu";

const BookingOrderItemSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  name: z.string().trim().min(1, "Item name is required"),
  description: z.string().trim().optional().default(""),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
});

const BookingUpdateSchema = z.object({
  customerId: z.string().trim().min(1, "customerId is required"),
  order: z.array(BookingOrderItemSchema),
  specialRequests: z.string().optional(),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]).optional(),
  paymentStatus: z.enum(["unpaid", "paid", "refunded"]).optional(),
});

type RouteContext = {
  params: Promise<{ bookingId: string }>;
};

function safeDocId(value: string) {
  return value.replace(/\//g, "").trim();
}

export async function PATCH(req: Request, context: RouteContext) {
  const authError = requireCmsAccess(req);
  if (authError) return authError;

  try {
    const { bookingId } = await context.params;
    const input = BookingUpdateSchema.parse(await req.json());
    const customerId = safeDocId(input.customerId);

    if (!customerId || !bookingId) {
      return NextResponse.json({ ok: false, message: "Invalid booking reference." }, { status: 400 });
    }

    const bookingRef = db.collection("customers").doc(customerId).collection("bookings").doc(bookingId);
    const bookingSnap = await bookingRef.get();

    if (!bookingSnap.exists) {
      return NextResponse.json({ ok: false, message: "Booking not found." }, { status: 404 });
    }

    const current = bookingSnap.data() ?? {};
    const currentPricing = current.pricing ?? {};
    const memberDiscountRate = Number(currentPricing.memberDiscountRate ?? (current.isMember ? MEMBER_DISCOUNT_RATE : 0));
    const safeRate = Number.isFinite(memberDiscountRate) ? memberDiscountRate : 0;

    const order = input.order.map((item, index) => {
      const id = item.id ?? Date.now() + index;
      const lineTotal = item.price * item.quantity;

      return {
        id,
        name: item.name,
        description: item.description ?? "",
        price: item.price,
        quantity: item.quantity,
        lineTotal,
      };
    });

    const subtotal = order.reduce((sum, item) => sum + item.lineTotal, 0);
    const discount = Math.round(subtotal * safeRate);
    const total = Math.max(0, subtotal - discount);

    const updateData: Record<string, unknown> = {
      order,
      pricing: {
        subtotal,
        memberDiscountRate: safeRate,
        discount,
        total,
        currency: currentPricing.currency ?? "PKR",
      },
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (typeof input.specialRequests === "string") {
      updateData.specialRequests = input.specialRequests;
    }

    if (input.status) {
      updateData.status = input.status;
    }

    if (input.paymentStatus) {
      updateData.paymentStatus = input.paymentStatus;
    }

    await bookingRef.update(updateData);
    await recordCmsAudit("booking.update", `${customerId}/${bookingId}`, {
      status: input.status ?? current.status ?? "pending",
      paymentStatus: input.paymentStatus ?? current.paymentStatus ?? "unpaid",
      items: order.length,
      total,
    });

    return NextResponse.json({ ok: true, pricing: updateData.pricing, order });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err?.message ?? "Could not update booking." },
      { status: 400 }
    );
  }
}
