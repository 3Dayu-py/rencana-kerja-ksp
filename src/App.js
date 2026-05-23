import { useState, useMemo } from "react";

// ── calendar ─────────────────────────────────────────────────────────────────
const HOLIDAYS = new Set([
  "2026-05-01","2026-05-14","2026-05-25",
  "2026-06-01","2026-06-04","2026-07-06",
  "2026-08-17","2026-09-21","2026-12-25",
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

// ── TASK DATA ────────────────────────────────────────────────────────────────
// Grand total: 154 HK
// Persiapan        :  3 HK  HK   1–3   (8–12 Mei 2026)
// KSP Perbatasan   : 11 HK  HK  4–14   (13–29 Mei 2026)   ← TA Hukum & TA GIS KSP belum kontrak
// KSP Banten Lama  : 62 HK  HK 15–76   (2 Jun–31 Ags 2026)
// KSP KP3B         : 43 HK  HK 77–119  (1 Sep–30 Okt 2026)
// Pembahasan & Fin : 35 HK  HK 120–154 (2 Nov–18 Des 2026)
// Laporan Bulanan  : HK 22,44,66,88,110,132,154
// Koordinasi TT    : min 1x/bulan (tersemat dalam kegiatan)

const TASKS = [

  // ══ PERSIAPAN  HK 1–3 ════════════════════════════════════════════════════
  { id:1, phase:"Persiapan", ksp:"Semua", days:3,
    tags:[],
    label:"Penyusunan Metodologi Kerja",
    pj:"TA PWK KSP, TA PWK FPR, Asisten PWK",
    output:"Outline metodologi & rencana kerja tim",
    note:"Pendalaman lingkup KAK; penyusunan kerangka metodologi & pendekatan kerja; rencana kerja lengkap tim untuk 3 KSP; pembagian tugas" },

  // ══ KSP PERBATASAN  HK 4–14  (≤ 29 Mei 2026) ════════════════════════════
  // Tim: TA PWK KSP, TA PWK FPR, Asisten PWK, TA GIS FPR
  // (TA Hukum & TA GIS KSP belum kontrak, baru masuk bulan ke-2)
  { id:2, phase:"KSP Perbatasan", ksp:"Perbatasan", days:3,
    tags:["perb"],
    label:"Kompilasi & Harmonisasi Dokumen per-WKP → 1 KSP",
    pj:"TA PWK KSP, TA PWK FPR, Asisten PWK",
    output:"Draft dokumen KSP Perbatasan terintegrasi (dari per-WKP menjadi 1 KSP)",
    note:"Menggabungkan kajian existing per-WKP; harmonisasi narasi, data, dan substansi antar wilayah; identifikasi gap yang perlu dilengkapi. Catatan: TA Hukum & TA GIS KSP belum kontrak pada fase ini" },

  { id:3, phase:"KSP Perbatasan", ksp:"Perbatasan", days:2,
    tags:["perb"],
    label:"Update Isu dan Nilai Strategis",
    pj:"TA PWK KSP, TA PWK FPR",
    output:"Matriks isu dan nilai strategis KSP Perbatasan (terintegrasi)",
    note:"Review & update analisis isu strategis dan nilai strategis kawasan pasca integrasi WKP; penyesuaian dengan kondisi terkini" },

  { id:4, phase:"KSP Perbatasan", ksp:"Perbatasan", days:2,
    tags:["perb","gis"],
    label:"Update Peta — Delineasi KSP Perbatasan",
    pj:"TA PWK KSP, TA GIS FPR",
    output:"Peta delineasi KSP Perbatasan terintegrasi (GIS)",
    note:"Penyatuan peta per-WKP; update delineasi kawasan perbatasan kab/kota/provinsi; verifikasi terhadap RTRW Prov. Banten" },

  { id:5, phase:"KSP Perbatasan", ksp:"Perbatasan", days:4,
    tags:["perb","doktek"],
    label:"Penyusunan Dokumen Teknis KSP Perbatasan",
    pj:"TA PWK KSP, TA PWK FPR, Asisten PWK",
    output:"Dokumen Teknis KSP Perbatasan",
    note:"Dokumen inti yang memuat: tinjauan kebijakan; gambaran umum wilayah; arahan pengembangan kawasan; rencana aksi; pemantauan & evaluasi. Disusun berdasarkan hasil kompilasi, update isu, dan pemetaan" },

  { id:6, phase:"KSP Perbatasan", ksp:"Perbatasan", days:1,
    tags:["perb","lapbul","koordinasi"],
    label:"Update Batang Tubuh & Lampiran Ranpergub  ·  Koordinasi Tim Teknis Mei  ·  Lap. Bulanan 1",
    pj:"TA PWK KSP, TA PWK FPR",
    output:"Ranpergub KSP Perbatasan (batang tubuh + lampiran rencana aksi) ✅  |  📅 Laporan Bulanan 1 — HK ke-22 diserahkan (12 Jun)",
    note:"Update batang tubuh dan lampiran Ranpergub KSP Perbatasan berdasarkan Dokumen Teknis yang telah disusun. Koordinasi bulanan dengan Tim Teknis PUPR (Mei). Catatan: Konsultasi Biro Hukum dilakukan setelah batang tubuh selesai, dijadwalkan di fase berikutnya saat TA Hukum sudah bergabung. Lap. Bulanan 1 diserahkan HK ke-22 (12 Juni)" },

  // ══ KSP BANTEN LAMA  HK 15–76  (≤ 31 Agustus 2026) ══════════════════════
  // Tim: TA PWK KSP, TA PWK FPR, Asisten PWK, TA GIS FPR, TA GIS KSP, TA Hukum
  { id:7, phase:"KSP Banten Lama", ksp:"Banten Lama", days:5,
    tags:["bl","survei"],
    label:"Survei Lapangan KSP Banten Lama",
    pj:"TA PWK KSP, TA GIS FPR, TA GIS KSP, Asisten PWK",
    output:"Data primer lapangan KSP Banten Lama (foto, observasi, pengukuran)",
    note:"Survei kondisi fisik kawasan heritage Banten Lama; dokumentasi lapangan; wawancara stakeholder; observasi potensi & permasalahan" },

  { id:8, phase:"KSP Banten Lama", ksp:"Banten Lama", days:4,
    tags:["bl"],
    label:"Pengumpulan Data Sekunder",
    pj:"TA PWK FPR, Asisten PWK",
    output:"Kompilasi data sekunder KSP Banten Lama (kependudukan, tata ruang, ekonomi, sosial-budaya)",
    note:"Pengumpulan data dari BPS, Dispar, Disbud, Bappeda, OPD Kab/Kota terkait kawasan Banten Lama" },

  { id:9, phase:"KSP Banten Lama", ksp:"Banten Lama", days:4,
    tags:["bl"],
    label:"Inventarisasi dan Tabulasi Permasalahan dan Potensi",
    pj:"TA PWK KSP, TA PWK FPR, Asisten PWK",
    output:"Matriks inventarisasi & tabulasi permasalahan dan potensi KSP Banten Lama",
    note:"Identifikasi, klasifikasi, dan tabulasi seluruh permasalahan dan potensi kawasan berdasarkan data primer & sekunder" },

  { id:10, phase:"KSP Banten Lama", ksp:"Banten Lama", days:4,
    tags:["bl","koordinasi"],
    label:"Kajian Kebijakan Penataan Ruang dan Pembangunan  ·  Koordinasi Tim Teknis Juni",
    pj:"TA PWK KSP, TA PWK FPR, TA Hukum",
    output:"Dokumen kajian kebijakan penataan ruang & pembangunan nasional/provinsi/kab-kota  |  Notulensi koordinasi Tim Teknis Juni",
    note:"Telaah kebijakan: RTRW Prov. Banten, RTRW Kab/Kota, KLHS, kebijakan pembangunan terkait. Koordinasi bulanan Tim Teknis PUPR (Juni)" },

  { id:11, phase:"KSP Banten Lama", ksp:"Banten Lama", days:1,
    tags:["lapbul"],
    label:"Laporan Bulanan 2  [HK ke-44]",
    pj:"TA PWK KSP",
    output:"📅 Laporan Bulanan 2 — HK ke-44 diserahkan (15 Jul)",
    note:"Laporan progres pekerjaan bulan ke-2; notulensi pembahasan; dokumentasi kegiatan — diserahkan HK ke-44 (15 Juli)" },

  { id:12, phase:"KSP Banten Lama", ksp:"Banten Lama", days:5,
    tags:["bl"],
    label:"Analisis Penguatan Nilai dan Isu Strategis",
    pj:"TA PWK KSP, TA PWK FPR",
    output:"Laporan analisis penguatan nilai & isu strategis KSP Banten Lama",
    note:"Analisis potensi heritage, pariwisata, sosial-budaya; penguatan nilai strategis kawasan; identifikasi isu-isu kritis" },

  { id:13, phase:"KSP Banten Lama", ksp:"Banten Lama", days:3,
    tags:["bl","gis"],
    label:"Analisis Delineasi Kawasan",
    pj:"TA PWK KSP, TA GIS FPR, TA GIS KSP",
    output:"Delineasi kawasan final KSP Banten Lama",
    note:"Verifikasi & penetapan delineasi kawasan; kesesuaian dengan RTRW; analisis peruntukan ruang eksisting vs rencana" },

  { id:14, phase:"KSP Banten Lama", ksp:"Banten Lama", days:5,
    tags:["bl","gis"],
    label:"Pengolahan Data dan Analisis Spasial KSP Banten Lama",
    pj:"TA GIS FPR, TA GIS KSP, Asisten PWK",
    output:"Peta tematik KSP Banten Lama (penggunaan lahan, delineasi, infrastruktur, dll.)",
    note:"Digitasi, overlay, analisis spasial data primer & sekunder; penyusunan peta tematik kawasan Banten Lama" },

  { id:15, phase:"KSP Banten Lama", ksp:"Banten Lama", days:1,
    tags:["lapbul","koordinasi"],
    label:"Laporan Bulanan 3  [HK ke-66]  ·  Koordinasi Tim Teknis Juli",
    pj:"TA PWK KSP",
    output:"📅 Laporan Bulanan 3 — HK ke-66 diserahkan (14 Ags)  |  Notulensi koordinasi Tim Teknis Juli",
    note:"Laporan progres pekerjaan bulan ke-3; koordinasi bulanan Tim Teknis PUPR (Juli) — diserahkan HK ke-66 (14 Agustus)" },

  { id:16, phase:"KSP Banten Lama", ksp:"Banten Lama", days:5,
    tags:["bl"],
    label:"Analisis Konsep Pengembangan",
    pj:"TA PWK KSP, TA PWK FPR",
    output:"Konsep pengembangan kawasan KSP Banten Lama",
    note:"Arahan pengembangan sektor unggulan, struktur ruang kawasan, kelembagaan; konsep pengembangan berbasis nilai strategis" },

  { id:17, phase:"KSP Banten Lama", ksp:"Banten Lama", days:3,
    tags:["bl"],
    label:"Analisis Regional",
    pj:"TA PWK KSP, TA PWK FPR",
    output:"Laporan analisis regional KSP Banten Lama (kawasan yang terpengaruh)",
    note:"Analisis keterkaitan kawasan Banten Lama dengan wilayah sekitarnya yang terpengaruh; dampak regional pengembangan kawasan" },

  { id:18, phase:"KSP Banten Lama", ksp:"Banten Lama", days:3,
    tags:["bl"],
    label:"Analisis Pembiayaan Pembangunan",
    pj:"TA PWK FPR, Asisten PWK",
    output:"Matrik pembiayaan pembangunan KSP Banten Lama",
    note:"Estimasi kebutuhan pembiayaan; identifikasi sumber pembiayaan (APBN, APBD, swasta); skema pendanaan pengembangan kawasan" },

  { id:19, phase:"KSP Banten Lama", ksp:"Banten Lama", days:12,
    tags:["bl","doktek"],
    label:"Penyusunan Dokumen Teknis KSP Banten Lama",
    pj:"TA PWK KSP, TA PWK FPR, Asisten PWK, TA GIS FPR, TA GIS KSP",
    output:"Dokumen Teknis KSP Banten Lama",
    note:"Dokumen inti (paling kompleks, disusun dari awal): pendahuluan; tinjauan kebijakan; gambaran umum; arahan pengembangan kawasan; rencana aksi; pemantauan & evaluasi. Membutuhkan waktu paling lama karena mencakup seluruh substansi teknis" },

  { id:20, phase:"KSP Banten Lama", ksp:"Banten Lama", days:7,
    tags:["bl","hukum","koordinasi"],
    label:"Penyusunan Batang Tubuh & Lampiran Ranpergub  ·  Konsultasi Biro Hukum  ·  Koordinasi TT Agustus",
    pj:"TA PWK KSP, TA Hukum, TA PWK FPR",
    output:"Ranpergub KSP Banten Lama (batang tubuh + lampiran rencana aksi) ✅  |  Notulensi Biro Hukum  |  Notulensi koordinasi TT Agustus",
    note:"Penyusunan pasal-pasal Ranpergub & lampiran matrik rencana aksi. Konsultasi Biro Hukum (1–2x) dilakukan setelah batang tubuh selesai. Koordinasi Tim Teknis PUPR Agustus. Selesai ≤ 31 Agustus 2026" },

  // ══ KSP KP3B  HK 77–119  (≤ 30 Oktober 2026) ════════════════════════════
  // Tim: TA PWK KSP, TA PWK FPR, Asisten PWK, TA GIS FPR, TA GIS KSP, TA Hukum
  { id:21, phase:"KSP KP3B", ksp:"KP3B", days:5,
    tags:["kp3b","survei","lapbul","koordinasi"],
    label:"Survei Lapangan KSP KP3B  ·  Koordinasi Tim Teknis September  ·  Lap. Bulanan 4  [HK ke-88]",
    pj:"TA PWK KSP, TA GIS FPR, TA GIS KSP, Asisten PWK",
    output:"Data primer lapangan KSP KP3B  |  Notulensi koordinasi TT September  |  📅 Laporan Bulanan 4 — HK ke-88 diserahkan (16 Sep)",
    note:"Survei kondisi fisik kawasan pusat pemerintahan KP3B; dokumentasi lapangan; observasi infrastruktur dan tata ruang eksisting. Koordinasi Tim Teknis (September). Lap. Bulanan 4 diserahkan HK ke-88 (16 September)" },

  { id:22, phase:"KSP KP3B", ksp:"KP3B", days:3,
    tags:["kp3b"],
    label:"Pengumpulan Data Sekunder",
    pj:"TA PWK FPR, Asisten PWK",
    output:"Kompilasi data sekunder KSP KP3B",
    note:"Data dari Biro Pemerintahan, BPKAD, Bappeda, OPD terkait kawasan pusat pemerintahan Provinsi Banten" },

  { id:23, phase:"KSP KP3B", ksp:"KP3B", days:3,
    tags:["kp3b"],
    label:"Inventarisasi dan Tabulasi Permasalahan dan Potensi",
    pj:"TA PWK KSP, TA PWK FPR, Asisten PWK",
    output:"Matriks inventarisasi & tabulasi permasalahan dan potensi KSP KP3B",
    note:"Identifikasi, klasifikasi, dan tabulasi permasalahan dan potensi kawasan berdasarkan data primer & sekunder" },

  { id:24, phase:"KSP KP3B", ksp:"KP3B", days:3,
    tags:["kp3b"],
    label:"Kajian Kebijakan Penataan Ruang dan Pembangunan",
    pj:"TA PWK KSP, TA PWK FPR, TA Hukum",
    output:"Dokumen kajian kebijakan penataan ruang & pembangunan nasional/provinsi/kab-kota",
    note:"Telaah kebijakan: RTRW Prov. Banten, kebijakan kawasan pusat pemerintahan, regulasi terkait KP3B" },

  { id:25, phase:"KSP KP3B", ksp:"KP3B", days:3,
    tags:["kp3b"],
    label:"Analisis Penguatan Nilai dan Isu Strategis",
    pj:"TA PWK KSP, TA PWK FPR",
    output:"Laporan analisis penguatan nilai & isu strategis KSP KP3B",
    note:"Analisis nilai strategis pusat pemerintahan provinsi; identifikasi isu kritis kawasan; penguatan peran KP3B" },

  { id:26, phase:"KSP KP3B", ksp:"KP3B", days:2,
    tags:["kp3b","gis"],
    label:"Analisis Delineasi Kawasan",
    pj:"TA PWK KSP, TA GIS FPR, TA GIS KSP",
    output:"Delineasi kawasan final KSP KP3B",
    note:"Verifikasi & penetapan delineasi kawasan KP3B; kesesuaian dengan RTRW; analisis peruntukan ruang" },

  { id:27, phase:"KSP KP3B", ksp:"KP3B", days:4,
    tags:["kp3b","gis"],
    label:"Pengolahan Data dan Analisis Spasial KSP KP3B",
    pj:"TA GIS FPR, TA GIS KSP, Asisten PWK",
    output:"Peta tematik KSP KP3B (penggunaan lahan, delineasi, infrastruktur, dll.)",
    note:"Digitasi, overlay, analisis spasial; penyusunan peta tematik kawasan KP3B" },

  { id:28, phase:"KSP KP3B", ksp:"KP3B", days:1,
    tags:["lapbul","koordinasi"],
    label:"Laporan Bulanan 5  [HK ke-110]  ·  Koordinasi Tim Teknis Oktober",
    pj:"TA PWK KSP",
    output:"📅 Laporan Bulanan 5 — HK ke-110 diserahkan (19 Okt)  |  Notulensi koordinasi Tim Teknis Oktober",
    note:"Laporan progres pekerjaan bulan ke-5; koordinasi bulanan Tim Teknis PUPR (Oktober) — diserahkan HK ke-110 (19 Oktober)" },

  { id:29, phase:"KSP KP3B", ksp:"KP3B", days:3,
    tags:["kp3b"],
    label:"Analisis Konsep Pengembangan",
    pj:"TA PWK KSP, TA PWK FPR",
    output:"Konsep pengembangan kawasan KSP KP3B",
    note:"Arahan pengembangan sektor unggulan, struktur ruang kawasan, kelembagaan; konsep pengembangan kawasan pusat pemerintahan" },

  { id:30, phase:"KSP KP3B", ksp:"KP3B", days:2,
    tags:["kp3b"],
    label:"Analisis Regional",
    pj:"TA PWK KSP, TA PWK FPR",
    output:"Laporan analisis regional KSP KP3B (kawasan yang terpengaruh)",
    note:"Analisis keterkaitan KP3B dengan wilayah sekitar yang terpengaruh; dampak regional pengembangan kawasan" },

  { id:31, phase:"KSP KP3B", ksp:"KP3B", days:2,
    tags:["kp3b"],
    label:"Analisis Pembiayaan Pembangunan",
    pj:"TA PWK FPR, Asisten PWK",
    output:"Matrik pembiayaan pembangunan KSP KP3B",
    note:"Estimasi kebutuhan pembiayaan; identifikasi sumber (APBN, APBD, swasta); skema pendanaan pengembangan kawasan KP3B" },

  { id:32, phase:"KSP KP3B", ksp:"KP3B", days:8,
    tags:["kp3b","doktek"],
    label:"Penyusunan Dokumen Teknis KSP KP3B",
    pj:"TA PWK KSP, TA PWK FPR, Asisten PWK, TA GIS FPR, TA GIS KSP",
    output:"Dokumen Teknis KSP KP3B",
    note:"Dokumen inti: pendahuluan; tinjauan kebijakan; gambaran umum; arahan pengembangan kawasan; rencana aksi; pemantauan & evaluasi. Membutuhkan waktu cukup lama karena disusun dari awal" },

  { id:33, phase:"KSP KP3B", ksp:"KP3B", days:4,
    tags:["kp3b","hukum"],
    label:"Penyusunan Batang Tubuh & Lampiran Ranpergub  ·  Konsultasi Biro Hukum",
    pj:"TA PWK KSP, TA Hukum, TA PWK FPR",
    output:"Ranpergub KSP KP3B (batang tubuh + lampiran rencana aksi) ✅  |  Notulensi Biro Hukum",
    note:"Penyusunan pasal-pasal Ranpergub & lampiran matrik rencana aksi KSP KP3B. Konsultasi Biro Hukum (1–2x) setelah batang tubuh selesai. Selesai ≤ 30 Oktober 2026" },

  // ══ PEMBAHASAN & FINALISASI  HK 120–154  (2 Nov – 18 Des 2026) ═══════════
  { id:34, phase:"Pembahasan & Finalisasi", ksp:"Semua", days:10,
    tags:["pembahasan"],
    label:"Pembahasan dan Perbaikan Seluruh Dokumen (3 Ranpergub KSP)",
    pj:"TA PWK KSP, TA Hukum, TA PWK FPR, semua tim",
    output:"Notulensi & Berita Acara pembahasan; 3 Ranpergub KSP — revisi final",
    note:"FGD & rapat koordinasi lintas sektor dengan OPD dan stakeholder untuk ke-3 Ranpergub KSP; penyempurnaan & perbaikan substansi berdasarkan masukan" },

  { id:35, phase:"Pembahasan & Finalisasi", ksp:"Semua", days:2,
    tags:["hukum","koordinasi"],
    label:"Konsultasi Biro Hukum KSP Perbatasan  ·  Koordinasi Tim Teknis November",
    pj:"TA PWK KSP, TA Hukum",
    output:"Notulensi Biro Hukum KSP Perbatasan  |  Notulensi koordinasi TT November",
    note:"Konsultasi Biro Hukum untuk KSP Perbatasan (TA Hukum baru bergabung di bulan ke-2, konsultasi Perbatasan dilakukan di fase ini). Koordinasi bulanan Tim Teknis PUPR (November)" },

  { id:36, phase:"Pembahasan & Finalisasi", ksp:"Semua", days:1,
    tags:["lapbul"],
    label:"Laporan Bulanan 6  [HK ke-132]",
    pj:"TA PWK KSP",
    output:"📅 Laporan Bulanan 6 — HK ke-132 diserahkan (18 Nov)",
    note:"Laporan progres pekerjaan bulan ke-6 — diserahkan HK ke-132 (18 November)" },

  { id:37, phase:"Pembahasan & Finalisasi", ksp:"Semua", days:8,
    tags:[],
    label:"Penyusunan Laporan Pendahuluan, Antara, dan Akhir (1 dokumen untuk 3 KSP)",
    pj:"TA PWK KSP, TA PWK FPR, Asisten PWK",
    output:"Laporan Pendahuluan · Laporan Antara · Laporan Akhir (masing-masing 5 eks, untuk 3 KSP)",
    note:"Kompilasi & penyusunan seluruh dokumen pelaporan: Laporan Pendahuluan, Laporan Antara (fakta & analisis), Laporan Akhir + seluruh lampiran. Diserahkan di akhir kontrak" },

  { id:38, phase:"Pembahasan & Finalisasi", ksp:"Semua", days:3,
    tags:[],
    label:"Penyusunan Ringkasan Eksekutif (per KSP, 3 dokumen)",
    pj:"TA PWK KSP, TA PWK FPR",
    output:"Ringkasan Eksekutif KSP Perbatasan · Ringkasan Eksekutif KSP Banten Lama · Ringkasan Eksekutif KSP KP3B",
    note:"Penyusunan executive summary per KSP yang memuat poin-poin kunci: nilai strategis, konsep pengembangan, dan rencana aksi masing-masing kawasan" },

  { id:39, phase:"Pembahasan & Finalisasi", ksp:"Semua", days:4,
    tags:[],
    label:"Penyusunan Jurnal",
    pj:"TA PWK KSP, TA PWK FPR",
    output:"Draft jurnal ilmiah (mengambil dari kajian KSP)",
    note:"Penyusunan 1 jurnal ilmiah berbasis kajian yang dilakukan selama pekerjaan (tidak harus mencakup 3 KSP; dapat fokus pada 1 tema kajian yang paling substansial)" },

  { id:40, phase:"Pembahasan & Finalisasi", ksp:"Semua", days:5,
    tags:["koordinasi"],
    label:"Koordinasi Tim Teknis Desember  ·  Finalisasi Seluruh Dokumen",
    pj:"TA PWK KSP, semua tim",
    output:"Notulensi koordinasi TT Desember  |  Seluruh dokumen final siap serah terima",
    note:"Finalisasi format & isi seluruh dokumen; pengecekan akhir kelengkapan output; koordinasi Tim Teknis PUPR (Desember); persiapan serah terima" },

  { id:41, phase:"Pembahasan & Finalisasi", ksp:"Semua", days:1,
    tags:["lapbul","serahterima"],
    label:"Serah Terima Output Pekerjaan  ·  Laporan Bulanan 7  [HK ke-154]",
    pj:"TA PWK KSP",
    output:"📋 Berita Acara Serah Terima — HK ke-154 (18 Desember 2026)  |  📅 Laporan Bulanan 7 — HK ke-154",
    note:"Penyerahan seluruh output: 3 Ranpergub KSP beserta lampiran · Laporan Pendahuluan · Laporan Antara · Laporan Akhir · 3 Ringkasan Eksekutif · 1 Jurnal · 7 Laporan Bulanan — pada HK ke-154, tanggal 18 Desember 2026" },
];

// ── build schedule ────────────────────────────────────────────────────────────
function buildSchedule() {
  let cur=0;
  return TASKS.map(t=>{
    const s=ALL_WDS[cur], e=ALL_WDS[Math.min(cur+t.days-1,153)];
    const ds=cur+1; cur+=t.days;
    return{...t,start:s,end:e,dayStart:ds,dayEnd:cur};
  });
}

// ── styles ────────────────────────────────────────────────────────────────────
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
  6: {label:"🏁 KSP Perbatasan selesai",sub:"≤ 29 Mei 2026",clr:"#d97706"},
  20:{label:"🏁 KSP Banten Lama selesai",sub:"≤ 31 Agustus 2026",clr:"#059669"},
  33:{label:"🏁 KSP KP3B selesai",sub:"≤ 30 Oktober 2026",clr:"#7c3aed"},
  41:{label:"📋 Serah Terima Output Pekerjaan",sub:"HK ke-154 · 18 Desember 2026",clr:"#e11d48"},
};

// tag icons
const TAG_ICONS={lapbul:"📅",koordinasi:"🤝",hukum:"⚖️",doktek:"📖",gis:"🗺️",survei:"🏕️",serahterima:"📋"};

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

  // Laporan Bulanan schedule summary
  const lapBulSummary=[
    {n:1,hk:22,tgl:"12 Jun 2026"},{n:2,hk:44,tgl:"15 Jul 2026"},{n:3,hk:66,tgl:"14 Ags 2026"},
    {n:4,hk:88,tgl:"16 Sep 2026"},{n:5,hk:110,tgl:"19 Okt 2026"},{n:6,hk:132,tgl:"18 Nov 2026"},
    {n:7,hk:154,tgl:"18 Des 2026"},
  ];

  return(
    <div style={{fontFamily:"'Segoe UI',sans-serif",background:"#f1f5f9",minHeight:"100vh"}}>

      {/* HEADER */}
      <div style={{background:"linear-gradient(145deg,#0f2744 0%,#1a5276 100%)",color:"#fff",padding:"22px 18px 18px"}}>
        <div style={{maxWidth:860,margin:"0 auto"}}>
          <div style={{fontSize:9,fontWeight:800,letterSpacing:2.5,color:"#7dd3fc",marginBottom:5,textTransform:"uppercase"}}>
            Dinas PUPR Provinsi Banten · Tahun Anggaran 2026
          </div>
          <h1 style={{margin:0,fontSize:18,fontWeight:800,lineHeight:1.3}}>
            Rencana Kerja Penyempurnaan Ranpergub KSP
          </h1>
          <p style={{margin:"4px 0 0",fontSize:11,color:"#93c5fd",fontStyle:"italic"}}>
            KSP Kawasan Perbatasan · KSP Banten Lama · KSP KP3B · 154 Hari Kerja
          </p>
          <div style={{display:"flex",gap:10,marginTop:14,flexWrap:"wrap"}}>
            {[["Mulai","8 Mei 2026"],["Selesai","18 Des 2026"],["Total HK","154"],["Tim","6 Tenaga Ahli"],["Output","3 Ranpergub KSP"]].map(([k,v])=>(
              <div key={k} style={{background:"rgba(255,255,255,0.12)",borderRadius:9,padding:"6px 13px"}}>
                <div style={{fontSize:8,color:"#7dd3fc",fontWeight:800,letterSpacing:1,textTransform:"uppercase"}}>{k}</div>
                <div style={{fontSize:14,fontWeight:800}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MILESTONE BAR */}
      <div style={{background:"#1e293b",padding:"8px 18px"}}>
        <div style={{maxWidth:860,margin:"0 auto",display:"flex",gap:16,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{fontSize:9,fontWeight:800,color:"#475569",textTransform:"uppercase",letterSpacing:1.5}}>Milestone:</span>
          {[
            {c:"#0284c7",l:"Persiapan",d:"HK 1–3"},
            {c:"#d97706",l:"KSP Perbatasan",d:"≤ 29 Mei"},
            {c:"#059669",l:"KSP Banten Lama",d:"≤ 31 Ags"},
            {c:"#7c3aed",l:"KSP KP3B",d:"≤ 30 Okt"},
            {c:"#e11d48",l:"Serah Terima",d:"18 Des · HK-154"},
          ].map(m=>(
            <span key={m.l} style={{display:"flex",alignItems:"center",gap:5,fontSize:11}}>
              <span style={{width:7,height:7,borderRadius:"50%",background:m.c,flexShrink:0,display:"inline-block"}}/>
              <span style={{color:"#e2e8f0",fontWeight:700}}>{m.l}</span>
              <span style={{color:"#64748b"}}>{m.d}</span>
            </span>
          ))}
        </div>
      </div>

      {/* LAP BULANAN STRIP */}
      <div style={{background:"#0c4a6e",padding:"7px 18px"}}>
        <div style={{maxWidth:860,margin:"0 auto",display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{fontSize:9,fontWeight:800,color:"#7dd3fc",textTransform:"uppercase",letterSpacing:1}}>📅 Laporan Bulanan:</span>
          {lapBulSummary.map(l=>(
            <span key={l.n} style={{fontSize:10,background:"rgba(125,211,252,0.15)",borderRadius:6,padding:"2px 8px",color:"#bae6fd",fontWeight:600}}>
              LB-{l.n} · HK {l.hk} · {l.tgl}
            </span>
          ))}
        </div>
      </div>

      {/* PHASE SUMMARY CARDS */}
      <div style={{maxWidth:860,margin:"14px auto 0",padding:"0 18px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(148px,1fr))",gap:8}}>
          {PHASE_ORDER.map(ph=>{
            const s=PS[ph]; const st=stats[ph]||{}; const act=fPhase===ph;
            return(
              <div key={ph} onClick={()=>setFPhase(act?"Semua":ph)} style={{
                background:act?s.bdr:"#fff",border:`2px solid ${act?s.bdr:s.bdr+"55"}`,
                borderRadius:11,padding:"9px 12px",cursor:"pointer",transition:"all 0.15s",
              }}>
                <div style={{fontSize:8,fontWeight:800,color:act?"#fff":s.txt,letterSpacing:0.5,marginBottom:3,lineHeight:1.3}}>{ph.toUpperCase()}</div>
                <div style={{display:"flex",gap:12}}>
                  <div><div style={{fontSize:20,fontWeight:800,color:act?"#fff":s.bdr,lineHeight:1}}>{st.hk}</div>
                    <div style={{fontSize:8,color:act?"rgba(255,255,255,0.75)":s.txt,fontWeight:700}}>HK</div></div>
                  <div><div style={{fontSize:20,fontWeight:800,color:act?"#fff":s.bdr,lineHeight:1}}>{st.tasks}</div>
                    <div style={{fontSize:8,color:act?"rgba(255,255,255,0.75)":s.txt,fontWeight:700}}>KEGIATAN</div></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div style={{maxWidth:860,margin:"12px auto 0",padding:"0 18px"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="🔍 Cari kegiatan, PJ, output, atau catatan..."
          style={{width:"100%",boxSizing:"border-box",padding:"9px 14px",borderRadius:9,
            border:"1.5px solid #cbd5e1",fontSize:13,outline:"none",background:"#fff",marginBottom:9}}/>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {["Semua",...PHASE_ORDER].map(p=>{
            const s=PS[p]||{}; const act=fPhase===p;
            return(<button key={p} onClick={()=>setFPhase(p)} style={{
              padding:"5px 11px",borderRadius:20,fontSize:11,fontWeight:act?800:500,cursor:"pointer",
              border:`1.5px solid ${act?(s.bdr||"#64748b"):"#e2e8f0"}`,
              background:act?(s.bg||"#f8fafc"):"#fff",color:act?(s.txt||"#1e293b"):"#64748b",
            }}>{p}</button>);
          })}
        </div>
      </div>

      {/* TASK LIST */}
      <div style={{maxWidth:860,margin:"12px auto 52px",padding:"0 18px"}}>
        {visible.length===0&&<div style={{textAlign:"center",padding:48,color:"#94a3b8"}}>Tidak ada kegiatan sesuai filter.</div>}

        {visible.map((t,idx)=>{
          const s=PS[t.phase]||PS["Pembahasan & Finalisasi"];
          const chip=KCHIP[t.ksp]||KCHIP["Semua"];
          const isOpen=openId===t.id;
          const prevPhase=idx>0?visible[idx-1].phase:null;
          const showHdr=t.phase!==prevPhase;
          const ms=MILESTONE[t.id];
          const isLap=t.tags.includes("lapbul");
          const isSerahTerima=t.tags.includes("serahterima");
          const isDokTek=t.tags.includes("doktek");
          const phFirst=visible.find(x=>x.phase===t.phase);
          const phLast=visible.filter(x=>x.phase===t.phase).slice(-1)[0];

          return(
            <div key={t.id}>
              {/* Phase header */}
              {showHdr&&(
                <div style={{margin:"20px 0 8px",display:"flex",alignItems:"center",gap:9}}>
                  <div style={{width:12,height:12,borderRadius:3,background:s.bdr,flexShrink:0}}/>
                  <span style={{fontSize:11,fontWeight:800,color:s.txt,letterSpacing:0.8}}>{t.phase.toUpperCase()}</span>
                  <div style={{flex:1,height:1,background:s.bdr,opacity:0.2}}/>
                  <span style={{fontSize:10,color:s.bdr,fontWeight:700}}>HK {phFirst?.dayStart}–{phLast?.dayEnd}</span>
                </div>
              )}

              {/* Card */}
              <div onClick={()=>setOpenId(isOpen?null:t.id)} style={{
                background:isSerahTerima?"#fff1f2":isDokTek?s.bg:"#fff",
                border:`1.5px solid ${isOpen||ms||isDokTek?s.bdr:"#e2e8f0"}`,
                borderLeft:`4px solid ${isLap?"#0ea5e9":isSerahTerima?"#e11d48":isDokTek?"#f59e0b":s.bdr}`,
                borderRadius:10,marginBottom:5,cursor:"pointer",
                boxShadow:isOpen?`0 4px 16px ${s.bdr}22`:"none",
                transition:"box-shadow 0.15s,border-color 0.15s",
              }}>
                <div style={{display:"flex",alignItems:"center",gap:9,padding:"10px 12px"}}>
                  {/* HK badge */}
                  <div style={{minWidth:52,textAlign:"center",background:s.bg,borderRadius:8,
                    padding:"4px 5px",flexShrink:0,border:`1px solid ${s.bdr}33`}}>
                    <div style={{fontSize:8,color:s.txt,fontWeight:800,textTransform:"uppercase"}}>HK</div>
                    <div style={{fontSize:11,fontWeight:800,color:s.bdr,lineHeight:1.2,whiteSpace:"nowrap"}}>
                      {t.dayStart===t.dayEnd?t.dayStart:`${t.dayStart}–${t.dayEnd}`}
                    </div>
                  </div>

                  {/* Label */}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:600,fontSize:13,color:"#0f172a",lineHeight:1.35}}>
                      {t.tags.filter(tg=>TAG_ICONS[tg]&&tg!=="perb"&&tg!=="bl"&&tg!=="kp3b").map(tg=>(
                        <span key={tg} style={{marginRight:3,fontSize:12}}>{TAG_ICONS[tg]}</span>
                      ))}
                      {t.label}
                    </div>
                    <div style={{fontSize:10,color:"#64748b",marginTop:2}}>
                      {fmtS(t.start)} – {fmtS(t.end)}&nbsp;·&nbsp;👤 {t.pj}
                    </div>
                  </div>

                  {/* Right */}
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                    <span style={{background:chip.bg,color:chip.c,fontSize:9,fontWeight:800,padding:"2px 8px",borderRadius:20}}>{t.ksp}</span>
                    <span style={{background: isDokTek?"#fef3c7":"#f1f5f9",color:isDokTek?"#92400e":"#475569",
                      fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:20}}>{t.days} HK</span>
                  </div>
                  <span style={{color:"#94a3b8",fontSize:11,marginLeft:3,flexShrink:0}}>{isOpen?"▲":"▼"}</span>
                </div>

                {/* Expanded */}
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
                    <div style={{padding:"8px 10px",background:"rgba(255,255,255,0.7)",borderRadius:7,fontSize:11.5,color:"#334155",lineHeight:1.6}}>
                      📝 {t.note}
                    </div>
                  </div>
                )}
              </div>

              {/* Milestone banner */}
              {ms&&(
                <div style={{margin:"3px 0 16px",padding:"8px 14px",borderRadius:9,
                  background:`${ms.clr}12`,border:`1.5px dashed ${ms.clr}`,
                  display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  <span style={{fontSize:13,fontWeight:800,color:ms.clr}}>{ms.label}</span>
                  <span style={{fontSize:11,color:ms.clr,opacity:0.8}}>— {ms.sub} — {fmtL(t.end)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div style={{textAlign:"center",padding:"13px",color:"#94a3b8",fontSize:10,borderTop:"1px solid #e2e8f0",background:"#fff"}}>
        Rencana Kerja Penyempurnaan Ranpergub KSP · PUPR Prov. Banten · TA 2026 · 154 HK · 8 Mei – 18 Desember 2026
      </div>
    </div>
  );
}
