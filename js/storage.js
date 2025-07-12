// Storage management
class StorageManager {
    static STORAGE_KEY = 'moneyManagerData';
    static THEME_KEY = 'moneyManagerTheme';

    static saveData(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }

    static loadData() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : { transactions: [], balance: 0 };
    }

    static saveTheme(theme) {
        localStorage.setItem(this.THEME_KEY, theme);
    }

    static loadTheme() {
        return localStorage.getItem(this.THEME_KEY) || 'light';
    }

    static clearData() {
        localStorage.removeItem(this.STORAGE_KEY);
        return { transactions: [], balance: 0 };
    }
}
