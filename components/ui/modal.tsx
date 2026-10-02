"use client";

import {
  type ReactNode,
  useEffect,
} from "react";
import { X } from "lucide-react";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
};

export function Modal({
  open,
  title,
  description,
  children,
  onClose,
}: ModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        "";

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Tutup modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />

      <div className="absolute inset-x-0 bottom-0 flex max-h-[92vh] flex-col rounded-t-3xl bg-white shadow-2xl sm:inset-0 sm:m-auto sm:max-h-[90vh] sm:w-full sm:max-w-lg sm:rounded-3xl">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-neutral-100 px-5 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0 space-y-1">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
              {title}
            </h2>

            {description ? (
              <p className="text-sm leading-5 text-neutral-500">
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-9 shrink-0 items-center justify-center rounded-xl text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950"
          >
            <X className="size-5" />

            <span className="sr-only">
              Tutup
            </span>
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 sm:px-6">
          {children}
        </div>
      </div>
    </div>
  );
}