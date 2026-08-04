import pandas as pd
import glob
import csv
import difflib

def string_similarity(s1, s2):
    if not s1 or not s2: return 0.0
    s1 = str(s1).strip().upper()
    s2 = str(s2).strip().upper()
    if s1 == s2: return 1.0
    len1, len2 = len(s1), len(s2)
    matrix = [[0] * (len2 + 1) for _ in range(len1 + 1)]
    for i in range(len1 + 1): matrix[i][0] = i
    for j in range(len2 + 1): matrix[0][j] = j
    for i in range(1, len1 + 1):
        for j in range(1, len2 + 1):
            cost = 0 if s1[i - 1] == s2[j - 1] else 1
            matrix[i][j] = min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost)
    dist = matrix[len1][len2]
    max_len = max(len1, len2)
    return (max_len - dist) / max_len

print("Loading master names...")
master_names = {}
for master_path in glob.glob('72/72/anggota_keluarga_dtsen_v3_2026_72.*.csv'):
    with open(master_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f, delimiter='|')
        next(reader, None)
        for parts in reader:
            if len(parts) >= 3:
                nik = parts[0].strip()
                if len(nik) == 16:
                    master_names[nik] = parts[2].strip().upper()

print("Analyzing TIDAK DITEMUKAN...")
df = pd.read_excel('Hasil_Validasi_Akurasi.xlsx')
failed = df[df['Status_Validasi_Akurasi'] == 'TIDAK DITEMUKAN'].head(10)

print("\n--- CONTOH 10 DATA TIDAK DITEMUKAN ---")
for idx, row in failed.iterrows():
    nik = str(row['nik_dtsen_prelist']).strip().replace('.0', '')
    nama_usulan = str(row['nama_dtsen_var']).upper().strip()
    if nama_usulan == 'NAN' or not nama_usulan: nama_usulan = str(row['nama_dtsen']).upper().strip()
    nama_master = master_names.get(nik, "TIDAK ADA")
    score = int(string_similarity(nama_usulan, nama_master) * 100)
    print(f"NIK: {nik}")
    print(f"Nama Prelist : {nama_usulan}")
    print(f"Nama KTP Asli: {nama_master}")
    print(f"Skor Levenshtein Murni: {score}%")
    print("-" * 40)
