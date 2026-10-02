import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  CircleDashed,
} from "lucide-react";

import { DebtActions } from "@/features/debts/components/debt-actions";
import type { Debt } from "@/features/debts/types/debt.types";
import { formatRupiah } from "@/lib/utils/currency";
import { formatRelativeDate } from "@/lib/utils/date";

type DebtCardProps = {
  debt: Debt;
};

export function DebtCard({
  debt,
}: DebtCardProps) {
  const isOwedToMe =
    debt.type === "owed_to_me";

  const isSettled =
    debt.settled_at !== null;

  const relativeDate =
    formatRelativeDate(
      debt.due_date ??
        debt.created_at
    );

  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-300 sm:p-5">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={
                isOwedToMe
                  ? "flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"
                  : "flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-700"
              }
            >
              {isOwedToMe ? (
                <ArrowDownLeft className="size-5" />
              ) : (
                <ArrowUpRight className="size-5" />
              )}
            </div>

            <div className="min-w-0 space-y-1">
              <h3 className="truncate font-medium text-neutral-950">
                {debt.counterpart_name}
              </h3>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-neutral-500">
                <span>
                  {isOwedToMe
                    ? "Dihutang ke saya"
                    : "Saya hutang"}
                </span>

                <span
                  aria-hidden="true"
                  className="text-neutral-300"
                >
                  •
                </span>

                <span>
                  {relativeDate}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-neutral-100 pt-4 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
            <p className="text-lg font-semibold tracking-tight text-neutral-950 sm:text-xl">
              {formatRupiah(
                Number(debt.amount)
              )}
            </p>

            {isSettled ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                <CheckCircle2 className="size-3.5" />
                Lunas
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                <CircleDashed className="size-3.5" />
                Belum lunas
              </span>
            )}
          </div>
        </div>

        {debt.note ? (
          <div className="rounded-xl bg-neutral-50 px-3.5 py-3">
            <p className="text-sm leading-6 text-neutral-600">
              {debt.note}
            </p>
          </div>
        ) : null}

        <div className="border-t border-neutral-100 pt-4">
          <DebtActions debt={debt} />
        </div>
      </div>
    </article>
  );
}