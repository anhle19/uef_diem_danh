
$(document).ready(function () {
    //// ================== INIT ==================
    $.fn.dataTable.moment('DD/MM/YYYY');


})


let studyClassTable = new DataTable('#studyClassTable', {
    dom: 'lrtp'    // "l" = length, "r" = processing, "t" = table, "i" = info, "p" = pagination
    // Notice no "f" here, which is the default filter/search box
});

// ================== ADD STUDY CLASS ==================

function addStudyClass() {
    const createStudyClassForm = document.getElementById("createStudyClassForm");
    const popup = document.getElementById("popupThemLop");
    const studyClassNameInput = popup.querySelector("#themTenLop");
    const studyClassStartDayInput = popup.querySelector("#themNgayBD");
    const studyClassEndDayInput = popup.querySelector("#themNgayKT");

    const studyClassName = studyClassNameInput.value.trim();
    const studyClassStartDay = studyClassStartDayInput.value;
    const studyClassEndDay = studyClassEndDayInput.value;

    // Validate inputs
    if (!studyClassName || !studyClassStartDay || !studyClassEndDay) {
        Swal.fire(
            "Lỗi",
            "Vui lòng nhập đầy đủ Tên lớp, Ngày bắt đầu và Ngày kết thúc",
            "warning"
        );
        return;
    }
    if (studyClassName && !studyClassStartDay && studyClassEndDay) {
        Swal.fire(
            "Lỗi",
            "Vui lòng nhập đầy đủ Ngày bắt đầu",
            "warning"
        );
        return;
    }
    if (studyClassName && studyClassStartDay && !studyClassEndDay) {
        Swal.fire(
            "Lỗi",
            "Vui lòng nhập đầy đủ Ngày kết thúc",
            "warning"
        );
        return;
    }
    if (new Date(studyClassStartDay) > new Date(studyClassEndDay)) {
        Swal.fire(
            "Lỗi",
            "Ngày bắt đầu phải trước hoặc bằng ngày kết thúc",
            "warning"
        );
        return;
    }

    // Submit form
    createStudyClassForm.requestSubmit();
};


// ================== EDIT CLASS ==================
async function initUpdateStudyClassFields(id) {

    // Call API to get study class detail
    try {
        const studyClassIdInput = document.getElementById("suaMaLop");
        const studyClassNameInput = document.getElementById("suaTenLop");
        const studyClassStartDayInput = document.getElementById("suaNgayBD");
        const studyClassEndDayInput = document.getElementById("suaNgayKT");

        const response = await axios.get(`https://localhost:7045/api/lay-chi-tiet-lop-hoc/${id}`)
        const fetchedStudyClass = response.data;

        studyClassIdInput.value = fetchedStudyClass.maLopHoc;
        studyClassNameInput.value = fetchedStudyClass.tenLopHoc;
        studyClassStartDayInput.value = fetchedStudyClass.thoiGianBatDau;
        studyClassEndDayInput.value = fetchedStudyClass.thoiGianKetThuc;

        console.log(response)
    } catch (ex) {
        console.log(ex);
    }


}

function updateStudyClass() {
    const updateStudyClassForm = document.getElementById("updateStudyClassForm");
    const studyClassNameInput = document.getElementById("suaTenLop");
    const studyClassStartDayInput = document.getElementById("suaNgayBD");
    const studyClassEndDayInput = document.getElementById("suaNgayKT");

    const studyClassName = studyClassNameInput.value.trim();
    const studyClassStartDay = studyClassStartDayInput.value;
    const studyClassEndDay = studyClassEndDayInput.value;

    // Validate inputs
    if (!studyClassName || !studyClassStartDay || !studyClassEndDay) {
        Swal.fire(
            "Lỗi",
            "Vui lòng nhập đầy đủ Tên lớp, Ngày bắt đầu và Ngày kết thúc",
            "warning"
        );
        return;
    }
    if (studyClassName && !studyClassStartDay && studyClassEndDay) {
        Swal.fire(
            "Lỗi",
            "Vui lòng nhập đầy đủ Ngày bắt đầu",
            "warning"
        );
        return;
    }
    if (studyClassName && studyClassStartDay && !studyClassEndDay) {
        Swal.fire(
            "Lỗi",
            "Vui lòng nhập đầy đủ Ngày kết thúc",
            "warning"
        );
        return;
    }
    if (new Date(studyClassStartDay) > new Date(studyClassEndDay)) {
        Swal.fire(
            "Lỗi",
            "Ngày bắt đầu phải trước hoặc bằng ngày kết thúc",
            "warning"
        );
        return;
    }


    // Submit form
    updateStudyClassForm.requestSubmit();
};


// ================== DELETE CLASS ==================
async function initDeleteStudyClassField(id) {
    const studyClassIdInput = document.getElementById("xoaMaLop");

    studyClassIdInput.value = id;
}


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

// ================== SEARCH ==================
function preventSearchStudyClassSubmit() {
    searchStudyClass();

    return false;
}

async function searchStudyClass() {
    const searchResultLabel = document.getElementById("searchResultLabel");
    const studyClassesTableBody = document.getElementById("classesTableBody");
    const searchOrderStudyClassForm = document.getElementById("searchOrderStudyClassForm");
    const studyClassSearchInputValue = document
        .getElementById("studyClassSearchInput")
        .value
        .trim();
    console.log(studyClassSearchInputValue);
    try {

        if (!studyClassSearchInputValue) {
            return;
        } else {

            studyClassTable.search(studyClassSearchInputValue).draw();

        }

    } catch (ex) {
        console.error(ex);
    }

    //    searchOrderStudyClassForm.requestSubmit();
}

// ================== VIEW/REMOVE STUDENTS ==================
//(function setupViewStudents() {
//    const popup = document.getElementById("popupHocVien");
//    const tbody = popup.querySelector(".studentsTableBody");
//    let currentClassId = null;

//    function renderStudents() {
//        const list = studentsByClass[currentClassId] || [];
//        tbody.innerHTML = "";
//        list.forEach((st, idx) => {
//            const tr = document.createElement("tr");
//            tr.innerHTML = `
//    <td>${idx + 1}</td>
//    <td>${st.lastName}</td>
//    <td>${st.firstName}</td>
//    <td>${st.email}</td>
//    <td><button class="btn btn-outline-danger btn-sm btn-remove-student" data-id="${st.id
//                }">Xoá</button></td>
//`;
//            tbody.appendChild(tr);
//        });
//        if (list.length === 0) {
//            const tr = document.createElement("tr");
//            tr.innerHTML = `<td colspan="5">Chưa có học viên</td>`;
//            tbody.appendChild(tr);
//        }
//    }

//    popup.addEventListener("show.bs.modal", (ev) => {
//        currentClassId = Number(ev.relatedTarget.getAttribute("data-id"));
//        renderStudents();
//    });

//    popup.addEventListener("click", (e) => {
//        const btn = e.target.closest(".btn-remove-student");
//        if (!btn) return;
//        const stId = Number(btn.getAttribute("data-id"));
//        const arr = studentsByClass[currentClassId] || [];
//        const idx = arr.findIndex((x) => x.id === stId);
//        if (idx > -1) {
//            arr.splice(idx, 1);
//            renderStudents();
//        }
//    });
//})();
