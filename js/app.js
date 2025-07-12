// Main Application
class App {
    static init() {
        UI.init();
    }

    static addTransaction(transaction) {
        const data = StorageManager.loadData();
        
        // Update balance
        if (transaction.type === 'income') {
            data.balance += transaction.amount;
        } else {
            data.balance -= transaction.amount;
        }
        
        // Add transaction
        data.transactions.push(transaction);
        
        // Save data
        StorageManager.saveData(data);
        
        // Update UI
        UI.updateUI();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => App.init());
