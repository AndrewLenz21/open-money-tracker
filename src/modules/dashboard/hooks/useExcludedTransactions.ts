import { useState, useCallback } from "react";

const STORAGE_KEY = "open-money-tracker.excluded-transactions.v1";

function readExcluded(): Set<string> {
  if (typeof localStorage === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set<string>(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveExcluded(keys: Set<string>): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(keys)));
  } catch {
    // noop
  }
}

export function useExcludedTransactions() {
  const [excluded, setExcludedState] = useState<Set<string>>(readExcluded);

  const setExcluded = useCallback((keys: Set<string> | ((prev: Set<string>) => Set<string>)) => {
    if (typeof keys === "function") {
      setExcludedState((prev) => {
        const next = keys(prev);
        saveExcluded(next);
        return next;
      });
    } else {
      setExcludedState(keys);
      saveExcluded(keys);
    }
  }, []);

  const toggleExcluded = useCallback(
    (transactionKey: string) => {
      setExcluded((prev) => {
        const next = new Set(prev);
        if (next.has(transactionKey)) {
          next.delete(transactionKey);
        } else {
          next.add(transactionKey);
        }
        return next;
      });
    },
    [setExcluded],
  );

  const isExcluded = useCallback(
    (transactionKey: string) => excluded.has(transactionKey),
    [excluded],
  );

  return { excluded, toggleExcluded, isExcluded };
}