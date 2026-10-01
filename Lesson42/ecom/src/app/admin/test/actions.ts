"use server";

import { auth0, requireAdminOr403 } from "@/lib/auth0";

export type OrdersTestKind = "my-orders" | "all-orders" | "order-by-id";

export type CallOrdersApiInput = {
  kind: OrdersTestKind;
  orderId?: string;
};

export type OrdersApiTestResult = {
  method: "GET";
  path: string;
  url: string;
  status: number | null;
  ok: boolean;
  body: unknown;
  error?: string;
};

function ordersApiPath(kind: OrdersTestKind, orderId?: string): string {
  switch (kind) {
    case "my-orders":
      return "/v1/orders";
    case "all-orders":
      return "/v1/orders/all";
    case "order-by-id": {
      const id = orderId?.trim();
      if (!id) {
        throw new Error("Order ID is required");
      }
      return `/v1/orders/${encodeURIComponent(id)}`;
    }
    default: {
      const exhaustive: never = kind;
      throw new Error(`Unhandled orders test kind: ${exhaustive}`);
    }
  }
}

function readAccessToken(result: unknown): string | null {
  if (typeof result === "string" && result.length > 0) return result;
  if (
    result &&
    typeof result === "object" &&
    "token" in result &&
    typeof (result as { token: unknown }).token === "string"
  ) {
    const token = (result as { token: string }).token;
    return token.length > 0 ? token : null;
  }
  return null;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

export async function callOrdersApi(
  input: CallOrdersApiInput,
): Promise<OrdersApiTestResult> {
  const admin = await requireAdminOr403();
  if (admin instanceof Response) {
    return {
      method: "GET",
      path: "",
      url: "",
      status: admin.status,
      ok: false,
      body: await parseResponseBody(admin),
      error: "Admin authentication required",
    };
  }

  let path: string;
  try {
    path = ordersApiPath(input.kind, input.orderId);
  } catch (error) {
    return {
      method: "GET",
      path: "",
      url: "",
      status: null,
      ok: false,
      body: null,
      error: error instanceof Error ? error.message : "Invalid request",
    };
  }

  const baseUrl = process.env.ORDERS_API_BASE_URL ?? "http://localhost:8000";
  const url = `${baseUrl}${path}`;
  const audience = process.env.AUTH0_AUDIENCE;

  if (!audience) {
    return {
      method: "GET",
      path,
      url,
      status: null,
      ok: false,
      body: null,
      error: "AUTH0_AUDIENCE is missing from the Next.js environment",
    };
  }

  let token: string | null;
  try {
    const tokenResult = await auth0.getAccessToken({ audience });
    token = readAccessToken(tokenResult);
  } catch (error) {
    return {
      method: "GET",
      path,
      url,
      status: null,
      ok: false,
      body: null,
      error:
        error instanceof Error
          ? `${error.message} Log out and log back in so Auth0 can issue a token for ${audience}.`
          : "Could not get an Auth0 access token. Log out and log back in.",
    };
  }

  if (!token) {
    return {
      method: "GET",
      path,
      url,
      status: null,
      ok: false,
      body: null,
      error: `No access token for ${audience}. Log out and log back in.`,
    };
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    return {
      method: "GET",
      path,
      url,
      status: response.status,
      ok: response.ok,
      body: await parseResponseBody(response),
    };
  } catch (error) {
    return {
      method: "GET",
      path,
      url,
      status: null,
      ok: false,
      body: null,
      error:
        error instanceof Error
          ? `Could not reach Express at ${url}: ${error.message}`
          : `Could not reach Express at ${url}`,
    };
  }
}
