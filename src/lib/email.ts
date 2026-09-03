import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const APP_NAME = "PAKEWA - BPS Prov. Sulawesi Tengah";
const LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Badan_Pusat_Statistik_Logo.svg/1024px-Badan_Pusat_Statistik_Logo.svg.png";

/**
 * Helper untuk membungkus konten email dengan layout premium
 */
function getEmailLayout(title: string, content: string) {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>${title}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f7f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; max-width: 600px; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
              <img src="${LOGO_URL}" alt="BPS Logo" width="60" style="display: block; margin: 0 auto 15px auto; filter: brightness(0) invert(1);" />
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">${title}</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px; color: #334155; font-size: 16px; line-height: 1.6;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #64748b; font-size: 13px; font-weight: 500;">&copy; ${new Date().getFullYear()} Badan Pusat Statistik Provinsi Sulawesi Tengah</p>
              <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 12px;">PAKEWA - Padanan Kesejahteraan Warga</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Mengirim email notifikasi ke Narahubung Instansi
 */
export async function sendInstitutionApprovalEmail(to: string, institutionName: string) {
  const content = `
    <p style="margin-top: 0;">Yth. Narahubung <strong>${institutionName}</strong>,</p>
    <p>Selamat! Pengajuan pendaftaran akun instansi Anda pada sistem <strong>PAKEWA</strong> telah <strong style="color: #059669;">DISETUJUI</strong> oleh Admin BPS.</p>
    <p>Akun untuk masing-masing pengguna (pegawai) yang Anda daftarkan telah berhasil dibuat. Instruksi login beserta kata sandi (password) telah dikirimkan langsung ke email masing-masing pengguna demi menjaga privasi dan keamanan data.</p>
    <p>Silakan arahkan pengguna Anda untuk mengecek kotak masuk email mereka dan segera login ke sistem.</p>
    
    <div style="text-align: center; margin: 35px 0;">
      <a href="http://localhost:3000/login" style="display: inline-block; background-color: #1e40af; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">Akses Dashboard PAKEWA</a>
    </div>
    
    <p style="margin: 0; color: #64748b;">Terima kasih atas sinergi Anda dalam mewujudkan data yang berkualitas di Sulawesi Tengah.</p>
  `;

  await transporter.sendMail({
    from: `"${APP_NAME}" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: `[PAKEWA] Pendaftaran Instansi ${institutionName} Disetujui`,
    html: getEmailLayout("Pendaftaran Disetujui", content),
  });
}

/**
 * Mengirim email penolakan ke Narahubung Instansi
 */
export async function sendInstitutionRejectionEmail(to: string, institutionName: string, reason: string) {
  const content = `
    <p style="margin-top: 0;">Yth. Narahubung <strong>${institutionName}</strong>,</p>
    <p>Mohon maaf, pengajuan pendaftaran akun instansi Anda pada sistem <strong>PAKEWA</strong> saat ini <strong style="color: #dc2626;">DITOLAK</strong> oleh Admin BPS.</p>
    
    <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px 20px; border-radius: 4px; margin: 25px 0;">
      <p style="margin: 0; color: #991b1b; font-size: 14px;"><strong>Alasan Penolakan:</strong><br/>${reason}</p>
    </div>
    
    <p>Silakan perbaiki persyaratan administrasi yang kurang dan ajukan pendaftaran kembali melalui portal resmi PAKEWA.</p>
    <p style="margin: 0; color: #64748b;">Terima kasih atas pengertian Anda.</p>
  `;

  await transporter.sendMail({
    from: `"${APP_NAME}" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: `[PAKEWA] Status Pendaftaran Instansi ${institutionName}`,
    html: getEmailLayout("Pendaftaran Ditolak", content),
  });
}

/**
 * Mengirim email ke masing-masing pengguna (User 1, User 2, dst)
 */
export async function sendUserWelcomeEmail(to: string, name: string, institutionName: string) {
  const content = `
    <p style="margin-top: 0;">Halo <strong>${name}</strong>,</p>
    <p>Akun Anda telah berhasil diprovisi sebagai pengguna dari instansi <strong>${institutionName}</strong> di sistem PAKEWA BPS.</p>
    
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center;">
      <p style="margin: 0 0 5px 0; color: #64748b; font-size: 14px;">Email / Username</p>
      <p style="margin: 0 0 20px 0; color: #0f172a; font-size: 18px; font-weight: 600;">${to}</p>
      
      <p style="margin: 0 0 5px 0; color: #64748b; font-size: 14px;">Password Sementara</p>
      <div style="display: inline-block; background-color: #e2e8f0; color: #334155; padding: 8px 16px; border-radius: 6px; font-family: monospace; font-size: 18px; font-weight: bold; letter-spacing: 1px;">Password123!</div>
    </div>
    
    <p style="color: #ea580c; font-size: 14px; text-align: center; margin-bottom: 30px;">
      <em>⚠️ Penting: Demi keamanan, sistem akan meminta Anda untuk mengganti password setelah login pertama kali.</em>
    </p>
    
    <div style="text-align: center; margin-bottom: 20px;">
      <a href="http://localhost:3000/login" style="display: inline-block; background-color: #1e40af; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">Login ke Dashboard</a>
    </div>
  `;

  await transporter.sendMail({
    from: `"${APP_NAME}" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: `[PAKEWA] Informasi Akses Akun Anda`,
    html: getEmailLayout("Selamat Datang di PAKEWA", content),
  });
}

/**
 * Mengirim email notifikasi ke Pemda saat status SLA (Pengajuan) di-update oleh Admin
 */
export async function sendSLAUpdateEmail(to: string, institutionName: string, submissionId: string, newStatus: string) {
  const content = `
    <p style="margin-top: 0;">Yth. Tim Data <strong>${institutionName}</strong>,</p>
    <p>Pengajuan pemadanan data Anda dengan ID <strong>${submissionId}</strong> telah diperbarui oleh Admin BPS.</p>
    
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center;">
      <p style="margin: 0 0 5px 0; color: #64748b; font-size: 14px;">Status Saat Ini</p>
      <div style="display: inline-block; background-color: #dbeafe; color: #1e40af; padding: 8px 16px; border-radius: 6px; font-weight: bold; letter-spacing: 1px;">${newStatus}</div>
    </div>
    
    <div style="text-align: center; margin-bottom: 20px;">
      <a href="http://localhost:3000/dashboard" style="display: inline-block; background-color: #1e40af; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">Lihat Detail di Dashboard</a>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"${APP_NAME}" <${process.env.SMTP_EMAIL}>`,
      to,
      subject: `[PAKEWA] Update Status Pengajuan ${submissionId}`,
      html: getEmailLayout("Update Status Pemadanan", content),
    });
    console.log(`[Email Terkirim] SLA Update ${newStatus} to ${to}`);
  } catch (e: any) {
    console.log(`[Email Simulasi] SLA Update ${newStatus} to ${to} (SMTP tidak dikonfigurasi)`);
  }
}

/**
 * Mengirim email notifikasi ke Admin BPS saat ada Pemda yang mengunggah pengajuan baru
 */
export async function sendNewSubmissionEmail(adminEmail: string, institutionName: string, submissionId: string, totalRows: number) {
  const content = `
    <p style="margin-top: 0;">Yth. Admin BPS,</p>
    <p>Terdapat pengajuan pemadanan data sasaran baru yang masuk ke sistem PAKEWA dari <strong>${institutionName}</strong>.</p>
    
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0 0 10px 0;"><strong>ID Pengajuan:</strong> ${submissionId}</p>
      <p style="margin: 0 0 10px 0;"><strong>Instansi:</strong> ${institutionName}</p>
      <p style="margin: 0 0 0 0;"><strong>Total Baris Data:</strong> ${totalRows.toLocaleString('id-ID')} baris</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="http://localhost:3000/admin/dashboard" style="display: inline-block; background-color: #1e40af; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">Verifikasi Sekarang</a>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"${APP_NAME}" <${process.env.SMTP_EMAIL}>`,
      to: adminEmail,
      subject: `[PAKEWA] Pengajuan Baru: ${institutionName}`,
      html: getEmailLayout("Pengajuan Data Baru", content),
    });
    console.log(`[Email Terkirim] New Submission to Admin`);
  } catch (e: any) {
    console.log(`[Email Simulasi] New Submission to Admin (SMTP tidak dikonfigurasi)`);
  }
}
