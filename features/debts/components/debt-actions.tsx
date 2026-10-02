"use client";

import { useState } from "react";
import {
  Check,
  LoaderCircle,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Modal } from "@/components/ui/modal";
import { DebtForm } from "@/features/debts/components/debt-form";
import type { Debt } from "@/features/debts/types/debt.types";

type DebtActionsProps = {
  debt: Debt;
};

export function DebtActions({
  debt,
}: DebtActionsProps) {
  const router = useRouter();

  const [editOpen, setEditOpen] =
    useState(false);

  const [
    deleteOpen,
    setDeleteOpen,
  ] = useState(false);

  const [
    pendingAction,
    setPendingAction,
  ] = useState<
    "settle" | "delete" | null
  >(null);

  const isSettled =
    debt.settled_at !== null;

  async function handleSettled() {
    setPendingAction("settle");

    try {
      const response = await fetch(
        `/api/debts/${debt.id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            settled: !isSettled,
          }),
        }
      );

      if (!response.ok) {
        window.alert(
          "Gagal memperbarui status kasbon"
        );
        return;
      }

      router.refresh();
    } finally {
      setPendingAction(null);
    }
  }

  async function handleDelete() {
    setPendingAction("delete");

    try {
      const response = await fetch(
        `/api/debts/${debt.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        window.alert(
          "Gagal menghapus kasbon"
        );
        return;
      }

      setDeleteOpen(false);

      router.refresh();
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
        <button
          type="button"
          onClick={handleSettled}
          disabled={
            pendingAction !== null
          }
          className="col-span-2 inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50 sm:col-span-1"
        >
          {pendingAction ===
          "settle" ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : isSettled ? (
            <RotateCcw className="size-4" />
          ) : (
            <Check className="size-4" />
          )}

          {isSettled
            ? "Batalkan lunas"
            : "Tandai lunas"}
        </button>

        <button
          type="button"
          onClick={() =>
            setEditOpen(true)
          }
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
        >
          <Pencil className="size-4" />
          Edit
        </button>

        <button
          type="button"
          onClick={() =>
            setDeleteOpen(true)
          }
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <Trash2 className="size-4" />
          Hapus
        </button>
      </div>

      <Modal
        open={editOpen}
        onClose={() =>
          setEditOpen(false)
        }
        title="Edit kasbon"
        description={`Perbarui catatan untuk ${debt.counterpart_name}.`}
      >
        <DebtForm
          mode="edit"
          debt={debt}
          onSuccess={() =>
            setEditOpen(false)
          }
        />
      </Modal>

      <Modal
        open={deleteOpen}
        onClose={() =>
          setDeleteOpen(false)
        }
        title="Hapus kasbon?"
        description="Data yang sudah dihapus nggak bisa dikembalikan."
      >
        <div className="space-y-5">
          <div className="rounded-2xl bg-neutral-50 p-4">
            <p className="font-medium text-neutral-950">
              {debt.counterpart_name}
            </p>

            <p className="mt-1 text-sm text-neutral-500">
              Kasbon ini akan dihapus permanen.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() =>
                setDeleteOpen(false)
              }
              className="h-11 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={
                pendingAction ===
                "delete"
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              {pendingAction ===
              "delete" ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}

              Hapus
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}