import { openDB, type IDBPDatabase } from "idb";
import type {
  ImportResult,
  NormalizedTransaction,
  ImportRecord,
} from "../domain";

const DB_NAME = "omt-db";
const DB_VERSION = 2;
const STORE_NAME = "imports";
const TX_STORE = "normalizedTransactions";
const RECORDS_STORE = "importRecords";

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, {
              keyPath: "id",
              autoIncrement: true,
            });
            store.createIndex("importedAt", "importedAt");
          }
        }

        if (oldVersion < 2) {
          if (!db.objectStoreNames.contains(RECORDS_STORE)) {
            const recordsStore = db.createObjectStore(RECORDS_STORE, {
              keyPath: "id",
              autoIncrement: true,
            });
            recordsStore.createIndex("importedAt", "importedAt");
          }

          if (!db.objectStoreNames.contains(TX_STORE)) {
            const txStore = db.createObjectStore(TX_STORE, {
              keyPath: "id",
            });
            txStore.createIndex("importId", "importId");
            txStore.createIndex("paymentDate", "paymentDate");
            txStore.createIndex("currency", "currency");
          }
        }
      },
    });
  }
  return dbPromise;
}

export async function saveImportResult(result: ImportResult): Promise<number> {
  const db = await getDb();
  const id = await db.add(STORE_NAME, {
    ...result,
    transactions: result.transactions.map((tx) => ({
      ...tx,
      startedAt: tx.startedAt.toISOString(),
      completedAt: tx.completedAt?.toISOString() ?? null,
    })),
  });
  return id as number;
}

export async function getLatestImportResult(): Promise<ImportResult | null> {
  const db = await getDb();
  const all = await db.getAllFromIndex(STORE_NAME, "importedAt");
  if (all.length === 0) return null;

  const latest = all[all.length - 1];

  return {
    ...latest,
    transactions: latest.transactions.map(
      (tx: Record<string, unknown>) => ({
        ...tx,
        startedAt: new Date(tx.startedAt as string),
        completedAt: tx.completedAt ? new Date(tx.completedAt as string) : null,
      })
    ),
  } as ImportResult;
}

function serializeNormalizedTx(tx: NormalizedTransaction) {
  return { ...tx, paymentDate: tx.paymentDate.toISOString() };
}

function deserializeNormalizedTx(tx: Record<string, unknown>): NormalizedTransaction {
  return {
    ...tx,
    paymentDate: new Date(tx.paymentDate as string),
  } as NormalizedTransaction;
}

export async function saveImportRecord(
  record: ImportRecord,
): Promise<number> {
  const db = await getDb();
  return (await db.add(RECORDS_STORE, record)) as number;
}

export async function saveNormalizedTransactions(
  transactions: NormalizedTransaction[],
): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(TX_STORE, "readwrite");
  const store = tx.objectStore(TX_STORE);
  for (const t of transactions) {
    await store.put(serializeNormalizedTx(t));
  }
  await tx.done;
}

export async function getAllImportRecords(): Promise<ImportRecord[]> {
  const db = await getDb();
  return db.getAll(RECORDS_STORE);
}

export async function getAllNormalizedTransactions(): Promise<
  NormalizedTransaction[]
> {
  const db = await getDb();
  const raw = await db.getAll(TX_STORE);
  return raw.map(deserializeNormalizedTx);
}

export async function getNormalizedTransactionsByImportId(
  importId: number,
): Promise<NormalizedTransaction[]> {
  const db = await getDb();
  const raw = await db.getAllFromIndex(TX_STORE, "importId", importId);
  return raw.map(deserializeNormalizedTx);
}

export async function clearAllImports(): Promise<void> {
  const db = await getDb();
  await db.clear(STORE_NAME);
  await db.clear(TX_STORE);
  await db.clear(RECORDS_STORE);
}

export async function deleteImportRecord(
  importId: number,
): Promise<void> {
  const db = await getDb();

  const transactions = await db.getAllFromIndex(
    TX_STORE,
    "importId",
    importId,
  );
  const txIds = transactions.map((t) => t.id);

  const delTx = db.transaction([RECORDS_STORE, TX_STORE], "readwrite");
  await delTx.objectStore(RECORDS_STORE).delete(importId);
  for (const id of txIds) {
    await delTx.objectStore(TX_STORE).delete(id);
  }
  await delTx.done;
}
