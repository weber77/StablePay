import { signCheckoutRequest } from "@/lib/checkout-signing";
import { NextResponse } from "next/server";

type CheckoutItem = {
  name: string;
  quantity: number;
  unit_price: number;
  product_id?: string;
};

type Body = {
  items: CheckoutItem[];
  user?: { id: string; email?: string; username?: string };
  currency?: string;
  crypto_currency?: string;
  metadata?: Record<string, unknown>;
  expires_in_minutes?: number;
};

export async function POST(req: Request) {
  const apiUrl = process.env.WAKAPAY_API_URL?.replace(/\/$/, "");
  const publicKey = process.env.WAKAPAY_PUBLIC_KEY;
  const secret = process.env.WAKAPAY_SECRET_KEY;

  if (!apiUrl || !publicKey || !secret) {
    return NextResponse.json(
      {
        error:
          "Missing WAKAPAY_API_URL, WAKAPAY_PUBLIC_KEY, or WAKAPAY_SECRET_KEY (see env.example)",
      },
      { status: 500 },
    );
  }

  let json: Body;
  try {
    json = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!json.items?.length) {
    return NextResponse.json({ error: "items required" }, { status: 400 });
  }

  const currency =
    json.currency ?? process.env.WAKAPAY_CHECKOUT_CURRENCY ?? "USD";
  const crypto_currency =
    json.crypto_currency ?? process.env.WAKAPAY_CHECKOUT_CRYPTO ?? "USDT";

  const user = json.user ?? {
    id: "guest",
    email: "guest@demo.local",
  };

  const payload = {
    user,
    items: json.items,
    currency,
    crypto_currency,
    metadata: {
      source: "marchant-store",
      ...(json.metadata ?? {}),
      ...(user.email ? { customer_email: user.email } : {}),
    },
    ...(json.expires_in_minutes != null
      ? { expires_in_minutes: json.expires_in_minutes }
      : {}),
  };

  const signed = signCheckoutRequest({
    publicKey,
    secret,
    bodyObject: payload,
  });

  let upstream: Response;
  try {
    upstream = await fetch(`${apiUrl}/checkout-sessions`, {
      method: "POST",
      headers: signed.headers,
      body: signed.body,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Cannot reach Wakapay API",
        detail:
          err instanceof Error
            ? err.message
            : "Check WAKAPAY_API_URL and that the API is running",
      },
      { status: 502 },
    );
  }

  const text = await upstream.text();
  let data: unknown = text;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    /* keep text */
  }

  if (!upstream.ok) {
    return NextResponse.json(
      {
        error: "Wakapay API error",
        status: upstream.status,
        detail: data,
      },
      { status: 502 },
    );
  }

  return NextResponse.json(data);
}
