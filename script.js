/* ───────────────────────────────────────────────
   LOCAL STORAGE YARDIMCI FONKSİYONLAR
─────────────────────────────────────────────── */

function getData(key) {
    return JSON.parse(localStorage.getItem(key) || "[]");
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

/* ───────────────────────────────────────────────
   ÖDEVLER MODÜLÜ
─────────────────────────────────────────────── */

function addHomework() {
    const name = document.getElementById("hwName").value;
    const desc = document.getElementById("hwDesc").value;
    const date = document.getElementById("hwDate").value;

    const list = getData("homework");
    list.push({ name, desc, date });
    saveData("homework", list);

    alert("Ödev kaydedildi!");
    location.reload();
}

function loadHomeworkList() {
    const list = getData("homework");
    const ul = document.getElementById("hwList");

    list.forEach((hw, i) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${hw.name}</strong><br>
            Son Tarih: ${hw.date}<br>
            <em>${hw.desc}</em><br>
            <button onclick="deleteHomework(${i})">Sil</button>
        `;
        ul.appendChild(li);
    });
}

function deleteHomework(i) {
    const list = getData("homework");
    list.splice(i, 1);
    saveData("homework", list);
    location.reload();
}

/* ───────────────────────────────────────────────
   SINAVLAR MODÜLÜ
─────────────────────────────────────────────── */

function addExam() {
    const name = document.getElementById("examName").value;
    const date = document.getElementById("examDate").value;

    const list = getData("exams");
    list.push({ name, date });
    saveData("exams", list);

    alert("Sınav kaydedildi!");
    location.reload();
}

function loadExamList() {
    const list = getData("exams");
    const ul = document.getElementById("examList");

    list.forEach((ex, i) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${ex.name}</strong><br>
            Tarih: ${ex.date}<br>
            <button onclick="deleteExam(${i})">Sil</button>
        `;
        ul.appendChild(li);
    });
}

function deleteExam(i) {
    const list = getData("exams");
    list.splice(i, 1);
    saveData("exams", list);
    location.reload();
}

/* Sınav yaklaşıyor mu? (1–2–3 gün uyarısı) */
function examReminder() {
    const list = getData("exams");
    const now = new Date();

    list.forEach(exam => {
        const diff = (new Date(exam.date) - now) / (1000 * 60 * 60 * 24);
        const days = Math.ceil(diff);

        if (days === 3) alert(`${exam.name} sınavına 3 gün kaldı!`);
        if (days === 2) alert(`${exam.name} sınavına 2 gün kaldı!`);
        if (days === 1) alert(`${exam.name} sınavı YARIN!`);
    });
}

/* ───────────────────────────────────────────────
   DERS PROGRAMI MODÜLÜ
─────────────────────────────────────────────── */

function addSchedule() {
    const day = document.getElementById("day").value;
    const lesson = document.getElementById("lesson").value;

    const list = getData("schedule");
    list.push({ day, lesson });
    saveData("schedule", list);

    alert("Ders eklendi!");
    location.reload();
}

function loadScheduleList() {
    const list = getData("schedule");
    const ul = document.getElementById("scheduleList");

    list.forEach((c, i) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${c.day}</strong>: ${c.lesson}
            <button onclick="deleteSchedule(${i})">Sil</button>
        `;
        ul.appendChild(li);
    });
}

function deleteSchedule(i) {
    const list = getData("schedule");
    list.splice(i, 1);
    saveData("schedule", list);
    location.reload();
}

/* ───────────────────────────────────────────────
   NOTLAR MODÜLÜ
─────────────────────────────────────────────── */

function addGrade() {
    const lesson = document.getElementById("gradeLesson").value;
    const value = parseInt(document.getElementById("gradeValue").value);

    const list = getData("grades");
    list.push({ lesson, value });
    saveData("grades", list);

    alert("Not kaydedildi!");
    location.reload();
}

function loadGrades() {
    const list = getData("grades");
    const ul = document.getElementById("gradeList");
    let total = 0;

    list.forEach(g => {
        const li = document.createElement("li");
        li.innerHTML = `${g.lesson}: <strong>${g.value}</strong>`;
        ul.appendChild(li);
        total += g.value;
    });

    if (list.length > 0) {
        document.getElementById("avg").innerText = (total / list.length).toFixed(2);
    }
}

/* ───────────────────────────────────────────────
   DASHBOARD (ANA SAYFA ÖZET)
─────────────────────────────────────────────── */

function loadDashboard() {
    const d = document.getElementById("dashboard");
    const hw = getData("homework");
    const ex = getData("exams");
    const sch = getData("schedule");
    const grades = getData("grades");

    let nextHw = "Yok";
    let nextExam = "Yok";

    if (hw.length > 0) {
        hw.sort((a, b) => new Date(a.date) - new Date(b.date));
        nextHw = `${hw[0].name} - ${hw[0].date}`;
    }

    if (ex.length > 0) {
        ex.sort((a, b) => new Date(a.date) - new Date(b.date));
        nextExam = `${ex[0].name} - ${ex[0].date}`;
    }

    // Bugün hangi ders var?
    let todayLesson = "Yok";
    const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
    const today = days[new Date().getDay()];

    sch.forEach(c => {
        if (c.day === today) todayLesson = c.lesson;
    });

    // Ortalama
    let avg = "0";
    if (grades.length > 0) {
        let total = grades.reduce((a, b) => a + b.value, 0);
        avg = (total / grades.length).toFixed(2);
    }

    // Dashboard yazdır
    d.innerHTML = `
        <p><strong>Yaklaşan Ödev:</strong> ${nextHw}</p>
        <p><strong>Yaklaşan Sınav:</strong> ${nextExam}</p>
        <p><strong>Bugünkü Ders:</strong> ${todayLesson}</p>
        <p><strong>Ortalama:</strong> ${avg}</p>
    `;
}

/* ───────────────────────────────────────────────
   SAYFA ALGILAMA & OTO ÇALIŞMA
─────────────────────────────────────────────── */

document.addEventListener("DOMContentLoaded", () => {

    const page = window.location.pathname;

    if (page.includes("odevler")) {
        document.getElementById("addHomeworkForm").onsubmit = (e) => {
            e.preventDefault();
            addHomework();
        };
        loadHomeworkList();
    }

    if (page.includes("sinavlar")) {
        document.getElementById("addExamForm").onsubmit = (e) => {
            e.preventDefault();
            addExam();
        };
        loadExamList();
        examReminder();
    }

    if (page.includes("dersProgrami")) {
        document.getElementById("scheduleForm").onsubmit = (e) => {
            e.preventDefault();
            addSchedule();
        };
        loadScheduleList();
    }

    if (page.includes("notlar")) {
        document.getElementById("gradeForm").onsubmit = (e) => {
            e.preventDefault();
            addGrade();
        };
        loadGrades();
    }

    if (page.includes("index")) {
        loadDashboard();
        examReminder();
    }
});
/* ───────────── DASHBOARD ANALİTİK SİSTEM ───────────── */

function loadDashboard() {
    const hw = getData("homework");
    const ex = getData("exams");
    const sch = getData("schedule");
    const grades = getData("grades");

    /* -------------------- Yaklaşan Ödev -------------------- */
    let nextHw = "Yok";
    if (hw.length > 0) {
        hw.sort((a, b) => new Date(a.date) - new Date(b.date));
        nextHw = `${hw[0].name} (${hw[0].date})`;
    }
    document.getElementById("dashboardHw").innerText = nextHw;

    /* -------------------- Yaklaşan Sınav -------------------- */
    let nextExam = "Yok";
    if (ex.length > 0) {
        ex.sort((a, b) => new Date(a.date) - new Date(b.date));
        nextExam = `${ex[0].name} (${ex[0].date})`;
    }
    document.getElementById("dashboardEx").innerText = nextExam;

    /* -------------------- Bugünkü Ders -------------------- */
    let todayLesson = "Yok";
    const days = ["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"];
    const today = days[new Date().getDay()];

    sch.forEach(s => { if (s.day === today) todayLesson = s.lesson; });

    document.getElementById("dashboardLesson").innerText = todayLesson;

    /* -------------------- Ortalama -------------------- */
    let avg = 0;
    if (grades.length > 0) {
        avg = grades.reduce((a, b) => a + b.value, 0) / grades.length;
    }
    document.getElementById("dashboardAvg").innerText = avg.toFixed(2);

    /* ───────────────────────────────
       📊 PİE CHART (Ödev/Sınav durumu)
       Pie Chart veri hesaplama
    ─────────────────────────────── */
    const pieData = {
        labels: ["Toplam Ödev", "Toplam Sınav"],
        datasets: [{
            data: [hw.length, ex.length],
            backgroundColor: ["#007bff", "#ff4560"]
        }]
    };

    new Chart(document.getElementById("pieChart"), {
        type: 'pie',
        data: pieData
    });

    /* ───────────────────────────────
       📈 LİNE CHART – Not Trend
    ─────────────────────────────── */
    const lineData = {
        labels: grades.map(g => g.lesson),
        datasets: [{
            label: "Not Trend",
            data: grades.map(g => g.value),
            borderColor: "#28a745",
            borderWidth: 2,
            fill: false,
            tension: 0.3
        }]
    };

    new Chart(document.getElementById("lineChart"), {
        type: "line",
        data: lineData
    });
}

/* Sayfa algılama */
document.addEventListener("DOMContentLoaded", () => {
    if (location.pathname.includes("index")) {
        loadDashboard();
        examReminder();
    }
});
