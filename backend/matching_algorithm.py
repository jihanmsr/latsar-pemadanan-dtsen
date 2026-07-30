import difflib
import json
import logging

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')

def string_similarity(s1, s2):
    """
    Calculate the similarity ratio between two strings using difflib.
    Returns a float between 0.0 and 1.0.
    """
    if not s1 or not s2:
        return 0.0
    s1 = str(s1).strip().upper()
    s2 = str(s2).strip().upper()
    return difflib.SequenceMatcher(None, s1, s2).ratio()

def match_data(sasaran_data, master_dtsen):
    """
    Memadankan satu data sasaran dengan list data master DTSEN.
    """
    best_match = None
    highest_score = 0
    match_type = "NO_MATCH"
    
    for master in master_dtsen:
        # 1. Deterministic Match (Exact Match NIK)
        if sasaran_data.get('nik') and master.get('nik') and sasaran_data['nik'] == master['nik']:
            return {
                'status': 'EXACT_MATCH',
                'score': 100.0,
                'master_data': master,
                'details': 'NIK cocok 100%'
            }
        
        # 2. Probabilistic Match (Fuzzy Match)
        # Pembobotan: Nama (50%), Tanggal Lahir (30%), Alamat (20%)
        
        name_sim = string_similarity(sasaran_data.get('nama'), master.get('nama'))
        dob_sim = 1.0 if str(sasaran_data.get('tgl_lahir')) == str(master.get('tgl_lahir')) else 0.0
        
        # Jika beda penulisan format tanggal lahir, bisa lebih advance (misal toleransi typo), 
        # tapi di sini kita simplifikasi pakai exact untuk dob atau partial string similarity
        if dob_sim == 0.0:
            dob_sim = string_similarity(str(sasaran_data.get('tgl_lahir')), str(master.get('tgl_lahir')))

        addr_sim = string_similarity(sasaran_data.get('alamat'), master.get('alamat'))
        
        # Hitung skor total (maksimal 100)
        total_score = (name_sim * 50) + (dob_sim * 30) + (addr_sim * 20)
        
        # Penalty jika beda jenis kelamin (Gender)
        if str(sasaran_data.get('jenis_kelamin')).upper() != str(master.get('jenis_kelamin')).upper():
            total_score -= 10  # Kurangi 10 poin jika gender beda (karena cukup fatal)
        
        # Batasi skor antara 0 - 100
        total_score = max(0.0, min(100.0, total_score))
        
        if total_score > highest_score:
            highest_score = total_score
            best_match = master
            
    # Tentukan Threshold untuk "Probable Match" (misal: 80%)
    if highest_score >= 80.0:
        match_type = 'PROBABLE_MATCH'
    elif highest_score >= 50.0:
        match_type = 'WEAK_MATCH'
    else:
        match_type = 'NO_MATCH'
        best_match = None

    return {
        'status': match_type,
        'score': round(highest_score, 2),
        'master_data': best_match,
        'details': f"Fuzzy Score: {highest_score:.2f}%"
    }

if __name__ == "__main__":
    # DUMMY DATABASE DTSEN (MASTER)
    db_dtsen = [
        {"nik": "3171234567890001", "nama": "MUHAMMAD YUSUF", "tgl_lahir": "1990-05-12", "jenis_kelamin": "L", "alamat": "JL JEND SUDIRMAN NO 12, JAKARTA SELATAN", "desil": 2},
        {"nik": "3201123456780002", "nama": "SITI AMINAH", "tgl_lahir": "1985-08-20", "jenis_kelamin": "P", "alamat": "KAMPUNG MANGGIS RT 01 RW 02, BOGOR", "desil": 1},
        {"nik": "3374123456780003", "nama": "BUDI SANTOSO", "tgl_lahir": "1978-12-01", "jenis_kelamin": "L", "alamat": "JL VETERAN NO 45, SEMARANG", "desil": 4},
    ]

    # KASUS UJI DARI INSTANSI PEMDA
    test_cases = [
        {
            # Kasus 1: NIK Cocok 100%
            "desc": "KASUS 1: NIK Valid 100%",
            "data": {"nik": "3171234567890001", "nama": "MUH YUSUF", "tgl_lahir": "1990-05-12", "jenis_kelamin": "L", "alamat": "JAKARTA SELATAN"}
        },
        {
            # Kasus 2: NIK Kosong/Salah, tapi Nama & Tanggal Lahir sangat mirip
            "desc": "KASUS 2: NIK Salah (Typo), Nama & Tgl Lahir mirip",
            "data": {"nik": "3171234567899999", "nama": "MUH. YUSUP", "tgl_lahir": "1990-05-12", "jenis_kelamin": "L", "alamat": "JALAN SUDIRMAN NO.12 JAKSEL"}
        },
        {
            # Kasus 3: NIK Salah, Nama agak mirip, Tanggal beda (Kasus Weak Match)
            "desc": "KASUS 3: Weak Match (Tgl beda, Nama typo berat)",
            "data": {"nik": "12345", "nama": "S. AMIN", "tgl_lahir": "1985-07-20", "jenis_kelamin": "P", "alamat": "BOGOR"}
        },
        {
            # Kasus 4: Data Sama Sekali Baru (Tidak ada di DTSEN)
            "desc": "KASUS 4: Data Tidak Ditemukan (No Match)",
            "data": {"nik": "9999999999999999", "nama": "JOKO WIDODO", "tgl_lahir": "1961-06-21", "jenis_kelamin": "L", "alamat": "SOLO"}
        }
    ]

    print("="*60)
    print("DEMO PROBABILISTIC MATCHING PAKEWA x DTSEN")
    print("="*60)

    for test in test_cases:
        print(f"\n[{test['desc']}]")
        print(f"Data Sasaran : {test['data']['nik']} | {test['data']['nama']}")
        
        result = match_data(test['data'], db_dtsen)
        
        print(f"Hasil Match  : {result['status']} (Skor: {result['score']}%)")
        if result['master_data']:
            print(f"Matched with : {result['master_data']['nik']} | {result['master_data']['nama']}")
        else:
            print("Matched with : None")
        print("-" * 60)
