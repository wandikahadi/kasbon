import {
  ArrowDownLeft,
  ArrowUpRight,
  Scale,
} from "lucide-react";

import type { Debt } from "@/features/debts/types/debt.types";
import { calculateDebtSummary } from "@/features/debts/utils/debt.utils";
import { formatRupiah } from "@/lib/utils/currency";

type DebtSummaryProps = {
  debts: Debt[];
};

export function DebtSummary({
  debts,
}: DebtSummaryProps) {
  const summary = calculateDebtSummary(debts);

  const netIsPositive = summary.net >= 0;

  return (
    <section
      aria-label="Ringkasan kasbon"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      <article className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <ArrowDownLeft className="size-5" />
          </div>

          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            Masuk
          </span>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-neutral-500">
            Total dihutang ke saya
          </p>

          <p className="break-words text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl">
            {formatRupiah(summary.owedToMe)}
          </p>
        </div>
      </article>

      <article className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
            <ArrowUpRight className="size-5" />
          </div>

          <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">
            Keluar
          </span>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-neutral-500">
            Total saya hutang
          </p>

          <p className="break-words text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl">
            {formatRupiah(summary.iOwe)}
          </p>
        </div>
      </article>

      <article className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:col-span-2 sm:p-5 lg:col-span-1">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div
            className={
              netIsPositive
                ? "flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"
                : "flex size-10 items-center justify-center rounded-xl bg-red-50 text-red-700"
            }
          >
            <Scale className="size-5" />
          </div>

          <span
            className={
              netIsPositive
                ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                : "rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700"
            }
          >
            Net
          </span>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-neutral-500">
            Selisih bersih
          </p>

          <p
            className={
              netIsPositive
                ? "break-words text-xl font-semibold tracking-tight text-emerald-700 sm:text-2xl"
                : "break-words text-xl font-semibold tracking-tight text-red-600 sm:text-2xl"
            }
          >
            {formatRupiah(summary.net)}
          </p>
        </div>
      </article>
    </section>
  );
}