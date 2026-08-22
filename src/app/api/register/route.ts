import { NextResponse } from "next/server";
import { writeFile, mkdir, readFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const kategori_instansi = formData.get("kategoriPemohon") as string;
    const nama_instansi = formData.get("namaInstansi") as string;
    const email_narahubung = formData.get("emailNarahubung") as string;
    const nama_narahubung = formData.get("namaNarahubung") as string;
    const no_hp_narahubung = formData.get("noHandphone") as string;
    const file = formData.get("lampiran") as File | null;

    if (!kategori_instansi || !nama_instansi || !email_narahubung || !nama_narahubung || !no_hp_narahubung || !file) {
      return NextResponse.json({ success: false, message: "Semua field instansi wajib diisi." }, { status: 400 });
    }

    // Process Users (User 1 and User 2 are required)
    const users = [];
    for (let i = 1; i <= 4; i++) {
      const nip_nik = formData.get(`user${i}_nip_nik`) as string;
      if (nip_nik) { 
        users.push({
          nip_nik,
          nama_lengkap: formData.get(`user${i}_nama_lengkap`) as string,
          nama_unit_kerja: formData.get(`user${i}_nama_unit_kerja`) as string,
          no_hp: formData.get(`user${i}_no_hp`) as string,
          email: formData.get(`user${i}_email`) as string,
          jabatan: formData.get(`user${i}_jabatan`) as string,
        });
      }
    }

    if (users.length < 2) {
      return NextResponse.json({ success: false, message: "Minimal User 1 dan User 2 wajib diisi." }, { status: 400 });
    }

    // Save File
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uploadDir = path.join(process.cwd(), "public/uploads/registrations");
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const uniqueId = uuidv4();
    const fileName = `${uniqueId}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    const relativeFilePath = `/uploads/registrations/${fileName}`;

    // Read existing JSON DB
    const dbPath = path.join(process.cwd(), "src/data/registrations.json");
    let registrations = [];
    if (fs.existsSync(dbPath)) {
      const dbContent = await readFile(dbPath, "utf-8");
      registrations = JSON.parse(dbContent);
    } else {
      const dataDir = path.dirname(dbPath);
      if (!fs.existsSync(dataDir)) await mkdir(dataDir, { recursive: true });
    }

    // Append new registration
    const newRequest = {
      id: uniqueId,
      kategori_instansi,
      nama_instansi,
      email_narahubung,
      nama_narahubung,
      no_hp_narahubung,
      surat_permohonan_path: relativeFilePath,
      status: "PENDING",
      created_at: new Date().toISOString(),
      users
    };
    
    registrations.push(newRequest);
    await writeFile(dbPath, JSON.stringify(registrations, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: "Pendaftaran berhasil dikirim. Kami akan memverifikasi permohonan Anda.",
      requestId: uniqueId
    });

  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan sistem. Silakan coba lagi." }, { status: 500 });
  }
}
