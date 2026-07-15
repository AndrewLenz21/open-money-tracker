import { useEffect, useMemo, useState } from "react";
import type { FilterMode } from "../stores/dashboardStore";
import type {
  CategorizedTransaction,
  TransactionSort,
  TransactionTypeFilter,
} from "../types/dashboard.types";
import { normalizeSearchText } from "../utils/transactionKey";
import { filterTransactionsByDate } from "../utils/analytics";
import { readRowsPerPage, saveRowsPerPage } from "@modules/categories/services/categoryAssignmentStorage";

export function useTransactionFilters(
  transactions: CategorizedTransaction[],
  filterMode: FilterMode,
  setFilterMode: (mode: FilterMode) => void,
) {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string | null | "all">("all");
  const [type, setType] = useState<TransactionTypeFilter>("all");
  const [onlyUncategorized, setOnlyUncategorized] = useState(false);
  const [sort, setSort] = useState<TransactionSort>("date-desc");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPageState] = useState(readRowsPerPage);

  const filteredTransactions = useMemo(() => {
    const query = normalizeSearchText(search);
    let value = filterTransactionsByDate(transactions, filterMode);

    if (query) {
      value = value.filter((tx) =>
        normalizeSearchText(`${tx.merchant} ${tx.originalDescription}`).includes(query),
      );
    }

    if (categoryId !== "all") {
      value = value.filter((tx) => tx.categoryId === categoryId);
    }

    if (type !== "all") {
      value = value.filter((tx) => tx.type === type);
    }

    if (onlyUncategorized) {
      value = value.filter((tx) => tx.categoryId === null);
    }

    const sorted = [...value];
    sorted.sort((a, b) => {
      switch (sort) {
        case "date-asc":
          return a.paymentDate.getTime() - b.paymentDate.getTime();
        case "amount-asc":
          return a.amount - b.amount;
        case "amount-desc":
          return b.amount - a.amount;
        case "date-desc":
        default:
          return b.paymentDate.getTime() - a.paymentDate.getTime();
      }
    });

    return sorted;
  }, [categoryId, filterMode, onlyUncategorized, search, sort, transactions, type]);

  useEffect(() => {
    setPage(1);
  }, [categoryId, filterMode, onlyUncategorized, search, sort, type]);

  const totalResults = filteredTransactions.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const paginatedTransactions = useMemo(() => {
    const start = (safePage - 1) * rowsPerPage;
    return filteredTransactions.slice(start, start + rowsPerPage);
  }, [filteredTransactions, rowsPerPage, safePage]);

  useEffect(() => {
    if (safePage !== page) setPage(safePage);
  }, [page, safePage]);

  const setRowsPerPage = (value: number) => {
    setRowsPerPageState(value);
    saveRowsPerPage(value);
    setPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setCategoryId("all");
    setType("all");
    setOnlyUncategorized(false);
    setSort("date-desc");
    setFilterMode("all");
  };

  return {
    search,
    setSearch,
    categoryId,
    setCategoryId,
    type,
    setType,
    onlyUncategorized,
    setOnlyUncategorized,
    sort,
    setSort,
    filterMode,
    setFilterMode,
    filteredTransactions,
    paginatedTransactions,
    page: safePage,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages,
    totalResults,
    resetFilters,
  };
}
