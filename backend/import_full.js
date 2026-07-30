const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const readline = require('readline');

const prisma = new PrismaClient();

async function run() {
  const filePath = '/Users/jihanmaisaroh/latsar-pemadanan-dtsen/72/72/anggota_keluarga_dtsen_v3_2026_72.01.csv';
  console.log(`Mulai memproses CSV: ${filePath}`);
  
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let records = [];
  let totalInserted = 0;
  let batchSize = 5000;
  
  for await (const line of rl) {
    let parts = line.split('|').map(p => p.replace(/"/g, ''));
    if (parts.length >= 42) {
      let nik = parts[0];
      if (!nik) continue;
      
      let tgl = parts[3];
      if (!tgl || tgl.length < 4) tgl = '1900-01-01';
      
      records.push({
        nik: nik,
        nama: parts[2] || '-',
        tanggal_lahir: new Date(tgl),
        jenis_kelamin: parts[4] || '0',
        alamat_lengkap: parts.length > 45 ? parts[45] : (parts[42] || '-'),
        provinsi: parts.length > 35 ? parts[35] : '-',
        kabupaten_kota: parts.length > 37 ? parts[37] : '-',
        kecamatan: parts.length > 39 ? parts[39] : '-',
        desa_kelurahan: parts.length > 41 ? parts[41] : '-',
        desil: 0
      });
      
      // Insert in batches
      if (records.length >= batchSize) {
        try {
          await prisma.dtsenMaster.createMany({
            data: records,
            skipDuplicates: true
          });
          totalInserted += records.length;
          console.log(`Berhasil insert ${totalInserted} baris...`);
        } catch (e) {
          console.error("Gagal insert batch:", e);
        }
        records = []; // Reset batch
      }
    }
  }

  // Insert remaining records
  if (records.length > 0) {
    try {
      await prisma.dtsenMaster.createMany({
        data: records,
        skipDuplicates: true
      });
      totalInserted += records.length;
      console.log(`Berhasil insert ${totalInserted} baris...`);
    } catch (e) {
      console.error("Gagal insert batch terakhir:", e);
    }
  }

  console.log(`\nSELESAI! 🎉 Total data yang berhasil dimasukkan ke MySQL: ${totalInserted} baris.`);
  
  // UNTUK KEAMANAN: Hapus file setelah sukses (uncomment jika siap)
  // fs.unlinkSync(filePath);
  // console.log("File CSV mentah telah dihapus permanen demi keamanan.");

  await prisma.$disconnect();
}

run();
