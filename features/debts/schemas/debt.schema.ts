import { z } from "zod";

export const debtTypeSchema = z.enum([
  "owed_to_me",
  "i_owe",
]);

export const debtStatusFilterSchema = z.enum([
  "all",
  "unsettled",
  "settled",
]);

export const debtTypeFilterSchema = z.enum([
  "all",
  "owed_to_me",
  "i_owe",
]);

export const debtIdSchema = z
  .string()
  .uuid("ID kasbon tidak valid");

export const createDebtSchema = z.object({
  type: debtTypeSchema,

  counterpartName: z
    .string()
    .trim()
    .min(1, "Nama orang wajib diisi")
    .max(100, "Nama orang maksimal 100 karakter"),

  amount: z
    .number()
    .int("Jumlah harus berupa Rupiah utuh")
    .positive("Jumlah harus lebih dari 0"),

  dueDate: z
    .string()
    .date("Tanggal tidak valid"),

  note: z
    .string()
    .trim()
    .max(200, "Catatan maksimal 200 karakter")
    .nullable(),
});

export const updateDebtSchema =
  createDebtSchema.partial().extend({
    settled: z.boolean().optional(),
  });

export const debtFilterSchema = z.object({
  status: debtStatusFilterSchema.default("all"),
  type: debtTypeFilterSchema.default("all"),
});

export type CreateDebtInput =
  z.infer<typeof createDebtSchema>;

export type UpdateDebtInput =
  z.infer<typeof updateDebtSchema>;

export type DebtFilters =
  z.infer<typeof debtFilterSchema>;