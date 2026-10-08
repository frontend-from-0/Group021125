"use server";

import { auth0 } from "@/lib/auth0";

export async function fetchMyOrders() {
  const { token } = await auth0.getAccessToken({
    audience: process.env.AUTH0_AUDIENCE,
  });

  const response = await fetch("http://localhost:8000/v1/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    status: response.status,
    body: await response.json(),
  };
}

export async function fetchAllOrders() {
  const { token } = await auth0.getAccessToken({
    audience: process.env.AUTH0_AUDIENCE,
  });

  const response = await fetch("http://localhost:8000/v1/orders/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    status: response.status,
    body: await response.json(),
  };
}

export async function fetchOrderById(orderId: string) {
  const { token } = await auth0.getAccessToken({
    audience: process.env.AUTH0_AUDIENCE,
  });

  const response = await fetch(`http://localhost:8000/v1/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    status: response.status,
    body: await response.json(),
  };
}
