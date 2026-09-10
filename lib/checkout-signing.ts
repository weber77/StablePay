import { createHmac, randomUUID } from "crypto";

export function signCheckoutRequest(args: {
  publicKey: string;
  secret: string;
  bodyObject: Record<string, unknown>;
}) {
  const rawBody = JSON.stringify(args.bodyObject);
  const timestamp = String(Date.now());
  const signature = createHmac("sha256", args.secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  return {
    headers: {
      "Content-Type": "application/json",
      "X-Wakapay-Key": args.publicKey,
      "X-Wakapay-Timestamp": timestamp,
      "X-Wakapay-Signature": signature,
      "Idempotency-Key": randomUUID(),
    } as Record<string, string>,
    body: rawBody,
  };
}
