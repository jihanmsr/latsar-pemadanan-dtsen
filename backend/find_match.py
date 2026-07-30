import pandas as pd
import difflib
import time

def string_similarity(s1, s2):
    if not s1 or not s2 or pd.isna(s1) or pd.isna(s2):
        return 0.0
    s1 = str(s1).strip().upper()
    s2 = str(s2).strip().upper()
    return difflib.SequenceMatcher(None, s1, s2).ratio()

print("Loading Missing NIK.xlsx (50 baris pertama)...")
# Load 50 rows from Missing NIK where NIK is invalid (e.g. 9999 or empty)
df_missing = pd.read_excel('/Users/jihanmaisaroh/latsar-pemadanan-dtsen/Missing NIK.xlsx', nrows=50)

# Build a list of sasaran dicts
targets = []
for _, row in df_missing.iterrows():
    nama = str(row.get('nama_dtsen_var', row.get('nama_dtsen', '')))
    thn = str(row.get('thn_lahir', '')).split('.')[0]
    bln = str(row.get('bln_lahir_value', '')).split('.')[0].zfill(2)
    tgl = str(row.get('tgl_lahir', '')).split('.')[0].zfill(2)
    dob = f"{thn}-{bln}-{tgl}"
    jk = str(row.get('jk_dtsen_value', '')).split('.')[0]
    alamat = str(row.get('alamat_klrg', ''))
    
    # only add if name is valid
    if len(nama) > 2 and nama.upper() != 'NAN':
        targets.append({
            'nama': nama,
            'tgl_lahir': dob,
            'jk': jk,
            'alamat': alamat
        })

print(f"Target yang akan dicari: {len(targets)} orang.")

file_path = '/Users/jihanmaisaroh/latsar-pemadanan-dtsen/72/72/anggota_keluarga_dtsen_v3_2026_72.01.csv'
print(f"Memulai pencarian di {file_path}...")
start_time = time.time()

found_matches = []

# Iterasi file master
with open(file_path, 'r', encoding='utf-8') as f:
    for line in f:
        # Cek apakah ada nama target di line ini untuk speed up
        line_upper = line.upper()
        
        # Fast filter
        possible_targets = [t for t in targets if t['nama'].split()[0] in line_upper]
        
        if not possible_targets:
            continue
            
        parts = line.strip().split('|')
        parts = [p.replace('"', '') for p in parts]
        if len(parts) > 5:
            nama_master = parts[2]
            tgl_master = parts[3]
            jk_master = parts[4]
            alamat_master = parts[42] if len(parts) > 42 else ""
            
            for sasaran in possible_targets:
                name_sim = string_similarity(sasaran['nama'], nama_master)
                # Jika nama lumayan mirip, baru hitung full score
                if name_sim > 0.6:
                    dob_sim = 1.0 if sasaran['tgl_lahir'] == tgl_master else string_similarity(sasaran['tgl_lahir'], tgl_master)
                    addr_sim = string_similarity(sasaran['alamat'], alamat_master)
                    
                    total_score = (name_sim * 50) + (dob_sim * 30) + (addr_sim * 20)
                    if str(sasaran['jk']) != jk_master:
                        total_score -= 10
                    
                    if total_score >= 80.0:
                        found_matches.append({
                            'sasaran': sasaran,
                            'master': {
                                'nama': nama_master,
                                'tgl_lahir': tgl_master,
                                'jk': jk_master,
                                'alamat': alamat_master
                            },
                            'score': total_score
                        })
                        
                        # Remove from targets to avoid finding again
                        targets.remove(sasaran)

print("="*50)
if found_matches:
    print(f"BERHASIL MENEMUKAN {len(found_matches)} KASUS COCOK! 🎉")
    for match in found_matches:
        s = match['sasaran']
        m = match['master']
        print(f"\n[ SKOR KEMIRIPAN: {match['score']:.2f}% ]")
        print(f"🔍 Data 'Missing NIK' : {s['nama']} | {s['tgl_lahir']} | {s['alamat']}")
        print(f"✅ Master DTSEN       : {m['nama']} | {m['tgl_lahir']} | {m['alamat']}")
else:
    print("Tidak ditemukan kecocokan yang tinggi (>= 80%) di 50 baris pertama.")
print("="*50)
print(f"Waktu eksekusi: {time.time() - start_time:.2f} detik")
