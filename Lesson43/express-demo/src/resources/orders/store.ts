import logger from '../../common/logger';
import { db } from '../../prisma/db';

export type OrderStatus = 'PENDING' | 'PAID' | 'EXPIRED';

export interface Order {
  id: string;
  checkoutSessionId: string;
  userId: string | null;
  customerEmail: string | null;
  amountTotal: number | null;
  currency: string | null;
  status: OrderStatus;
  createdAt: Date;
}

type OrderInput = Omit<Order, 'id' | 'createdAt'>;

type OrderDocument = {
  _id: { toString(): string };
  checkoutSessionId: string;
  userId: string | null;
  customerEmail: string | null;
  amountTotal: number | null;
  currency: string | null;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
};

const objectIdPattern = /^[a-fA-F0-9]{24}$/;

function toOrder(order: OrderDocument): Order {
  return {
    id: String(order._id),
    checkoutSessionId: order.checkoutSessionId,
    userId: order.userId,
    customerEmail: order.customerEmail,
    amountTotal: order.amountTotal,
    currency: order.currency,
    status: order.status,
    createdAt: order.createdAt,
  };
}

export const upsertOrder = async (
  checkoutSessionId: string,
  data: Partial<OrderInput>,
): Promise<Order> => {
  const now = new Date();
  const order = await db.orm.orders.where({ checkoutSessionId }).upsert({
    create: {
      checkoutSessionId,
      userId: data.userId ?? null,
      customerEmail: data.customerEmail ?? null,
      amountTotal: data.amountTotal ?? null,
      currency: data.currency ?? null,
      status: data.status ?? 'PENDING',
      createdAt: now,
      updatedAt: now,
    },
    update: {
      userId: data.userId ?? null,
      customerEmail: data.customerEmail ?? null,
      amountTotal: data.amountTotal ?? null,
      currency: data.currency ?? null,
      status: data.status ?? 'PENDING',
      updatedAt: now,
    },
  });

  if (!order) {
    throw new Error(`Upsert returned no order for ${checkoutSessionId}`);
  }

  logger.info(`Order saved: ${String(order._id)}`);
  return toOrder(order);
};

export const getOrderByCheckoutSession = async (
  checkoutSessionId: string,
): Promise<Order | null> => {
  const order = await db.orm.orders.where({ checkoutSessionId }).first();
  return order ? toOrder(order) : null;
};

export const getAllOrders = async (): Promise<Order[]> => {
  const orders = await db.orm.orders.orderBy({ createdAt: -1 }).all();
  return orders.map(toOrder);
};

export const getOrderById = async (id: string): Promise<Order | null> => {
  if (!objectIdPattern.test(id)) {
    return null;
  }

  const order = await db.orm.orders.where({ _id: id }).first();
  return order ? toOrder(order) : null;
};

export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  const orders = await db.orm.orders.where({ userId }).all();
  return orders.map(toOrder);
};

export const markOrderExpired = async (
  checkoutSessionId: string,
): Promise<Order | null> => {
  const existing = await db.orm.orders.where({ checkoutSessionId }).first();

  if (existing?.status === 'PAID') {
    return toOrder(existing);
  }

  if (existing) {
    const updated = await db.orm.orders.where({ checkoutSessionId }).update({
      status: 'EXPIRED',
      updatedAt: new Date(),
    });

    if (!updated) {
      throw new Error(`Expire update returned no order for ${checkoutSessionId}`);
    }

    return toOrder(updated);
  }

  const now = new Date();
  const created = await db.orm.orders.create({
    checkoutSessionId,
    userId: null,
    customerEmail: null,
    amountTotal: null,
    currency: null,
    status: 'EXPIRED',
    createdAt: now,
    updatedAt: now,
  });

  return toOrder(created);
};
