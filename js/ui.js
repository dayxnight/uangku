// UI Components
class UI {
    static init() {
        this.setupEventListeners();
        this.loadTheme();
        this.updateGreeting();
        this.updateUI();
    }

    static setupEventListeners() {
        // Transaction buttons
        document.getElementById('add-income').addEventListener('click', () => this.showTransactionModal('income'));
        document.getElementById('add-expense').addEventListener('click', () => this.showTransactionModal('expense'));
        
        // Modal buttons
        document.getElementById('transaction-form').addEventListener('submit', this.handleTransactionSubmit.bind(this));
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', this.closeAllModals.bind(this));
        });
        
        // Settings
        document.getElementById('settings-btn').addEventListener('click', () => this.showModal('settings-modal'));
        document.getElementById('theme-toggle').addEventListener('change', this.toggleTheme.bind(this));
        document.getElementById('backup-btn').addEventListener('click', () => this.showModal('backup-modal'));
        document.getElementById('restore-btn').addEventListener('click', () => document.getElementById('restore-file').click());
        document.getElementById('restore-file').addEventListener('change', this.handleFileUpload.bind(this));
        document.getElementById('reset-btn').addEventListener('click', this.showResetConfirmation.bind(this));
        
        // Backup modal
        document.getElementById('generate-backup').addEventListener('click', this.generateBackup.bind(this));
        document.getElementById('copy-backup').addEventListener('click', this.copyBackupToClipboard.bind(this));
        
        // Restore modal
        document.getElementById('confirm-restore').addEventListener('click', this.restoreData.bind(this));
        
        // Confirmation modal
        document.getElementById('confirm-cancel').addEventListener('click', this.closeAllModals.bind(this));
        document.getElementById('confirm-ok').addEventListener('click', this.resetData.bind(this));
    }

    static showModal(modalId) {
        this.closeAllModals();
        const modal = document.getElementById(modalId);
        modal.style.display = 'flex';
        Utils.animateElement(modal.querySelector('.modal-content'), 'slideUp');
    }

    static closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    static showTransactionModal(type) {
        this.transactionType = type;
        const modal = document.getElementById('transaction-modal');
        document.getElementById('modal-title').textContent = type === 'income' ? 'Tambah Pemasukan' : 'Tambah Pengeluaran';
        document.getElementById('date').value = new Date().toISOString().split('T')[0];
        this.showModal('transaction-modal');
    }

    static handleTransactionSubmit(e) {
        e.preventDefault();
        
        const amount = parseFloat(document.getElementById('amount').value);
        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value;
        
        if (!amount || !description || !date) return;
        
        const transaction = {
            id: Date.now(),
            type: this.transactionType,
            amount,
            description,
            date,
            createdAt: new Date().toISOString()
        };
        
        App.addTransaction(transaction);
        this.closeAllModals();
        document.getElementById('transaction-form').reset();
    }

    static updateUI() {
        const { balance, transactions } = StorageManager.loadData();
        
        // Update balance
        document.getElementById('balance').textContent = Utils.formatCurrency(balance);
        
        // Update history
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';
        
        if (transactions.length === 0) {
            historyList.innerHTML = '<p>Tidak ada transaksi</p>';
            return;
        }
        
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(transaction => {
            const item = document.createElement('div');
            item.className = 'history-item gsap-slide-up';
            
            item.innerHTML = `
                <div class="history-description">${transaction.description}</div>
                <div class="history-date">${Utils.formatDate(transaction.date)}</div>
                <div class="history-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'} ${Utils.formatCurrency(transaction.amount)}
                </div>
            `;
            
            historyList.appendChild(item);
            Utils.animateElement(item, 'slideUp');
        });
    }

    static updateGreeting() {
        const greeting = Utils.getGreeting();
        document.getElementById('greeting').textContent = `${greeting}, Pengguna!`;
    }

    static loadTheme() {
        const theme = StorageManager.loadTheme();
        document.documentElement.setAttribute('data-theme', theme);
        document.getElementById('theme-toggle').checked = theme === 'dark';
    }

    static toggleTheme() {
        const theme = document.getElementById('theme-toggle').checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        StorageManager.saveTheme(theme);
    }

    static showResetConfirmation() {
        this.closeAllModals();
        document.getElementById('confirm-message').textContent = 'Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.';
        this.showModal('confirm-modal');
    }

    static resetData() {
        StorageManager.clearData();
        this.closeAllModals();
        this.updateUI();
    }

    static generateBackup() {
        const password = document.getElementById('backup-password').value;
        const confirmPassword = document.getElementById('backup-password-confirm').value;
        
        if (!password || password !== confirmPassword) {
            alert('Password tidak cocok atau kosong');
            return;
        }
        
        const data = StorageManager.loadData();
        const encryptedData = Utils.encryptData(data, password);
        
        if (encryptedData) {
            document.getElementById('backup-data').value = encryptedData;
            document.getElementById('backup-result').classList.remove('hidden');
        }
    }

    static copyBackupToClipboard() {
        const backupData = document.getElementById('backup-data');
        backupData.select();
        document.execCommand('copy');
        alert('Backup data telah disalin ke clipboard');
    }

    static handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            document.getElementById('restore-data').value = event.target.result;
            this.showModal('restore-modal');
        };
        reader.readAsText(file);
    }

    static restoreData() {
        const password = document.getElementById('restore-password').value;
        const encryptedData = document.getElementById('restore-data').value;
        
        if (!password || !encryptedData) {
            alert('Password dan data backup harus diisi');
            return;
        }
        
        const data = Utils.decryptData(encryptedData, password);
        
        if (data) {
            StorageManager.saveData(data);
            this.closeAllModals();
            this.updateUI();
            alert('Data berhasil dipulihkan');
        } else {
            alert('Gagal memulihkan data. Password mungkin salah atau data corrupt.');
        }
    }
}
