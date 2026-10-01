/**
 * In-memory order store (for classroom demo — no real database).
 *
 * Each order is created by the Stripe webhook when `checkout.session.completed`
 * is received. Orders are keyed by `checkoutSessionId` to allow upsert behavior.
 */

export interface Order {
  id: string;
  checkoutSessionId: string;
  userId: string | null;
  customerEmail: string | null;
  amountTotal: number | null;
  currency: string | null;
  status: 'paid' | 'expired' | 'pending';
  createdAt: Date;
}

const orders: Map<string, Order> = new Map();

let idCounter = 1;

export const createOrder = (data: Omit<Order, 'id' | 'createdAt'>): Order => {
  const id = `order_${idCounter++}`;
  const order: Order = {
    ...data,
    id,
    createdAt: new Date(),
  };
  orders.set(data.checkoutSessionId, order);
  return order;
};

export const getOrderByCheckoutSession = (checkoutSessionId: string): Order | undefined => {
  return orders.get(checkoutSessionId);
};

export const upsertOrder = (checkoutSessionId: string, data: Partial<Omit<Order, 'id' | 'createdAt'>>): Order => {
  const existing = orders.get(checkoutSessionId);
  if (existing) {
    const updated: Order = { ...existing, ...data };
    orders.set(checkoutSessionId, updated);
    return updated;
  }
  return createOrder({
    checkoutSessionId,
    userId: data.userId ?? null,
    customerEmail: data.customerEmail ?? null,
    amountTotal: data.amountTotal ?? null,
    currency: data.currency ?? null,
    status: data.status ?? 'pending',
  });
};

export const getAllOrders = (): Order[] => {
  return Array.from(orders.values());
};

export const getOrderById = (id: string): Order | undefined => {
  return Array.from(orders.values()).find((o) => o.id === id);
};

export const getOrdersByUserId = (userId: string): Order[] => {
  return Array.from(orders.values()).filter((o) => o.userId === userId);
};

export const markOrderExpired = (checkoutSessionId: string): Order | undefined => {
  const existing = orders.get(checkoutSessionId);
  if (existing) {
    existing.status = 'expired';
    return existing;
  }
  return undefined;
};
