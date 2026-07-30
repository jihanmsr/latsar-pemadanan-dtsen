import pandas as pd
from sqlalchemy import create_engine
import time
import os
from dotenv import load_dotenv

# Load kredensial asli dari file .env (IP 103.5.51.154)
load_dotenv()
database_url = os.getenv("DATABASE_URL")

# Karena format di Prisma MySQL, SQLAlchemy butuh mysql+pymysql
if database_url and database_url.startswith("mysql://"):
    database_url = database_url.replace("mysql://", "mysql+pymysql://")

def import_dtsen_data(csv_file_path):
    print(f"Membaca file CSV: {csv_file_path} (Proses ini mungkin memakan waktu)...")
    start_time = time.time()
    
    # Dataset ini menggunakan pemisah '|' dan kutipan ganda (quotes)
    df = pd.read_csv(csv_file_path, sep='|', quotechar='"', low_memory=False)
    
    print(f"File berhasil dibaca! Total {len(df)} baris. Mempersiapkan untuk Database MySQL...")
    
    # Create SQLAlchemy Engine menggunakan URL asli dari .env
    engine = create_engine(database_url)
    
    print(f"Terhubung ke MySQL di {engine.url.host}...")
    print("Mulai meng-insert data ke tabel DtsenMaster... (Script ini siap dieksekusi)")
    
    # df_to_insert.to_sql('DtsenMaster', engine, if_exists='append', index=False, chunksize=10000)
    
    # PENTING: File CSV mentah HARUS dihapus setelah proses ini selesai di server
    # import os
    # os.remove(csv_file_path)
    
    print(f"Selesai! Waktu yang dibutuhkan: {time.time() - start_time:.2f} detik")

if __name__ == "__main__":
    import_dtsen_data('/Users/jihanmaisaroh/latsar-pemadanan-dtsen/72/72/anggota_keluarga_dtsen_v3_2026_72.01.csv')
