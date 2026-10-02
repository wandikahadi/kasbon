"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { DebtForm } from "@/features/debts/components/debt-form";

export function CreateDebtButton() {
  const [open, setOpen] =
    useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() =>
          setOpen(true)
        }
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-4 text-sm font-medium text-white transition hover:bg-neutral-800 sm:w-auto"
      >
        <Plus className="size-4" />
        Catat baru
      </button>

      <Modal
        open={open}
        onClose={() =>
          setOpen(false)
        }
        title="Catat kasbon baru"
        description="Simpan biar nggak perlu ngandelin ingatan."
      >
        <DebtForm
          mode="create"
          onSuccess={() =>
            setOpen(false)
          }
        />
      </Modal>
    </>
  );
}