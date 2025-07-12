// js/app.js
// Logika aplikasi utama dan event listener

import * as DOM from './dom.js';
import * as Data from './data.js';
import * as Utils from './utils.js';
import * as Theme from './theme.js';
import * as Modal from './modal.js';

/**
 * Menambahkan transaksi baru (pemasukan atau pengeluaran).
 * @param {string} type - Tipe transaksi ('income' atau 'expense').
 */
function addTransaction(type) {
    const description = DOM.descriptionInput.value.trim();
    const amount = parseFloat(DOM.amountInput.value);

    if (!description || isNaN(amount) || amount <= 0) {
        Utils.showMessage('Harap isi deskripsi dan jumlah yang valid. 🚫', 'error', DOM.appMessageBox);
        return;
    }

    const newTransaction = {
        id: Date.now(), // ID unik sederhana
        description,
        amount,
        type,
        date: new Date().toISOString()
    };

    Data.transactions.push(newTransaction);
    Data.calculateBalance();
    Data.renderTransactions();
    Data.saveToLocalStorage(); // Simpan otomatis setelah menambah transaksi

    // Bersihkan formulir
    DOM.descriptionInput.value = '';
    DOM.amountInput.value = '';
    Utils.showMessage(`Transaksi ${type === 'income' ? 'pemasukan' : 'pengeluaran'} berhasil ditambahkan! 🎉`, 'success', DOM.appMessageBox);
}

// --- Event Listeners Utama ---
DOM.addIncomeBtn.addEventListener('click', () => addTransaction('income'));
DOM.addExpenseBtn.addEventListener('click', () => addTransaction('expense'));

// --- Inisialisasi Aplikasi ---
document.addEventListener('DOMContentLoaded', () => {
    // Animasi awal untuk app-screen
    gsap.from(DOM.appScreen, { opacity: 0, y: 50, duration: 0.8, ease: "power3.out" });

    // Muat tema yang tersimpan atau atur default ke terang
    const savedTheme = localStorage.getItem(Data.THEME_KEY) || 'light';
    Theme.setTheme(savedTheme);

    // Coba muat password yang tersimpan untuk kenyamanan
    const savedPassword = localStorage.getItem(Data.PASSWORD_KEY);
    if (savedPassword) {
        DOM.modalEncryptionPasswordInput.value = savedPassword; // Set password di input modal
        Data.loadFromLocalStorage(); // Coba muat data dengan password yang tersimpan
    } else {
        Utils.showMessage('Selamat datang! Masukkan kata sandi enkripsi Anda di Pengaturan untuk memuat atau menyimpan data. 🔑', 'info', DOM.appMessageBox);
        // Jika tidak ada password, tampilkan data kosong
        Data.transactions = [];
        Data.calculateBalance();
        Data.renderTransactions();
    }
});

