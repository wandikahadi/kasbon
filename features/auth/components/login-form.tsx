"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { authSchema } from "@/features/auth/schemas/auth.schema";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setMessage(null);

    const parsed = authSchema.safeParse({
      email,
      password,
    });

    if (!parsed.success) {
      setMessage(
        parsed.error.issues[0]?.message ??
          "Data login tidak valid"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const { error } =
        await supabase.auth.signInWithPassword(
          parsed.data
        );

      if (error) {
        setMessage("Email atau password salah");
        return;
      }

      router.replace("/");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium text-neutral-800"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          placeholder="nama@email.com"
          className="h-11 w-full rounded-xl border border-neutral-300 bg-white px-3.5 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10 sm:h-12"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-neutral-800"
        >
          Password
        </label>

        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          placeholder="Minimal 6 karakter"
          className="h-11 w-full rounded-xl border border-neutral-300 bg-white px-3.5 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10 sm:h-12"
        />
      </div>

      {message ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm leading-5 text-red-700"
        >
          {message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-4 text-sm font-medium text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:h-12"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            Masuk...
          </>
        ) : (
          "Masuk"
        )}
      </button>

      <p className="text-center text-sm text-neutral-600">
        Belum punya akun?{" "}
        <Link
          href="/signup"
          className="font-medium text-neutral-950 underline underline-offset-4"
        >
          Daftar
        </Link>
      </p>
    </form>
  );
}