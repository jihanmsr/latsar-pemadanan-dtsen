import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { action } = await request.json(); // "approve" or "reject"
    const id = params.id;

    const dbPath = path.join(process.cwd(), "src/data/registrations.json");
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json({ success: false, message: "Data tidak ditemukan." }, { status: 404 });
    }

    const dbContent = await readFile(dbPath, "utf-8");
    let registrations = JSON.parse(dbContent);

    const index = registrations.findIndex((r: any) => r.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: "Pendaftaran tidak ditemukan." }, { status: 404 });
    }

    const reg = registrations[index];

    if (action === "approve") {
      reg.status = "APPROVED";
      
      // Create users in MySQL using Prisma
      // Generate a default password for these new accounts
      const defaultPassword = "Password123!";
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      // Create users based on the registration_users array
      for (const u of reg.users) {
        // Check if user already exists
        const existing = await prisma.users.findUnique({ where: { username: u.nip_nik } });
        if (!existing) {
          await prisma.users.create({
            data: {
              username: u.nip_nik,
              password: hashedPassword,
              full_name: u.nama_lengkap,
              role: "instansi", // Adjust based on your enum role types
            }
          });
        }
      }

    } else if (action === "reject") {
      reg.status = "REJECTED";
    }

    registrations[index] = reg;
    await writeFile(dbPath, JSON.stringify(registrations, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: action === "approve" ? "Pendaftaran disetujui dan akun telah dibuat." : "Pendaftaran ditolak."
    });

  } catch (error: any) {
    console.error("Action Registration Error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server." }, { status: 500 });
  }
}
