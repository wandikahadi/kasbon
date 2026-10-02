import { LogoutButton } from "@/features/auth/components/logout-button";

export default function DashboardPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Kasbon
          </h1>

          <p className="text-sm text-neutral-600">
            Dashboard kasbon kamu.
          </p>
        </div>

        <LogoutButton />
      </header>
    </main>
  );
}