import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'knowledge.json');

// Helper to read data
function getKnowledgeBase() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading knowledge.json:", error);
    return [];
  }
}

// Helper to write data
function saveKnowledgeBase(data: any) {
  try {
    // Ensure dir exists
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error("Error writing knowledge.json:", error);
    return false;
  }
}

// GET all knowledge
export async function GET() {
  const data = getKnowledgeBase();
  return NextResponse.json(data);
}

// POST to add new knowledge
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { keywords, reply } = body;

    if (!keywords || !reply) {
      return NextResponse.json({ error: "Keywords and reply are required" }, { status: 400 });
    }

    // Split comma separated keywords and trim
    const keywordArray = typeof keywords === 'string' 
      ? keywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k.length > 0)
      : keywords;

    const data = getKnowledgeBase();
    
    // Generate new ID
    const newId = data.length > 0 ? Math.max(...data.map((item: any) => item.id || 0)) + 1 : 1;
    
    const newItem = {
      id: newId,
      keywords: keywordArray,
      reply
    };

    data.push(newItem);
    
    if (saveKnowledgeBase(data)) {
      return NextResponse.json({ message: "Berhasil ditambahkan", item: newItem }, { status: 201 });
    } else {
      return NextResponse.json({ error: "Gagal menyimpan data" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// DELETE to remove knowledge
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const data = getKnowledgeBase();
    const filteredData = data.filter((item: any) => item.id !== parseInt(id));

    if (filteredData.length === data.length) {
      return NextResponse.json({ error: "ID not found" }, { status: 404 });
    }

    if (saveKnowledgeBase(filteredData)) {
      return NextResponse.json({ message: "Berhasil dihapus" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Gagal menyimpan data" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
