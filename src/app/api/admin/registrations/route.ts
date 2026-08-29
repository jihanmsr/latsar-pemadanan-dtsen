import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const registrations: any[] = await query(`
      SELECT * FROM registration_requests ORDER BY created_at DESC
    `);

    const users: any[] = await query(`
      SELECT * FROM registration_users
    `);

    const combined = (registrations || []).map(reg => ({
      ...reg,
      users: (users || []).filter(u => u.registration_id === reg.id)
    }));

    return NextResponse.json({ success: true, data: combined });
  } catch (error: any) {
    console.error("Fetch Registrations Error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server." }, { status: 500 });
  }
}
