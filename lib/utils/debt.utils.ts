import type { Debt } from "@/features/debts/types/debt.types";

export type DebtSummary = {
  owedToMe: number;
  iOwe: number;
  net: number;
};

export function calculateDebtSummary(
  debts: Debt[]
): DebtSummary {
  const unsettledDebts = debts.filter(
    (debt) => debt.settled_at === null
  );

  const owedToMe = unsettledDebts
    .filter(
      (debt) => debt.type === "owed_to_me"
    )
    .reduce(
      (total, debt) =>
        total + Number(debt.amount),
      0
    );

  const iOwe = unsettledDebts
    .filter(
      (debt) => debt.type === "i_owe"
    )
    .reduce(
      (total, debt) =>
        total + Number(debt.amount),
      0
    );

  return {
    owedToMe,
    iOwe,
    net: owedToMe - iOwe,
  };
}