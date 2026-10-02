import type { Database } from "@/types/database.types";

export type Debt =
  Database["public"]["Tables"]["debts"]["Row"];

export type DebtInsert =
  Database["public"]["Tables"]["debts"]["Insert"];

export type DebtUpdate =
  Database["public"]["Tables"]["debts"]["Update"];

export type DebtType = Debt["type"];

export type DebtStatus =
  | "unsettled"
  | "settled";

export type DebtStatusFilter =
  | "all"
  | DebtStatus;

export type DebtTypeFilter =
  | "all"
  | DebtType;