import { createHmac, timingSafeEqual } from "crypto";

/**
 * Verifies `X-Wakapay-Signature` = hex(HMAC-SHA256(signing_secret, `${timestamp}.${rawBody}`)).
 * Use the raw request body string (bytes as UTF-8), not a re-serialized JSON object.
 */
export function verifyWakapayWebhookSignature(args: {
  signingSecret: string;
  rawBody: string;
  timestamp: string;
  signatureHex: string;
}): boolean {
  const expected = createHmac("sha256", args.signingSecret)
    .update(`${args.timestamp}.${args.rawBody}`)
    .digest();
  let received: Buffer;
  try {
    received = Buffer.from(args.signatureHex.trim(), "hex");
  } catch {
    return false;
  }
  if (expected.length !== received.length) return false;
  return timingSafeEqual(expected, received);
}
