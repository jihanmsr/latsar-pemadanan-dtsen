import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const APP_NAME = "PAKEWA - BPS Prov. Sulawesi Tengah";

/**
 * Mengirim email notifikasi ke Narahubung Instansi
 */
export async function sendInstitutionApprovalEmail(to: string, institutionName: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
      <div style="background-color: #1e40af; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Pendaftaran Disetujui</h1>
      </div>
      <div style="padding: 20px; color: #334155;">
        <p>Yth. Narahubung <strong>${institutionName}</strong>,</p>
        <p>Selamat! Pengajuan pendaftaran akun instansi Anda pada sistem <strong>PAKEWA (Padanan Kesejahteraan Warga)</strong> telah <strong>DISETUJUI</strong> oleh Admin BPS.</p>
        <p>Akun untuk masing-masing pengguna (pegawai) yang Anda daftarkan telah berhasil dibuat. Instruksi login beserta kata sandi (password) telah dikirimkan langsung ke email masing-masing pengguna tersebut demi keamanan data.</p>
        <p>Silakan arahkan pengguna Anda untuk mengecek kotak masuk email mereka dan segera login ke sistem.</p>
        <br/>
        <a href="https://pakewa.bpsulteng.id/login" style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login ke PAKEWA</a>
        <br/><br/>
        <p>Terima kasih atas kerja samanya dalam mengentaskan kemiskinan ekstrem di Sulawesi Tengah.</p>
        <p>Salam hangat,<br/>Tim Admin PAKEWA BPS</p>
      </div>
      <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
        &copy; ${new Date().getFullYear()} Badan Pusat Statistik Provinsi Sulawesi Tengah
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"${APP_NAME}" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: `[PAKEWA] Pendaftaran Instansi ${institutionName} Disetujui`,
    html,
  });
}

/**
 * Mengirim email penolakan ke Narahubung Instansi
 */
export async function sendInstitutionRejectionEmail(to: string, institutionName: string, reason: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
      <div style="background-color: #dc2626; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Pendaftaran Ditolak</h1>
      </div>
      <div style="padding: 20px; color: #334155;">
        <p>Yth. Narahubung <strong>${institutionName}</strong>,</p>
        <p>Mohon maaf, pengajuan pendaftaran akun instansi Anda pada sistem <strong>PAKEWA</strong> saat ini <strong>DITOLAK</strong> oleh Admin BPS.</p>
        <p><strong>Alasan Penolakan:</strong></p>
        <div style="background-color: #fee2e2; padding: 15px; border-left: 4px solid #b91c1c; border-radius: 4px; margin-bottom: 20px;">
          ${reason}
        </div>
        <p>Silakan perbaiki persyaratan yang kurang dan ajukan pendaftaran kembali melalui website PAKEWA.</p>
        <p>Terima kasih atas pengertiannya.</p>
        <p>Salam hangat,<br/>Tim Admin PAKEWA BPS</p>
      </div>
      <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
        &copy; ${new Date().getFullYear()} Badan Pusat Statistik Provinsi Sulawesi Tengah
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"${APP_NAME}" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: `[PAKEWA] Pembaruan Status Pendaftaran Instansi ${institutionName}`,
    html,
  });
}

/**
 * Mengirim email ke masing-masing pengguna (User 1, User 2, dst)
 */
export async function sendUserWelcomeEmail(to: string, name: string, institutionName: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
      <div style="background-color: #2563eb; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Selamat Datang di PAKEWA</h1>
      </div>
      <div style="padding: 20px; color: #334155;">
        <p>Halo <strong>${name}</strong>,</p>
        <p>Akun Anda telah berhasil didaftarkan sebagai pengguna dari instansi <strong>${institutionName}</strong> di sistem PAKEWA BPS.</p>
        <p>Berikut adalah detail akses masuk Anda:</p>
        <div style="background-color: #f8fafc; padding: 15px; border: 1px solid #e2e8f0; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${to}</p>
          <p style="margin: 0;"><strong>Password Sementara:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">Password123!</code></p>
        </div>
        <p style="color: #b91c1c; font-size: 14px;"><em>*Penting: Segera ganti password Anda setelah berhasil login pertama kali.</em></p>
        <br/>
        <div style="text-align: center;">
          <a href="https://pakewa.bpsulteng.id/login" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login ke Dashboard</a>
        </div>
        <br/><br/>
        <p>Salam hangat,<br/>Tim Admin PAKEWA BPS</p>
      </div>
      <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
        &copy; ${new Date().getFullYear()} Badan Pusat Statistik Provinsi Sulawesi Tengah
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"${APP_NAME}" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: `[PAKEWA] Informasi Akun Login Anda`,
    html,
  });
}
