import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { action, reason } = await request.json(); // "approve" or "reject"
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const regs: any[] = await query("SELECT * FROM registration_requests WHERE id = ?", [id]);
    if (!regs || regs.length === 0) {
      return NextResponse.json({ success: false, message: "Pendaftaran tidak ditemukan." }, { status: 404 });
    }
    const reg = regs[0];
    const regUsers: any[] = await query("SELECT * FROM registration_users WHERE registration_id = ?", [id]);

    if (action === "approve") {
      await query("UPDATE registration_requests SET status = 'APPROVED' WHERE id = ?", [id]);
      
      const defaultPassword = "Password123!";
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      // Create users based on the registration_users array
      for (const u of (regUsers || [])) {
        const existing: any[] = await query("SELECT id FROM users WHERE email = ?", [u.email]);
        if (!existing || existing.length === 0) {
          await query(
            "INSERT INTO users (email, password, name, role, instansi) VALUES (?, ?, ?, 'PEMDA', ?)",
            [u.email, hashedPassword, u.nama_lengkap, reg.nama_instansi]
          );
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
      await query("UPDATE registration_requests SET status = 'REJECTED', alasan_penolakan = ? WHERE id = ?", [reason || null, id]);

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
