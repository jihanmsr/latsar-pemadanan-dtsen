import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { action, reason } = await request.json(); // "approve" or "reject"
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const reg = await prisma.registration_requests.findUnique({
      where: { id },
      include: { users: true }
    });

    if (!reg) {
      return NextResponse.json({ success: false, message: "Pendaftaran tidak ditemukan." }, { status: 404 });
    }

    if (action === "approve") {
      await prisma.registration_requests.update({
        where: { id },
        data: { status: "APPROVED" }
      });
      
      const defaultPassword = "Password123!";
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      // Create users based on the registration_users array
      for (const u of reg.users) {
        const existing = await prisma.users.findUnique({ where: { email: u.email } });
        if (!existing) {
          await prisma.users.create({
            data: {
              email: u.email,
              password: hashedPassword,
              name: u.nama_lengkap,
              role: "PEMDA",
              instansi: reg.nama_instansi
            }
          });
          // Kirim email kredensial ke user
          if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
            import('@/lib/email').then(({ sendUserWelcomeEmail }) => {
              sendUserWelcomeEmail(u.email, u.nama_lengkap, reg.nama_instansi).catch(console.error);
            });
          }
        }
      }

      // Kirim email persetujuan ke narahubung
      if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
        import('@/lib/email').then(({ sendInstitutionApprovalEmail }) => {
          sendInstitutionApprovalEmail(reg.email_narahubung, reg.nama_instansi).catch(console.error);
        });
      }

    } else if (action === "reject") {
      await prisma.registration_requests.update({
        where: { id },
        data: { 
          status: "REJECTED",
          alasan_penolakan: reason || null
        }
      });

      // Kirim email penolakan ke narahubung
      if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
        import('@/lib/email').then(({ sendInstitutionRejectionEmail }) => {
          sendInstitutionRejectionEmail(reg.email_narahubung, reg.nama_instansi, reason || "Tidak memenuhi syarat").catch(console.error);
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: action === "approve" ? "Pendaftaran disetujui, akun telah dibuat, dan email dikirim." : "Pendaftaran ditolak dan email pemberitahuan dikirim."
    });

  } catch (error: any) {
    console.error("Action Registration Error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server." }, { status: 500 });
  }
}
