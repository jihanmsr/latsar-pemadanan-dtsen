import { NextRequest, NextResponse } from 'next/server';

import { verifyAuth, unauthorizedResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { user, error } = await verifyAuth(req);
  if (!user) return unauthorizedResponse(error ?? undefined);

  const { searchParams } = new URL(req.url);
  const submissionId = searchParams.get('submissionId');

  if (!submissionId) {
    return NextResponse.json({ success: false, error: 'submissionId diperlukan' }, { status: 400 });
  }

  // Generate HTML Resmi untuk BAST
  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>BAST - ${submissionId}</title>
      <style>
        body { font-family: 'Times New Roman', Times, serif; color: #000; line-height: 1.5; margin: 0; padding: 40px; }
        .kop-surat { text-align: center; border-bottom: 3px solid #000; padding-bottom: 15px; margin-bottom: 30px; }
        .kop-surat h1 { margin: 0; font-size: 20px; text-transform: uppercase; }
        .kop-surat h2 { margin: 5px 0 0; font-size: 16px; font-weight: normal; }
        .kop-surat p { margin: 5px 0 0; font-size: 12px; }
        .title { text-align: center; margin-bottom: 30px; }
        .title h3 { text-decoration: underline; margin: 0; font-size: 16px; }
        .title p { margin: 5px 0 0; font-size: 14px; }
        .content { font-size: 14px; text-align: justify; }
        .table-info { margin: 20px 0; width: 100%; border-collapse: collapse; }
        .table-info td { padding: 5px; vertical-align: top; }
        .table-info td:first-child { width: 30%; }
        .table-info td:nth-child(2) { width: 2%; }
        .signatures { margin-top: 50px; width: 100%; display: flex; justify-content: space-between; }
        .sign-box { width: 45%; text-align: center; }
        .sign-space { height: 100px; }
        .footer-note { margin-top: 50px; font-size: 10px; font-style: italic; color: #666; text-align: center; border-top: 1px solid #ccc; padding-top: 10px; }
        @media print {
          @page { margin: 2cm; }
          body { padding: 0; }
        }
      </style>
    </head>
    <body onload="window.print()">
      <div class="kop-surat">
        <h1>BADAN PUSAT STATISTIK</h1>
        <h2>Sistem Pemadanan Kesejahteraan Sosial (PAKEWA)</h2>
        <p>Jl. Dr. Sutomo No. 6-8, Jakarta 10710, Telp: (021) 3841195, 3842508, 3810291, Faks: (021) 3857046</p>
      </div>

      <div class="title">
        <h3>BERITA ACARA SERAH TERIMA DATA PEMADANAN</h3>
        <p>Nomor: BAST/${submissionId.split('-')[1]}/${submissionId.split('-')[2]}</p>
      </div>

      <div class="content">
        <p>Pada hari ini, <b>${new Date().toLocaleDateString('id-ID', { weekday: 'long' })}</b>, tanggal <b>${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</b>, telah dilaksanakan serah terima hasil pemadanan data mandiri melalui Sistem PAKEWA antara Badan Pusat Statistik dan pihak instansi pengaju.</p>
        
        <p>Rincian pelaksanaan pemadanan adalah sebagai berikut:</p>
        <table class="table-info">
          <tr>
            <td>ID Tiket Pengajuan</td>
            <td>:</td>
            <td><b>${submissionId}</b></td>
          </tr>
          <tr>
            <td>Instansi Pemohon</td>
            <td>:</td>
            <td><b>${user.instansi || 'Pemerintah Daerah'}</b></td>
          </tr>
          <tr>
            <td>Status Akhir</td>
            <td>:</td>
            <td><b>SELESAI (100%)</b></td>
          </tr>
        </table>

        <p>Dengan diterbitkannya Berita Acara Serah Terima (BAST) ini, Pihak Instansi menyatakan telah menerima hasil pemadanan data Kesejahteraan Sosial secara lengkap dan akan menjaga kerahasiaan data tersebut sesuai dengan Non-Disclosure Agreement (NDA) dan peraturan perundang-undangan yang berlaku tentang Perlindungan Data Pribadi.</p>
        <p>Demikian Berita Acara Serah Terima ini dibuat dengan sebenar-benarnya untuk dipergunakan sebagaimana mestinya.</p>
      </div>

      <div class="signatures">
        <div class="sign-box">
          <p>Menerima,<br><b>Perwakilan Instansi</b></p>
          <div class="sign-space"></div>
          <p><u><b>${user.name.toUpperCase()}</b></u><br>NIP. .........................</p>
        </div>
        <div class="sign-box">
          <p>Menyerahkan,<br><b>Admin PAKEWA BPS</b></p>
          <div class="sign-space"></div>
          <p><u><b>TIM PENGELOLA DATA</b></u><br>Badan Pusat Statistik</p>
        </div>
      </div>

      <div class="footer-note">
        Dokumen ini dihasilkan secara otomatis oleh Sistem PAKEWA pada ${new Date().toLocaleString('id-ID')}. Dokumen elektronik ini sah dan tidak memerlukan stempel basah.
      </div>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
      // We don't force download, we let it open in browser so it can print
      'Content-Disposition': 'inline', 
    },
  });
}
