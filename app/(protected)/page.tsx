import {
  Plus,
  WalletCards,
} from "lucide-react";

import { LogoutButton } from "@/features/auth/components/logout-button";
import { DebtList } from "@/features/debts/components/debt-list";
import { DebtSummary } from "@/features/debts/components/debt-summary";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: debts, error } =
    await supabase
      .from("debts")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    throw new Error(
      "Gagal mengambil data kasbon"
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-white sm:size-11">
              <WalletCards className="size-5" />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl">
                Kasbon
              </h1>

              <p className="hidden truncate text-sm text-neutral-500 sm:block">
                Biar utang piutang tetap ke-track.
              </p>
            </div>
          </div>

          <LogoutButton />
        </header>

        <div className="space-y-8">
          <DebtSummary debts={debts ?? []} />

          <section className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-neutral-950 sm:text-xl">
                  Semua kasbon
                </h2>

                <p className="text-sm text-neutral-500">
                  {debts?.length ?? 0} catatan tersimpan
                </p>
              </div>

              <button
                type="button"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-4 text-sm font-medium text-white transition hover:bg-neutral-800 sm:w-auto"
              >
                <Plus className="size-4" />
                Catat baru
              </button>
            </div>

            <DebtList debts={debts ?? []} />
          </section>
        </div>
      </div>
    </main>
  );
}