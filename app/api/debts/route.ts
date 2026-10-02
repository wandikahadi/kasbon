import {
  createDebtSchema,
  debtFilterSchema,
} from "@/features/debts/schemas/debt.schema";
import {
  errorResponse,
  successResponse,
} from "@/app/api/response";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return errorResponse(
      "Kamu harus login dulu",
      401
    );
  }

  const { searchParams } = new URL(request.url);

  const parsedFilters =
    debtFilterSchema.safeParse({
      status:
        searchParams.get("status") ?? "all",

      type:
        searchParams.get("type") ?? "all",
    });

  if (!parsedFilters.success) {
    return errorResponse(
      "Filter kasbon tidak valid",
      400
    );
  }

  const {
    status,
    type,
  } = parsedFilters.data;

  let query = supabase
    .from("debts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (status === "settled") {
    query = query.not(
      "settled_at",
      "is",
      null
    );
  }

  if (status === "unsettled") {
    query = query.is(
      "settled_at",
      null
    );
  }

  if (type !== "all") {
    query = query.eq("type", type);
  }

  const {
    data,
    error,
  } = await query;

  if (error) {
    console.error(
      "GET /api/debts:",
      error
    );

    return errorResponse(
      "Gagal mengambil data kasbon",
      500
    );
  }

  return successResponse(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return errorResponse(
      "Kamu harus login dulu",
      401
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
    createDebtSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse(
      "Data kasbon belum valid",
      400,
      parsed.error.flatten().fieldErrors
    );
  }

  const input = parsed.data;

  const {
    data,
    error,
  } = await supabase
    .from("debts")
    .insert({
      user_id: user.id,
      type: input.type,
      counterpart_name:
        input.counterpartName,
      amount: input.amount,
      due_date: input.dueDate,
      note: input.note || null,
    })
    .select()
    .single();

  if (error) {
    console.error(
      "POST /api/debts:",
      error
    );

    return errorResponse(
      "Gagal menyimpan kasbon",
      500
    );
  }

  return successResponse(
    data,
    201
  );
}