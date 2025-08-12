$(document).ready(function () {
    //// ================== INIT ==================
    $.fn.dataTable.moment('DD/MM/YYYY');


})
let studentTable = new DataTable('#studentTable', {
    dom: 'lrtp'    // "l" = length, "r" = processing, "t" = table, "i" = info, "p" = pagination
    // Notice no "f" here, which is the default filter/search box
});
// ================== SEARCH ==================

function preventSearchStudyClassSubmit() {
    searchStudyClass();

    return false;
}

function updateSearchOrderType() {
    const searchOrderTypeInput = document.getElementById("searchOrderType");
    searchOrderTypeInput.value = "SEARCH_ONLY";
}

async function searchStudent() {
    const searchResultLabel = document.getElementById("searchResultLabel");
    const studyClassesTableBody = document.getElementById("studentsTableBody");
    const searchOrderStudyClassForm = document.getElementById("searchOrderStudentForm");
    const studyClassSearchInputValue = document
        .getElementById("studentSearchInput")
        .value
        .trim();
    console.log(studyClassSearchInputValue);
    try {

        if (!studyClassSearchInputValue) {
            return;
        } else {

            studentTable.search(studyClassSearchInputValue).draw();

        }

    } catch (ex) {
        console.error(ex);
    }

    //    searchOrderStudyClassForm.requestSubmit();
}


// ================== ADD STUDY CLASS ==================
function addStudent() {
    const createStudentForm = document.getElementById("createStudentForm");
    const popup = document.getElementById("popupThemHocVien");

    const studentLastNameInput = popup.querySelector("#themHo");
    const studentFirstNameInput = popup.querySelector("#themTen");
    const studentDobInput = popup.querySelector("#themNgaySinh");
    const studentAddressInput = popup.querySelector("#themDiaChi");
    const studentEmailInput = popup.querySelector("#themEmail");
    const studentPhoneNumberInput = popup.querySelector("#themSoDienThoai");


    const studentLastName = studentLastNameInput.value.trim();
    const studentFirstName = studentFirstNameInput.value.trim();
    const studentDob = studentDobInput.value;
    const studentAddress = studentAddressInput.value.trim();
    const studentEmail = studentEmailInput.value.trim();
    const studentPhoneNumber = studentPhoneNumberInput.value.trim();


    // Validate inputs
    if (!studentLastName || !studentFirstName || !studentDob || !studentAddress || !studentEmail || !studentPhoneNumber) {
        Swal.fire(
            "Lỗi",
            "Vui lòng nhập đầy đủ dữ liệu",
            "warning"
        );
        return;
    }


    // Submit form
    createStudentForm.requestSubmit();
};


// ================== EDIT CLASS ==================


async function initUpdateStudentFields(id) {
    // Call API to get study class detail
    try {
        const studentIdInput = document.getElementById("suaMaHocVien");
        const studentLastNameInput = document.getElementById("suaHo");
        const studentFirstNameInput = document.getElementById("suaTen");
        const studentDobInput = document.getElementById("suaNgaySinh");
        const studentAddressInput = document.getElementById("suaDiaChi");
        const studentEmailInput = document.getElementById("suaEmail");
        const studentPhoneNumberInput = document.getElementById("suaSoDienThoai");


        const response = await axios.get(`https://localhost:7045/api/lay-chi-tiet-hoc-vien/${id}`)
        const fetchedStudent = response.data;

        console.log(fetchedStudent);
        studentIdInput.value = fetchedStudent.maHocVien;
        studentLastNameInput.value = fetchedStudent.ho;
        studentFirstNameInput.value = fetchedStudent.ten;
        studentDobInput.value = fetchedStudent.ngaySinh;
        studentAddressInput.value = fetchedStudent.diaChi;
        studentEmailInput.value = fetchedStudent.email;
        studentPhoneNumberInput.value = fetchedStudent.soDienThoai;


        console.log(response)
    } catch (ex) {
        console.log(ex);
    }

}

function updateStudent() {
    const updateStudyClassForm = document.getElementById("updateStudentForm");

    const studentLastNameInput = document.getElementById("suaHo");
    const studentFirstNameInput = document.getElementById("suaTen");
    const studentDobInput = document.getElementById("suaNgaySinh");
    const studentAddressInput = document.getElementById("suaDiaChi");
    const studentEmailInput = document.getElementById("suaEmail");
    const studentPhoneNumberInput = document.getElementById("suaSoDienThoai");

    const studentLastName = studentLastNameInput.value.trim();
    const studentFirstName = studentFirstNameInput.value.trim();
    const studentDob = studentDobInput.value;
    const studentAddress = studentAddressInput.value.trim();
    const studentEmail = studentEmailInput.value.trim();
    const studentPhoneNumber = studentPhoneNumberInput.value.trim();

    // Validate inputs
    if (!studentLastName || !studentFirstName || !studentDob || !studentAddress || !studentEmail || !studentPhoneNumber) {
        Swal.fire(
            "Lỗi",
            "Vui lòng nhập đầy đủ dữ liệu",
            "warning"
        );
        return;
    }

    // Submit form
    updateStudyClassForm.requestSubmit();
};


// ================== DELETE CLASS ==================
async function initDeleteStudentField(id) {
    const studyClassIdInput = document.getElementById("xoaMaHocVien");

    studyClassIdInput.value = id;
}

//(function setupDelete() {
//    const popup = document.getElementById("popupXoaLop");
//    const btn = document.getElementById("btnXacNhanXoaLop");
//    let currentId = null;
//    popup.addEventListener("show.bs.modal", (ev) => {
//        currentId = Number(ev.relatedTarget.getAttribute("data-id"));
//        const item = classesData.find((x) => x.id === currentId);
//        popup.querySelector(
//            ".modal-body"
//        ).textContent = `Bạn có chắc chắn muốn xoá "${item?.tenLop}" không?`;
//    });
//    btn.addEventListener("click", () => {
//        const idx = classesData.findIndex((x) => x.id === currentId);
//        if (idx > -1) {
//            classesData.splice(idx, 1);
//        }
//        renderTable(classesData);
//        bootstrap.Modal.getInstance(popup)?.hide();
//    });
//})();

// ================== IMPORT STUDENTS ==================
//(function setupImport() {
//    const popup = document.getElementById("popupImport");
//    const btnDownload = document.getElementById("btnDownloadTemplate");
//    const fileInput = document.getElementById("fileImport");
//    const btnImport = document.getElementById("btnThucHienImport");
//    let currentClassId = null;

//    popup.addEventListener("show.bs.modal", (ev) => {
//        currentClassId = Number(ev.relatedTarget.getAttribute("data-id"));
//        fileInput.value = "";
//    });

//    // Tải file mẫu
//    btnDownload.addEventListener("click", () => {
//        const csvHeader = "lastName,firstName,email\n";
//        const csvSample =
//            csvHeader + "Nguyen,An,an@example.com\nTran,Binh,binh@example.com\n";
//        const blob = new Blob([csvSample], { type: "text/csv;charset=utf-8;" });
//        const url = URL.createObjectURL(blob);
//        const a = document.createElement("a");
//        a.href = url;
//        a.download = "mau_import_hoc_vien.csv";
//        document.body.appendChild(a);
//        a.click();
//        a.remove();
//        URL.revokeObjectURL(url);
//    });

//    btnImport.addEventListener("click", () => {
//        const file = fileInput.files?.[0];
//        if (!file) {
//            Swal.fire("Thông báo", "Vui lòng chọn file trước khi import", "info");
//            return;
//        }
//        if (!file.name.endsWith(".csv")) {
//            Swal.fire("Thông báo", "Demo này chỉ đọc nhanh", "info");
//            return;
//        }
//        const reader = new FileReader();
//        reader.onload = function (e) {
//            const text = e.target.result;
//            const lines = String(text).split(/\r?\n/).filter(Boolean);
//            if (lines.length <= 1) {
//                Swal.fire("Lỗi", "File trống hoặc sai định dạng", "error");
//                return;
//            }
//            const rows = lines.slice(1).map((l) => l.split(","));
//            const toAdd = rows.map((r, i) => ({
//                id: Date.now() + i,
//                lastName: r[0]?.trim() || "",
//                firstName: r[1]?.trim() || "",
//                email: r[2]?.trim() || "",
//            }));
//            if (!studentsByClass[currentClassId])
//                studentsByClass[currentClassId] = [];
//            studentsByClass[currentClassId].push(...toAdd);
//            Swal.fire(
//                "Thành công",
//                `Đã import ${toAdd.length} học viên vào lớp`,
//                "success"
//            );
//            bootstrap.Modal.getInstance(popup)?.hide();
//        };
//        reader.readAsText(file, "utf-8");
//    });
//})();

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
//        <td>${idx + 1}</td>
//        <td>${st.ho}</td>
//        <td>${st.ten}</td>
//        <td>${st.ngaySinh}</td>
//        <td>${st.diaChi}</td>
//        <td>${st.email}</td>
//        <td>${st.soDienThoai}</td>
//        <td><button class="btn btn-outline-danger btn-sm btn-remove-student" data-id="${st.MaHocVien
//                }">Xoá</button></td>
//    `;
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