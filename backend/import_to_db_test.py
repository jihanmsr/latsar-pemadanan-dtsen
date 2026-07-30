import os
from dotenv import load_dotenv
import pandas as pd
from sqlalchemy import create_engine
import time

load_dotenv()
database_url = os.getenv("DATABASE_URL")
if database_url and database_url.startswith("mysql://"):
    database_url = database_url.replace("mysql://", "mysql+pymysql://")

def run():
    print("Mempersiapkan koneksi...")
    engine = create_engine(database_url)
    
    file_path = '/Users/jihanmaisaroh/latsar-pemadanan-dtsen/72/72/anggota_keluarga_dtsen_v3_2026_72.01.csv'
    print(f"Membaca {file_path} (HANYA 100 BARIS PERTAMA UNTUK TESTING)...")
    
    records = []
    with open(file_path, 'r', encoding='utf-8') as f:
        for _ in range(100):
            line = f.readline()
            if not line: break
            parts = line.strip().split('|')
            parts = [p.replace('"', '') for p in parts]
            
            if len(parts) >= 42:
                # Kolom 0: NIK (kadang kosong, tapi ini primary unique key di DtsenMaster)
                nik = parts[0]
                if not nik:
                    continue # Skip jika tidak ada NIK
                
                # Handling format datetime untuk Prisma
                tgl = parts[3]
                if not tgl or len(tgl) < 4:
                    tgl = '1900-01-01'
                
                records.append({
                    'nik': nik,
                    'nama': parts[2] or '-',
                    'tanggal_lahir': tgl + " 00:00:00", 
                    'jenis_kelamin': parts[4] or '0',
                    'alamat_lengkap': parts[45] if len(parts) > 45 else parts[42],
                    'provinsi': parts[35] if len(parts) > 35 else '-',
                    'kabupaten_kota': parts[37] if len(parts) > 37 else '-',
                    'kecamatan': parts[39] if len(parts) > 39 else '-',
                    'desa_kelurahan': parts[41] if len(parts) > 41 else '-',
                    'desil': 0
                })
    
    if records:
        df = pd.DataFrame(records)
        print(f"Mencoba menginsert {len(df)} baris ke DtsenMaster...")
        try:
            # Gunakan penamaan tabel sesuai struktur prisma di database mysql
            # Prisma membuat tabel DtsenMaster (karena ada case nya)
            df.to_sql('DtsenMaster', engine, if_exists='append', index=False)
            print("BERHASIL INSERT 100 BARIS!")
        except Exception as e:
            print(f"GAGAL: {e}")
    else:
        print("Tidak ada data.")

if __name__ == '__main__':
    run()
