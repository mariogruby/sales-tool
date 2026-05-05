import { NextResponse } from "next/server";

export const apiSuccess = <T extends object>(data: T, status = 200) =>
    NextResponse.json(data, { status });

export const apiError = (message: string, status = 500) =>
    NextResponse.json({ message }, { status });
