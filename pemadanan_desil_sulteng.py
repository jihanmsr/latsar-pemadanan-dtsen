import pandas as pd
import os
import glob

def get_perubahan_flag(diff):
    if pd.isna(diff):
        return 'Data Tidak Lengkap'
    elif diff <= -7:
        return 'Turun Ekstrem'
    elif diff <= -4:
        return 'Turun Signifikan'
    elif diff < 0:
        return 'Turun'
    elif diff == 0:
        return 'Tetap'
    elif diff <= 3:
        return 'Naik'
    elif diff <= 6:
        return 'Naik Signifikan'
    else:
        return 'Naik Ekstrem'

def main():
    v2_base_path = '/Users/jihanmaisaroh/latsar-pemadanan-dtsen/DTSEN_V2'
    v3_base_path = '/Users/jihanmaisaroh/latsar-pemadanan-dtsen/DTSEN_V3/72'
    
    print("Membaca data V2...")
    v2_files = glob.glob(os.path.join(v2_base_path, '**', 'keluarga_dtsen_v2_2026_*.xlsx'), recursive=True)
    v2_list = []
    for f in v2_files:
        try:
            df = pd.read_excel(f, usecols=['nomor_kartu_keluarga', 'desil_nasional', 'kode_kabupaten_kota', 'kabupaten_kota', 'kecamatan', 'kelurahan_desa'])
            v2_list.append(df)
        except Exception as e:
            print(f"Error reading {f}: {e}")
    
    if not v2_list:
        print("Tidak ada data V2 yang berhasil dimuat.")
        return
        
    df_v2 = pd.concat(v2_list, ignore_index=True)
    df_v2.rename(columns={
        'desil_nasional': 'desil_nas_v2',
        'kode_kabupaten_kota': 'idkab',
        'kabupaten_kota': 'nama_wilayah',
        'kelurahan_desa': 'desa_kelurahan'
    }, inplace=True)
    
    print(f"Total baris V2 dimuat: {len(df_v2)}")

    print("Membaca data V3...")
    v3_files = glob.glob(os.path.join(v3_base_path, 'keluarga_dtsen_v3_2026_*.csv'))
    v3_list = []
    for f in v3_files:
        try:
            # Menggunakan encoding latin1 dan on_bad_lines='skip' untuk menangani file CSV yang tidak standar (EOF inside string/encoding error)
            df = pd.read_csv(f, sep='|', usecols=['nomor_kartu_keluarga', 'nama_kepala_keluarga', 'desil_nasional', 'is_gc_kemensos', 'is_pbi_se', 'is_siks_ng'], encoding='latin1', on_bad_lines='skip', engine='python')
            v3_list.append(df)
        except Exception as e:
            print(f"Error reading {f}: {e}")
            
    if not v3_list:
        print("Tidak ada data V3 yang berhasil dimuat.")
        return
        
    df_v3 = pd.concat(v3_list, ignore_index=True)
    df_v3.rename(columns={
        'desil_nasional': 'desil_nas_v3',
        'nama_kepala_keluarga': 'nama_kk',
        'nomor_kartu_keluarga': 'nokk'
    }, inplace=True)
    
    # Simple logic for sumber based on available flags
    def determine_sumber(row):
        if pd.notna(row.get('is_gc_kemensos')) and row.get('is_gc_kemensos') == 1:
            return 'gc_kemensos'
        if pd.notna(row.get('is_pbi_se')) and row.get('is_pbi_se') == 1:
            return 'gc_pbi'
        if pd.notna(row.get('is_siks_ng')) and row.get('is_siks_ng') == 1:
            return 'siks_ng'
        return 'sumber_lain'
        
    df_v3['sumber'] = df_v3.apply(determine_sumber, axis=1)
    
    df_v2.rename(columns={'nomor_kartu_keluarga': 'nokk'}, inplace=True)
    print(f"Total baris V3 dimuat: {len(df_v3)}")

    print("Menggabungkan data...")
    # Using inner join to only compare families present in both
    merged = pd.merge(df_v3, df_v2, on='nokk', how='inner')
    
    print(f"Total baris setelah merge (inner join): {len(merged)}")
    
    merged['diff'] = merged['desil_nas_v3'] - merged['desil_nas_v2']
    merged['flag_perubahan_nas'] = merged['diff'].apply(get_perubahan_flag)
    
    # Menghapus duplikat nokk jika ada
    merged = merged.drop_duplicates(subset=['nokk'])
    
    # Menghapus data yang tidak lengkap (desil kosong di V2 atau V3)
    merged = merged[merged['flag_perubahan_nas'] != 'Data Tidak Lengkap']
    
    output_cols = ['nokk', 'nama_kk', 'desil_nas_v3', 'desil_nas_v2', 'flag_perubahan_nas', 'idkab', 'nama_wilayah', 'kecamatan', 'desa_kelurahan', 'sumber']
    
    final_cols = [col for col in output_cols if col in merged.columns]
    final_df = merged[final_cols]
    
    output_file = '/Users/jihanmaisaroh/latsar-pemadanan-dtsen/Hasil_Cek_Desil_Sulteng.csv'
    print(f"Menyimpan ke {output_file}...")
    final_df.to_csv(output_file, index=False, sep='|')
    print("Selesai! File berhasil dibuat.")

if __name__ == "__main__":
    main()
