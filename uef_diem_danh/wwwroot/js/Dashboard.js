renderChart();

function renderChart() {
    // Chart 1: Học viên theo tháng
    new Chart(document.getElementById("studentsChart").getContext("2d"), {
        type: "line",
        data: {
            labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
            datasets: [
                {
                    label: "Số học viên",
                    data: [80, 120, 200, 300, 450, 600, 750, 900, 1050, 1150, 1200, 1250],
                    borderColor: "#0d6efd",
                    backgroundColor: "rgba(13,110,253,0.2)",
                    fill: true,
                    tension: 0.3,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { display: false },
                },
                x: {
                    grid: { display: false },
                },
            },
        },
    });

    // Chart 2: Điểm danh
    new Chart(document.getElementById("attendanceChart").getContext("2d"), {
        type: "bar",
        data: {
            labels: ["Có mặt", "Vắng"],
            datasets: [
                {
                    label: "Điểm danh",
                    data: [1120, 130], // tổng = 1250
                    backgroundColor: ["#198754", "#dc3545"],
                },
            ],
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { display: false },
                },
                x: {
                    grid: { display: false },
                },
            },
        },
    });

    // Chart 3: Buổi học theo tháng (tổng ~120 buổi)
    new Chart(document.getElementById("sessionsChart").getContext("2d"), {
        type: "line",
        data: {
            labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
            datasets: [
                {
                    label: "Số buổi học",
                    data: [8, 10, 8, 9, 10, 11, 10, 9, 10, 11, 12, 12],
                    borderColor: "#ffc107",
                    backgroundColor: "rgba(255,193,7,0.2)",
                    fill: true,
                    tension: 0.3,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { display: false },
                },
                x: {
                    grid: { display: false },
                },
            },
        },
    });

    // Chart 4: Lớp học theo tháng (tăng dần đến 18 lớp)
    new Chart(document.getElementById("classesChart").getContext("2d"), {
        type: "line",
        data: {
            labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
            datasets: [
                {
                    label: "Số lớp học",
                    data: [2, 3, 11, 13, 4, 6, 7, 9, 15, 16, 17, 18],
                    borderColor: "#20c997",
                    backgroundColor: "rgba(32,201,151,0.2)",
                    fill: true,
                    tension: 0.3,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { display: false },
                },
                x: {
                    grid: { display: false },
                },
            },
        },
    });
}
