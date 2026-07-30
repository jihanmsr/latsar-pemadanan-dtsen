import time
import difflib

def string_similarity(s1, s2):
    if not s1 or not s2:
        return 0.0
    s1 = str(s1).strip().upper()
    s2 = str(s2).strip().upper()
    return difflib.SequenceMatcher(None, s1, s2).ratio()

sasaran = {
    'nik': '9999',
    'nama': 'FARHANA SALSABILAH',
    'tgl_lahir': '2026-04-29',
    'jk': '2',
    'alamat': 'DESA SAMBIUT'
}

file_path = '/Users/jihanmaisaroh/latsar-pemadanan-dtsen/72/72/anggota_keluarga_dtsen_v3_2026_72.01.csv'
print(f"Mencari {sasaran['nama']} di {file_path}...")

start_time = time.time()

best_match = None
highest_score = 0.0
candidates = []

with open(file_path, 'r', encoding='utf-8') as f:
    for line in f:
        if 'FARHANA' in line.upper() or 'SALSABILAH' in line.upper():
            parts = line.strip().split('|')
            # Hilangkan quotes
            parts = [p.replace('"', '') for p in parts]
            if len(parts) > 5:
                # Kolom ke-3 biasanya nama (index 2)
                # Kolom ke-4 tgl lahir (index 3)
                # Kolom ke-5 JK (index 4)
                # Alamat di index 42 atau sekitarnya (kita gabung semua utk alamat)
                
                nama_master = parts[2]
                tgl_master = parts[3]
                jk_master = parts[4]
                alamat_master = parts[42] if len(parts) > 42 else ""
                
                name_sim = string_similarity(sasaran['nama'], nama_master)
                dob_sim = 1.0 if sasaran['tgl_lahir'] == tgl_master else string_similarity(sasaran['tgl_lahir'], tgl_master)
                addr_sim = string_similarity(sasaran['alamat'], alamat_master)
                
                total_score = (name_sim * 50) + (dob_sim * 30) + (addr_sim * 20)
                if str(sasaran['jk']) != jk_master:
                    total_score -= 10
                
                if total_score > highest_score:
                    highest_score = total_score
                    best_match = {
                        'nama': nama_master,
                        'tgl_lahir': tgl_master,
                        'jk': jk_master,
                        'alamat': alamat_master,
                        'skor': highest_score,
                        'raw': line.strip()
                    }

print("="*50)
if highest_score >= 50.0:
    print(f"KETEMU! (Skor Kemiripan: {highest_score:.2f}%)")
    print(f"Data Sasaran   : {sasaran['nama']} | {sasaran['tgl_lahir']} | JK:{sasaran['jk']} | {sasaran['alamat']}")
    print(f"Match Master   : {best_match['nama']} | {best_match['tgl_lahir']} | JK:{best_match['jk']} | {best_match['alamat']}")
    print(f"Raw Master Data: {best_match['raw'][:100]}...")
else:
    print(f"Tidak ada kecocokan. Skor tertinggi: {highest_score:.2f}%")
print("="*50)
print(f"Waktu eksekusi: {time.time() - start_time:.2f} detik")
