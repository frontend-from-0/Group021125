import { ParseOptions } from 'querystring';
import logger from '../../common/logger';
import { db } from '../../prisma/db';

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
  REFUNDED = 'REFUNDED',
  EXPIRED = "EXPIRED",
}

export interface Address {
  line1: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  checkoutSessionId: string;
  userId: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  address: Address;
}

type OrderDocument = {
  _id: { toString(): string };
  checkoutSessionId: string;
  userId: string;
  status: `${OrderStatus}`;
  createdAt: Date;
  updatedAt: Date;
  address: Address;
};

function toOrder(orderDoc: OrderDocument): Order {
  return {
    id: String(orderDoc._id),
    checkoutSessionId: orderDoc.checkoutSessionId,
    userId: orderDoc.userId,
    status: orderDoc.status as OrderStatus,
    createdAt: orderDoc.createdAt,
    updatedAt: orderDoc.updatedAt,
    address: orderDoc.address,
  };
}

export type NewOrder = {
  checkoutSessionId: string;
  userId: string;
  status: OrderStatus;
  address: Address;
};


export const createOrder = async (data: NewOrder): Promise<Order> => {
  const now = new Date();
  const orderDoc = await db.orm.orders.create({
    checkoutSessionId: data.checkoutSessionId,
    userId: data.userId,
    status: data.status,
    createdAt: now,
    updatedAt: now,
    address: data.address,
  });

  logger.info(`Order created: ${orderDoc._id}`);

  return toOrder(orderDoc);
};

export const updateOrder = async (checkoutSessionId: string, status: OrderStatus): Promise<Order> => {
  const orderDoc = await db.orm.orders.where({ checkoutSessionId }).update({
    status: status,
    updatedAt: new Date(),
  });

  if (!orderDoc) {
    throw new Error(`No order found for checkout session ${checkoutSessionId}`);
  }

  logger.info(`Order updated: ${orderDoc._id}`);

  return toOrder(orderDoc);
};
