import { NextResponse } from "next/server";

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
};

export function successResponse<T>(
  data: T,
  status = 200
) {
  return NextResponse.json<ApiSuccess<T>>(
    {
      success: true,
      data,
    },
    { status }
  );
}

export function errorResponse(
  message: string,
  status = 400,
  errors?: Record<string, string[]>
) {
  return NextResponse.json<ApiError>(
    {
      success: false,
      message,
      ...(errors ? { errors } : {}),
    },
    { status }
  );
}