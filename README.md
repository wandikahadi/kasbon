# Kasbon

Kasbon adalah web app sederhana untuk mencatat utang dan piutang pribadi.

User bisa mencatat siapa yang berutang kepadanya, atau kepada siapa dia berutang, lalu menandai catatan sebagai lunas ketika pembayaran sudah selesai.

## Setup

### 1. Clone repository

```bash
git clone <repository-url>
cd kasbon
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Value bisa didapat dari Supabase Dashboard pada project yang digunakan.

Pastikan `.env.local` tidak di-commit ke Git.

### 4. Setup database

Login ke Supabase CLI:

```bash
npx supabase login
```

Hubungkan project lokal dengan project Supabase:

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
```

Jalankan migration:

```bash
npx supabase db push
```

Migration disimpan di folder:

```text
supabase/migrations/
```

Migration membuat tabel `debts`, enum tipe kasbon, trigger `updated_at`, serta Row Level Security policy untuk `SELECT`, `INSERT`, `UPDATE`, dan `DELETE`.

### 5. Generate database types

Generate TypeScript types langsung dari schema Supabase:

```bash
npx supabase gen types typescript --linked > types/database.types.ts
```

File `types/database.types.ts` merupakan generated file dan tidak diedit manual.

### 6. Jalankan project secara lokal

```bash
npm run dev
```

Buka:

```text
http://localhost:3000
```

Untuk pengecekan sebelum commit atau deploy:

```bash
npm run lint
npm run build
```

## Demo

Vercel:

```text
https://wandikahadi-kasbon.vercel.app
```

Ganti URL di atas setelah deployment selesai.

## Approach

Saya memisahkan aplikasi berdasarkan feature dan responsibility supaya routing, UI, business logic, validasi, dan akses database tidak tercampur. Database Supabase saya jadikan source of truth untuk tipe data melalui generated TypeScript types, sedangkan Zod digunakan untuk validasi input di client dan server supaya aturan validasi tetap konsisten. Untuk keamanan, `user_id` tidak pernah dipercaya dari input client; identitas user selalu diambil dari Supabase Auth session, lalu Row Level Security menjadi lapisan terakhir yang memastikan setiap user hanya bisa membaca dan mengubah data miliknya sendiri. Status pelunasan disimpan menggunakan `settled_at` daripada boolean agar aplikasi tidak hanya mengetahui apakah kasbon sudah lunas, tetapi juga kapan pelunasan terjadi.

## Trade-off

Kalau punya satu hari tambahan, saya akan fokus menambah automated test untuk business logic dan RLS dengan dua user berbeda, memperbaiki accessibility modal seperti focus trap, menambahkan search dan sorting, serta membuat feedback mutation lebih halus dengan toast dan optimistic UI. Saya sengaja memprioritaskan correctness, security, type safety, dan core flow terlebih dahulu sebelum menambahkan fitur bonus.

## Time Spent

```text
Sekitar 2 jam.
```
