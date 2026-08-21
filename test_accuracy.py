import pandas as pd
import time

import difflib
import re

COMMON_TITLES = {"MUHAMMAD", "MOHAMMAD", "MOH", "M", "SITI", "NUR", "ABDUL", "ACHMAD", "AHMAD", "HJ", "H", "RADEN", "R", "NY", "TN", "ANDI"}

def clean_name(name):
    name = str(name).strip().upper()
    name = re.sub(r'[^A-Z\s]', ' ', name)
    tokens = [t for t in name.split() if t and t not in COMMON_TITLES]
    if not tokens:
        tokens = [t for t in name.split() if t] # fallback
    return " ".join(tokens)

def string_similarity(s1, s2):
    s1_clean = clean_name(s1)
    s2_clean = clean_name(s2)
    if not s1_clean or not s2_clean: return 0.0
    if s1_clean == s2_clean: return 1.0
    
    t1 = set(s1_clean.split())
    t2 = set(s2_clean.split())
    if t1 and t2:
        inter = t1.intersection(t2)
        if len(inter) == min(len(t1), len(t2)):
            return 0.95 

    return difflib.SequenceMatcher(None, s1_clean, s2_clean).ratio()

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
master_wilayah = {}

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
                        
                        kab = p['wilayah'][:4]
                        if kab not in master_wilayah:
                            master_wilayah[kab] = []
                        master_wilayah[kab].append({'nik': nik, 'nama': nama, 'p': p})

print(f"Master Loaded: {len(master_dict)} records.")

print("Loading Validation Data...")
df = pd.read_excel('Missing NIK.xlsx')

correct_matches = 0
incorrect_matches = 0
not_found = 0

out_predicted_nik = []
out_predicted_nama = []
out_validation_status = []
out_keterangan = []

start_time = time.time()

for idx, row in df.iterrows():
    actual_nik = str(row['nik_dtsen_prelist']).strip()
    if '.0' in actual_nik: actual_nik = actual_nik.replace('.0', '')
    
    # Validasi Sesungguhnya: Apakah NIK ini ada di Master?
    has_ground_truth = True
    if len(actual_nik) != 16 or actual_nik not in master_dict:
        has_ground_truth = False
        
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
            out_predicted_nama.append(None)
            out_validation_status.append('SKIP (DOB INVALID)')
            out_keterangan.append('Tanggal/Bulan lahir tidak valid')
            continue
            
    try:
        tgl, bln, thn = int(tgl), int(bln), int(thn)
        thn = thn % 100
    except:
        out_predicted_nik.append(None)
        out_predicted_nama.append(None)
        out_validation_status.append('SKIP (DOB FORMAT ERROR)')
        out_keterangan.append('Format tgl/bln/thn bukan angka')
        continue
        
    gender = str(row['jk_dtsen_value']).strip()
    if gender == 'nan': gender = '1'
    if gender == '2.0': gender = '2'
    if gender == '1.0': gender = '1'

    usulan_kab = str(row['level_6_full_code']).strip()[:4]
    usulan_wilayah = str(row['level_6_full_code']).strip()[:6]

    # JALANKAN ALGORITMA FALLBACK (PURA-PURA NIK HILANG)
    dob_key = f"{tgl:02d}_{bln:02d}_{thn:02d}_{gender}"
    candidates = master_dob.get(dob_key, [])
    
    best_score = -1
    best_match_nik = None
    
    if candidates:
        for m in candidates:
            score = int(string_similarity(nama_usulan, m['nama']) * 100)
            
            # Hanya beri bonus jika nama sudah cukup mirip (minimal 75%)
            if score >= 75:
                score = min(100, score + 10)
                
            if usulan_wilayah == m['wilayah'] and score >= 75:
                score = min(100, score + 5)
                
            if score > best_score:
                best_score = score
                best_match_nik = m['nik']
            if best_score >= 90: break

    # Lapis 2: Jika Lapis 1 gagal
    if best_score < 60:
        c_name = clean_name(nama_usulan)
        first_word = c_name.split(' ')[0] if ' ' in c_name else c_name
        
        kab_candidates = master_wilayah.get(usulan_kab, [])
        
        for c in kab_candidates:
            if first_word not in c['nama']: continue
            
            score = int(string_similarity(nama_usulan, c['nama']) * 100)
            p = c['p']
            
            is_same_dob = (tgl == p['dd'] and bln == p['mm'] and thn == p['yy'])
            is_same_wil = (usulan_wilayah == p['wilayah'])
            
            if score >= 85 and not is_same_dob:
                score -= 15 # Penalti lebih kecil jika nama sangat mirip (>=85%)
            elif score >= 75 and is_same_dob:
                score = min(100, score + 10) # Bonus TTL
                
            if is_same_wil and score >= 75:
                score = min(100, score + 5) # Bonus Wilayah
                    
            if score > best_score:
                best_score = score
                best_match_nik = c['nik']
            if best_score >= 90: break
    
    system_status = 'NO_MATCH'
    keterangan = ''
    
    p_best = parse_nik(best_match_nik) if best_match_nik else None
    is_dob_anomaly = False
    
    if p_best:
        is_dob_anomaly = not (tgl == p_best['dd'] and bln == p_best['mm'] and thn == p_best['yy'])
        
    if best_score >= 90 and not is_dob_anomaly:
        system_status = 'EXACT_MATCH'
    elif best_score >= 70:
        system_status = 'HIGH_PROBABLE_MATCH'
        if is_dob_anomaly:
            keterangan = 'Perbedaan Tanggal Lahir'
    elif best_score >= 50:
        system_status = 'PROBABLE_MATCH'
        
    if system_status != 'NO_MATCH':
        out_predicted_nik.append(best_match_nik)
        out_predicted_nama.append(master_dict.get(best_match_nik, '-'))
        if has_ground_truth:
            if best_match_nik == actual_nik:
                correct_matches += 1
                if not keterangan: keterangan = 'Valid (Sesuai NIK Aktual)'
            else:
                incorrect_matches += 1
                if not keterangan: keterangan = 'Invalid (Dipetakan ke NIK Berbeda)'
        else:
            if not keterangan: keterangan = 'Prediksi Berhasil (Tanpa Ground Truth)'
    else:
        not_found += 1
        out_predicted_nik.append(None)
        out_predicted_nama.append(None)
        keterangan = 'Tidak Ditemukan Kandidat Master'
        
    out_validation_status.append(system_status)
    out_keterangan.append(keterangan)
        
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
df['Prediksi_Nama_Master'] = out_predicted_nama
df['Status_Pemadanan_Sistem'] = out_validation_status
df['Keterangan_Validasi_Kunci'] = out_keterangan
df.to_excel('Hasil_Validasi_Akurasi.xlsx', index=False)
print("File Hasil_Validasi_Akurasi.xlsx berhasil dibuat!")
