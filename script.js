// Inisialisasi Lucide
lucide.createIcons();

const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const fileStatus = document.getElementById('fileStatus');
const upscaleBtn = document.getElementById('upscaleBtn');
const mainPreview = document.getElementById('mainPreview');
const placeholder = document.getElementById('placeholder');
const loadingOverlay = document.getElementById('loadingOverlay');
const downloadBtn = document.getElementById('downloadBtn');

// Handle Click & Drag-Drop
dropZone.onclick = () => fileInput.click();

fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImage(file);
    }
};

function handleImage(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        mainPreview.src = event.target.result;
        mainPreview.classList.remove('hidden');
        placeholder.classList.add('hidden');
        fileStatus.innerText = `File: ${file.name}`;
        fileStatus.classList.add('text-accent');
    };
    reader.readAsDataURL(file);
}

// Logic Upscale (Simulasi)
upscaleBtn.onclick = async () => {
    if (!fileInput.files[0]) {
        alert("Pilih gambar dulu bos!");
        return;
    }

    // Tampilkan Loading
    loadingOverlay.classList.remove('hidden');
    upscaleBtn.disabled = true;
    upscaleBtn.innerText = "PROCESSING...";

    // Simulasi delay AI (3 detik)
    setTimeout(() => {
        loadingOverlay.classList.add('hidden');
        upscaleBtn.disabled = false;
        upscaleBtn.innerText = "GENERATE IMAGE";
        
        // Munculkan tombol download
        downloadBtn.classList.remove('hidden');
        downloadBtn.href = mainPreview.src;
        downloadBtn.download = "HidzScale_Enhanced.png";
        
        // Efek Flash saat selesai
        mainPreview.style.filter = "brightness(1.5)";
        setTimeout(() => mainPreview.style.filter = "brightness(1)", 300);
    }, 3000);
};

// Theme Toggle Logic
const themeToggle = document.getElementById('themeToggle');
const themeText = document.getElementById('themeText');

themeToggle.onclick = () => {
    const isDark = document.body.classList.toggle('light-mode');
    themeText.innerText = isDark ? '🌙 GELAP' : '☀️ TERANG';
    document.body.style.backgroundColor = isDark ? '#f8fafc' : '#05070a';
};
