const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const readline = require('readline');

const prisma = new PrismaClient();

async function run() {
  const fileStream = fs.createReadStream('/Users/jihanmaisaroh/latsar-pemadanan-dtsen/72/72/anggota_keluarga_dtsen_v3_2026_72.01.csv');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  console.log("Mulai membaca CSV...");
  
  let records = [];
  let count = 0;
  
  for await (const line of rl) {
    if (count >= 100) break;
    
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
        alamat_lengkap: parts.length > 45 ? parts[45] : parts[42] || '-',
        provinsi: parts.length > 35 ? parts[35] : '-',
        kabupaten_kota: parts.length > 37 ? parts[37] : '-',
        kecamatan: parts.length > 39 ? parts[39] : '-',
        desa_kelurahan: parts.length > 41 ? parts[41] : '-',
        desil: 0
      });
      count++;
    }
  }

  console.log(`Mencoba insert ${records.length} baris...`);
  try {
    await prisma.dtsenMaster.createMany({
      data: records,
      skipDuplicates: true
    });
    console.log("BERHASIL INSERT!");
  } catch (e) {
    console.error("GAGAL:", e);
  } finally {
    await prisma.$disconnect();
  }
}

run();
