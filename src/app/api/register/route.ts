import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Extract basic info
    const kategoriInstansi = formData.get("kategoriPemohon") as string || formData.get("kategoriInstansi") as string;
    const namaInstansi = formData.get("namaInstansi") as string;
    const emailNarahubung = formData.get("emailNarahubung") as string;
    const namaNarahubung = formData.get("namaNarahubung") as string;
    const noHpNarahubung = formData.get("noHandphone") as string || formData.get("noHpNarahubung") as string;
    
    const file = formData.get("lampiran") as File | null || formData.get("suratPermohonan") as File | null;

    if (!kategoriInstansi || !namaInstansi || !emailNarahubung || !namaNarahubung || !noHpNarahubung || !file) {
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
    await mkdir(uploadDir, { recursive: true });

    const uniqueId = uuidv4();
    const fileName = `${uniqueId}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    const relativeFilePath = `/uploads/registrations/${fileName}`;

    // Save to Database using Prisma
    const newRequest = await prisma.registration_requests.create({
      data: {
        kategori_instansi: kategoriInstansi,
        nama_instansi: namaInstansi,
        email_narahubung: emailNarahubung,
        nama_narahubung: namaNarahubung,
        no_hp_narahubung: noHpNarahubung,
        surat_permohonan_path: relativeFilePath,
        users: {
          create: users.map((u: any) => ({
            nip_nik: u.nip_nik,
            nama_lengkap: u.nama_lengkap,
            nama_unit_kerja: u.nama_unit_kerja,
            no_hp: u.no_hp,
            email: u.email,
            jabatan: u.jabatan
          }))
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Pendaftaran berhasil dikirim. Kami akan memverifikasi permohonan Anda.",
      requestId: newRequest.id
    });

  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan sistem. Silakan coba lagi." }, { status: 500 });
  }
}
