import os
import glob
import pandas as pd

base_dir = '/Users/jihanmaisaroh/latsar-pemadanan-dtsen'
new_data_dir = os.path.join(base_dir, 'New 25 Agustus')
dtsen_dir = os.path.join(base_dir, 'DTSEN_V3', '72')

# 1. Load DTSEN data (only need KK number and desil)
print("Loading DTSEN keluarga data...")
dtsen_files = glob.glob(os.path.join(dtsen_dir, 'keluarga_dtsen_v3_*.csv'))
dtsen_list = []

for f in dtsen_files:
    try:
        # File is pipe-separated with quotes. Added encoding and on_bad_lines to handle messy data.
        import csv
        df_dtsen = pd.read_csv(
            f, 
            sep='|', 
            usecols=['nomor_kartu_keluarga', 'desil_nasional', 'desil_provinsi', 'desil_kabupaten_kota'], 
            dtype={'nomor_kartu_keluarga': str},
            encoding='utf-8',
            encoding_errors='replace',
            on_bad_lines='skip'
        )
        dtsen_list.append(df_dtsen)
    except Exception as e:
        print(f"Error reading {f}: {e}")

if dtsen_list:
    dtsen_df = pd.concat(dtsen_list, ignore_index=True)
    # Drop duplicates just in case
    dtsen_df = dtsen_df.drop_duplicates(subset=['nomor_kartu_keluarga'])
else:
    dtsen_df = pd.DataFrame(columns=['nomor_kartu_keluarga', 'desil_nasional', 'desil_provinsi', 'desil_kabupaten_kota'])

print(f"Loaded {len(dtsen_df)} unique families from DTSEN.")

# 2. Process the New 25 Agustus files
print("Processing New 25 Agustus files...")
new_files = glob.glob(os.path.join(new_data_dir, 'sqllab_kk_tidak_ditemukan_dan_tidak_ada_padanannya_di_mana_pun_page *.csv'))

output_dir = os.path.join(new_data_dir, 'Hasil_Pemadanan_Desil')
os.makedirs(output_dir, exist_ok=True)

all_matched_list = []

for f in new_files:
    try:
        df_new = pd.read_csv(f, dtype={'no_kk': str, 'nik_kk': str})
    except Exception as e:
        print(f"Error reading {f}: {e}")
        continue
    
    # Merge
    merged = pd.merge(df_new, dtsen_df, how='left', left_on='no_kk', right_on='nomor_kartu_keluarga')
    merged.drop(columns=['nomor_kartu_keluarga'], inplace=True)
    
    # Save the full result (optional, but good to have)
    out_name = os.path.basename(f)
    merged.to_csv(os.path.join(output_dir, out_name), index=False)
    
    # Keep track of matched records
    matched = merged[merged['desil_nasional'].notna()]
    all_matched_list.append(matched)

print("Finished matching all files.")

if all_matched_list:
    all_matched_df = pd.concat(all_matched_list, ignore_index=True)
    
    # Filter desil 1-5
    # Desil can be string or int, so let's convert to numeric for filtering
    all_matched_df['desil_nasional_num'] = pd.to_numeric(all_matched_df['desil_nasional'], errors='coerce')
    
    desil_1_5 = all_matched_df[(all_matched_df['desil_nasional_num'] >= 1) & (all_matched_df['desil_nasional_num'] <= 5)]
    
    desil_1_5 = desil_1_5.drop(columns=['desil_nasional_num'])
    
    # Export to Excel
    out_excel = os.path.join(output_dir, 'Keluarga_Desil_1_sampai_5_Belum_Terdata.xlsx')
    desil_1_5.to_excel(out_excel, index=False)
    print(f"Saved desil 1-5 results to {out_excel} ({len(desil_1_5)} rows found)")
else:
    print("No matches found.")
