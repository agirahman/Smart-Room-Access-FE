# DESAIN.md — Panduan UI/UX Admin Dashboard: Kelola Akses Ruangan

> Dokumen ini adalah panduan desain **wajib** bagi setiap agent atau developer yang membangun tampilan UI dashboard ini. Ikuti semua spesifikasi dengan ketat. Jangan berimprovisasi di luar panduan ini tanpa alasan yang jelas.

---

## 1. IDENTITAS VISUAL & TONE

### Arah Estetika
**Industrial Precision** — Tampilan yang tegas, fungsional, dan profesional seperti sistem kontrol keamanan kelas enterprise. Bukan "startup SaaS biasa". Bukan "dashboard template". Ini adalah *command center*.

### Kata Kunci Desain
- Tegas, bukan dekoratif
- Padat informasi, bukan kosong
- Kontrol, otoritas, kepercayaan
- Presisi teknis, bukan ramah konsumen

### Yang HARUS Dihindari (Anti-Pattern AI Slop)
- ❌ Gradient ungu/pink ke putih
- ❌ Card dengan border-radius besar (>12px) seperti aplikasi mobile
- ❌ Ikon emoji sebagai pengganti ikon vektor
- ❌ Font Inter, Roboto, atau Arial
- ❌ Background abu-abu terang (#F5F5F5)
- ❌ Tombol besar bulat penuh (pill button) untuk aksi utama
- ❌ Ilustrasi SVG dekoratif yang tidak relevan
- ❌ Animasi bounce/elastic yang kekanak-kanakan
- ❌ Warna-warni pelangi dalam satu tampilan
- ❌ Empty state dengan karakter kartun

---

## 2. COLOR SYSTEM

### Palet Utama (CSS Variables Wajib)

```css
:root {
  /* === BACKGROUNDS === */
  --bg-base:        #080C12;   /* Latar paling gelap — body/html */
  --bg-surface:     #0D1117;   /* Permukaan utama — sidebar, header */
  --bg-elevated:    #111820;   /* Card, panel, modal */
  --bg-overlay:     #16202E;   /* Hover state, dropdown, tooltip bg */
  --bg-input:       #0A1020;   /* Input field background */

  /* === BLUE ACCENT (Primary) === */
  --accent-primary:     #2F7FFF;   /* CTA utama, active state, link */
  --accent-hover:       #4A93FF;   /* Hover dari primary */
  --accent-muted:       #1A3A6E;   /* Background badge, chip aktif */
  --accent-glow:        rgba(47, 127, 255, 0.15); /* Glow/aura efek */
  --accent-border:      rgba(47, 127, 255, 0.35); /* Border aktif */

  /* === STATUS COLORS === */
  --status-online:      #22C55E;   /* Ruangan: terbuka/aktif */
  --status-online-muted: rgba(34, 197, 94, 0.12);
  --status-offline:     #EF4444;   /* Ruangan: terkunci/bahaya */
  --status-offline-muted: rgba(239, 68, 68, 0.12);
  --status-warning:     #F59E0B;   /* Peringatan, akses pending */
  --status-warning-muted: rgba(245, 158, 11, 0.12);
  --status-neutral:     #64748B;   /* Tidak aktif, disabled */

  /* === TYPOGRAPHY === */
  --text-primary:   #E8EDF5;   /* Heading, nilai penting */
  --text-secondary: #8B96A8;   /* Label, deskripsi */
  --text-muted:     #4A5568;   /* Placeholder, metadata */
  --text-inverse:   #080C12;   /* Teks di atas background terang */

  /* === BORDERS === */
  --border-subtle:  rgba(255, 255, 255, 0.05);  /* Separator halus */
  --border-default: rgba(255, 255, 255, 0.08);  /* Border card/panel */
  --border-strong:  rgba(255, 255, 255, 0.14);  /* Border elemen interaktif */

  /* === SHADOWS === */
  --shadow-sm:  0 1px 3px rgba(0, 0, 0, 0.4);
  --shadow-md:  0 4px 16px rgba(0, 0, 0, 0.5);
  --shadow-lg:  0 8px 32px rgba(0, 0, 0, 0.6);
  --shadow-accent: 0 0 20px rgba(47, 127, 255, 0.2);
}
```

### Aturan Penggunaan Warna
- **Biru hanya untuk**: elemen aktif, CTA utama, link, indikator progress, highlight data terpilih
- **Hijau hanya untuk**: status "online", "granted", "open", "success"
- **Merah hanya untuk**: status "locked", "denied", "error", "danger"
- **Kuning hanya untuk**: "warning", "pending", "review needed"
- **Abu-abu**: semua teks sekunder, metadata, elemen disabled

---

## 3. TIPOGRAFI

### Font Stack

```css
/* Import di <head> */
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

:root {
  --font-display: 'Syne', sans-serif;       /* Heading besar, nama ruangan, judul section */
  --font-body:    'DM Sans', sans-serif;    /* Body text, label, deskripsi */
  --font-mono:    'IBM Plex Mono', monospace; /* ID akses, timestamp, kode, badge teknis */
}
```

### Skala Tipografi

| Token         | Font           | Size    | Weight | Line Height | Penggunaan |
|---------------|----------------|---------|--------|-------------|------------|
| `--t-hero`    | Syne           | 28px    | 800    | 1.1         | Judul halaman utama |
| `--t-title`   | Syne           | 20px    | 700    | 1.2         | Nama ruangan, section heading |
| `--t-subtitle`| Syne           | 15px    | 600    | 1.3         | Sub-heading, group label |
| `--t-body`    | DM Sans        | 14px    | 400    | 1.5         | Konten umum |
| `--t-label`   | DM Sans        | 12px    | 500    | 1.4         | Form label, tabel header |
| `--t-caption` | DM Sans        | 11px    | 400    | 1.4         | Metadata, timestamp display |
| `--t-code`    | IBM Plex Mono  | 12px    | 400    | 1.6         | ID, kode akses, log entry |

### Aturan Tipografi
- Letter-spacing untuk ALL CAPS label: `0.08em`
- Tabel header selalu UPPERCASE dengan letter-spacing
- Angka statistik besar: Syne 700, warna `--text-primary`
- Timestamp & ID: selalu IBM Plex Mono, warna `--text-muted`

---

## 4. LAYOUT & SPACING

### Grid System

```
┌─────────────────────────────────────────────────────┐
│  SIDEBAR (220px fixed)  │  MAIN CONTENT (flex: 1)   │
│                         │  ┌─────────────────────┐  │
│  Logo (56px height)     │  │  TOPBAR (56px)       │  │
│  ─────────────────      │  └─────────────────────┘  │
│  Nav Items              │                            │
│                         │  PAGE CONTENT              │
│                         │  padding: 24px             │
│                         │                            │
└─────────────────────────────────────────────────────┘
```

### Spacing Scale (8px base)

```css
:root {
  --sp-1:  4px;
  --sp-2:  8px;
  --sp-3:  12px;
  --sp-4:  16px;
  --sp-5:  20px;
  --sp-6:  24px;
  --sp-8:  32px;
  --sp-10: 40px;
  --sp-12: 48px;
}
```

### Aturan Layout
- **Page padding**: 24px semua sisi
- **Gap antar card/section**: 16px
- **Gap dalam card (padding internal)**: 20px–24px
- **Tabel row height**: minimum 44px
- **Sidebar width**: 220px (collapsed: 56px)
- **Topbar height**: 56px

### Breakpoint System

```css
/* === BREAKPOINT TOKENS === */
/* xs  : < 480px   — Handphone kecil (iPhone SE, Galaxy A) */
/* sm  : 480–767px — Handphone besar (iPhone Pro Max, Galaxy S) */
/* md  : 768–1023px — Tablet portrait (iPad, Tab S9) */
/* lg  : 1024–1279px — Tablet landscape / laptop kecil */
/* xl  : 1280–1439px — Laptop standar */
/* 2xl : ≥ 1440px  — Desktop / monitor lebar */

@custom-media --xs    (max-width: 479px);
@custom-media --sm    (min-width: 480px) and (max-width: 767px);
@custom-media --md    (min-width: 768px) and (max-width: 1023px);
@custom-media --lg    (min-width: 1024px) and (max-width: 1279px);
@custom-media --xl    (min-width: 1280px) and (max-width: 1439px);
@custom-media --2xl   (min-width: 1440px);

/* Shorthand yang sering dipakai */
@custom-media --mobile   (max-width: 767px);
@custom-media --tablet   (min-width: 768px) and (max-width: 1023px);
@custom-media --desktop  (min-width: 1024px);
```

---

## 5. KOMPONEN UTAMA

### 5.1 Card / Panel

```
┌──────────────────────────────────────┐
│ ╔══ border: 1px solid --border-default ══╗ │
│ ║  background: --bg-elevated            ║ │
│ ║  border-radius: 8px                   ║ │
│ ║  padding: 20px 24px                   ║ │
│ ║  box-shadow: --shadow-md              ║ │
│ ╚═══════════════════════════════════════╝ │
└──────────────────────────────────────┘
```

**Card aktif/terpilih**: tambahkan `border-color: --accent-border` dan `box-shadow: --shadow-accent`

### 5.2 Tombol (Button)

| Varian        | Penggunaan | Spesifikasi |
|---------------|------------|-------------|
| **Primary**   | Aksi utama (Buka Akses, Simpan) | bg: `--accent-primary`, text: putih, border-radius: 6px, padding: 8px 16px |
| **Secondary** | Aksi sekunder (Edit, Detail) | bg: `--bg-overlay`, border: `--border-strong`, text: `--text-primary` |
| **Danger**    | Revoke akses, hapus | bg: `--status-offline-muted`, border: `rgba(239,68,68,0.3)`, text: `--status-offline` |
| **Ghost**     | Aksi tersier, dalam tabel | bg: transparent, hover: `--bg-overlay` |

**Semua tombol**: font DM Sans 13px weight 500, height 34px–38px, border-radius: 6px (BUKAN pill)

### 5.3 Badge / Status Chip

```
Format: [● LABEL]
Font: IBM Plex Mono 11px
Padding: 3px 8px
Border-radius: 4px
Border: 1px solid (warna status dengan opacity 0.3)
```

Contoh:
- `● GRANTED` — bg: `--status-online-muted`, text: `--status-online`
- `● LOCKED` — bg: `--status-offline-muted`, text: `--status-offline`
- `● PENDING` — bg: `--status-warning-muted`, text: `--status-warning`

### 5.4 Sidebar Navigation

```css
/* Nav item */
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 6px;
  font: 13px/1 'DM Sans';
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

/* Active state */
.nav-item.active {
  background: var(--accent-muted);
  color: var(--accent-hover);
  /* Garis vertikal kiri */
  box-shadow: inset 3px 0 0 var(--accent-primary);
}

/* Hover state */
.nav-item:hover:not(.active) {
  background: var(--bg-overlay);
  color: var(--text-primary);
}
```

### 5.5 Tabel Data

```css
/* Prinsip tabel */
table {
  border-collapse: collapse;
  width: 100%;
}

thead th {
  font: 11px/1 'DM Sans';
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-default);
  text-align: left;
}

tbody tr {
  border-bottom: 1px solid var(--border-subtle);
  transition: background 0.1s;
}

tbody tr:hover {
  background: var(--bg-overlay);
}

tbody td {
  padding: 12px 16px;
  font-size: 13px;
  color: var(--text-primary);
}
```

### 5.6 Input & Form

```css
input, select, textarea {
  background: var(--bg-input);
  border: 1px solid var(--border-default);
  border-radius: 6px;
  color: var(--text-primary);
  font: 13px 'DM Sans';
  padding: 9px 12px;
  transition: border-color 0.15s;
}

input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

/* Label */
label {
  font: 11px/1 'DM Sans';
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 6px;
  display: block;
}
```

### 5.7 Room Access Card (Komponen Khusus)

Kartu untuk tiap ruangan di halaman utama:

```
┌─────────────────────────────────────┐
│  [IKON RUANGAN]   NAMA RUANGAN      │
│                   Lantai 3 · Blok A │
│  ─────────────────────────────────  │
│  Status: ● ONLINE   Kapasitas: 12   │
│  Akses Terakhir: 09:24 · 11 Mei     │
│  ─────────────────────────────────  │
│  [3 avatar user]  +5 lainnya        │
│  ─────────────────────────────────  │
│  [BUKA AKSES]            [DETAIL →] │
└─────────────────────────────────────┘
```

- Lebar: auto (grid 3 kolom pada 1440px, 2 kolom pada 1024px)
- Ikon ruangan: SVG line art, bukan emoji, warna `--accent-primary`
- Border kiri: 3px solid sesuai status (hijau/merah/kuning)

---

## 6. IKON

- **Library wajib**: [Lucide Icons](https://lucide.dev/) atau [Phosphor Icons](https://phosphoricons.com/)
- **Style**: Line/Outline, bukan filled solid
- **Ukuran standar**: 16px (inline), 18px (navigasi), 20px (header/hero)
- **Warna**: Ikuti warna teks konteks (`--text-secondary` untuk idle, `--accent-primary` untuk aktif)
- **JANGAN**: Font Awesome solid, emoji sebagai ikon, SVG dekoratif berlebihan

---

## 7. ANIMASI & TRANSISI

### Prinsip
- **Fungsional, bukan dekoratif** — animasi hanya ada jika membantu pemahaman state
- Durasi pendek, respons cepat

### Token Transisi

```css
:root {
  --transition-fast:   0.1s ease;    /* Hover, active press */
  --transition-base:   0.2s ease;    /* Fade, color change */
  --transition-smooth: 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* Slide panel, modal */
}
```

### Animasi yang Diizinkan
- Fade in card saat load halaman: `opacity 0→1`, durasi 0.3s, stagger 50ms per item
- Sidebar collapse/expand: `width` transition 0.25s ease
- Tombol hover: background transition, `transform: translateY(-1px)` halus
- Status badge pulse (ruangan aktif): `box-shadow` pulse lambat 2s infinite
- Modal masuk: `opacity + translateY(8px→0)`, durasi 0.25s

### Animasi yang DILARANG
- ❌ Bounce, elastic, spring berlebihan
- ❌ Rotasi penuh pada ikon biasa
- ❌ Loading spinner yang terlalu besar/dramatis
- ❌ Animasi yang lebih dari 400ms tanpa alasan

---

## 8. POLA HALAMAN

### 8.1 Halaman Dashboard Utama

```
TOPBAR
├── [≡] Logo + Nama Sistem
├── Breadcrumb: Dashboard
├── [🔍 Search]  [🔔 Notif]  [Avatar]

CONTENT AREA
├── STAT ROW (4 kartu horizontal)
│   ├── Total Ruangan Aktif
│   ├── Akses Diberikan Hari Ini
│   ├── Akses Ditolak
│   └── User Aktif
│
├── SECTION: Ruangan (grid card)
│   └── [Room Card] × N
│
└── SECTION: Log Aktivitas Terbaru (tabel)
```

### 8.2 Halaman Manajemen Akses

```
TOPBAR + filter bar (Search, Filter Status, Filter Tanggal)

TABLE: Daftar Akses
├── Kolom: USER — RUANGAN — LEVEL AKSES — STATUS — VALID HINGGA — AKSI
└── Row action: [Edit] [Revoke] [Detail]

PANEL DETAIL (slide dari kanan saat klik row)
```

### 8.3 Stat Card (Mini KPI)

```
┌───────────────────────────┐
│  LABEL METRIK             │
│  [NILAI BESAR]            │
│  ↑ +12% dari kemarin      │
└───────────────────────────┘
```
- Label: DM Sans 11px uppercase `--text-muted`
- Nilai: Syne 28px `--text-primary`
- Perubahan: DM Sans 12px, warna hijau/merah sesuai arah

---

## 9. DETAIL HALUS (Micro-Details)

Ini yang membedakan tampilan profesional dari AI slop:

- **Garis pemisah (divider)**: selalu `1px solid --border-subtle`, BUKAN `<hr>` default
- **Scrollbar custom**:
  ```css
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 99px; }
  ```
- **Seleksi teks**:
  ```css
  ::selection { background: var(--accent-muted); color: var(--accent-hover); }
  ```
- **Focus visible** (aksesibilitas): selalu gunakan `box-shadow: 0 0 0 2px --accent-primary` bukan outline default
- **Tabel kosong (empty state)**: teks datar "Tidak ada data ditemukan." dengan ikon kecil, BUKAN ilustrasi
- **Tooltip**: bg `--bg-overlay`, border `--border-strong`, font IBM Plex Mono 11px, padding 4px 8px, border-radius 4px
- **Topbar border bawah**: `1px solid --border-subtle`, BUKAN `box-shadow`
- **Avatar user**: lingkaran 28px, inisial 2 huruf, bg dari hash nama (warna yang konsisten per user)

---

## 10. RESPONSIF — MULTI DEVICE

> Dashboard ini dirancang **desktop-first** namun harus tetap fungsional penuh di tablet dan mobile. Prinsipnya: **informasi tidak hilang, hanya diatur ulang**.

---

### 10.1 Strategi Per Breakpoint

#### 🖥️ Desktop (≥ 1280px) — Tampilan Utama
Ini adalah referensi desain. Semua komponen tampil penuh.

```
┌──────────────────────────────────────────────────────────┐
│  SIDEBAR 220px (fixed)  │  TOPBAR (full width)           │
│  ─────────────────────  ├─────────────────────────────── │
│  Nav items              │  PAGE CONTENT (padding: 24px)  │
│                         │  Stat cards: 4 kolom           │
│                         │  Room cards: 3 kolom           │
│                         │  Tabel: semua kolom terlihat   │
└──────────────────────────────────────────────────────────┘
```

#### 💻 Laptop Kecil / Tablet Landscape (1024px–1279px)
Sidebar menyempit ke mode ikon saja.

```
┌──────────────────────────────────────────────────────────┐
│  SIDEBAR 56px (collapsed, ikon only) │  TOPBAR           │
│  ──────────────────────────────────  ├─────────────────  │
│  [ikon]                              │  Stat: 4 kolom    │
│  [ikon]                              │  Room: 2 kolom    │
│  [ikon]                              │  Tabel: semua     │
└──────────────────────────────────────────────────────────┘
```

```css
@media (min-width: 1024px) and (max-width: 1279px) {
  .sidebar {
    width: 56px;
  }
  .sidebar .nav-label,
  .sidebar .logo-text,
  .sidebar .section-title {
    display: none;
  }
  .sidebar .nav-item {
    justify-content: center;
    padding: 10px;
  }
  .stat-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  .room-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

#### 📱 Tablet Portrait (768px–1023px)
Sidebar menjadi **overlay drawer** yang tersembunyi di balik hamburger menu.

```
┌─────────────────────────────────────────┐
│  [≡]  LOGO          [🔔] [Avatar]       │  ← Topbar
├─────────────────────────────────────────┤
│  Stat cards: 2 kolom × 2 baris         │
│  ─────────────────────────────────────  │
│  Room cards: 2 kolom                   │
│  ─────────────────────────────────────  │
│  Tabel: kolom prioritas saja           │
│  (sembunyikan kolom sekunder)          │
└─────────────────────────────────────────┘
```

```css
@media (min-width: 768px) and (max-width: 1023px) {
  /* Layout berubah jadi stacked */
  .app-layout {
    flex-direction: column;
  }

  /* Sidebar jadi overlay */
  .sidebar {
    position: fixed;
    top: 0;
    left: -220px;          /* tersembunyi default */
    height: 100vh;
    z-index: 100;
    transition: left var(--transition-smooth);
  }
  .sidebar.open {
    left: 0;
  }

  /* Backdrop saat drawer terbuka */
  .sidebar-backdrop {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 99;
  }
  .sidebar.open ~ .sidebar-backdrop {
    display: block;
  }

  .main-content {
    width: 100%;
    padding: 16px;
  }

  .stat-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .room-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Sembunyikan kolom tabel tidak kritis */
  .table-col-secondary {
    display: none;
  }
}
```

#### 📱 Mobile (≤ 767px)
Layout **single column penuh**. Sidebar tetap sebagai drawer. Tabel berubah ke card list.

```
┌─────────────────────────────┐
│  [≡]  LOGO       [🔔][👤]  │  ← Topbar (56px)
├─────────────────────────────┤
│  Stat cards: 2 kolom        │
│  (nilai lebih kecil)        │
├─────────────────────────────┤
│  Room cards: 1 kolom        │
│  (layout horizontal compact)│
├─────────────────────────────┤
│  Log Aktivitas:             │
│  → Card list (bukan tabel)  │
│  [NAMA USER]   [● GRANTED]  │
│  Ruangan A · 09:24          │
└─────────────────────────────┘
```

```css
@media (max-width: 767px) {
  .topbar {
    padding: 0 16px;
  }

  /* Sembunyikan breadcrumb di mobile */
  .topbar-breadcrumb {
    display: none;
  }

  .main-content {
    padding: 12px;
  }

  .stat-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  /* Stat card lebih compact */
  .stat-card {
    padding: 14px 16px;
  }
  .stat-card .value {
    font-size: 22px; /* dari 28px */
  }

  /* Room card: 1 kolom, layout horizontal */
  .room-grid {
    grid-template-columns: 1fr;
  }

  .room-card {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 12px;
    align-items: center;
    padding: 14px 16px;
  }

  /* Tabel → Card List */
  /* Sembunyikan tabel biasa */
  .data-table-wrapper {
    display: none;
  }

  /* Tampilkan versi card list */
  .data-card-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .data-card-item {
    background: var(--bg-elevated);
    border: 1px solid var(--border-default);
    border-radius: 8px;
    padding: 14px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /* Filter bar: scroll horizontal */
  .filter-bar {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    gap: 8px;
    padding-bottom: 4px;
    scrollbar-width: none;
  }
  .filter-bar::-webkit-scrollbar {
    display: none;
  }
}
```

#### 📱 Mobile Kecil (≤ 479px)

```css
@media (max-width: 479px) {
  .stat-grid {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .stat-card .value {
    font-size: 20px;
  }

  /* Tombol di room card: ikon saja tanpa label */
  .room-card .btn-label {
    display: none;
  }

  /* Topbar: hanya ikon, tanpa teks logo */
  .topbar .logo-text {
    display: none;
  }
}
```

---

### 10.2 Komponen: Perubahan Per Breakpoint

#### Sidebar

| Breakpoint | Perilaku |
|------------|----------|
| ≥ 1280px   | Fixed, 220px, nav label terlihat |
| 1024–1279px | Fixed, 56px collapsed, ikon only, tooltip saat hover |
| < 1024px   | Off-canvas drawer, dipicu hamburger menu |

**Sidebar tooltip saat collapsed (lg breakpoint):**
```css
.sidebar.collapsed .nav-item {
  position: relative;
}
.sidebar.collapsed .nav-item::after {
  content: attr(data-label);
  position: absolute;
  left: calc(100% + 8px);
  background: var(--bg-overlay);
  border: 1px solid var(--border-strong);
  color: var(--text-primary);
  font: 12px 'DM Sans';
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
}
.sidebar.collapsed .nav-item:hover::after {
  opacity: 1;
}
```

#### Tabel Data

| Breakpoint | Perilaku |
|------------|----------|
| ≥ 1024px   | Semua kolom tampil |
| 768–1023px | Sembunyikan kolom sekunder (`.table-col-secondary`) |
| < 768px    | Ubah ke card list, tabel disembunyikan |

**Kolom prioritas yang SELALU tampil:**
- Nama user / entitas utama
- Status badge
- Aksi (tombol)

**Kolom yang boleh disembunyikan di tablet/mobile:**
- ID teknis
- Tanggal detail
- Kolom metadata tambahan

#### Stat Cards (KPI)

| Breakpoint | Grid | Ukuran Nilai |
|------------|------|-------------|
| ≥ 1280px   | 4 kolom | 28px |
| 1024–1279px | 4 kolom | 24px |
| 768–1023px | 2×2 | 22px |
| < 768px    | 2×2 | 20px |

#### Room Cards

| Breakpoint | Layout |
|------------|--------|
| ≥ 1440px   | 3 kolom grid |
| 1024–1439px | 2 kolom grid |
| < 1024px   | 1 kolom, card horizontal compact |

---

### 10.3 Touch Target & Mobile UX

```css
/* Semua elemen interaktif di mobile minimal 44×44px */
@media (max-width: 767px) {
  button, .nav-item, .clickable-row, input, select {
    min-height: 44px;
  }

  /* Jarak antar tombol dalam satu baris minimal 8px */
  .action-group {
    gap: 8px;
  }

  /* Hapus hover state di touchscreen */
  @media (hover: none) {
    tbody tr:hover {
      background: transparent;
    }
    .nav-item:hover:not(.active) {
      background: transparent;
      color: var(--text-secondary);
    }
  }
}
```

---

### 10.4 Modal & Drawer di Mobile

```css
/* Modal: full-screen di mobile, centered di desktop */
.modal {
  /* Desktop */
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 520px;
  max-height: 80vh;
  border-radius: 8px;
  overflow-y: auto;
}

@media (max-width: 767px) {
  .modal {
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    max-height: 90vh;
    border-radius: 12px 12px 0 0;    /* bottom sheet style */
    transform: none;
    /* Animasi dari bawah */
    animation: slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes slideUp {
    from { transform: translateY(100%); opacity: 0; }
    to   { transform: translateY(0);   opacity: 1; }
  }

  /* Handle bar di top modal */
  .modal::before {
    content: '';
    display: block;
    width: 36px;
    height: 4px;
    background: var(--border-strong);
    border-radius: 99px;
    margin: 10px auto 16px;
  }
}
```

**Detail panel (slide dari kanan):**
```css
.detail-panel {
  position: fixed;
  top: 0;
  right: -480px;
  width: 480px;
  height: 100vh;
  background: var(--bg-surface);
  border-left: 1px solid var(--border-default);
  transition: right var(--transition-smooth);
  z-index: 90;
  overflow-y: auto;
}
.detail-panel.open {
  right: 0;
}

@media (max-width: 767px) {
  .detail-panel {
    width: 100%;
    right: -100%;
    border-left: none;
  }
}
```

---

### 10.5 Tipografi Responsif

```css
/* Hero title menyesuaikan ukuran layar */
.page-title {
  font-size: 28px; /* default desktop */
}

@media (max-width: 1023px) {
  .page-title { font-size: 22px; }
}

@media (max-width: 767px) {
  .page-title { font-size: 18px; }
}

/* Body text: tetap 13-14px, tidak perlu berubah */
/* Label uppercase: tetap 11px di semua breakpoint */
```

---

### 10.6 Form Responsif

```css
/* Desktop: form bisa 2 kolom */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Tablet & Mobile: 1 kolom */
@media (max-width: 767px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  /* Input full width */
  input, select, textarea {
    width: 100%;
  }

  /* Tombol aksi form: full width di mobile */
  .form-actions {
    flex-direction: column;
  }
  .form-actions button {
    width: 100%;
  }
}
```

---

### 10.7 Perilaku Navigasi Mobile

Urutan prioritas nav item di mobile (yang harus selalu terlihat):

1. **Dashboard** (beranda)
2. **Akses Ruangan** (fungsi utama)
3. **Log Aktivitas**
4. **Pengguna**
5. **Pengaturan**

Item lain: kelompokkan dalam "Lainnya" atau sembunyikan di drawer level kedua.

**Bottom navigation (opsional untuk mobile):**
Jika ada ≥ 5 halaman yang sering diakses, pertimbangkan bottom nav bar di mobile:

```css
/* Hanya tampil di mobile */
.bottom-nav {
  display: none;
}

@media (max-width: 767px) {
  .bottom-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: var(--bg-surface);
    border-top: 1px solid var(--border-default);
    z-index: 80;
    justify-content: space-around;
    align-items: center;
    padding-bottom: env(safe-area-inset-bottom); /* iPhone notch */
  }

  .bottom-nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    color: var(--text-muted);
    font: 10px 'DM Sans';
    min-width: 44px;
    min-height: 44px;
    justify-content: center;
  }

  .bottom-nav-item.active {
    color: var(--accent-primary);
  }

  /* Beri ruang agar konten tidak tertutup bottom nav */
  .main-content {
    padding-bottom: calc(56px + 16px);
  }
}
```

---

### 10.8 Safe Area (Notch & Dynamic Island)

```css
/* Selalu terapkan ini di iOS */
.topbar {
  padding-left: max(16px, env(safe-area-inset-left));
  padding-right: max(16px, env(safe-area-inset-right));
  padding-top: env(safe-area-inset-top);
}

.sidebar {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}

body {
  padding-bottom: env(safe-area-inset-bottom);
}
```

---

### 10.9 Tabel Responsif: Pola Transformasi

Tabel adalah komponen paling bermasalah di mobile. Gunakan pola ini secara konsisten:

**Pola A — Card List (direkomendasikan untuk log/akses):**
```
Desktop (tabel):                   Mobile (card list):
┌────┬─────────┬────────┬──────┐   ┌──────────────────────────┐
│ ID │  USER   │ STATUS │ AKSI │   │ Budi Santoso    ● GRANTED│
├────┼─────────┼────────┼──────┤   │ Lab Komputer · 09:24     │
│ 01 │ Budi S. │●GRANT │ [···]│   │                    [···] │
└────┴─────────┴────────┴──────┘   └──────────────────────────┘
```

**Pola B — Scroll Horizontal (untuk tabel dengan banyak kolom angka):**
```css
.table-scroll-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Indikator scroll ada konten */
.table-scroll-wrapper::after {
  content: '';
  position: sticky;
  right: 0;
  width: 32px;
  background: linear-gradient(to right, transparent, var(--bg-elevated));
  pointer-events: none;
}
```

---

## 11. WIDE SCREEN & PRINT

### 11.1 Large Monitor (≥ 1920px)

Hindari tampilan yang terlalu "meregang" di layar sangat lebar. Gunakan max-width container:

```css
@media (min-width: 1920px) {
  /* Batasi lebar konten utama */
  .page-content {
    max-width: 1600px;
    margin: 0 auto;
  }

  /* Room grid tambah 1 kolom */
  .room-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  /* Stat grid tetap 4 kolom tapi lebih lebar */
  .stat-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  /* Sidebar tetap 220px — JANGAN diperbesar */
}
```

### 11.2 Ultra-Wide (≥ 2560px)

```css
@media (min-width: 2560px) {
  .page-content {
    max-width: 2000px;
  }
  .room-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
```

### 11.3 Print Media Query

Untuk cetak laporan akses atau log:

```css
@media print {
  /* Sembunyikan elemen non-konten */
  .sidebar,
  .topbar,
  .filter-bar,
  .action-group,
  .btn-primary,
  .btn-danger,
  .bottom-nav {
    display: none !important;
  }

  /* Reset layout ke full width */
  .app-layout {
    display: block;
  }
  .main-content {
    width: 100%;
    padding: 0;
  }

  /* Ubah ke warna terang untuk print */
  body {
    background: #fff;
    color: #111;
  }

  /* Tabel: border hitam yang jelas */
  table, th, td {
    border: 1px solid #ccc !important;
    color: #111 !important;
  }

  /* Badge: hanya teks, tanpa background */
  .badge {
    background: none !important;
    border: 1px solid #999 !important;
    color: #333 !important;
  }

  /* Header print */
  .print-header {
    display: block;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    margin-bottom: 16px;
    border-bottom: 2px solid #000;
    padding-bottom: 8px;
  }
}

/* Sembunyikan print-header di layar */
.print-header {
  display: none;
}
```

---

## 12. CHECKLIST SEBELUM DELIVER

Sebelum menyerahkan hasil, pastikan **semua** item ini terpenuhi:

### ✅ Visual & Branding
- [ ] Semua CSS variable dari Color System digunakan secara konsisten
- [ ] Font Syne, DM Sans, IBM Plex Mono ter-import dan digunakan sesuai hierarki
- [ ] Tidak ada warna hardcoded di luar variabel yang ditetapkan
- [ ] Border-radius tidak melebihi 8px (kecuali avatar/pill yang disengaja)
- [ ] Semua ikon adalah Lucide/Phosphor line style, bukan emoji
- [ ] Tidak ada ilustrasi dekoratif yang tidak relevan

### ✅ Komponen
- [ ] Tabel memiliki header UPPERCASE + letter-spacing 0.08em
- [ ] Status badge menggunakan format `[● LABEL]` dengan IBM Plex Mono
- [ ] Semua tombol height 34–38px, border-radius 6px (bukan pill)
- [ ] Input focus state menggunakan glow `--accent-glow`
- [ ] Scrollbar custom diterapkan di semua scroll area

### ✅ Animasi
- [ ] Tidak ada animasi yang melebihi 400ms
- [ ] Tidak ada bounce/elastic/spring
- [ ] Semua transisi menggunakan token `--transition-*`

### ✅ Responsif
- [ ] Diuji di 1440px (desktop standar)
- [ ] Diuji di 1024px (laptop/tablet landscape) — sidebar collapsed ke 56px
- [ ] Diuji di 768px (tablet portrait) — sidebar menjadi drawer
- [ ] Diuji di 375px (mobile standar iPhone)
- [ ] Diuji di 320px (mobile terkecil)
- [ ] Tabel beralih ke card list di mobile (≤767px)
- [ ] Semua touch target minimal 44×44px di mobile
- [ ] Tidak ada konten yang terpotong horizontal (overflow-x hidden)
- [ ] Safe area inset diterapkan (notch/Dynamic Island)
- [ ] Hover state dinonaktifkan di perangkat touchscreen
- [ ] Bottom nav (jika ada) memiliki `env(safe-area-inset-bottom)`
- [ ] Modal berubah ke bottom sheet di mobile
- [ ] Filter bar bisa scroll horizontal di mobile

### ✅ Aksesibilitas Dasar
- [ ] Semua elemen interaktif memiliki `focus-visible` state
- [ ] Kontras teks minimal 4.5:1 untuk teks body
- [ ] Semua gambar/ikon dekoratif memiliki `aria-hidden="true"`

---

## 14. REFERENSI MOOD

Bayangkan tampilan seperti:
- **Linear.app** — densitas informasi tinggi, navigasi bersih
- **Vercel Dashboard** — dark mode industrial, tipografi kuat
- **Grafana** — data-first, tabel profesional, status berwarna jelas
- **AWS Console** — otoritas, kepercayaan, fungsional tanpa ornamen

Bukan seperti: Notion, Framer, atau template Tailwind UI yang generik.

---

*Dokumen ini berlaku untuk semua halaman dan komponen dalam sistem. Setiap penyimpangan harus didokumentasikan dengan alasan yang jelas.*