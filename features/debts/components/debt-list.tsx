import { ReceiptText } from "lucide-react";

import { DebtCard } from "@/features/debts/components/debt-card";
import type { Debt } from "@/features/debts/types/debt.types";

type DebtListProps = {
  debts: Debt[];
};

export function DebtList({
  debts,
}: DebtListProps) {
  if (debts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-5 py-12 text-center sm:py-16">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-600">
          <ReceiptText className="size-5" />
        </div>

        <div className="mx-auto mt-4 max-w-sm space-y-2">
          <h3 className="font-semibold text-neutral-950">
            Belum ada kasbon nih
          </h3>

          <p className="text-sm leading-6 text-neutral-500">
            Catat utang atau piutang pertama kamu biar nggak cuma ngandelin ingatan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {debts.map((debt) => (
        <DebtCard
          key={debt.id}
          debt={debt}
        />
      ))}
    </div>
  );
}