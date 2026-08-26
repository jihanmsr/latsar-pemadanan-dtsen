import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

function generateTempPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email wajib diisi' }, { status: 400 });
    }

    // Cek apakah email ada di database
    const dbUser = await prisma.users.findUnique({
      where: { email }
    });

    // Selalu return success agar tidak bocorkan info email mana yang terdaftar
    if (!dbUser) {
      return NextResponse.json({ 
        success: true, 
        message: 'Jika email terdaftar, instruksi reset password telah dikirim.' 
      });
    }

    // Generate password sementara baru
    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Update password di database
    await prisma.users.update({
      where: { email },
      data: { password: hashedPassword }
    });

    // Kirim email password baru
    const html = `
<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"><title>Reset Password PAKEWA</title></head>
<body style="margin:0;padding:0;background:#f4f7f6;font-family:'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:600px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,.05);">
        <tr>
          <td style="background:linear-gradient(135deg,#dc2626,#ef4444);padding:40px 30px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">🔑 Reset Password</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 30px;color:#334155;font-size:16px;line-height:1.6;">
            <p style="margin-top:0">Halo <strong>${dbUser.name}</strong>,</p>
            <p>Kami menerima permintaan reset password untuk akun PAKEWA Anda. Berikut password sementara yang bisa digunakan:</p>
            
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:25px;margin:25px 0;text-align:center;">
              <p style="margin:0 0 8px;color:#64748b;font-size:14px;">Password Sementara</p>
              <div style="display:inline-block;background:#1e40af;color:#fff;padding:10px 20px;border-radius:8px;font-family:monospace;font-size:20px;font-weight:bold;letter-spacing:2px;">${tempPassword}</div>
            </div>
            
            <p style="color:#ea580c;font-size:14px;text-align:center;">⚠️ Segera ganti password ini setelah berhasil login!</p>
            
            <div style="text-align:center;margin:25px 0;">
              <a href="http://localhost:3000/login" style="background:#1e40af;color:#fff;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:600;">Login ke Dashboard</a>
            </div>
            
            <p style="color:#94a3b8;font-size:13px;">Jika Anda tidak merasa meminta reset password, abaikan email ini. Password lama Anda sudah tidak berlaku.</p>
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafc;padding:20px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0;color:#64748b;font-size:12px;">&copy; ${new Date().getFullYear()} Badan Pusat Statistik Provinsi Sulawesi Tengah</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    await transporter.sendMail({
      from: `"PAKEWA - BPS Prov. Sulawesi Tengah" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: '[PAKEWA] Reset Password Akun Anda',
      html,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Jika email terdaftar, instruksi reset password telah dikirim.' 
    });
  } catch (err) {
    console.error('[/api/auth/forgot-password] Error:', err);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
