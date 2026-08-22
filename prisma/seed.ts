import * as mariadb from 'mariadb';
import bcrypt from 'bcryptjs';
import { encrypt } from '../src/lib/encryption';


async function main() {
  const dbUrl = process.env.DATABASE_URL || "mysql://u12228jhr_dtsen:inidatapenting123@103.5.51.154:3306/u12228jhr_dtsen";
  const parsed = new URL(dbUrl);
  const pool = mariadb.createPool({
    host: parsed.hostname,
    port: Number(parsed.port) || 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.slice(1),
    connectionLimit: 10,
  });

  const conn = await pool.getConnection();
  console.log('🌱 Seeding database...');

  // ── ADMIN BPS ────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin@BPS2024!', 10);
  
  // Upsert Admin BPS
  await conn.query(`
    INSERT INTO users (id, email, password, name, role, instansi) 
    VALUES (UUID(), ?, ?, 'Admin BPS', 'ADMIN', 'BPS Provinsi/Kabupaten')
    ON DUPLICATE KEY UPDATE password = ?, name = 'Admin BPS'
  `, ['admin@bps.go.id', adminPassword, adminPassword]);
  
  console.log('  ✅ Admin BPS: admin@bps.go.id');

  const pemdaPassword = await bcrypt.hash('Pemda@12345!', 10);

  // Upsert Pemda Palu
  await conn.query(`
    INSERT INTO users (id, email, password, name, role, instansi) 
    VALUES (UUID(), 'pemda.palu@sulteng.go.id', ?, 'Operator Dinas Palu', 'PEMDA', 'Dinas Sosial Kota Palu')
    ON DUPLICATE KEY UPDATE password = ?
  `, [pemdaPassword, pemdaPassword]);
  console.log('  ✅ PEMDA Palu: pemda.palu@sulteng.go.id');

  // Upsert Pemda Sigi
  await conn.query(`
    INSERT INTO users (id, email, password, name, role, instansi) 
    VALUES (UUID(), 'pemda.sigi@sulteng.go.id', ?, 'Operator Dinas Sigi', 'PEMDA', 'Dinas Sosial Kab. Sigi')
    ON DUPLICATE KEY UPDATE password = ?
  `, [pemdaPassword, pemdaPassword]);
  console.log('  ✅ PEMDA Sigi: pemda.sigi@sulteng.go.id');

  // Upsert Pemda Donggala
  await conn.query(`
    INSERT INTO users (id, email, password, name, role, instansi) 
    VALUES (UUID(), 'pemda.donggala@sulteng.go.id', ?, 'Operator Dinas Donggala', 'PEMDA', 'Dinas Sosial Kab. Donggala')
    ON DUPLICATE KEY UPDATE password = ?
  `, [pemdaPassword, pemdaPassword]);
  console.log('  ✅ PEMDA Donggala: pemda.donggala@sulteng.go.id');

  // ── MASTER DTSEN ─────────────────────────────────────────────────────────
  // 60 data dummy master DTSEN untuk keperluan testing matching
  const masterData = [
    { nik: '7271010101800001', nama_lengkap: 'AHMAD FAUZI', alamat_lengkap: 'JL. VETERAN NO.1, PALU' },
    { nik: '7271010201800002', nama_lengkap: 'BUDI SANTOSO', alamat_lengkap: 'JL. EMANUALA NO.3, PALU' },
    { nik: '7271010301850003', nama_lengkap: 'CICI RAHAYU', alamat_lengkap: 'JL. WAHIDIN NO.5, PALU' },
    { nik: '7271010401750004', nama_lengkap: 'DEDI KURNIAWAN', alamat_lengkap: 'JL. MERDEKA NO.7, PALU' },
    { nik: '7271010501800005', nama_lengkap: 'EKA WULANDARI', alamat_lengkap: 'JL. DIPONEGORO NO.9, PALU' },
    { nik: '7271020101820006', nama_lengkap: 'FAISAL RAHMAN', alamat_lengkap: 'JL. SUDIRMAN NO.11, PALU' },
    { nik: '7271020201780007', nama_lengkap: 'GITA PUSPITA', alamat_lengkap: 'JL. GATOT SUBROTO NO.13, PALU' },
    { nik: '7271020301900008', nama_lengkap: 'HASAN BASRI', alamat_lengkap: 'JL. IMAM BONJOL NO.15, PALU' },
    { nik: '7271020401850009', nama_lengkap: 'INDAH PERMATA', alamat_lengkap: 'JL. RADEN SALEH NO.17, PALU' },
    { nik: '7271020501760010', nama_lengkap: 'JOKO SUSILO', alamat_lengkap: 'JL. AHMAD YANI NO.19, PALU' },
    { nik: '7272010101830011', nama_lengkap: 'KARTINI DEWI', alamat_lengkap: 'JL. PAHLAWAN NO.1, PALU BARAT' },
    { nik: '7272010201810012', nama_lengkap: 'LUKMAN HAKIM', alamat_lengkap: 'JL. SLAMET RIYADI NO.2, PALU BARAT' },
    { nik: '7272010301880013', nama_lengkap: 'MIRA YANTI', alamat_lengkap: 'JL. HAYAM WURUK NO.3, PALU BARAT' },
    { nik: '7272010401720014', nama_lengkap: 'NANANG SETIAWAN', alamat_lengkap: 'JL. BRAWIJAYA NO.4, PALU BARAT' },
    { nik: '7272010501800015', nama_lengkap: 'OCHI RATNASARI', alamat_lengkap: 'JL. TEUKU UMAR NO.5, PALU BARAT' },
    { nik: '7272020101850016', nama_lengkap: 'PANDU WIRAWAN', alamat_lengkap: 'JL. DIPONEGORO NO.6, PALU BARAT' },
    { nik: '7272020201790017', nama_lengkap: 'QORI AMALIA', alamat_lengkap: 'JL. SOEDIRMAN NO.7, PALU BARAT' },
    { nik: '7272020301820018', nama_lengkap: 'RAHMAT HIDAYAT', alamat_lengkap: 'JL. VETERAN NO.8, PALU BARAT' },
    { nik: '7272020401870019', nama_lengkap: 'SARI MULYATI', alamat_lengkap: 'JL. PEMUDA NO.9, PALU BARAT' },
    { nik: '7272020501760020', nama_lengkap: 'TAUFIK AKBAR', alamat_lengkap: 'JL. COKROAMINOTO NO.10, PALU BARAT' },
    { nik: '7273010101800021', nama_lengkap: 'UMI KALSUM', alamat_lengkap: 'JL. RAYA NO.1, DONGGALA' },
    { nik: '7273010201830022', nama_lengkap: 'VINA MAHARANI', alamat_lengkap: 'JL. KEBUN NO.2, DONGGALA' },
    { nik: '7273010301770023', nama_lengkap: 'WAHYU PRASETYO', alamat_lengkap: 'JL. PASAR NO.3, DONGGALA' },
    { nik: '7273010401850024', nama_lengkap: 'XENA FITRIA', alamat_lengkap: 'JL. MERDEKA NO.4, DONGGALA' },
    { nik: '7273010501820025', nama_lengkap: 'YUSUF MANSUR', alamat_lengkap: 'JL. MASJID NO.5, DONGGALA' },
    { nik: '7273020101890026', nama_lengkap: 'ZAHRA NURMALA', alamat_lengkap: 'JL. TELUK NO.6, DONGGALA' },
    { nik: '7273020201760027', nama_lengkap: 'AMIR HAMZAH', alamat_lengkap: 'JL. PANTAI NO.7, DONGGALA' },
    { nik: '7273020301830028', nama_lengkap: 'BUNGA MELATI', alamat_lengkap: 'JL. NELAYAN NO.8, DONGGALA' },
    { nik: '7273020401810029', nama_lengkap: 'CAHYONO PUTRA', alamat_lengkap: 'JL. PELABUHAN NO.9, DONGGALA' },
    { nik: '7273020501780030', nama_lengkap: 'DEWI ANGGRAINI', alamat_lengkap: 'JL. LAUT NO.10, DONGGALA' },
    { nik: '7274010101840031', nama_lengkap: 'ENDRA GUNAWAN', alamat_lengkap: 'JL. SIGI NO.1, KAB. SIGI' },
    { nik: '7274010201800032', nama_lengkap: 'FITRI HANDAYANI', alamat_lengkap: 'JL. BIROMARU NO.2, KAB. SIGI' },
    { nik: '7274010301860033', nama_lengkap: 'GANI SURYAWAN', alamat_lengkap: 'JL. PALOLO NO.3, KAB. SIGI' },
    { nik: '7274010401790034', nama_lengkap: 'HANI NURSYAMSIAH', alamat_lengkap: 'JL. MARAWOLA NO.4, KAB. SIGI' },
    { nik: '7274010501810035', nama_lengkap: 'IRFAN HABIBIE', alamat_lengkap: 'JL. DOLO NO.5, KAB. SIGI' },
    { nik: '7274020101750036', nama_lengkap: 'JULIA RAMADHANI', alamat_lengkap: 'JL. TANAMBULAVA NO.6, KAB. SIGI' },
    { nik: '7274020201870037', nama_lengkap: 'KIRANA SARI', alamat_lengkap: 'JL. GUMBASA NO.7, KAB. SIGI' },
    { nik: '7274020301830038', nama_lengkap: 'LUHUR WIBOWO', alamat_lengkap: 'JL. KULAWI NO.8, KAB. SIGI' },
    { nik: '7274020401800039', nama_lengkap: 'MAHARANI PUTRI', alamat_lengkap: 'JL. NOKILALAKI NO.9, KAB. SIGI' },
    { nik: '7274020501820040', nama_lengkap: 'NOVA ADRIANA', alamat_lengkap: 'JL. DESA NO.10, KAB. SIGI' },
    { nik: '7275010101810041', nama_lengkap: 'OMAR FAUZAN', alamat_lengkap: 'JL. LUWUK NO.1, BANGGAI' },
    { nik: '7275010201780042', nama_lengkap: 'PUTRI AMANAH', alamat_lengkap: 'JL. SALAKAN NO.2, BANGGAI' },
    { nik: '7275010301850043', nama_lengkap: 'RENDI FIRMANSYAH', alamat_lengkap: 'JL. PAGIMANA NO.3, BANGGAI' },
    { nik: '7275010401830044', nama_lengkap: 'SISKA WULANDARI', alamat_lengkap: 'JL. BATUI NO.4, BANGGAI' },
    { nik: '7275010501760045', nama_lengkap: 'TIARA MAHARANI', alamat_lengkap: 'JL. KINTOM NO.5, BANGGAI' },
    { nik: '7275020101820046', nama_lengkap: 'UJANG SUHERMAN', alamat_lengkap: 'JL. TOILI NO.6, BANGGAI' },
    { nik: '7275020201870047', nama_lengkap: 'VERA KRISTIANTI', alamat_lengkap: 'JL. MOILONG NO.7, BANGGAI' },
    { nik: '7275020301800048', nama_lengkap: 'WAWAN HERMAWAN', alamat_lengkap: 'JL. BUNTA NO.8, BANGGAI' },
    { nik: '7275020401790049', nama_lengkap: 'YENI OKTAVIA', alamat_lengkap: 'JL. LUWUK TIMUR NO.9, BANGGAI' },
    { nik: '7275020501840050', nama_lengkap: 'ZULFIKAR ALI', alamat_lengkap: 'JL. LAMALA NO.10, BANGGAI' },
    { nik: '7276010101820051', nama_lengkap: 'AKBAR TANJUNG', alamat_lengkap: 'JL. POSO NO.1, KAB. POSO' },
    { nik: '7276010201800052', nama_lengkap: 'BADRIYAH KUSTINI', alamat_lengkap: 'JL. TENTENA NO.2, KAB. POSO' },
    { nik: '7276010301850053', nama_lengkap: 'CANDRA WIJAYA', alamat_lengkap: 'JL. PAMONA NO.3, KAB. POSO' },
    { nik: '7276010401780054', nama_lengkap: 'DIAN NOVITASARI', alamat_lengkap: 'JL. LAGE NO.4, KAB. POSO' },
    { nik: '7276010501830055', nama_lengkap: 'EKO PRASOJO', alamat_lengkap: 'JL. BETELEME NO.5, KAB. POSO' },
    { nik: '7276020101860056', nama_lengkap: 'FADHILAH NURAINI', alamat_lengkap: 'JL. AMPANA NO.6, KAB. POSO' },
    { nik: '7276020201810057', nama_lengkap: 'GILANG RAMADHAN', alamat_lengkap: 'JL. LEMORO NO.7, KAB. POSO' },
    { nik: '7276020301770058', nama_lengkap: 'HESTI RAHAYU', alamat_lengkap: 'JL. MEKO NO.8, KAB. POSO' },
    { nik: '7276020401840059', nama_lengkap: 'IMAM SYARIFUDIN', alamat_lengkap: 'JL. UEKULI NO.9, KAB. POSO' },
    { nik: '7276020501800060', nama_lengkap: 'JULIANA PRATIWI', alamat_lengkap: 'JL. TOJO NO.10, KAB. POSO' },
  ];

  // Upsert agar tidak duplikat jika seed dijalankan ulang
  let seededCount = 0;
  
  // Use batch for better performance
  const batchData = [];
  for (const data of masterData) {
    const encryptedNik = encrypt(data.nik);
    batchData.push([
      encryptedNik, data.nama_lengkap, data.alamat_lengkap, 1
    ]);
    seededCount++;
  }
  
  await conn.batch(`
    INSERT INTO master_dtsen (nik, nama_lengkap, alamat_lengkap, is_active)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE nama_lengkap = VALUES(nama_lengkap), alamat_lengkap = VALUES(alamat_lengkap)
  `, batchData);
  console.log(`  ✅ Master DTSEN: ${seededCount} records`);

  console.log('\n🎉 Seeding selesai!');
  console.log('\n📝 Akun yang bisa digunakan:');
  console.log('  👑 BPS Admin  : admin@bps.go.id       | Admin@BPS2024!');
  console.log('  🏛️  PEMDA Palu  : pemda.palu@sulteng.go.id | Pemda@12345!');
  console.log('  🏛️  PEMDA Sigi  : pemda.sigi@sulteng.go.id | Pemda@12345!');
  console.log('  🏛️  PEMDA Dongg : pemda.donggala@sulteng.go.id | Pemda@12345!');
  await conn.release();
  await pool.end();
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  });