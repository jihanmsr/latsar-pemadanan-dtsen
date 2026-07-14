import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { FileItem } from '@/context/MatchingContext';

export interface ManifestMetadata {
  nomorSurat: string;
  tanggalSurat: string;
  perihalSurat: string;
  namaInstansi: string;
}

export async function generateManifest(fileItems: FileItem[], metadata: ManifestMetadata) {
  if (fileItems.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Manifes_Global');

  // Styling presets
  const titleStyle: Partial<ExcelJS.Style> = {
    font: { bold: true, size: 14, color: { argb: 'FF000000' } },
    alignment: { vertical: 'middle', horizontal: 'center' }
  };
  
  const headerStyle: Partial<ExcelJS.Style> = {
    font: { bold: true, color: { argb: 'FF000000' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE9ECEF' } },
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    },
    alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }
  };
  
  const cellStyle: Partial<ExcelJS.Style> = {
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    },
    alignment: { vertical: 'middle', wrapText: true }
  };

  // 1. Header (Merged)
  worksheet.mergeCells('A1:G1');
  const headerCell = worksheet.getCell('A1');
  headerCell.value = `FORM MANIFES PEMADANAN DATA ${metadata.namaInstansi.toUpperCase() || '[NAMA INSTANSI]'}`;
  headerCell.style = titleStyle;
  worksheet.getRow(1).height = 35;

  // 2. Spesifikasi Block
  let currRow = 3;
  const specTitleCell = worksheet.getCell(`A${currRow}`);
  specTitleCell.value = 'SPESIFIKASI';
  specTitleCell.font = { bold: true, size: 12 };
  currRow++;

  const specData = [
    ["Nama Kegiatan", "... [lengkapi]"],
    ["Waktu Penerimaan", new Date().toLocaleString('id-ID')],
    ["Surat Permintaan:"],
    [" - Dari", "... [lengkapi]"],
    [" - Nomor", metadata.nomorSurat || ""],
    [" - Tanggal", metadata.tanggalSurat || ""],
    [" - Perihal", metadata.perihalSurat || ""],
    ["Jumlah Set Data", fileItems.length.toString()],
    ["Nama Set Data", fileItems.map(f => f.name).join(', ')],
    ["Pengiriman Data Balikan", "Melalui Portal Pemadanan"],
    ["Tautan Pengiriman", "... [otomatis via portal]"],
    ["Tautan Metadata", "... [lengkapi]"],
    ["Tautan MoU", "... [lengkapi]"]
  ];

  specData.forEach(item => {
    worksheet.getCell(`A${currRow}`).value = item[0];
    worksheet.getCell(`A${currRow}`).font = { bold: true };
    if (item[1]) {
      worksheet.getCell(`B${currRow}`).value = item[1];
    }
    currRow++;
  });
  currRow++;

  // 3. INFORMASI DATA Table
  const infoTitleCell = worksheet.getCell(`A${currRow}`);
  infoTitleCell.value = 'INFORMASI DATA';
  infoTitleCell.font = { bold: true, size: 12 };
  currRow++;

  const infoHeaders = ["No.", "Nama Set Data/File", "Jumlah Record", "Jumlah Variabel", "Periode Referensi Data", "Format Data"];
  infoHeaders.forEach((h, i) => {
    const cell = worksheet.getCell(currRow, i + 1);
    cell.value = h;
    cell.style = headerStyle;
  });
  currRow++;

  fileItems.forEach((item, index) => {
    const rowData = [
      index + 1,
      item.name,
      item.totalRows,
      item.previewHeaders?.length || 0,
      "",
      item.name.split('.').pop()?.toUpperCase() || "CSV"
    ];
    rowData.forEach((val, i) => {
      const cell = worksheet.getCell(currRow, i + 1);
      cell.value = val;
      cell.style = cellStyle;
    });
    currRow++;
  });
  currRow += 2;

  // 4. HASIL IDENTIFIKASI VARIABEL
  const varTitleCell = worksheet.getCell(`A${currRow}`);
  varTitleCell.value = 'HASIL IDENTIFIKASI VARIABEL';
  varTitleCell.font = { bold: true, size: 12 };
  currRow++;

  fileItems.forEach((item, index) => {
    if (!item.previewHeaders || !item.previewRows) return;

    worksheet.getCell(`A${currRow}`).value = `IDENTIFIKASI FILE ${index + 1}: ${item.name}`;
    worksheet.getCell(`A${currRow}`).font = { bold: true };
    currRow++;

    const varHeaders = ["No.", "Nama Variabel", "Label Variabel", "Datatype", "Kategori Variabel", "Kesesuaian dengan DTSEN", "Keterangan/ Potensi Variabel"];
    varHeaders.forEach((h, i) => {
      const cell = worksheet.getCell(currRow, i + 1);
      cell.value = h;
      cell.style = headerStyle;
    });
    currRow++;

    item.previewHeaders.forEach((header, hIdx) => {
      let isNumber = true;
      let sampleValue = "";
      for (const row of item.previewRows!) {
        const val = row[hIdx]?.toString() || "";
        if (!sampleValue && val) sampleValue = val;
        if (val && isNaN(Number(val.replace(',', '.')))) isNumber = false;
      }
      const dataType = (isNumber && sampleValue) ? "INT / NUMERIC" : "VARCHAR";
      const hLower = header?.toLowerCase() || "";
      const isDtsen = hLower === 'nik' || hLower === 'nama';
      
      const rowData = [
        hIdx + 1,
        header || `Kolom_${hIdx + 1}`,
        header || `Kolom_${hIdx + 1}`,
        dataType,
        "Variabel Utama",
        isDtsen ? "Sesuai" : "",
        ""
      ];
      rowData.forEach((val, i) => {
        const cell = worksheet.getCell(currRow, i + 1);
        cell.value = val;
        cell.style = cellStyle;
      });
      currRow++;
    });
    currRow += 2;
  });

  // Set column widths
  worksheet.getColumn(1).width = 8;
  worksheet.getColumn(2).width = 40;
  worksheet.getColumn(3).width = 20;
  worksheet.getColumn(4).width = 20;
  worksheet.getColumn(5).width = 25;
  worksheet.getColumn(6).width = 25;
  worksheet.getColumn(7).width = 30;

  // Export
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `Manifes_Global_${metadata.namaInstansi.replace(/\s+/g, '_') || 'BPS'}.xlsx`);
}



