// js/theme.js
// Logika pengelolaan tema

import * as DOM from './dom.js';
import * * as Data from './data.js'; // Import Data untuk akses THEME_KEY

/**
 * Mengatur tema aplikasi (terang/gelap) dengan animasi GSAP.
 * @param {string} theme - 'light' atau 'dark'.
 */
export function setTheme(theme) {
    const isDark = theme === 'dark';
    DOM.htmlElement.classList.toggle('dark', isDark);
    localStorage.setItem(Data.THEME_KEY, theme);

    // Update teks tombol tema di modal
    DOM.modalThemeToggleBtn.innerHTML = isDark ? '🌙 Mode Gelap' : '☀️ Mode Terang';

    // Animasi transisi warna menggunakan GSAP
    const rootStyle = getComputedStyle(DOM.htmlElement);
    const duration = 0.5; // Durasi animasi

    // Daftar properti CSS yang akan dianimasikan
    const colorProps = [
        '--light-body-bg', '--light-card-bg', '--light-text-primary', '--light-text-secondary', '--light-border',
        '--light-button-primary-bg', '--light-button-primary-hover', '--light-button-secondary-bg', '--light-button-secondary-hover',
        '--light-income-bg', '--light-expense-bg', '--light-income-text', '--light-expense-text',
        '--light-message-success-bg', '--light-message-success-text', '--light-message-error-bg', '--light-message-error-text',
        '--light-message-info-bg', '--light-message-info-text',
        '--light-clear-button-bg', '--light-clear-button-text', '--light-clear-button-hover'
    ];

    colorProps.forEach(prop => {
        // Dapatkan nilai target dari variabel dark/light yang sesuai
        const targetProp = isDark ? prop.replace('--light-', '--dark-') : prop;
        const endColor = rootStyle.getPropertyValue(targetProp);

        gsap.to(DOM.htmlElement, {
            [prop]: endColor, // Animasi CSS variable
            duration: duration,
            ease: "power2.inOut",
            overwrite: true
        });
    });

    // Update warna teks saldo secara langsung setelah animasi tema
    Data.updateBalanceDisplay();
    // Render ulang transaksi untuk memastikan warna item transaksi diperbarui
    Data.renderTransactions();
}

/**
 * Mengubah tema aplikasi.
 */
export function toggleTheme() {
    const currentTheme = DOM.htmlElement.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

