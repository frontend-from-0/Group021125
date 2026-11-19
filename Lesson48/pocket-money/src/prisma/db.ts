import "dotenv/config";
import mongo from "@prisma/orm-mongo/runtime";
import { contractFromJson } from "@prisma/orm-mongo/static";

import type { Contract } from "./contract.d";
import contractJson from "./contract.json" with { type: "json" };

const contract = contractFromJson<Contract>(contractJson);

function createDb() {
  const url = process.env["DATABASE_URL"];
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  return mongo({
    contract,
    url,
  });
}

type Db = ReturnType<typeof createDb>;

const globalForDb = globalThis as typeof globalThis & {
  __pocketMoneyDb?: Db;
};

function getDb(): Db {
  if (!globalForDb.__pocketMoneyDb) {
    globalForDb.__pocketMoneyDb = createDb();
  }
  return globalForDb.__pocketMoneyDb;
}

/** Lazy proxy so importing this module during `next build` does not validate DATABASE_URL. */
export const db: Db = new Proxy({} as Db, {
  get(_target, property, receiver) {
    return Reflect.get(getDb(), property, receiver);
  },
});
