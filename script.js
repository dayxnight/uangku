// --- Data & State ---
let transactions = JSON.parse(localStorage.getItem("uangku_data")) || [];
let currentType = "masuk";

// --- Elemen DOM ---
const themeLink = document.getElementById("theme-link");
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const themeText = document.getElementById("theme-text");

const popupOverlay = document.getElementById("popup-overlay");
const menuOverlay = document.getElementById("menu-overlay");
const modalHeader = document.getElementById("modal-header");
const historyList = document.getElementById("history-list");
const sisaSaldo = document.getElementById("sisa-saldo");

// --- LOGIKA TEMA (BARU) ---

// 1. Fungsi untuk set tema
function applyTheme(theme) {
    if (theme === "dark") {
        themeLink.setAttribute("href", "theme-dark.css");
        themeIcon.innerText = "light_mode"; // Ikon berubah jadi matahari saat gelap
        themeText.innerText = "Mode Terang";
    } else {
        themeLink.setAttribute("href", "theme.css");
        themeIcon.innerText = "dark_mode"; // Ikon berubah jadi bulan saat terang
        themeText.innerText = "Mode Gelap";
    }
    localStorage.setItem("selected_theme", theme);
}

// 2. Cek tema saat aplikasi pertama dimuat
const savedTheme = localStorage.getItem("selected_theme") || "light";
applyTheme(savedTheme);

// 3. Event Listener Klik Tombol Tema
themeToggle.addEventListener("click", () => {
    const currentTheme = localStorage.getItem("selected_theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    applyTheme(newTheme);
    closeOverlay(menuOverlay, ".menu-window"); // Menutup dengan animasi GSAP
});


// --- LOGIKA ANIMASI GSAP (Helper Functions) ---

// Fungsi untuk membuka overlay
function openOverlay(overlay, contentSelector) {
    const content = overlay.querySelector(contentSelector);
    
    // Siapkan kondisi awal (gaib)
    overlay.style.display = "flex";
    gsap.set(overlay, { opacity: 0 });
    gsap.set(content, { scale: 0.8, y: 30, opacity: 0 });

    // Jalankan animasi masuk
    gsap.to(overlay, { opacity: 1, duration: 0.3 });
    gsap.to(content, { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        duration: 0.5, 
        ease: "back.out(1.7)" 
    });
}

// Fungsi untuk menutup overlay
function closeOverlay(overlay, contentSelector) {
    const content = overlay.querySelector(contentSelector);

    // Jalankan animasi keluar
    gsap.to(content, { 
        opacity: 0, 
        scale: 0.8, 
        y: 30, 
        duration: 0.3, 
        ease: "power2.in" 
    });
    
    gsap.to(overlay, { 
        opacity: 0, 
        duration: 0.3, 
        onComplete: () => {
            overlay.style.display = "none"; // Baru di-hide setelah animasi selesai
        }
    });
}


// --- LOGIKA TRANSAKSI ---

function showPopUp(type) {
    currentType = type;
    // Buka dengan animasi GSAP
    openOverlay(popupOverlay, ".modal");
    
    modalHeader.innerText =
        type === "masuk" ? "Tambah Pemasukan" : "Catat Pengeluaran";
    document.getElementById("input-value").value = "";
    document.getElementById("input-desc").value = "";
}

document
    .getElementById("masuk")
    .addEventListener("click", () => showPopUp("masuk"));
document
    .getElementById("keluar")
    .addEventListener("click", () => showPopUp("keluar"));
document
    .getElementById("setting")
    .addEventListener("click", () => openOverlay(menuOverlay, ".menu-window"));

// Menutup overlay saat klik area luar
popupOverlay.addEventListener("click", e => {
    if (e.target === popupOverlay) closeOverlay(popupOverlay, ".modal");
});

menuOverlay.addEventListener("click", e => {
    if (e.target === menuOverlay) closeOverlay(menuOverlay, ".menu-window");
});

document.getElementById("save-value").addEventListener("click", () => {
    const value = parseInt(document.getElementById("input-value").value);
    const desc =
        document.getElementById("input-desc").value || "Tanpa keterangan";

    if (!value || value <= 0) return alert("Masukkan jumlah yang valid!");

    const newTransaction = {
        id: Date.now(),
        type: currentType,
        amount: value,
        description: desc,
        date: new Date().toLocaleDateString()
    };

    transactions.unshift(newTransaction);
    saveAndRender();
    // Tutup dengan animasi GSAP
    closeOverlay(popupOverlay, ".modal");
});

function saveAndRender() {
    localStorage.setItem("uangku_data", JSON.stringify(transactions));
    let total = 0;
    historyList.innerHTML = "";

    transactions.forEach(item => {
        if (item.type === "masuk") total += item.amount;
        else total -= item.amount;

        const html = `
            <div class="history-item ${item.type}">
                <div class="history-icon">
                    <span class="material-symbols-rounded">${item.type === "masuk" ? "arrow_circle_down" : "arrow_circle_up"}</span>
                </div>
                <div class="keterangan">
                    <p>${item.description}</p>
                    <small>${item.date}</small>
                </div>
                <span class="history-value">${item.type === "masuk" ? "+" : "-"}${item.amount.toLocaleString()}</span>
            </div>
        `;
        historyList.innerHTML += html;
    });

    sisaSaldo.innerText = `Rp ${total.toLocaleString()}`;
}


// --- LOGIKA EXPORT & IMPORT ---

// 1. Mengambil elemen tombol dari HTML
const exportBtn = document.querySelector(".menu-button.export");
const importBtn = document.querySelector(".menu-button.import");

// 2. Logika untuk EXPORT (Mengunduh Data)
exportBtn.addEventListener("click", () => {
    const dataStr = JSON.stringify(transactions);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "uangku_data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Tutup dengan animasi GSAP
    closeOverlay(menuOverlay, ".menu-window");
    alert("Data berhasil diekspor!");
});


// --- LOGIKA IMPORT (VERSI STABIL MOBILE) ---

const fileInputHidden = document.getElementById("file-input-hidden");

function processFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        try {
            const importedData = JSON.parse(e.target.result);
            if (Array.isArray(importedData)) {
                transactions = importedData;
                saveAndRender();
                alert("Data berhasil diimpor! ✅");
            } else {
                alert("Format file tidak didukung.");
            }
        } catch (err) {
            alert("File rusak atau bukan format JSON.");
        }
        fileInputHidden.value = "";
    };
    reader.readAsText(file);
}

fileInputHidden.addEventListener("change", processFile);

importBtn.addEventListener("click", () => {
    console.log("Membuka file picker...");
    
    // Tutup menu dengan animasi dulu
    closeOverlay(menuOverlay, ".menu-window");

    // Klik input "gaib"
    fileInputHidden.click();
});

// Jalankan fungsi render pertama kali
saveAndRender();
