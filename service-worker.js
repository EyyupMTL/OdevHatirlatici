self.addEventListener("install", e => {
    console.log("Service Worker Yüklendi");
    self.skipWaiting();
});

self.addEventListener("activate", e => {
    console.log("Service Worker Aktif");
});

// Bildirim gönderme fonksiyonu
function showNotification(title, body) {
    self.registration.showNotification(title, {
        body: body,
        icon: "icon-192.png"
    });
}

// Her 30 dakikada bir kontrol eden sistem
setInterval(() => {
    checkAndNotify();
}, 30 * 60 * 1000);

// Bildirim kontrolü
async function checkAndNotify() {
    const data = await caches.open("app-data");
    const exams = JSON.parse(localStorage.getItem("exams") || "[]");
    const homework = JSON.parse(localStorage.getItem("homework") || "[]");

    const now = new Date();

    // Sınav bildirimleri
    exams.forEach(ex => {
        const diff = (new Date(ex.date) - now) / (1000 * 60 * 60 * 24);
        const days = Math.ceil(diff);

        if (days === 3) showNotification("Sınava 3 Gün Kaldı", ex.name + " sınavı yaklaşıyor!");
        if (days === 2) showNotification("Sınava 2 Gün Kaldı", ex.name + " sınavı yaklaşıyor!");
        if (days === 1) showNotification("Yarın Sınavın Var!", ex.name + " sınavını unutma!");
    });

    // Ödev bildirimleri
    homework.forEach(hw => {
        const diff = (new Date(hw.date) - now) / (1000 * 60 * 60 * 24);
        const days = Math.ceil(diff);

        if (days === 1) showNotification("Ödev Yarına!", hw.name + " ödevinin son tarihi yarın.");
    });
}
