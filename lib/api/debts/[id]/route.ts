import {
  debtIdSchema,
  updateDebtSchema,
} from "@/features/debts/schemas/debt.schema";
import type { DebtUpdate } from "@/features/debts/types/debt.types";
import {
  errorResponse,
  successResponse,
} from "@/lib/api/response";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return errorResponse(
      "Kamu harus login dulu",
      401
    );
  }

  const { id } = await context.params;

  const parsedId =
    debtIdSchema.safeParse(id);

  if (!parsedId.success) {
    return errorResponse(
      "ID kasbon tidak valid",
      400
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse(
      "Format request tidak valid",
      400
    );
  }

  const parsed =
    updateDebtSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse(
      "Data kasbon belum valid",
      400,
      parsed.error.flatten().fieldErrors
    );
  }

  const input = parsed.data;

  const update: DebtUpdate = {};

  if (input.type !== undefined) {
    update.type = input.type;
  }

  if (
    input.counterpartName !== undefined
  ) {
    update.counterpart_name =
      input.counterpartName;
  }

  if (input.amount !== undefined) {
    update.amount = input.amount;
  }

  if (input.dueDate !== undefined) {
    update.due_date = input.dueDate;
  }

  if (input.note !== undefined) {
    update.note =
      input.note || null;
  }

  if (input.settled !== undefined) {
    update.settled_at =
      input.settled
        ? new Date().toISOString()
        : null;
  }

  const {
    data,
    error,
  } = await supabase
    .from("debts")
    .update(update)
    .eq("id", parsedId.data)
    .eq("user_id", user.id)
    .select()
    .maybeSingle();

  if (error) {
    console.error(
      "PATCH /api/debts/[id]:",
      error
    );

    return errorResponse(
      "Gagal memperbarui kasbon",
      500
    );
  }

  if (!data) {
    return errorResponse(
      "Kasbon tidak ditemukan",
      404
    );
  }

  return successResponse(data);
}

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return errorResponse(
      "Kamu harus login dulu",
      401
    );
  }

  const { id } = await context.params;

  const parsedId =
    debtIdSchema.safeParse(id);

  if (!parsedId.success) {
    return errorResponse(
      "ID kasbon tidak valid",
      400
    );
  }

  const {
    data,
    error,
  } = await supabase
    .from("debts")
    .delete()
    .eq("id", parsedId.data)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error(
      "DELETE /api/debts/[id]:",
      error
    );

    return errorResponse(
      "Gagal menghapus kasbon",
      500
    );
  }

  if (!data) {
    return errorResponse(
      "Kasbon tidak ditemukan",
      404
    );
  }

  return successResponse({
    id: data.id,
  });
}