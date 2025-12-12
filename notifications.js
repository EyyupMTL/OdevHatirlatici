// Bildirim izni alma
function requestNotificationPermission() {
    if (!("Notification" in window)) {
        alert("Bu tarayıcı bildirim desteklemiyor.");
        return;
    }

    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            alert("Bildirimler aktif!");
        } else {
            alert("Bildirim izni verilmedi.");
        }
    });
}

// Service Worker kaydı
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
        .then(() => console.log("Service Worker kayıt başarılı"))
        .catch(err => console.log("Hata:", err));
}
