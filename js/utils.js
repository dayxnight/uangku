// js/utils.js
// Fungsi utilitas umum (enkripsi, dekripsi, pesan)

/**
 * Menampilkan pesan di kotak pesan UI dengan animasi GSAP.
 * @param {string} message - Pesan yang akan ditampilkan.
 * @param {string} type - Tipe pesan ('success', 'error', 'info').
 * @param {HTMLElement} boxElement - Elemen kotak pesan yang akan digunakan.
 */
export function showMessage(message, type, boxElement) {
    boxElement.textContent = message;
    boxElement.classList.remove('hidden', 'success', 'error', 'info');
    boxElement.classList.add(type);

    gsap.fromTo(boxElement, { opacity: 0, y: 10, display: 'none' }, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
        display: 'block',
        onComplete: () => {
            gsap.to(boxElement, {
                opacity: 0,
                y: 10,
                duration: 0.3,
                delay: 4.5, // Tahan selama 4.5 detik sebelum fade out
                ease: "power2.in",
                onComplete: () => {
                    boxElement.classList.add('hidden');
                    boxElement.style.display = 'none'; // Pastikan display diset none setelah fade out
                }
            });
        }
    });
}

/**
 * Mengenkripsi data menggunakan AES.
 * @param {string} data - String data yang akan dienkripsi.
 * @param {string} password - Kata sandi untuk enkripsi.
 * @returns {string} Data terenkripsi dalam format string.
 */
export function encryptData(data, password) {
    if (!password) {
        throw new Error("Kata sandi enkripsi tidak boleh kosong.");
    }
    return CryptoJS.AES.encrypt(data, password).toString();
}

/**
 * Mendekripsi data menggunakan AES.
 * @param {string} encryptedData - String data terenkripsi.
 * @param {string} password - Kata sandi untuk dekripsi.
 * @returns {string} Data terdekripsi dalam format string.
 */
export function decryptData(encryptedData, password) {
    if (!password) {
        throw new Error("Kata sandi dekripsi tidak boleh kosong.");
    }
    const bytes = CryptoJS.AES.decrypt(encryptedData, password);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedText) {
        throw new Error("Dekripsi gagal. Kata sandi salah atau data rusak.");
    }
    return decryptedText;
}

