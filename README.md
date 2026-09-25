# My Links — Linktree Sederhana + Supabase + Vercel

Versi ini memakai **1 halaman Admin** untuk Login + Admin Panel. Pengguna tidak perlu membuka halaman login terpisah.

---

## 📌 ISI PROJECT

- `index.html` → halaman profil publik.
- `admin.html` → halaman Login + Admin Panel dalam satu halaman.
- `admin.js` → fungsi login, profil, link, sosial media, dan logout.
- `profile.js` → mengambil dan menampilkan profil publik dari Supabase.
- `style.css` → tampilan website.
- `api/config.js` → mengambil konfigurasi Supabase dari Environment Variables Vercel.
- `supabase/schema.sql` → struktur tabel dan RLS Supabase.
- `vercel.json` → URL bersih `/admin` dan redirect `/login` ke `/admin`.
- `.gitignore` → mencegah file sensitif seperti `.env` ikut di-upload.

---

# 🚀 TUTORIAL LENGKAP INSTALASI

## BAGIAN 1 — Yang perlu disiapkan

Sebelum mulai, siapkan:

1. Akun GitHub.
2. Akun Vercel.
3. Akun Supabase.
4. Email yang akan digunakan sebagai akun admin.

Tidak perlu memasukkan `service_role` key ke website.

---

# BAGIAN 2 — Membuat Project Supabase

### 1. Buka Supabase

Masuk ke dashboard Supabase dan buat project baru.

Setelah project selesai dibuat, buka project tersebut.

### 2. Jalankan database

Di dalam ZIP ini terdapat:

`supabase/schema.sql`

Di Supabase buka:

**SQL Editor → New query**

Salin seluruh isi `supabase/schema.sql`, lalu klik **Run**.

### 3. Pastikan tabel dibuat

Buka:

**Table Editor**

Pastikan ada:

- `profiles`
- `links`
- `socials`

Jangan menghapus tabel tersebut karena Admin Panel menggunakannya.

---

# BAGIAN 3 — Membuat Akun Admin

Buka:

**Supabase → Authentication → Users**

Buat user baru.

Contoh:

Email:

`admin@example.com`

Password:

buat password kuat milik kamu sendiri.

Email dan password ini yang digunakan pada halaman:

`/admin`

> Jangan masukkan password Supabase ke file website atau GitHub.

---

# BAGIAN 4 — Mengambil URL dan Key Supabase

Di Supabase buka:

**Project Settings → API**

Cari:

### Project URL

Contohnya:

`https://xxxxxxxx.supabase.co`

Simpan nilai tersebut untuk Environment Variable `SUPABASE_URL`.

### Publishable / Anon Key

Gunakan key publik yang disediakan Supabase untuk aplikasi browser.

Simpan untuk Environment Variable `SUPABASE_ANON_KEY`.

⚠️ **JANGAN gunakan `service_role` / secret key di frontend.**

---

# BAGIAN 5 — Upload Project ke GitHub

### Cara paling mudah

1. Buka GitHub.
2. Klik **New repository**.
3. Beri nama repository, misalnya:

`my-links`

4. Buat repository.
5. Extract ZIP ini di komputer.
6. Upload seluruh isi project ke repository.

Struktur repository harus terlihat seperti:

```text
my-links/
├── api/
│   └── config.js
├── supabase/
│   └── schema.sql
├── admin.html
├── admin.js
├── index.html
├── profile.js
├── style.css
├── vercel.json
├── README.md
└── .gitignore
```

Jangan upload file ZIP sebagai satu-satunya isi repository. Yang di-upload ke GitHub adalah **isi project**.

---

# BAGIAN 6 — Deploy ke Vercel

1. Buka Vercel.
2. Klik **Add New → Project**.
3. Pilih repository GitHub yang tadi dibuat.
4. Klik **Import**.
5. Biarkan pengaturan framework/default jika tidak ada kebutuhan khusus.
6. Sebelum deploy, buka bagian **Environment Variables**.

Tambahkan:

### Variable 1

Name:

`SUPABASE_URL`

Value:

URL Project Supabase kamu.

### Variable 2

Name:

`SUPABASE_ANON_KEY`

Value:

Publishable/Anon key Supabase kamu.

Pilih environment yang digunakan, minimal **Production**. Jika ingin aman untuk Preview juga, isi untuk Preview/Development sesuai kebutuhan.

Setelah itu klik **Deploy**.

---

# BAGIAN 7 — Jika Environment Variables ditambahkan setelah Deploy

Jika project sudah pernah di-deploy lalu kamu baru menambahkan atau mengubah Environment Variables:

**Vercel → Deployments → Redeploy**

atau lakukan deployment baru dari commit terbaru.

Environment Variables baru tidak otomatis memperbaiki deployment lama yang sudah dibuat.

---

# BAGIAN 8 — Membuka Admin

Setelah deployment selesai, buka:

`https://DOMAIN-KAMU.vercel.app/admin`

Contoh:

`https://my-links.vercel.app/admin`

Karena Login dan Admin sudah digabung:

### Belum login

Yang muncul:

- Email
- Password
- Tombol Masuk

### Sudah login

Form login akan digantikan oleh Admin Panel.

Tidak perlu pindah ke `/login`.

---

# BAGIAN 9 — Membuat Profil Pertama

Setelah login, Admin Panel akan menggunakan akun Supabase kamu untuk mengelola profil.

Isi bagian **Profil**:

- Username publik
- Nama
- Bio
- URL foto profil
- Warna tombol
- Background

Contoh username:

`cupz`

Profil nantinya dapat diakses melalui username sesuai konfigurasi aplikasi.

---

# BAGIAN 10 — Menambahkan Link

Di Admin Panel buka bagian **Link**.

Klik:

`+ Tambah`

Isi:

- Judul link
- URL
- Icon jika tersedia

Klik **Simpan**.

URL sebaiknya menggunakan format lengkap:

`https://contoh.com`

Bukan hanya:

`contoh.com`

---

# BAGIAN 11 — Menghapus Link

Pada link yang ingin dihapus, klik **Hapus**.

Link akan dihapus dari database Supabase.

---

# BAGIAN 12 — Mengatur Sosial Media

Di Admin Panel terdapat bagian **Sosial**.

Isi sesuai kebutuhan:

- Instagram
- TikTok
- YouTube
- Telegram

Kemudian klik:

**Simpan Sosial**

---

# BAGIAN 13 — Melihat Website Publik

Dari Admin Panel klik:

**Lihat Profil ↗**

atau buka domain Vercel kamu.

Halaman publik mengambil data dari Supabase.

---

# 🔐 KEAMANAN

Project ini menggunakan:

- Supabase Authentication untuk login.
- Supabase Row Level Security (RLS) untuk membatasi data.
- `SUPABASE_ANON_KEY` untuk akses browser.
- Environment Variables Vercel untuk menyimpan konfigurasi.

### Jangan lakukan ini

❌ Jangan menaruh `service_role` key di `index.html`.

❌ Jangan menaruh `service_role` key di `admin.js`.

❌ Jangan commit password admin ke GitHub.

❌ Jangan mengirim password admin kepada orang lain.

`SUPABASE_ANON_KEY` memang dapat digunakan oleh aplikasi browser. Keamanan datanya tetap harus ditangani oleh RLS.

---

# 🛠️ TROUBLESHOOTING

## 1. Admin hanya memuat / tidak masuk

Periksa:

1. Apakah `SUPABASE_URL` sudah dibuat di Vercel?
2. Apakah `SUPABASE_ANON_KEY` sudah dibuat di Vercel?
3. Apakah setelah mengubah Environment Variables sudah Redeploy?
4. Apakah akun admin sudah ada di **Supabase → Authentication → Users**?
5. Apakah `supabase/schema.sql` sudah dijalankan?

---

## 2. `/api/config.js` tidak bisa dibuka

Coba buka:

`https://DOMAIN-KAMU.vercel.app/api/config.js`

Jika berhasil, akan terlihat JavaScript yang mengisi:

```js
window.SUPABASE_URL="...";
window.SUPABASE_ANON_KEY="...";
```

Jangan membagikan nilai key lengkap kepada orang lain.

Jika muncul 404/500, periksa deployment Vercel dan file:

`api/config.js`

---

## 3. Login tidak merespons

Periksa:

- Environment Variables Vercel.
- Deployment terbaru.
- Browser console jika tersedia.
- Akun di Supabase Authentication.
- URL dan key Supabase.

Jangan langsung mengubah RLS sebelum mengetahui error sebenarnya.

---

## 4. Login berhasil tetapi data tidak muncul

Periksa apakah `supabase/schema.sql` sudah dijalankan dan RLS masih sesuai dengan schema project.

Periksa juga apakah profile dan link memiliki hubungan `profile_id` yang benar.

---

## 5. Tombol Tambah Link tidak bekerja

Pastikan file yang digunakan adalah versi project terbaru dan `admin.js` ikut di-upload ke GitHub.

Setelah mengganti file, lakukan deployment baru di Vercel.

---

## 6. Website masih memakai versi lama

Kemungkinan browser atau deployment masih menggunakan versi sebelumnya.

Coba:

1. Push perubahan baru ke GitHub.
2. Tunggu Vercel selesai deploy.
3. Buka deployment terbaru.
4. Refresh browser.

---

# 📁 FILE YANG BOLEH DIUBAH

Untuk mengubah tampilan:

`style.css`

Untuk mengubah halaman publik:

`index.html`

Untuk mengubah fungsi halaman publik:

`profile.js`

Untuk mengubah Admin Panel:

`admin.html`

Untuk mengubah fungsi Admin Panel:

`admin.js`

Untuk konfigurasi database:

`supabase/schema.sql`

Untuk routing Vercel:

`vercel.json`

Jangan memasukkan key rahasia ke file frontend.

---

# 🌐 URL YANG DIGUNAKAN

Halaman publik:

`/`

Admin + Login:

`/admin`

URL `/login` diarahkan ke `/admin` karena Login dan Admin sudah digabung.

API konfigurasi:

`/api/config.js`

---

# 📦 CARA MEMBAGIKAN PROJECT

Jika ZIP ini dibagikan kepada orang lain:

1. Mereka harus membuat project Supabase sendiri.
2. Mereka harus menjalankan `supabase/schema.sql`.
3. Mereka harus membuat akun admin sendiri.
4. Mereka harus membuat project Vercel sendiri atau menggunakan repository sendiri.
5. Mereka harus memasukkan `SUPABASE_URL` dan `SUPABASE_ANON_KEY` milik project Supabase mereka sendiri ke Vercel.

**Jangan membagikan password admin atau key rahasia milik project pribadi.**

---

# ✅ CHECKLIST SEBELUM WEBSITE DIGUNAKAN

- [ ] Project Supabase sudah dibuat.
- [ ] `schema.sql` sudah dijalankan.
- [ ] Tabel `profiles`, `links`, `socials` sudah ada.
- [ ] Akun admin sudah dibuat di Authentication → Users.
- [ ] `SUPABASE_URL` sudah dibuat di Vercel.
- [ ] `SUPABASE_ANON_KEY` sudah dibuat di Vercel.
- [ ] Project sudah Redeploy setelah Environment Variables dibuat.
- [ ] `/api/config.js` bisa dibuka.
- [ ] `/admin` bisa dibuka.
- [ ] Login berhasil.
- [ ] Profil dapat disimpan.
- [ ] Link dapat ditambah/disimpan/dihapus.
- [ ] Sosial media dapat disimpan.
- [ ] Halaman publik dapat menampilkan data.

---

## Selesai

Setelah semua langkah di atas selesai, project sudah siap digunakan sebagai website link profile sederhana dengan Supabase sebagai database/authentication dan Vercel sebagai hosting.
