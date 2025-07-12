// js/modal.js
// Logika pengelolaan modal pengaturan

import * as DOM from './dom.js';
import * as Utils from './utils.js';
import * as Data from './data.js';
import * as Theme from './theme.js';

// --- Event Listeners untuk Modal Pengaturan ---

DOM.settingsToggleBtn.addEventListener('click', () => {
    gsap.to(DOM.settingsModalOverlay, { opacity: 1, visibility: 'visible', duration: 0.3 });
    gsap.fromTo(DOM.settingsModalContent, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" });

    // Sinkronkan password input di modal dengan yang tersimpan
    DOM.modalEncryptionPasswordInput.value = localStorage.getItem(Data.PASSWORD_KEY) || '';
    // Sinkronkan ikon tema
    const currentTheme = DOM.htmlElement.classList.contains('dark') ? 'dark' : 'light';
    Theme.setTheme(currentTheme); // Panggil setTheme untuk mengupdate teks tombol modal
});

DOM.closeSettingsModalBtn.addEventListener('click', () => {
    gsap.to(DOM.settingsModalContent, { y: -20, opacity: 0, duration: 0.3, ease: "power2.in", onComplete: () => {
        gsap.to(DOM.settingsModalOverlay, { opacity: 0, visibility: 'hidden', duration: 0.3 });
    }});
    Utils.showMessage('', 'info', DOM.modalMessageBox); // Bersihkan pesan di modal saat ditutup
});

// Tutup modal jika klik di luar konten
DOM.settingsModalOverlay.addEventListener('click', (event) => {
    if (event.target === DOM.settingsModalOverlay) {
        gsap.to(DOM.settingsModalContent, { y: -20, opacity: 0, duration: 0.3, ease: "power2.in", onComplete: () => {
            gsap.to(DOM.settingsModalOverlay, { opacity: 0, visibility: 'hidden', duration: 0.3 });
        }});
        Utils.showMessage('', 'info', DOM.modalMessageBox); // Bersihkan pesan di modal saat ditutup
    }
});

// Pengalih tema di dalam modal
DOM.modalThemeToggleBtn.addEventListener('click', Theme.toggleTheme);

// Backup Data (ZIP) dari modal
DOM.modalBackupDataBtn.addEventListener('click', async () => {
    const password = DOM.modalEncryptionPasswordInput.value;
    if (!password) {
        Utils.showMessage('Harap masukkan kata sandi enkripsi untuk backup data. 🔒', 'error', DOM.modalMessageBox);
        return;
    }

    Utils.showMessage('Membuat file backup ZIP... ⏳', 'info', DOM.modalMessageBox);
    try {
        const dataToBackup = JSON.stringify(Data.transactions);
        const encryptedData = Utils.encryptData(dataToBackup, password);

        const zip = new JSZip();
        zip.file("kakeibo_data.txt", encryptedData);

        const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 9 } });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kakeibo_backup_${new Date().toISOString().slice(0,10)}.zip`; // Nama file ZIP
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Membersihkan URL objek
        Utils.showMessage('Data berhasil di-backup sebagai file ZIP terenkripsi! ✅', 'success', DOM.modalMessageBox);
        Data.saveToLocalStorage(); // Pastikan password terbaru tersimpan
    } catch (error) {
        console.error('Gagal backup data:', error);
        Utils.showMessage(`Gagal backup data: ${error.message} ❌`, 'error', DOM.modalMessageBox);
    }
});

// Restore Data (ZIP) dari modal
DOM.modalRestoreFileInput.addEventListener('change', async (event) => {
    const password = DOM.modalEncryptionPasswordInput.value;
    if (!password) {
        Utils.showMessage('Harap masukkan kata sandi enkripsi untuk restore data. 🔒', 'error', DOM.modalMessageBox);
        event.target.value = ''; // Bersihkan input file
        return;
    }

    const file = event.target.files[0];
    if (!file) {
        return;
    }

    Utils.showMessage('Memuat dan mendekripsi file ZIP... ⏳', 'info', DOM.modalMessageBox);
    try {
        const zip = await JSZip.loadAsync(file);
        const dataFile = zip.file("kakeibo_data.txt"); // Nama file di dalam ZIP

        if (!dataFile) {
            throw new Error("File 'kakeibo_data.txt' tidak ditemukan di dalam ZIP. Pastikan ini adalah file backup Kakeibo yang valid.");
        }

        const encryptedData = await dataFile.async("text");
        const decryptedData = Utils.decryptData(encryptedData, password);
        const loadedTransactions = JSON.parse(decryptedData);

        // Validasi sederhana: pastikan data yang dimuat adalah array
        if (!Array.isArray(loadedTransactions)) {
            throw new Error("Format data di dalam file backup tidak valid.");
        }

        // Hapus data lama dari localStorage sebelum menyimpan yang baru
        Data.clearAllLocalData(); // Menggunakan fungsi modular
        Data.transactions = loadedTransactions; // Assign kembali data yang dimuat
        Data.calculateBalance();
        Data.renderTransactions();
        Data.saveToLocalStorage(); // Simpan data yang direstore ke localStorage
        Utils.showMessage('Data berhasil di-restore dari file ZIP! ✨', 'success', DOM.modalMessageBox);
        Utils.showMessage('Data Kakeibo Anda telah diperbarui. 🔄', 'info', DOM.appMessageBox);
    } catch (error) {
        console.error('Gagal restore data:', error);
        Utils.showMessage(`Gagal restore data: ${error.message} 🚫. Pastikan file ZIP benar dan kata sandi cocok.`, 'error', DOM.modalMessageBox);
    } finally {
        event.target.value = ''; // Bersihkan input file setelah operasi selesai
    }
});

// Hapus Data Lokal dari modal (dengan konfirmasi)
DOM.modalClearLocalDataBtn.addEventListener('click', () => {
    // Menggunakan confirm() karena ini adalah tindakan destruktif dan diminta oleh user
    const confirmDelete = confirm('Anda yakin ingin menghapus SEMUA data transaksi lokal dari browser ini? Tindakan ini TIDAK dapat dibatalkan tanpa backup ZIP!');
    if (confirmDelete) {
        Data.clearAllLocalData(); // Menggunakan fungsi modular
        Utils.showMessage('Semua data lokal telah dihapus. 🗑️', 'info', DOM.modalMessageBox);
        Utils.showMessage('Data Kakeibo Anda telah dihapus dari browser ini. ✨', 'info', DOM.appMessageBox);
        DOM.modalEncryptionPasswordInput.value = ''; // Bersihkan input kata sandi di modal
    } else {
        Utils.showMessage('Penghapusan data dibatalkan. ↩️', 'info', DOM.modalMessageBox);
    }
});
          
