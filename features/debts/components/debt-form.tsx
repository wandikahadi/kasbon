"use client";

import {
  FormEvent,
  useState,
} from "react";
import {
  LoaderCircle,
  Save,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  createDebtSchema,
} from "@/features/debts/schemas/debt.schema";
import type {
  Debt,
  DebtType,
} from "@/features/debts/types/debt.types";

type DebtFormProps =
  | {
      mode: "create";
      debt?: never;
      onSuccess: () => void;
    }
  | {
      mode: "edit";
      debt: Debt;
      onSuccess: () => void;
    };

function getToday(): string {
  const date = new Date();

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function DebtForm(
  props: DebtFormProps
) {
  const router = useRouter();

  const isEdit =
    props.mode === "edit";

  const [type, setType] =
    useState<DebtType>(
      isEdit
        ? props.debt.type
        : "owed_to_me"
    );

  const [
    counterpartName,
    setCounterpartName,
  ] = useState(
    isEdit
      ? props.debt.counterpart_name
      : ""
  );

  const [amount, setAmount] =
    useState(
      isEdit
        ? String(props.debt.amount)
        : ""
    );

  const [dueDate, setDueDate] =
    useState(
      isEdit
        ? props.debt.due_date ??
            getToday()
        : getToday()
    );

  const [note, setNote] =
    useState(
      isEdit
        ? props.debt.note ?? ""
        : ""
    );

  const [
    message,
    setMessage,
  ] = useState<string | null>(
    null
  );

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage(null);

    const parsed =
      createDebtSchema.safeParse({
        type,
        counterpartName,
        amount: Number(amount),
        dueDate,
        note:
          note.trim() === ""
            ? null
            : note,
      });

    if (!parsed.success) {
      setMessage(
        parsed.error.issues[0]
          ?.message ??
          "Data kasbon belum valid"
      );

      return;
    }

    setIsSubmitting(true);

    try {
      const url = isEdit
        ? `/api/debts/${props.debt.id}`
        : "/api/debts";

      const response = await fetch(
        url,
        {
          method: isEdit
            ? "PATCH"
            : "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            parsed.data
          ),
        }
      );

      const result: unknown =
        await response.json();

      if (!response.ok) {
        if (
          typeof result === "object" &&
          result !== null &&
          "message" in result &&
          typeof result.message ===
            "string"
        ) {
          setMessage(
            result.message
          );
        } else {
          setMessage(
            "Gagal menyimpan kasbon"
          );
        }

        return;
      }

      props.onSuccess();

      router.refresh();
    } catch {
      setMessage(
        "Ada masalah koneksi. Coba lagi."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-neutral-800">
          Tipe
        </legend>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <label
            className={
              type === "owed_to_me"
                ? "cursor-pointer rounded-xl border border-neutral-950 bg-neutral-950 px-4 py-3 text-sm font-medium text-white"
                : "cursor-pointer rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-300"
            }
          >
            <input
              type="radio"
              name="type"
              value="owed_to_me"
              checked={
                type ===
                "owed_to_me"
              }
              onChange={() =>
                setType(
                  "owed_to_me"
                )
              }
              className="sr-only"
            />

            Saya dihutang
          </label>

          <label
            className={
              type === "i_owe"
                ? "cursor-pointer rounded-xl border border-neutral-950 bg-neutral-950 px-4 py-3 text-sm font-medium text-white"
                : "cursor-pointer rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-300"
            }
          >
            <input
              type="radio"
              name="type"
              value="i_owe"
              checked={
                type === "i_owe"
              }
              onChange={() =>
                setType("i_owe")
              }
              className="sr-only"
            />

            Saya hutang
          </label>
        </div>
      </fieldset>

      <div className="space-y-2">
        <label
          htmlFor="counterpartName"
          className="text-sm font-medium text-neutral-800"
        >
          Nama orang
        </label>

        <input
          id="counterpartName"
          type="text"
          value={counterpartName}
          onChange={(event) =>
            setCounterpartName(
              event.target.value
            )
          }
          placeholder="Contoh: Budi"
          className="h-11 w-full rounded-xl border border-neutral-300 px-3.5 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="amount"
          className="text-sm font-medium text-neutral-800"
        >
          Jumlah
        </label>

        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm font-medium text-neutral-500">
            Rp
          </span>

          <input
            id="amount"
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            value={amount}
            onChange={(event) =>
              setAmount(
                event.target.value
              )
            }
            placeholder="0"
            className="h-11 w-full rounded-xl border border-neutral-300 pl-10 pr-3.5 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10"
          />
        </div>

        <p className="text-xs text-neutral-500">
          Masukkan Rupiah utuh, tanpa desimal.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="dueDate"
          className="text-sm font-medium text-neutral-800"
        >
          Tanggal
        </label>

        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(event) =>
            setDueDate(
              event.target.value
            )
          }
          className="h-11 w-full rounded-xl border border-neutral-300 px-3.5 text-sm outline-none transition focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="note"
            className="text-sm font-medium text-neutral-800"
          >
            Catatan
          </label>

          <span className="text-xs text-neutral-400">
            {note.length}/200
          </span>
        </div>

        <textarea
          id="note"
          rows={4}
          maxLength={200}
          value={note}
          onChange={(event) =>
            setNote(
              event.target.value
            )
          }
          placeholder="Opsional. Misalnya: makan bareng kemarin."
          className="w-full resize-none rounded-xl border border-neutral-300 px-3.5 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10"
        />
      </div>

      {message ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
        >
          {message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-4 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            Menyimpan...
          </>
        ) : (
          <>
            <Save className="size-4" />

            {isEdit
              ? "Simpan perubahan"
              : "Simpan kasbon"}
          </>
        )}
      </button>
    </form>
  );
}