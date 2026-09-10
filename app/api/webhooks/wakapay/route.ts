import { verifyWakapayWebhookSignature } from "@/lib/wakapay-webhook-verify";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type WakapayWebhookBody = {
  event?: string;
  data?: Record<string, unknown>;
};

function resolveCustomerEmail(data: Record<string, unknown>): string | null {
  const user = data.user as { email?: string } | undefined;
  if (user?.email && typeof user.email === "string") return user.email.trim();

  const meta = data.metadata as Record<string, unknown> | undefined;
  if (meta) {
    const a = meta.customer_email ?? meta.email;
    if (typeof a === "string" && a.includes("@")) return a.trim();
  }

  return null;
}

function resolveCustomerName(
  data: Record<string, unknown>,
): string | undefined {
  const user = data.user as { username?: string; name?: string } | undefined;
  if (user?.username) return user.username;
  if (user?.name) return user.name;
  const meta = data.metadata as Record<string, unknown> | undefined;
  const n = meta?.customer_name;
  if (typeof n === "string") return n;
  return undefined;
}

const EMAIL_EVENTS = new Set([
  "payment.created",
  "payment.paid",
  "payment.expired",
]);

export async function POST(req: Request) {
  const signingSecret = process.env.WAKAPAY_WEBHOOK_SECRET?.trim();
  if (!signingSecret) {
    console.error("WAKAPAY_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook signing not configured" },
      { status: 500 },
    );
  }

  const rawBody = await req.text();
  const sig = req.headers.get("x-wakapay-signature");
  const ts = req.headers.get("x-wakapay-timestamp");
  if (!sig || !ts) {
    return NextResponse.json(
      { error: "Missing signature headers" },
      { status: 401 },
    );
  }

  const ok = verifyWakapayWebhookSignature({
    signingSecret,
    rawBody,
    timestamp: ts,
    signatureHex: sig,
  });
  if (!ok) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: WakapayWebhookBody;
  try {
    body = JSON.parse(rawBody) as WakapayWebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = body.event ?? req.headers.get("x-wakapay-event") ?? "";
  const data =
    body.data && typeof body.data === "object"
      ? body.data
      : ({} as Record<string, unknown>);

  if (!EMAIL_EVENTS.has(event)) {
    return NextResponse.json({ received: true, emailed: false });
  }
  console.log("data", data);
  const to = data.email as string;
  if (!to) {
    console.warn(
      "Wakapay webhook: no customer email on payload; set user.email or metadata.customer_email when creating checkout",
      { event, checkout_session_id: data.checkout_session_id },
    );
    return NextResponse.json({
      received: true,
      emailed: false,
      reason: "no_email",
    });
  }

  return NextResponse.json({ received: true, emailed: true });
}
