import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), "src/data/registrations.json");
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json({ success: true, data: [] });
    }

    const dbContent = await readFile(dbPath, "utf-8");
    const registrations = JSON.parse(dbContent);

    // Sort by created_at descending
    registrations.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ success: true, data: registrations });
  } catch (error: any) {
    console.error("Fetch Registrations Error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server." }, { status: 500 });
  }
}
