type CheckoutItem = {
  name: string;
  quantity: number;
  unit_price: number;
  product_id?: string;
};

type CheckoutResponse = {
  checkout_url?: string;
  session_id?: string;
};

export async function postCheckout(items: CheckoutItem[]) {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items,
      user: {
        id: "demo-customer",
        email: "ceo@wakamann.com",
      },
    }),
  });

  const text = await res.text();
  let data: CheckoutResponse & { error?: string; detail?: unknown };
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      res.ok ? "Invalid checkout response" : `Checkout failed (${res.status})`,
    );
  }

  if (!res.ok) {
    const msg =
      typeof data.detail === "object" && data.detail !== null
        ? JSON.stringify(data.detail)
        : (data.error ?? "Checkout failed");
    throw new Error(msg);
  }

  const url = data.checkout_url;
  if (!url) {
    throw new Error("No checkout_url in response");
  }
  return url;
}
