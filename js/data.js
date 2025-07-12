// js/data.js
// Logika pengelolaan data (transaksi, saldo, localStorage)

import * as DOM from './dom.js';
import * as Utils from './utils.js';

export let transactions = [];
export let balance = 0;

export const LOCAL_STORAGE_KEY = 'kakeiboEncryptedData';
export const THEME_KEY = 'kakeiboTheme';
export const PASSWORD_KEY = 'kakeiboEncryptionPassword';

/**
 * Mengupdate tampilan saldo saat ini.
 */
export function updateBalanceDisplay() {
    DOM.balanceDisplay.textContent = `Rp ${balance.toLocaleString('id-ID')}`;
    const targetColor = balance < 0 ? 'var(--light-expense-text)' : 'white';
    gsap.to(DOM.balanceDisplay, { color: targetColor, duration: 0.3 });
}

/**
 * Mengupdate daftar transaksi di UI.
 */
export function renderTransactions() {
    DOM.transactionListDiv.innerHTML = '';
    if (transactions.length === 0) {
        DOM.noTransactionsMessage.classList.remove('hidden');
        return;
    } else {
        DOM.noTransactionsMessage.classList.add('hidden');
    }

    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedTransactions.forEach(transaction => {
        const transactionItem = document.createElement('div');
        transactionItem.className = `transaction-item ${transaction.type === 'income' ? 'transaction-item-income' : 'transaction-item-expense'}`;

        const amountClass = transaction.type === 'income' ? 'transaction-amount-income' : 'transaction-amount-expense';
        const sign = transaction.type === 'income' ? '+' : '-';

        transactionItem.innerHTML = `
            <div>
                <p style="font-weight: 500; color: var(--light-text-primary);">${transaction.description}</p>
                <p style="font-size: 0.75rem; color: var(--light-text-secondary); margin-top: 0.25rem;">${new Date(transaction.date).toLocaleDateString('id-ID')}</p>
            </div>
            <p style="font-weight: 600;" class="${amountClass}">${sign} Rp ${transaction.amount.toLocaleString('id-ID')}</p>
        `;
        DOM.transactionListDiv.prepend(transactionItem); // Tambahkan di awal daftar
        gsap.from(transactionItem, { opacity: 0, y: 20, duration: 0.4, ease: "back.out(1.7)" }); // Animasi masuk
    });
}

/**
 * Menghitung ulang saldo dari daftar transaksi.
 */
export function calculateBalance() {
    balance = transactions.reduce((total, transaction) => {
        if (transaction.type === 'income') {
            return total + transaction.amount;
        } else {
            return total - transaction.amount;
        }
    }, 0);
    updateBalanceDisplay();
}

/**
 * Menyimpan data transaksi ke localStorage setelah dienkripsi.
 */
export function saveToLocalStorage() {
    const password = DOM.modalEncryptionPasswordInput.value; // Ambil password dari input modal
    if (!password) {
        return; // Jangan simpan jika password kosong (tidak ada pesan error di sini)
    }
    try {
        const dataToSave = JSON.stringify(transactions);
        const encryptedData = Utils.encryptData(dataToSave, password);
        localStorage.setItem(LOCAL_STORAGE_KEY, encryptedData);
        localStorage.setItem(PASSWORD_KEY, password); // Simpan password untuk auto-load
    } catch (error) {
        console.error('Gagal menyimpan ke localStorage:', error);
        Utils.showMessage(`Gagal menyimpan ke penyimpanan lokal: ${error.message}`, 'error', DOM.appMessageBox);
    }
}

/**
 * Memuat data transaksi dari localStorage, mendekripsinya, dan memperbarui UI.
 */
export function loadFromLocalStorage() {
    const password = DOM.modalEncryptionPasswordInput.value; // Ambil password dari input modal
    if (!password) {
        Utils.showMessage('Harap masukkan kata sandi enkripsi di Pengaturan untuk memuat data.', 'info', DOM.appMessageBox);
        transactions = [];
        calculateBalance();
        renderTransactions();
        return;
    }

    const encryptedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!encryptedData) {
        Utils.showMessage('Tidak ada data yang tersimpan di penyimpanan lokal. Mulai Kakeibo baru.', 'info', DOM.appMessageBox);
        transactions = [];
        calculateBalance();
        renderTransactions();
        return;
    }

    try {
        const decryptedData = Utils.decryptData(encryptedData, password);
        transactions = JSON.parse(decryptedData);
        calculateBalance();
        renderTransactions();
        Utils.showMessage('Data berhasil dimuat dari penyimpanan lokal! ✅', 'success', DOM.appMessageBox);
    } catch (error) {
        console.error('Gagal memuat dari localStorage:', error);
        Utils.showMessage(`Gagal memuat dari penyimpanan lokal: ${error.message}. Pastikan kata sandi benar. ❌`, 'error', DOM.appMessageBox);
        transactions = []; // Reset transaksi jika gagal
        calculateBalance();
        renderTransactions();
    }
}

/**
 * Menghapus semua data dari localStorage.
 */
export function clearAllLocalData() {
    transactions = [];
    balance = 0;
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(PASSWORD_KEY);
    calculateBalance();
    renderTransactions();
}

