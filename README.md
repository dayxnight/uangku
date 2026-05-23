# 💰 Uangku - Money Manager

Aplikasi manajemen keuangan personal yang sederhana, cepat, dan elegant berbasis web. Uangku membantu Anda melacak pemasukan dan pengeluaran dengan antarmuka yang intuitif dan responsif. **Sepenuhnya berjalan di sisi klien (browser) tanpa memerlukan backend atau server!**

## ✨ Fitur Utama

- 📊 **Catat Transaksi** - Mudah mencatat pemasukan dan pengeluaran dengan deskripsi
- 💾 **Menyimpan Data Lokal** - Data tersimpan aman di browser Anda menggunakan localStorage
- 🎨 **Mode Tema Gelap/Terang** - Beralih antara tema cerah dan gelap sesuai preferensi
- 📥 **Import/Export Data** - Ekspor data transaksi sebagai JSON dan impor kembali kapan saja
- 📱 **Responsive Design** - Bekerja sempurna di desktop, tablet, dan mobile
- ⚡ **Animasi Smooth** - Animasi fluid menggunakan GSAP untuk pengalaman pengguna yang menyenangkan
- 🚀 **Client-Side Only** - Tidak perlu khawatir tentang privacy, semua data hanya ada di device Anda

## 📁 Struktur Folder

```
uangku/
├── index.html          # File HTML utama aplikasi
├── script.js           # Logika aplikasi (transaksi, tema, animasi)
├── style.css           # Gaya CSS global dan layout
├── theme.css           # Palet warna tema terang (Material Design 3)
├── theme-dark.css      # Palet warna tema gelap (Material Design 3)
└── README.md           # Dokumentasi proyek
```

## 🚀 Cara Menggunakan

### Metode 1: Buka File HTML Langsung
1. Klon atau download repositori:
   ```bash
   git clone https://github.com/dayxnight/uangku.git
   cd uangku
   ```
2. Buka file `index.html` di browser favorit Anda (Chrome, Firefox, Edge, Safari, dll)

### Metode 2: Akses Online
Atau akses aplikasi melalui GitHub Pages:
🔗 **https://tegar-izo.github.io/uangku/**

## 💡 Cara Kerja

### Menambah Transaksi
1. Klik tombol **"masuk"** untuk mencatat pemasukan atau **"keluar"** untuk pengeluaran
2. Isi keterangan transaksi (misal: "Gaji Bulanan", "Beli Makanan")
3. Masukkan jumlah nominal dalam Rupiah
4. Klik **"simpan"** untuk menyimpan transaksi

### Melihat Riwayat
- Riwayat transaksi ditampilkan secara real-time di bawah layar
- **Total saldo** otomatis dihitung dari semua transaksi
- Transaksi ditampilkan dengan ikon, deskripsi, tanggal, dan nominal

### Mengelola Data
- 📤 **Export**: Simpan semua data transaksi Anda ke file JSON
- 📥 **Import**: Muat data dari file JSON sebelumnya
- 🎨 **Tema**: Toggle antara mode terang dan gelap dengan satu klik

## 🛠️ Teknologi

- **HTML5** - Struktur markup semantik
- **CSS3** - Styling modern dengan CSS variables dan Material Design 3
- **JavaScript (ES6+)** - Logika aplikasi yang responsif
- **GSAP** - Animasi smooth dan interaktif
- **Material Symbols** - Icon library dari Google
- **localStorage API** - Penyimpanan data lokal di browser

## 📦 Dependensi

- [GSAP 3.15](https://gsap.com/) - Diunduh dari CDN untuk animasi
- [Google Fonts Material Symbols](https://fonts.google.com/icons) - Icon dari CDN

Semua dependensi dimuat dari CDN, sehingga Anda tidak perlu instalasi tambahan!

## 💾 Penyimpanan Data

Aplikasi ini menggunakan **browser's localStorage** untuk menyimpan data:
- Data disimpan dalam format JSON dengan key `uangku_data`
- Data tetap ada meskipun browser ditutup
- Anda dapat menghapus data dengan membersihkan browser cache
- **Tips keamanan**: Export data Anda secara berkala sebagai backup!

## 🎨 Desain & Tema

Aplikasi menggunakan **Material Design 3** dengan palet warna yang profesional:
- **Tema Terang**: Warna cerah yang nyaman untuk siang hari
- **Tema Gelap**: Warna gelap yang melindungi mata di malam hari

Kedua tema dapat diubah kapan saja melalui menu pengaturan.

## 📝 Catatan

- Aplikasi mendukung semua browser modern (Chrome, Firefox, Edge, Safari)
- Data hanya tersimpan lokal di device Anda - tidak ada koneksi server
- Untuk keamanan maksimal, gunakan fitur export untuk membuat backup reguler

## 📧 Support & Feedback

Jika Anda memiliki saran atau menemukan bug, silakan buat issue di repositori ini!

---

<div align="center">

**Dibuat dengan ❤️ untuk membantu Anda mengelola keuangan dengan lebih baik**

⭐ Jika Anda suka proyek ini, berikan bintang!

</div>
