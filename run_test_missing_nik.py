import pandas as pd
import time
import difflib

def string_similarity(s1, s2):
    if not s1 or not s2: return 0.0
    return difflib.SequenceMatcher(None, s1, s2).ratio()

def parse_nik(nik):
    if not isinstance(nik, str) or len(nik) != 16:
        return None
    try:
        wilayah = nik[0:6]
        dd = int(nik[6:8])
        mm = int(nik[8:10])
        yy = int(nik[10:12])
        gender = 'Laki-Laki'
        if dd > 40:
            gender = 'Perempuan'
            dd -= 40
        return {'wilayah': wilayah, 'dd': dd, 'mm': mm, 'yy': yy, 'gender': gender}
    except:
        return None

print("Loading Master Data...")
master_dict = {}
master_wilayah = {}
master_dob = {}

with open('72/72/anggota_keluarga_dtsen_v3_2026_72.01.csv', 'r') as f:
    for line in f:
        if not line.strip(): continue
        parts = [p.replace('"', '') for p in line.split('|')]
        if len(parts) >= 3:
            # Di file, NIK yang sebenarnya ada di index 0
            nik = parts[0].strip() 
            nama = parts[2].strip().upper()
            master_dict[nik] = nama
            
            parsed = parse_nik(nik)
            if parsed:
                wil = parsed['wilayah']
                dob_key = f"{parsed['dd']}-{parsed['mm']}-{parsed['yy']}-{parsed['gender']}"
                
                if wil not in master_wilayah:
                    master_wilayah[wil] = []
                master_wilayah[wil].append({'nik': nik, 'nama': nama})
                
                if dob_key not in master_dob:
                    master_dob[dob_key] = []
                master_dob[dob_key].append({'nik': nik, 'nama': nama})

print(f"Master Loaded: {len(master_dict)} records.")

print("Loading Missing NIK Data...")
missing_df = pd.read_excel('Missing NIK.xlsx')

padan = 0
anomali = 0
tidak_padan = 0

start_time = time.time()

print(f"Matching {len(missing_df)} rows...")
out_status = []
out_score = []
out_nik = []
out_nama = []

for idx, row in missing_df.iterrows():
    nik_usulan = str(row.get('nik_dtsen_prelist', '')).strip()
    if nik_usulan == 'nan' or len(nik_usulan) < 16:
        nik_usulan = str(row.get('nik_dtsen', '')).strip()
        
    nama_usulan = str(row.get('nama_dtsen', '')).strip().upper()
    
    if len(nik_usulan) == 16 and nik_usulan in master_dict:
        score = int(string_similarity(nama_usulan, master_dict[nik_usulan]) * 100)
        status = 'PADAN' if score >= 80 else ('ANOMALI' if score >= 60 else 'TIDAK_PADAN')
        if status == 'PADAN': padan += 1
        elif status == 'ANOMALI': anomali += 1
        else: tidak_padan += 1
        out_status.append(status)
        out_score.append(score)
        out_nik.append(nik_usulan)
        out_nama.append(master_dict[nik_usulan])
        continue
        
    parsed = parse_nik(nik_usulan)
    best_score = -1
    best_match = None
    
    if parsed:
        candidates = []
        wil = parsed['wilayah']
        dob_key = f"{parsed['dd']}-{parsed['mm']}-{parsed['yy']}-{parsed['gender']}"
        
        if wil in master_wilayah:
            candidates.extend(master_wilayah[wil])
        if dob_key in master_dob:
            candidates.extend(master_dob[dob_key])
            
        seen = set()
        unique_cands = []
        for c in candidates:
            if c['nik'] not in seen:
                seen.add(c['nik'])
                unique_cands.append(c)
                
        for m in unique_cands:
            score = int(string_similarity(nama_usulan, m['nama']) * 100)
            
            p_m = parse_nik(m['nik'])
            if p_m:
                is_dob = p_m['dd'] == parsed['dd'] and p_m['mm'] == parsed['mm'] and p_m['yy'] == parsed['yy'] and p_m['gender'] == parsed['gender']
                is_wil = p_m['wilayah'] == wil
                
                if is_dob and score >= 50:
                    score = min(100, score + 15)
                elif is_wil and score >= 60:
                    score = min(100, score + 5)
                    
            if score > best_score:
                best_score = score
                best_match = m
    else:
        # Fallback Name Matching if NIK is invalid
        first_word = nama_usulan.split(' ')[0] if ' ' in nama_usulan else nama_usulan
        count = 0
        for nik, nama in master_dict.items():
            if first_word not in nama:
                continue
                
            score = int(string_similarity(nama_usulan, nama) * 100)
            if score > best_score:
                best_score = score
                best_match = {'nik': nik, 'nama': nama}
            if best_score == 100: break
            count += 1
            if count >= 25000: break # Batas aman seperti di route.ts
                
    if best_score >= 80:
        padan += 1
        out_status.append('PADAN')
    elif best_score >= 60:
        anomali += 1
        out_status.append('ANOMALI')
    else:
        tidak_padan += 1
        out_status.append('TIDAK_PADAN')
        
    out_score.append(best_score if best_score != -1 else 0)
    out_nik.append(best_match['nik'] if best_match else None)
    out_nama.append(best_match['nama'] if best_match else None)

    if (idx + 1) % 500 == 0:
        print(f"Processed {idx + 1} rows...", flush=True)

missing_df['New_Match_Status'] = out_status
missing_df['New_Match_Score'] = out_score
missing_df['New_Matched_NIK'] = out_nik
missing_df['New_Matched_Nama'] = out_nama

print(f"Finished matching in {time.time() - start_time:.2f} seconds.", flush=True)
print(f"PADAN: {padan}, ANOMALI: {anomali}, TIDAK PADAN: {tidak_padan}", flush=True)

# Simpan ke Excel
print("Menyimpan hasil ke Hasil_Pemadanan_Baru.xlsx...", flush=True)
missing_df.to_excel("Hasil_Pemadanan_Baru.xlsx", index=False)
print("Selesai! File Hasil_Pemadanan_Baru.xlsx telah berhasil dibuat.", flush=True)

