import { useState, useMemo } from "react";

// Libur SKB 3 Menteri No.1497/2/5 Tahun 2025 — Libur Nasional & Cuti Bersama 2026
const HOLIDAYS = new Set([
  "2026-05-01","2026-05-14","2026-05-15","2026-05-27","2026-05-28","2026-05-31",
  "2026-06-01","2026-06-16","2026-08-17","2026-08-25","2026-12-24","2026-12-25",
]);
function isWD(d) {
  return d.getDay()!==0 && d.getDay()!==6 && !HOLIDAYS.has(d.toISOString().slice(0,10));
}
function buildWDs(n) {
  const arr=[], d=new Date("2026-05-08");
  while(arr.length<n){ if(isWD(d)) arr.push(new Date(d)); d.setDate(d.getDate()+1); }
  return arr;
}
const ALL_WDS = buildWDs(154);
const fmtL = d => d.toLocaleDateString("id-ID",{day:"2-digit",month:"long",year:"numeric"});
const fmtS = d => d.toLocaleDateString("id-ID",{day:"2-digit",month:"short"});

// Grand total: 154 HK (8 Mei – 21 Desember 2026, libur SKB resmi) — struktur Timeline Tim Teknis
// Persiapan 3 · Perbatasan 11 · Banten Lama 53 · KP3B 52 · Pembahasan 35 — total 48 kegiatan

const TASKS = [
  { id:1, phase:"Persiapan", ksp:"Semua", days:2, tags:[],
    label:"Penyusunan Metodologi Kerja",
    pj:"TA PWK KSP, TA PWK FPR, Asisten PWK",
    output:"Outline metodologi & rencana kerja tim",
    note:"Pendalaman lingkup KAK; penyusunan kerangka pendekatan & metodologi pekerjaan; rencana kerja lengkap tim untuk 3 KSP; pembagian tugas" },
  { id:2, phase:"Persiapan", ksp:"Semua", days:1, tags:["koordinasi"],
    label:"Koordinasi, Konsultasi, dan Asistensi",
    pj:"TA PWK KSP, TA PWK FPR",
    output:"Notulensi koordinasi awal dengan Tim Teknis Dinas PUPR",
    note:"Koordinasi awal dengan Tim Teknis Dinas PUPR; penyamaan persepsi lingkup & metodologi pekerjaan" },
  { id:3, phase:"KSP Perbatasan", ksp:"Perbatasan", days:2, tags:["perb"],
    label:"Kompilasi dan Harmonisasi Dokumen",
    pj:"TA PWK KSP, TA PWK FPR, Asisten PWK",
    output:"Draft dokumen KSP Perbatasan terintegrasi",
    note:"Menggabungkan kajian eksisting per-WKP menjadi 1 dokumen KSP Perbatasan; harmonisasi narasi, data, dan substansi" },
  { id:4, phase:"KSP Perbatasan", ksp:"Perbatasan", days:2, tags:["perb"],
    label:"Update Isu dan Nilai Strategis",
    pj:"TA PWK KSP, TA PWK FPR",
    output:"Matriks isu & nilai strategis terintegrasi",
    note:"Review & update analisis isu strategis dan nilai strategis kawasan pasca integrasi WKP" },
  { id:5, phase:"KSP Perbatasan", ksp:"Perbatasan", days:1, tags:["perb","gis"],
    label:"Update Peta Delineasi KSP Perbatasan",
    pj:"TA PWK KSP, TA GIS FPR",
    output:"Peta delineasi KSP Perbatasan (GIS)",
    note:"Penyatuan peta per-WKP; update delineasi kawasan perbatasan; verifikasi terhadap RTRW Prov. Banten" },
  { id:6, phase:"KSP Perbatasan", ksp:"Perbatasan", days:2, tags:["perb","doktek"],
    label:"Penyusunan Dokumen Teknis KSP Perbatasan",
    pj:"TA PWK KSP, TA PWK FPR, Asisten PWK",
    output:"Dokumen Teknis KSP Perbatasan",
    note:"Pendahuluan; tinjauan kebijakan; gambaran umum wilayah; arahan pengembangan kawasan; rencana aksi" },
  { id:7, phase:"KSP Perbatasan", ksp:"Perbatasan", days:1, tags:["perb"],
    label:"Update Ranpergub KSP Perbatasan",
    pj:"TA PWK KSP, TA PWK FPR",
    output:"Ranpergub KSP Perbatasan (batang tubuh + lampiran)",
    note:"Update batang tubuh dan lampiran rencana aksi Ranpergub KSP Perbatasan" },
  { id:8, phase:"KSP Perbatasan", ksp:"Perbatasan", days:1, tags:["perb","lapbul"],
    label:"Penyusunan Laporan Bulanan (bulan ke-1)",
    pj:"TA PWK KSP",
    output:"📅 Laporan Bulanan 1 — HK ke-22 (15 Jun)",
    note:"Penyusunan laporan progres bulan ke-1; diserahkan HK ke-22" },
  { id:9, phase:"KSP Perbatasan", ksp:"Perbatasan", days:1, tags:["perb","koordinasi"],
    label:"Koordinasi, Konsultasi, dan Asistensi",
    pj:"TA PWK KSP, TA PWK FPR",
    output:"Notulensi pembahasan + dokumentasi (Koordinasi TT Mei)",
    note:"Laporan progres pekerjaan bulan ke-1; notulensi pembahasan; dokumentasi kegiatan; koordinasi Tim Teknis Mei" },
  { id:10, phase:"KSP Perbatasan", ksp:"Perbatasan", days:1, tags:["perb","hukum"],
    label:"Konsultasi Biro Hukum KSP Perbatasan (awal)",
    pj:"TA PWK KSP, TA Hukum",
    output:"Notulensi konsultasi awal Biro Hukum Perbatasan",
    note:"Konsultasi awal Biro Hukum untuk KSP Perbatasan terkait legal drafting batang tubuh Ranpergub" },
  { id:11, phase:"KSP Banten Lama", ksp:"Banten Lama", days:4, tags:["bl","survei"],
    label:"Survei Lapangan",
    pj:"TA PWK KSP, TA GIS FPR, TA GIS KSP, Asisten PWK",
    output:"Data primer lapangan KSP Banten Lama",
    note:"Survei kondisi fisik kawasan heritage Banten Lama; dokumentasi lapangan; observasi potensi & permasalahan" },
  { id:12, phase:"KSP Banten Lama", ksp:"Banten Lama", days:3, tags:["bl"],
    label:"Pengumpulan Data Sekunder",
    pj:"TA PWK FPR, Asisten PWK",
    output:"Kompilasi data sekunder KSP Banten Lama",
    note:"Data dari BPS, Dispar, Disbud, Bappeda, OPD Kab/Kota terkait kawasan Banten Lama" },
  { id:13, phase:"KSP Banten Lama", ksp:"Banten Lama", days:3, tags:["bl"],
    label:"Inventarisasi dan Tabulasi Permasalahan dan Potensi",
    pj:"TA PWK KSP, TA PWK FPR, Asisten PWK",
    output:"Matriks inventarisasi & tabulasi",
    note:"Identifikasi, klasifikasi, tabulasi permasalahan dan potensi kawasan berdasarkan data primer & sekunder" },
  { id:14, phase:"KSP Banten Lama", ksp:"Banten Lama", days:3, tags:["bl","koordinasi"],
    label:"Kajian Kebijakan Penataan Ruang dan Pembangunan · Koordinasi Tim Teknis Juni",
    pj:"TA PWK KSP, TA PWK FPR, TA Hukum",
    output:"Dokumen kajian kebijakan + Notulensi Tim Teknis Juni",
    note:"Telaah RTRW Prov. Banten, RTRW Kab/Kota, KLHS, kebijakan pembangunan; koordinasi Tim Teknis Juni" },
  { id:15, phase:"KSP Banten Lama", ksp:"Banten Lama", days:4, tags:["bl"],
    label:"Analisis Penguatan Nilai dan Isu Strategis",
    pj:"TA PWK KSP, TA PWK FPR",
    output:"Laporan analisis penguatan nilai & isu strategis",
    note:"Analisis potensi heritage, pariwisata, sosial-budaya; penguatan nilai strategis; identifikasi isu kritis" },
  { id:16, phase:"KSP Banten Lama", ksp:"Banten Lama", days:3, tags:["bl","gis"],
    label:"Analisis Delineasi Kawasan",
    pj:"TA PWK KSP, TA GIS FPR, TA GIS KSP",
    output:"Delineasi kawasan final KSP Banten Lama",
    note:"Verifikasi & penetapan delineasi kawasan; kesesuaian RTRW; analisis peruntukan ruang eksisting vs rencana" },
  { id:17, phase:"KSP Banten Lama", ksp:"Banten Lama", days:5, tags:["bl","gis"],
    label:"Pengolahan Data dan Analisis Spasial KSP Banten Lama",
    pj:"TA GIS FPR, TA GIS KSP, Asisten PWK",
    output:"Peta tematik KSP Banten Lama",
    note:"Digitasi, overlay, analisis spasial data primer & sekunder; penyusunan peta tematik kawasan Banten Lama" },
  { id:18, phase:"KSP Banten Lama", ksp:"Banten Lama", days:5, tags:["bl"],
    label:"Analisis Konsep Pengembangan",
    pj:"TA PWK KSP, TA PWK FPR",
    output:"Konsep pengembangan kawasan KSP Banten Lama",
    note:"Arahan pengembangan sektor unggulan, struktur ruang kawasan, kelembagaan; konsep berbasis nilai strategis" },
  { id:19, phase:"KSP Banten Lama", ksp:"Banten Lama", days:3, tags:["bl"],
    label:"Analisis Regional",
    pj:"TA PWK KSP, TA PWK FPR",
    output:"Laporan analisis regional",
    note:"Analisis keterkaitan kawasan Banten Lama dengan wilayah sekitar yang terpengaruh; dampak regional" },
  { id:20, phase:"KSP Banten Lama", ksp:"Banten Lama", days:3, tags:["bl"],
    label:"Analisis Pembiayaan Pembangunan",
    pj:"TA PWK FPR, Asisten PWK",
    output:"Matrik pembiayaan pembangunan",
    note:"Estimasi kebutuhan pembiayaan; identifikasi sumber (APBN, APBD, swasta); skema pendanaan" },
  { id:21, phase:"KSP Banten Lama", ksp:"Banten Lama", days:10, tags:["bl","doktek"],
    label:"Penyusunan Dokumen Teknis KSP Banten Lama",
    pj:"TA PWK KSP, TA PWK FPR, Asisten PWK, TA GIS FPR, TA GIS KSP",
    output:"Dokumen Teknis KSP Banten Lama",
    note:"Dokumen inti (disusun dari awal): pendahuluan; tinjauan kebijakan; gambaran umum; arahan pengembangan; rencana aksi" },
  { id:22, phase:"KSP Banten Lama", ksp:"Banten Lama", days:3, tags:["bl"],
    label:"Penyusunan Ranpergub KSP Banten Lama",
    pj:"TA PWK KSP, TA Hukum, TA PWK FPR",
    output:"Ranpergub KSP Banten Lama (batang tubuh + lampiran)",
    note:"Penyusunan batang tubuh dan lampiran rencana aksi Ranpergub KSP Banten Lama" },
  { id:23, phase:"KSP Banten Lama", ksp:"Banten Lama", days:2, tags:["bl","lapbul"],
    label:"Penyusunan Laporan Bulanan (bulan ke-2 & ke-3)",
    pj:"TA PWK KSP",
    output:"📅 Laporan Bulanan 2 (HK 44) & 3 (HK 66)",
    note:"Penyusunan laporan progres bulan ke-2 dan ke-3; diserahkan HK ke-44 dan ke-66" },
  { id:24, phase:"KSP Banten Lama", ksp:"Banten Lama", days:1, tags:["bl","koordinasi"],
    label:"Koordinasi, Konsultasi, dan Asistensi",
    pj:"TA PWK KSP, TA PWK FPR",
    output:"Notulensi pembahasan + dokumentasi (Koordinasi Tim Teknis Juli & Ags)",
    note:"Laporan progres bulan ke-2 & ke-3; notulensi; dokumentasi; koordinasi Tim Teknis Juli & Agustus" },
  { id:25, phase:"KSP Banten Lama", ksp:"Banten Lama", days:1, tags:["bl","hukum"],
    label:"Konsultasi Biro Hukum KSP Banten Lama",
    pj:"TA PWK KSP, TA Hukum",
    output:"Notulensi konsultasi Biro Hukum Banten Lama",
    note:"Konsultasi Biro Hukum untuk KSP Banten Lama setelah batang tubuh Ranpergub selesai" },
  { id:26, phase:"KSP KP3B", ksp:"KP3B", days:4, tags:["kp3b","survei","koordinasi"],
    label:"Survei Lapangan · Koordinasi Tim Teknis September",
    pj:"TA PWK KSP, TA GIS FPR, TA GIS KSP, Asisten PWK",
    output:"Data primer lapangan KSP KP3B + Notulensi Tim Teknis Sep",
    note:"Survei kondisi fisik kawasan KP3B; dokumentasi lapangan; observasi infrastruktur; koordinasi Tim Teknis September" },
  { id:27, phase:"KSP KP3B", ksp:"KP3B", days:3, tags:["kp3b"],
    label:"Pengumpulan Data Sekunder",
    pj:"TA PWK FPR, Asisten PWK",
    output:"Kompilasi data sekunder KSP KP3B",
    note:"Data dari Biro Pemerintahan, BPKAD, Bappeda, OPD terkait kawasan pusat pemerintahan Provinsi Banten" },
  { id:28, phase:"KSP KP3B", ksp:"KP3B", days:3, tags:["kp3b"],
    label:"Inventarisasi dan Tabulasi Permasalahan dan Potensi",
    pj:"TA PWK KSP, TA PWK FPR, Asisten PWK",
    output:"Matriks inventarisasi & tabulasi KP3B",
    note:"Identifikasi, klasifikasi, tabulasi permasalahan dan potensi kawasan berdasarkan data primer & sekunder" },
  { id:29, phase:"KSP KP3B", ksp:"KP3B", days:3, tags:["kp3b"],
    label:"Kajian Kebijakan Penataan Ruang dan Pembangunan",
    pj:"TA PWK KSP, TA PWK FPR, TA Hukum",
    output:"Dokumen kajian kebijakan KP3B",
    note:"Telaah RTRW Prov. Banten, kebijakan kawasan pusat pemerintahan, regulasi terkait KP3B" },
  { id:30, phase:"KSP KP3B", ksp:"KP3B", days:4, tags:["kp3b"],
    label:"Analisis Penguatan Nilai dan Isu Strategis",
    pj:"TA PWK KSP, TA PWK FPR",
    output:"Laporan analisis penguatan nilai & isu strategis KP3B",
    note:"Analisis nilai strategis pusat pemerintahan provinsi; identifikasi isu kritis kawasan" },
  { id:31, phase:"KSP KP3B", ksp:"KP3B", days:2, tags:["kp3b","gis"],
    label:"Analisis Delineasi Kawasan",
    pj:"TA PWK KSP, TA GIS FPR, TA GIS KSP",
    output:"Delineasi kawasan final KSP KP3B",
    note:"Verifikasi & penetapan delineasi kawasan KP3B; kesesuaian dengan RTRW; analisis peruntukan ruang" },
  { id:32, phase:"KSP KP3B", ksp:"KP3B", days:4, tags:["kp3b","gis"],
    label:"Pengolahan Data dan Analisis Spasial KSP KP3B",
    pj:"TA GIS FPR, TA GIS KSP, Asisten PWK",
    output:"Peta tematik KSP KP3B",
    note:"Digitasi, overlay, analisis spasial; penyusunan peta tematik kawasan KP3B" },
  { id:33, phase:"KSP KP3B", ksp:"KP3B", days:4, tags:["kp3b"],
    label:"Analisis Konsep Pengembangan",
    pj:"TA PWK KSP, TA PWK FPR",
    output:"Konsep pengembangan kawasan KSP KP3B",
    note:"Arahan pengembangan sektor unggulan, struktur ruang kawasan, kelembagaan KP3B" },
  { id:34, phase:"KSP KP3B", ksp:"KP3B", days:3, tags:["kp3b"],
    label:"Analisis Regional",
    pj:"TA PWK KSP, TA PWK FPR",
    output:"Laporan analisis regional KP3B",
    note:"Analisis keterkaitan KP3B dengan wilayah sekitar yang terpengaruh; dampak regional pengembangan" },
  { id:35, phase:"KSP KP3B", ksp:"KP3B", days:3, tags:["kp3b"],
    label:"Analisis Pembiayaan Pembangunan",
    pj:"TA PWK FPR, Asisten PWK",
    output:"Matrik pembiayaan pembangunan KP3B",
    note:"Estimasi kebutuhan pembiayaan; identifikasi sumber (APBN, APBD, swasta); skema pendanaan KP3B" },
  { id:36, phase:"KSP KP3B", ksp:"KP3B", days:10, tags:["kp3b","doktek"],
    label:"Penyusunan Dokumen Teknis KSP KP3B",
    pj:"TA PWK KSP, TA PWK FPR, Asisten PWK, TA GIS FPR, TA GIS KSP",
    output:"Dokumen Teknis KSP KP3B",
    note:"Dokumen inti (disusun dari awal): pendahuluan; tinjauan kebijakan; gambaran umum; arahan pengembangan; rencana aksi" },
  { id:37, phase:"KSP KP3B", ksp:"KP3B", days:3, tags:["kp3b"],
    label:"Penyusunan Ranpergub KSP KP3B",
    pj:"TA PWK KSP, TA Hukum, TA PWK FPR",
    output:"Ranpergub KSP KP3B (batang tubuh + lampiran)",
    note:"Penyusunan batang tubuh dan lampiran rencana aksi Ranpergub KSP KP3B" },
  { id:38, phase:"KSP KP3B", ksp:"KP3B", days:2, tags:["kp3b","lapbul"],
    label:"Penyusunan Laporan Bulanan (bulan ke-4 & ke-5)",
    pj:"TA PWK KSP",
    output:"📅 Laporan Bulanan 4 (HK 88) & 5 (HK 110)",
    note:"Penyusunan laporan progres bulan ke-4 dan ke-5; diserahkan HK ke-88 dan ke-110" },
  { id:39, phase:"KSP KP3B", ksp:"KP3B", days:2, tags:["kp3b","koordinasi"],
    label:"Koordinasi, Konsultasi, dan Asistensi",
    pj:"TA PWK KSP, TA PWK FPR",
    output:"Notulensi pembahasan + dokumentasi (Koordinasi Tim Teknis Okt)",
    note:"Laporan progres bulan ke-4 & ke-5; notulensi; dokumentasi; koordinasi Tim Teknis Oktober" },
  { id:40, phase:"KSP KP3B", ksp:"KP3B", days:2, tags:["kp3b","hukum"],
    label:"Konsultasi Biro Hukum KSP KP3B",
    pj:"TA PWK KSP, TA Hukum",
    output:"Notulensi konsultasi Biro Hukum KP3B",
    note:"Konsultasi Biro Hukum untuk KSP KP3B setelah batang tubuh Ranpergub selesai" },
  { id:41, phase:"Pembahasan & Finalisasi", ksp:"Semua", days:10, tags:["pembahasan"],
    label:"Pembahasan dan Perbaikan Seluruh Dokumen (3 Ranpergub KSP)",
    pj:"TA PWK KSP, TA Hukum, TA PWK FPR, semua tim",
    output:"3 Ranpergub KSP — revisi final",
    note:"Rapat koordinasi lintas sektor dengan OPD dan stakeholder untuk ke-3 Ranpergub; penyempurnaan substansi" },
  { id:42, phase:"Pembahasan & Finalisasi", ksp:"Semua", days:2, tags:["hukum","koordinasi"],
    label:"Konsultasi Biro Hukum KSP Perbatasan (lanjutan) · Koordinasi Tim Teknis November",
    pj:"TA PWK KSP, TA Hukum",
    output:"Notulensi Biro Hukum Perbatasan lanjutan + Tim Teknis Nov",
    note:"Konsultasi lanjutan Biro Hukum untuk KSP Perbatasan; koordinasi bulanan Tim Teknis PUPR (November)" },
  { id:43, phase:"Pembahasan & Finalisasi", ksp:"Semua", days:8, tags:[],
    label:"Penyusunan Laporan Pendahuluan, Antara, dan Akhir (untuk 3 KSP)",
    pj:"TA PWK KSP, TA PWK FPR, Asisten PWK",
    output:"Lap. Pendahuluan · Antara · Akhir (5 eks masing-masing)",
    note:"Kompilasi & penyusunan seluruh dokumen pelaporan untuk 3 KSP" },
  { id:44, phase:"Pembahasan & Finalisasi", ksp:"Semua", days:3, tags:[],
    label:"Penyusunan Ringkasan Eksekutif (per KSP — 3 dokumen)",
    pj:"TA PWK KSP, TA PWK FPR",
    output:"3 Ringkasan Eksekutif",
    note:"Executive summary per KSP memuat nilai strategis, konsep pengembangan, dan rencana aksi" },
  { id:45, phase:"Pembahasan & Finalisasi", ksp:"Semua", days:4, tags:[],
    label:"Penyusunan Jurnal",
    pj:"TA PWK KSP, TA PWK FPR",
    output:"Draft jurnal ilmiah",
    note:"Penyusunan 1 jurnal ilmiah berbasis kajian KSP; fokus pada 1 tema kajian paling substansial" },
  { id:46, phase:"Pembahasan & Finalisasi", ksp:"Semua", days:2, tags:["lapbul"],
    label:"Penyusunan Laporan Bulanan (bulan ke-6 & ke-7)",
    pj:"TA PWK KSP",
    output:"📅 Laporan Bulanan 6 (HK 132) & 7 (HK 154)",
    note:"Penyusunan laporan progres bulan ke-6 dan ke-7; diserahkan HK ke-132 dan ke-154" },
  { id:47, phase:"Pembahasan & Finalisasi", ksp:"Semua", days:5, tags:["koordinasi"],
    label:"Koordinasi, Konsultasi, dan Asistensi · Finalisasi",
    pj:"TA PWK KSP, semua tim",
    output:"Seluruh dokumen final + Notulensi Tim Teknis Des",
    note:"Finalisasi format & isi seluruh dokumen; pengecekan akhir kelengkapan output; koordinasi Tim Teknis Desember" },
  { id:48, phase:"Pembahasan & Finalisasi", ksp:"Semua", days:1, tags:["serahterima"],
    label:"Serah Terima Output Pekerjaan",
    pj:"TA PWK KSP",
    output:"📋 Berita Acara Serah Terima — HK ke-154 (21 Desember 2026)",
    note:"Penyerahan seluruh output: 3 Ranpergub KSP · Laporan Pendahuluan, Antara, Akhir · 3 Ringkasan Eksekutif · 1 Jurnal · 7 Laporan Bulanan" },
];

function buildSchedule() {
  let cur=0;
  return TASKS.map(t=>{
    const s=ALL_WDS[cur], e=ALL_WDS[Math.min(cur+t.days-1,153)];
    const ds=cur+1; cur+=t.days;
    return{...t,start:s,end:e,dayStart:ds,dayEnd:cur};
  });
}

const PS={
  "Persiapan":            {bg:"#e0f2fe",bdr:"#0284c7",txt:"#0c4a6e"},
  "KSP Perbatasan":       {bg:"#fffbeb",bdr:"#d97706",txt:"#78350f"},
  "KSP Banten Lama":      {bg:"#ecfdf5",bdr:"#059669",txt:"#064e3b"},
  "KSP KP3B":             {bg:"#f5f3ff",bdr:"#7c3aed",txt:"#4c1d95"},
  "Pembahasan & Finalisasi":{bg:"#fff1f2",bdr:"#e11d48",txt:"#881337"},
};
const PHASE_ORDER=["Persiapan","KSP Perbatasan","KSP Banten Lama","KSP KP3B","Pembahasan & Finalisasi"];
const KCHIP={"Perbatasan":{bg:"#fef3c7",c:"#92400e"},"Banten Lama":{bg:"#d1fae5",c:"#065f46"},"KP3B":{bg:"#ede9fe",c:"#4c1d95"},"Semua":{bg:"#f1f5f9",c:"#475569"}};
const MILESTONE={
  10:{label:"🏁 KSP Perbatasan selesai",sub:"≤ 3 Juni 2026",clr:"#d97706"},
  25:{label:"🏁 KSP Banten Lama selesai",sub:"≤ 19 Agustus 2026",clr:"#059669"},
  40:{label:"🏁 KSP KP3B selesai",sub:"≤ 2 November 2026",clr:"#7c3aed"},
  48:{label:"📋 Serah Terima Output Pekerjaan",sub:"HK ke-154 · 21 Desember 2026",clr:"#e11d48"},
};
const LAP_IDS=new Set([8,23,38,46]);

export default function App(){
  const sched=useMemo(buildSchedule,[]);
  const [fPhase,setFPhase]=useState("Semua");
  const [search,setSearch]=useState("");
  const [openId,setOpenId]=useState(null);

  const stats=useMemo(()=>{
    const m={};
    sched.forEach(t=>{if(!m[t.phase])m[t.phase]={tasks:0,hk:0};m[t.phase].tasks++;m[t.phase].hk+=t.days;});
    return m;
  },[sched]);

  const visible=sched.filter(t=>{
    const ok1=fPhase==="Semua"||t.phase===fPhase;
    const q=search.toLowerCase();
    const ok2=!q||t.label.toLowerCase().includes(q)||t.pj.toLowerCase().includes(q)||t.output.toLowerCase().includes(q)||t.note.toLowerCase().includes(q);
    return ok1&&ok2;
  });

  const lapBulSummary=[
    {n:1,hk:22,tgl:"15 Jun 2026"},{n:2,hk:44,tgl:"16 Jul 2026"},{n:3,hk:66,tgl:"18 Ags 2026"},
    {n:4,hk:88,tgl:"18 Sep 2026"},{n:5,hk:110,tgl:"20 Okt 2026"},{n:6,hk:132,tgl:"19 Nov 2026"},
    {n:7,hk:154,tgl:"21 Des 2026"},
  ];

  return(
    <div style={{fontFamily:"'Segoe UI',sans-serif",background:"#f1f5f9",minHeight:"100vh"}}>
      <div style={{background:"linear-gradient(145deg,#0f2744 0%,#1a5276 100%)",color:"#fff",padding:"22px 18px 18px"}}>
        <div style={{maxWidth:860,margin:"0 auto"}}>
          <div style={{fontSize:9,fontWeight:800,letterSpacing:2.5,color:"#7dd3fc",marginBottom:5,textTransform:"uppercase"}}>Dinas PUPR Provinsi Banten · Tahun Anggaran 2026</div>
          <h1 style={{margin:0,fontSize:18,fontWeight:800,lineHeight:1.3}}>Rencana Kerja Penyempurnaan Ranpergub KSP</h1>
          <p style={{margin:"4px 0 0",fontSize:11,color:"#93c5fd",fontStyle:"italic"}}>KSP Kawasan Perbatasan · KSP Banten Lama · KSP KP3B · 154 Hari Kerja</p>
          <div style={{display:"flex",gap:10,marginTop:14,flexWrap:"wrap"}}>
            {[["Mulai","8 Mei 2026"],["Selesai","21 Des 2026"],["Total HK","154"],["Tim","6 Tenaga Ahli"],["Output","3 Ranpergub KSP"]].map(([k,v])=>(
              <div key={k} style={{background:"rgba(255,255,255,0.12)",borderRadius:9,padding:"6px 13px"}}>
                <div style={{fontSize:8,color:"#7dd3fc",fontWeight:800,letterSpacing:1,textTransform:"uppercase"}}>{k}</div>
                <div style={{fontSize:14,fontWeight:800}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{background:"#1e293b",padding:"8px 18px"}}>
        <div style={{maxWidth:860,margin:"0 auto",display:"flex",gap:16,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{fontSize:9,fontWeight:800,color:"#475569",textTransform:"uppercase",letterSpacing:1.5}}>Milestone:</span>
          {[{c:"#0284c7",l:"Persiapan",d:"HK 1–3"},{c:"#d97706",l:"KSP Perbatasan",d:"≤ 3 Jun"},{c:"#059669",l:"KSP Banten Lama",d:"≤ 19 Ags"},{c:"#7c3aed",l:"KSP KP3B",d:"≤ 2 Nov"},{c:"#e11d48",l:"Serah Terima",d:"21 Des · HK-154"}].map(m=>(
            <span key={m.l} style={{display:"flex",alignItems:"center",gap:5,fontSize:11}}>
              <span style={{width:7,height:7,borderRadius:"50%",background:m.c,flexShrink:0,display:"inline-block"}}/>
              <span style={{color:"#e2e8f0",fontWeight:700}}>{m.l}</span>
              <span style={{color:"#64748b"}}>{m.d}</span>
            </span>
          ))}
        </div>
      </div>

      <div style={{background:"#0c4a6e",padding:"7px 18px"}}>
        <div style={{maxWidth:860,margin:"0 auto",display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{fontSize:9,fontWeight:800,color:"#7dd3fc",textTransform:"uppercase",letterSpacing:1}}>📅 Laporan Bulanan:</span>
          {lapBulSummary.map(l=>(
            <span key={l.n} style={{fontSize:10,background:"rgba(125,211,252,0.15)",borderRadius:6,padding:"2px 8px",color:"#bae6fd",fontWeight:600}}>LB-{l.n} · HK {l.hk} · {l.tgl}</span>
          ))}
        </div>
      </div>

      <div style={{maxWidth:860,margin:"14px auto 0",padding:"0 18px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(148px,1fr))",gap:8}}>
          {PHASE_ORDER.map(ph=>{
            const s=PS[ph]; const st=stats[ph]||{}; const act=fPhase===ph;
            return(
              <div key={ph} onClick={()=>setFPhase(act?"Semua":ph)} style={{background:act?s.bdr:"#fff",border:`2px solid ${act?s.bdr:s.bdr+"55"}`,borderRadius:11,padding:"9px 12px",cursor:"pointer",transition:"all 0.15s"}}>
                <div style={{fontSize:8,fontWeight:800,color:act?"#fff":s.txt,letterSpacing:0.5,marginBottom:3,lineHeight:1.3}}>{ph.toUpperCase()}</div>
                <div style={{display:"flex",gap:12}}>
                  <div><div style={{fontSize:20,fontWeight:800,color:act?"#fff":s.bdr,lineHeight:1}}>{st.hk}</div><div style={{fontSize:8,color:act?"rgba(255,255,255,0.75)":s.txt,fontWeight:700}}>HK</div></div>
                  <div><div style={{fontSize:20,fontWeight:800,color:act?"#fff":s.bdr,lineHeight:1}}>{st.tasks}</div><div style={{fontSize:8,color:act?"rgba(255,255,255,0.75)":s.txt,fontWeight:700}}>KEGIATAN</div></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{maxWidth:860,margin:"12px auto 0",padding:"0 18px"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Cari kegiatan, PJ, output, atau catatan..."
          style={{width:"100%",boxSizing:"border-box",padding:"9px 14px",borderRadius:9,border:"1.5px solid #cbd5e1",fontSize:13,outline:"none",background:"#fff",marginBottom:9}}/>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {["Semua",...PHASE_ORDER].map(p=>{
            const s=PS[p]||{}; const act=fPhase===p;
            return(<button key={p} onClick={()=>setFPhase(p)} style={{padding:"5px 11px",borderRadius:20,fontSize:11,fontWeight:act?800:500,cursor:"pointer",border:`1.5px solid ${act?(s.bdr||"#64748b"):"#e2e8f0"}`,background:act?(s.bg||"#f8fafc"):"#fff",color:act?(s.txt||"#1e293b"):"#64748b",fontFamily:"inherit"}}>{p}</button>);
          })}
        </div>
      </div>

      <div style={{maxWidth:860,margin:"12px auto 52px",padding:"0 18px"}}>
        {visible.length===0&&<div style={{textAlign:"center",padding:48,color:"#94a3b8"}}>Tidak ada kegiatan sesuai filter.</div>}
        {visible.map((t,idx)=>{
          const s=PS[t.phase]||PS["Pembahasan & Finalisasi"];
          const chip=KCHIP[t.ksp]||KCHIP["Semua"];
          const isOpen=openId===t.id;
          const prevPhase=idx>0?visible[idx-1].phase:null;
          const showHdr=t.phase!==prevPhase;
          const ms=MILESTONE[t.id];
          const isLap=LAP_IDS.has(t.id);
          const isDok=t.tags.includes("doktek");
          const isST=t.tags.includes("serahterima");
          const leftBdr=isLap?"#0ea5e9":isST?"#e11d48":isDok?"#f59e0b":s.bdr;
          const cardBg=isST?"#fff1f2":isDok?s.bg:"#fff";
          const phFirst=visible.find(x=>x.phase===t.phase);
          const phLast=visible.filter(x=>x.phase===t.phase).slice(-1)[0];
          let icons="";
          if(isLap) icons+="📅 ";
          if(t.tags.includes("koordinasi")) icons+="🤝 ";
          if(t.tags.includes("hukum")) icons+="⚖️ ";
          if(isDok) icons+="📖 ";
          if(t.tags.includes("survei")) icons+="🏕️ ";
          if(t.tags.includes("gis")) icons+="🗺️ ";
          return(
            <div key={t.id}>
              {showHdr&&(
                <div style={{margin:"20px 0 8px",display:"flex",alignItems:"center",gap:9}}>
                  <div style={{width:12,height:12,borderRadius:3,background:s.bdr,flexShrink:0}}/>
                  <span style={{fontSize:11,fontWeight:800,color:s.txt,letterSpacing:0.8,textTransform:"uppercase"}}>{t.phase}</span>
                  <div style={{flex:1,height:1,background:s.bdr,opacity:0.2}}/>
                  <span style={{fontSize:10,color:s.bdr,fontWeight:700,fontFamily:"monospace"}}>HK {phFirst?.dayStart}–{phLast?.dayEnd}</span>
                </div>
              )}
              <div onClick={()=>setOpenId(isOpen?null:t.id)} style={{background:cardBg,border:`1.5px solid ${isOpen||ms||isDok?s.bdr:"#e2e8f0"}`,borderLeft:`4px solid ${leftBdr}`,borderRadius:10,marginBottom:5,cursor:"pointer",boxShadow:isOpen?`0 4px 16px ${s.bdr}22`:"none",transition:"box-shadow 0.15s,border-color 0.15s"}}>
                <div style={{display:"flex",alignItems:"center",gap:9,padding:"10px 12px"}}>
                  <div style={{minWidth:52,textAlign:"center",background:s.bg,borderRadius:8,padding:"4px 5px",flexShrink:0,border:`1px solid ${s.bdr}33`}}>
                    <div style={{fontSize:8,color:s.txt,fontWeight:800,textTransform:"uppercase"}}>HK</div>
                    <div style={{fontSize:11,fontWeight:800,color:s.bdr,lineHeight:1.2,whiteSpace:"nowrap",fontFamily:"monospace"}}>{t.dayStart===t.dayEnd?t.dayStart:`${t.dayStart}–${t.dayEnd}`}</div>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:600,fontSize:13,color:"#0f172a",lineHeight:1.35}}>{icons}{t.label}</div>
                    <div style={{fontSize:10,color:"#64748b",marginTop:2}}>{fmtS(t.start)} – {fmtS(t.end)}&nbsp;·&nbsp;👤 {t.pj}</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                    <span style={{background:chip.bg,color:chip.c,fontSize:9,fontWeight:800,padding:"2px 8px",borderRadius:20}}>{t.ksp}</span>
                    <span style={{background:isDok?"#fef3c7":"#f1f5f9",color:isDok?"#92400e":"#475569",fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:20}}>{t.days} HK</span>
                  </div>
                  <span style={{color:"#94a3b8",fontSize:11,marginLeft:3,flexShrink:0}}>{isOpen?"▲":"▼"}</span>
                </div>
                {isOpen&&(
                  <div style={{borderTop:`1px solid ${s.bdr}33`,padding:"11px 12px 13px",background:s.bg,borderRadius:"0 0 9px 9px"}}>
                    <div style={{display:"flex",flexWrap:"wrap",gap:16,marginBottom:8}}>
                      <div>
                        <div style={{fontSize:8,fontWeight:800,color:s.txt,textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>Periode</div>
                        <div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>{fmtL(t.start)} — {fmtL(t.end)}</div>
                        <div style={{fontSize:10,color:"#64748b"}}>Hari Kerja ke-{t.dayStart}{t.dayStart!==t.dayEnd?` s/d ${t.dayEnd}`:""}</div>
                      </div>
                      <div>
                        <div style={{fontSize:8,fontWeight:800,color:s.txt,textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>Penanggung Jawab</div>
                        <div style={{fontSize:13,color:"#0f172a"}}>{t.pj}</div>
                      </div>
                    </div>
                    <div style={{marginBottom:8}}>
                      <div style={{fontSize:8,fontWeight:800,color:s.txt,textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>Output</div>
                      <div style={{fontSize:13,color:"#0f172a",fontWeight:600,lineHeight:1.5}}>{t.output}</div>
                    </div>
                    <div style={{padding:"8px 10px",background:"rgba(255,255,255,0.7)",borderRadius:7,fontSize:11.5,color:"#334155",lineHeight:1.6}}>📝 {t.note}</div>
                  </div>
                )}
              </div>
              {ms&&(
                <div style={{margin:"3px 0 16px",padding:"8px 14px",borderRadius:9,background:`${ms.clr}12`,border:`1.5px dashed ${ms.clr}`,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  <span style={{fontSize:13,fontWeight:800,color:ms.clr}}>{ms.label}</span>
                  <span style={{fontSize:11,color:ms.clr,opacity:0.8}}>— {ms.sub} — {fmtL(t.end)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{textAlign:"center",padding:"13px",color:"#94a3b8",fontSize:10,borderTop:"1px solid #e2e8f0",background:"#fff"}}>
        Rencana Kerja Penyempurnaan Ranpergub KSP · PUPR Prov. Banten · TA 2026 · 154 HK · 8 Mei – 21 Desember 2026
      </div>
    </div>
  );
}
