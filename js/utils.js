// Utility functions
class Utils {
    static formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }

    static formatDate(dateString) {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    }

    static getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Selamat Pagi';
        if (hour < 15) return 'Selamat Siang';
        if (hour < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    }

    static encryptData(data, password) {
        try {
            return CryptoJS.AES.encrypt(JSON.stringify(data), password).toString();
        } catch (error) {
            console.error('Encryption error:', error);
            return null;
        }
    }

    static decryptData(ciphertext, password) {
        try {
            const bytes = CryptoJS.AES.decrypt(ciphertext, password);
            return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        } catch (error) {
            console.error('Decryption error:', error);
            return null;
        }
    }

    static animateElement(element, animationType) {
        gsap.from(element, {
            duration: 0.5,
            opacity: 0,
            y: animationType === 'slideUp' ? 20 : (animationType === 'slideDown' ? -20 : 0),
            ease: 'power2.out'
        });
    }
}
