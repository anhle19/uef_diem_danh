//// ================== MOCK DATA ==================
//const classesData = [
//    {
//        id: 101,
//        tenLop: "Tư tưởng Hồ Chí Minh",
//        ngayBD: "2025-08-02",
//        ngayKT: "2025-10-02",
//        createdAt: "2025-08-06T15:00:00Z",
//    },
//    {
//        id: 102,
//        tenLop: "Quản lý hành chính nhà nước",
//        ngayBD: "2025-08-03",
//        ngayKT: "2025-10-05",
//        createdAt: "2025-08-07T10:00:00Z",
//    },
//    {
//        id: 103,
//        tenLop: "Đường lối, chính sách của Đảng và Nhà nước Việt Nam",
//        ngayBD: "2025-07-28",
//        ngayKT: "2025-09-30",
//        createdAt: "2025-08-08T08:30:00Z",
//    },
//];

//// studentsByClass: key = classId
//// Danh sách học viên có trong lớp.
//const studentsByClass = {
//    101: [
//        {
//            id: 1,
//            lastName: "Nguyễn Thanh",
//            firstName: "An",
//            email: "an@example.com",
//        },
//        {
//            id: 2,
//            lastName: "Trần An",
//            firstName: "Bình",
//            email: "binh@example.com",
//        },
//    ],
//    102: [
//        { id: 3, lastName: "Lê Khánh", firstName: "Chi", email: "chi@example.com" },
//    ],
//    103: [],
//};

//// ================== RENDER LIST ==================
//const tbody = document.querySelector(".classesTableBody");

//function sortByNewestCreated(data) {
//    return [...data].sort(
//        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//    );
//}

////định dạng dd-mm-yyyy
//function formatDate(d) {
//    const date = new Date(d);
//    const dd = String(date.getDate()).padStart(2, "0");
//    const mm = String(date.getMonth() + 1).padStart(2, "0");
//    const yyyy = date.getFullYear();
//    return `${dd}-${mm}-${yyyy}`;
//}

//function renderTable(data) {
//    if (!tbody) return; // Nếu tbody không tồn tại thì dừng luôn
//    tbody.innerHTML = ""; // Xóa toàn bộ nội dung cũ trong bảng
//    const sorted = sortByNewestCreated(data); // Sắp xếp trước khi hiển thị
//    sorted.forEach((item, idx) => {
//        const tr = document.createElement("tr");
//        tr.innerHTML = `
//    <td>${idx + 1}</td>
//    <td>${item.tenLop}</td>
//    <td>${formatDate(item.ngayBD)}</td>
//    <td>${formatDate(item.ngayKT)}</td>
//    <td>
//        <button class="btn btn-outline-secondary btn-sm btn-import" data-id="${item.id
//            }" data-bs-toggle="modal" data-bs-target="#popupImport">Import</button>
//    </td>
//    <td>
//        <button class="btn btn-outline-primary btn-sm btn-view-students" data-id="${item.id
//            }" data-bs-toggle="modal" data-bs-target="#popupHocVien">Xem</button>
//    </td>
//    <td>
//        <a class="action-link" href="/html/layout/main.html?page=classes&classId=${item.id
//            }">Quản lý buổi học</a>
//    </td>
//    <td>
//        <button class="btn btn-outline-secondary btn-sm btn-edit" data-id="${item.id
//            }" data-bs-toggle="modal" data-bs-target="#popupSuaLop">Sửa</button>
//    </td>
//    <td>
//        <button class="btn btn-outline-danger btn-sm btn-delete" data-id="${item.id
//            }" data-bs-toggle="modal" data-bs-target="#popupXoaLop">Xoá</button>
//    </td>
//    `;
//        tbody.appendChild(tr);
//    });
//}

// ================== SEARCH ==================
document.getElementById("btnSearch").addEventListener("click", () => {
    const kw = document.getElementById("kw").value.trim().toLowerCase();
    if (!kw) {
        renderTable(classesData);
        return;
    }
    const filtered = classesData.filter((c) =>
        c.tenLop.toLowerCase().includes(kw)
    );
    renderTable(filtered);
});

// ================== ADD CLASS ==================
(function setupAdd() {
    const popup = document.getElementById("popupThemLop");
    const ten = popup.querySelector("#themTenLop");
    const bd = popup.querySelector("#themNgayBD");
    const kt = popup.querySelector("#themNgayKT");
    const btn = document.getElementById("btnLuuLopMoi");

    btn.addEventListener("click", () => {
        const name = ten.value.trim();
        const start = bd.value;
        const end = kt.value;
        if (!name || !start || !end) {
            Swal.fire(
                "Lỗi",
                "Vui lòng nhập đầy đủ Tên lớp, Ngày bắt đầu và Ngày kết thúc",
                "warning"
            );
            return;
        }
        if (new Date(start) > new Date(end)) {
            Swal.fire(
                "Lỗi",
                "Ngày bắt đầu phải trước hoặc bằng ngày kết thúc",
                "warning"
            );
            return;
        }
        const newItem = {
            id: Date.now(),
            tenLop: name,
            ngayBD: start,
            ngayKT: end,
            createdAt: new Date().toISOString(),
        };
        classesData.push(newItem);
        renderTable(classesData);
        bootstrap.Modal.getInstance(popup)?.hide();
        ten.value = "";
        bd.value = "";
        kt.value = "";
    });
})();

// ================== EDIT CLASS ==================
(function setupEdit() {
    const popup = document.getElementById("popupSuaLop");
    const ten = popup.querySelector("#suaTenLop");
    const bd = popup.querySelector("#suaNgayBD");
    const kt = popup.querySelector("#suaNgayKT");
    const btn = document.getElementById("btnLuuSuaLop");

    let currentId = null;
    popup.addEventListener("show.bs.modal", (ev) => {
        const id = Number(ev.relatedTarget.getAttribute("data-id"));
        currentId = id;
        const item = classesData.find((x) => x.id === id);
        if (item) {
            ten.value = item.tenLop;
            bd.value = item.ngayBD;
            kt.value = item.ngayKT;
        }
    });

    btn.addEventListener("click", () => {
        const name = ten.value.trim();
        const start = bd.value;
        const end = kt.value;
        if (!name || !start || !end) {
            Swal.fire(
                "Lỗi",
                "Vui lòng nhập đầy đủ Tên lớp, Ngày bắt đầu và Ngày kết thúc",
                "warning"
            );
            return;
        }
        if (new Date(start) > new Date(end)) {
            Swal.fire(
                "Lỗi",
                "Ngày bắt đầu phải trước hoặc bằng ngày kết thúc",
                "warning"
            );
            return;
        }
        const idx = classesData.findIndex((x) => x.id === currentId);
        if (idx > -1) {
            classesData[idx].tenLop = name;
            classesData[idx].ngayBD = start;
            classesData[idx].ngayKT = end;
            renderTable(classesData);
        }
        bootstrap.Modal.getInstance(popup)?.hide();
    });
})();

// ================== DELETE CLASS ==================
(function setupDelete() {
    const popup = document.getElementById("popupXoaLop");
    const btn = document.getElementById("btnXacNhanXoaLop");
    let currentId = null;
    popup.addEventListener("show.bs.modal", (ev) => {
        currentId = Number(ev.relatedTarget.getAttribute("data-id"));
        const item = classesData.find((x) => x.id === currentId);
        popup.querySelector(
            ".modal-body"
        ).textContent = `Bạn có chắc chắn muốn xoá "${item?.tenLop}" không?`;
    });
    btn.addEventListener("click", () => {
        const idx = classesData.findIndex((x) => x.id === currentId);
        if (idx > -1) {
            classesData.splice(idx, 1);
        }
        renderTable(classesData);
        bootstrap.Modal.getInstance(popup)?.hide();
    });
})();

// ================== IMPORT STUDENTS ==================
(function setupImport() {
    const popup = document.getElementById("popupImport");
    const btnDownload = document.getElementById("btnDownloadTemplate");
    const fileInput = document.getElementById("fileImport");
    const btnImport = document.getElementById("btnThucHienImport");
    let currentClassId = null;

    popup.addEventListener("show.bs.modal", (ev) => {
        currentClassId = Number(ev.relatedTarget.getAttribute("data-id"));
        fileInput.value = "";
    });

    // Tải file mẫu
    btnDownload.addEventListener("click", () => {
        const csvHeader = "lastName,firstName,email\n";
        const csvSample =
            csvHeader + "Nguyen,An,an@example.com\nTran,Binh,binh@example.com\n";
        const blob = new Blob([csvSample], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "mau_import_hoc_vien.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    });

    btnImport.addEventListener("click", () => {
        const file = fileInput.files?.[0];
        if (!file) {
            Swal.fire("Thông báo", "Vui lòng chọn file trước khi import", "info");
            return;
        }
        if (!file.name.endsWith(".csv")) {
            Swal.fire("Thông báo", "Demo này chỉ đọc nhanh", "info");
            return;
        }
        const reader = new FileReader();
        reader.onload = function (e) {
            const text = e.target.result;
            const lines = String(text).split(/\r?\n/).filter(Boolean);
            if (lines.length <= 1) {
                Swal.fire("Lỗi", "File trống hoặc sai định dạng", "error");
                return;
            }
            const rows = lines.slice(1).map((l) => l.split(","));
            const toAdd = rows.map((r, i) => ({
                id: Date.now() + i,
                lastName: r[0]?.trim() || "",
                firstName: r[1]?.trim() || "",
                email: r[2]?.trim() || "",
            }));
            if (!studentsByClass[currentClassId])
                studentsByClass[currentClassId] = [];
            studentsByClass[currentClassId].push(...toAdd);
            Swal.fire(
                "Thành công",
                `Đã import ${toAdd.length} học viên vào lớp`,
                "success"
            );
            bootstrap.Modal.getInstance(popup)?.hide();
        };
        reader.readAsText(file, "utf-8");
    });
})();

// ================== VIEW/REMOVE STUDENTS ==================
(function setupViewStudents() {
    const popup = document.getElementById("popupHocVien");
    const tbody = popup.querySelector(".studentsTableBody");
    let currentClassId = null;

    function renderStudents() {
        const list = studentsByClass[currentClassId] || [];
        tbody.innerHTML = "";
        list.forEach((st, idx) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${idx + 1}</td>
        <td>${st.lastName}</td>
        <td>${st.firstName}</td>
        <td>${st.email}</td>
        <td><button class="btn btn-outline-danger btn-sm btn-remove-student" data-id="${st.id
                }">Xoá</button></td>
    `;
            tbody.appendChild(tr);
        });
        if (list.length === 0) {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td colspan="5">Chưa có học viên</td>`;
            tbody.appendChild(tr);
        }
    }

    popup.addEventListener("show.bs.modal", (ev) => {
        currentClassId = Number(ev.relatedTarget.getAttribute("data-id"));
        renderStudents();
    });

    popup.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-remove-student");
        if (!btn) return;
        const stId = Number(btn.getAttribute("data-id"));
        const arr = studentsByClass[currentClassId] || [];
        const idx = arr.findIndex((x) => x.id === stId);
        if (idx > -1) {
            arr.splice(idx, 1);
            renderStudents();
        }
    });
})();

// ================== INIT ==================
renderTable(classesData);