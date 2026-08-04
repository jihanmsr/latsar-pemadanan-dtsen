import pandas as pd
import time

def string_similarity(s1, s2):
    if not s1 or not s2: return 0.0
    s1 = str(s1).strip().upper()
    s2 = str(s2).strip().upper()
    if s1 == s2: return 1.0

    len1, len2 = len(s1), len(s2)
    if len1 == 0 or len2 == 0: return 0.0

    matrix = [[0] * (len2 + 1) for _ in range(len1 + 1)]
    for i in range(len1 + 1): matrix[i][0] = i
    for j in range(len2 + 1): matrix[0][j] = j

    for i in range(1, len1 + 1):
        for j in range(1, len2 + 1):
            cost = 0 if s1[i - 1] == s2[j - 1] else 1
            matrix[i][j] = min(matrix[i - 1][j] + 1,       
                               matrix[i][j - 1] + 1,       
                               matrix[i - 1][j - 1] + cost) 

    dist = matrix[len1][len2]
    max_len = max(len1, len2)
    return (max_len - dist) / max_len

def parse_nik(nik):
    nik = str(nik).strip()
    if len(nik) != 16 or not nik.isdigit(): return None
    wilayah = nik[:6]
    dd = int(nik[6:8])
    mm = int(nik[8:10])
    yy = int(nik[10:12])
    gender = '2' if dd > 40 else '1'
    if dd > 40: dd -= 40
    return {'wilayah': wilayah, 'dd': dd, 'mm': mm, 'yy': yy, 'gender': gender}

print("Loading Master Data...")
import glob
import os
import csv

master_dict = {} 
master_dob = {}  

csv_files = glob.glob('72/72/anggota_keluarga_dtsen_v3_2026_72.*.csv')

for master_path in csv_files:
    print(f"Loading {os.path.basename(master_path)}...")
    with open(master_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f, delimiter='|')
        next(reader, None) # skip header
        for parts in reader:
            if len(parts) >= 3:
                nik = parts[0].strip()
                nama = parts[2].strip().upper()
                if len(nik) == 16:
                    master_dict[nik] = nama
                    p = parse_nik(nik)
                    if p:
                        dob_key = f"{p['dd']:02d}_{p['mm']:02d}_{p['yy']:02d}_{p['gender']}"
                        if dob_key not in master_dob:
                            master_dob[dob_key] = []
                        master_dob[dob_key].append({'nik': nik, 'nama': nama, 'wilayah': p['wilayah']})

print(f"Master Loaded: {len(master_dict)} records.")

print("Loading Validation Data...")
df = pd.read_excel('sqllab_untitled_query_14_20260803T101305.xlsx')

correct_matches = 0
incorrect_matches = 0
not_found = 0

out_predicted_nik = []
out_validation_status = []

start_time = time.time()

for idx, row in df.iterrows():
    actual_nik = str(row['nik_dtsen_prelist']).strip()
    if '.0' in actual_nik: actual_nik = actual_nik.replace('.0', '')
    
    # Validasi Sesungguhnya: Apakah NIK ini ada di Master? 
    if len(actual_nik) != 16 or actual_nik not in master_dict:
        out_predicted_nik.append(None)
        out_validation_status.append('SKIP (TIDAK ADA DI MASTER)')
        continue
        
    nama_usulan = str(row['nama_dtsen_var']).upper().strip()
    if nama_usulan == 'NAN' or not nama_usulan: 
        nama_usulan = str(row['nama_dtsen']).upper().strip()

    tgl = row['tgl_lahir']
    bln = row['bln_lahir_value']
    thn = row['thn_lahir']
    
    if pd.isna(tgl) or pd.isna(bln) or pd.isna(thn):
        p = parse_nik(actual_nik)
        if p:
            tgl, bln, thn = p['dd'], p['mm'], p['yy']
        else:
            out_predicted_nik.append(None)
            out_validation_status.append('SKIP (DOB INVALID)')
            continue
            
    try:
        tgl, bln, thn = int(tgl), int(bln), int(thn)
        thn = thn % 100
    except:
        out_predicted_nik.append(None)
        out_validation_status.append('SKIP (DOB FORMAT ERROR)')
        continue
        
    gender = str(row['jk_dtsen_value']).strip()
    if gender == 'nan': gender = '1'
    if gender == '2.0': gender = '2'
    if gender == '1.0': gender = '1'

    usulan_wilayah = str(row['level_6_full_code']).strip()[:6]

    # JALANKAN ALGORITMA FALLBACK (PURA-PURA NIK HILANG)
    dob_key = f"{tgl:02d}_{bln:02d}_{thn:02d}_{gender}"
    candidates = master_dob.get(dob_key, [])
    
    best_score = -1
    best_match_nik = None
    
    if candidates:
        for m in candidates:
            score = int(string_similarity(nama_usulan, m['nama']) * 100)
            
            # Tambahkan bonus jika nama agak beda tapi TTL sama persis (yang mana ini pasti)
            if score >= 50:
                score = min(100, score + 15)
                
            if usulan_wilayah == m['wilayah'] and score >= 60:
                score = min(100, score + 5)
                
            if score > best_score:
                best_score = score
                best_match_nik = m['nik']
            if best_score == 100: break

    # Lapis 2: Jika Lapis 1 gagal
    if best_score < 60:
        first_word = nama_usulan.split(' ')[0] if ' ' in nama_usulan else nama_usulan
        for nik, nama in master_dict.items():
            if first_word not in nama: continue
            
            score = int(string_similarity(nama_usulan, nama) * 100)
            p = parse_nik(nik)
            if p:
                is_same_dob = (tgl == p['dd'] and bln == p['mm'] and thn == p['yy'])
                is_same_wil = (usulan_wilayah == p['wilayah'])
                
                if score >= 80 and not is_same_dob:
                    score -= 30
                    if is_same_wil: score += 15
                elif score >= 60 and is_same_dob:
                    score = min(100, score + (30 if is_same_wil else 15))
                    
            if score > best_score:
                best_score = score
                best_match_nik = nik
            if best_score == 100: break
    
    if best_score >= 60:
        if best_match_nik == actual_nik:
            correct_matches += 1
            out_validation_status.append('BENAR')
        else:
            incorrect_matches += 1
            out_validation_status.append('SALAH ORANG')
        out_predicted_nik.append(best_match_nik)
    else:
        not_found += 1
        out_predicted_nik.append(None)
        out_validation_status.append('TIDAK DITEMUKAN')
        
    if (idx + 1) % 100 == 0:
        print(f"Processed {idx + 1} rows...")

total_tested = correct_matches + incorrect_matches + not_found
acc = (correct_matches / total_tested) * 100 if total_tested > 0 else 0

print(f"\\n--- VALIDATION RESULTS ---")
print(f"Total Evaluated: {total_tested}")
print(f"Correctly Predicted NIK: {correct_matches} ({acc:.2f}%)")
print(f"Incorrectly Predicted NIK: {incorrect_matches}")
print(f"Not Found (No Match): {not_found}")
print(f"Time Taken: {time.time() - start_time:.2f} seconds")

df['Prediksi_NIK_Algoritma'] = out_predicted_nik
df['Status_Validasi_Akurasi'] = out_validation_status
df.to_excel('Hasil_Validasi_Akurasi.xlsx', index=False)
print("File Hasil_Validasi_Akurasi.xlsx berhasil dibuat!")
