import { WalletCards } from "lucide-react";
import { redirect } from "next/navigation";

import { SignupForm } from "@/features/auth/components/signup-form";
import { createClient } from "@/lib/supabase/server";

export default async function SignupPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md items-center sm:min-h-[calc(100vh-4rem)]">
        <section className="w-full rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8">
          <div className="mb-8 space-y-5">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-neutral-950 text-white sm:size-12">
              <WalletCards className="size-5 sm:size-6" />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-500">
                Kasbon
              </p>

              <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
                Buat akun baru
              </h1>

              <p className="max-w-sm text-sm leading-6 text-neutral-600 sm:text-base">
                Mulai catat siapa yang ngutang dan kamu ngutang ke siapa.
              </p>
            </div>
          </div>

          <SignupForm />
        </section>
      </div>
    </main>
  );
}