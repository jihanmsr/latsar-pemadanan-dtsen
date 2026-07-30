from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import difflib

app = FastAPI(title="PAKEWA Matching API", version="1.0")

class TargetData(BaseModel):
    nik: Optional[str] = None
    nama: str
    tgl_lahir: str
    jenis_kelamin: str
    alamat: Optional[str] = ""

class MasterData(BaseModel):
    nik: str
    nama: str
    tgl_lahir: str
    jenis_kelamin: str
    alamat: str

class MatchRequest(BaseModel):
    sasaran: TargetData
    master_dataset: List[MasterData]

def string_similarity(s1, s2):
    if not s1 or not s2:
        return 0.0
    return difflib.SequenceMatcher(None, str(s1).strip().upper(), str(s2).strip().upper()).ratio()

@app.post("/api/match")
async def match_endpoint(request: MatchRequest):
    sasaran = request.sasaran
    best_match = None
    highest_score = 0.0
    
    for master in request.master_dataset:
        # Deterministic Match
        if sasaran.nik and master.nik and sasaran.nik == master.nik:
            return {
                "status": "EXACT_MATCH",
                "score": 100.0,
                "matched_data": master
            }
            
        # Probabilistic Match
        name_sim = string_similarity(sasaran.nama, master.nama)
        dob_sim = 1.0 if sasaran.tgl_lahir == master.tgl_lahir else string_similarity(sasaran.tgl_lahir, master.tgl_lahir)
        addr_sim = string_similarity(sasaran.alamat, master.alamat)
        
        total_score = (name_sim * 50) + (dob_sim * 30) + (addr_sim * 20)
        
        if sasaran.jenis_kelamin != master.jenis_kelamin:
            total_score -= 10
            
        total_score = max(0.0, min(100.0, total_score))
        
        if total_score > highest_score:
            highest_score = total_score
            best_match = master

    if highest_score >= 80.0:
        status = "PROBABLE_MATCH"
    elif highest_score >= 50.0:
        status = "WEAK_MATCH"
    else:
        status = "NO_MATCH"
        best_match = None

    return {
        "status": status,
        "score": round(highest_score, 2),
        "matched_data": best_match
    }
