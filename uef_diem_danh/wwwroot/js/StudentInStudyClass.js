$(document).ready(function () {
    //// ================== INIT ==================
    $.fn.dataTable.moment('DD/MM/YYYY');

    initAddStudentToStudyClassTable();
})


let addStudentToStudyClassTable = new DataTable('#addStudentToStudyClassTable', {
    dom: 'rtp'    // "l" = length, "r" = processing, "t" = table, "i" = info, "p" = pagination
    // Notice no "f" here, which is the default filter/search box
});


async function initAddStudentToStudyClassTable() {
    try {
        const addStudentToStudyClassTableBody = document.getElementById("addStudentToStudyClassTableBody");

        const response = await axios.get(`https://localhost:7045/api/quan-ly-danh-sach-lop-hoc/danh-sach-hoc-vien-con-trong`)
        const data = response.data;


        addStudentToStudyClassTable.rows.add(data.map(student => [
            student.id,
            `${student.lastName} ${student.firstName}`,
            student.email,
            student.phoneNumber,
            student.barCode,
            `<button
                type="button"
                id="add-student-${student.id}"
                class="btn btn-outline-primary btn-sm"
                onclick="addStudentToStudyClass(${student.id})">
                    Thêm
            </button>`
        ]));
        addStudentToStudyClassTable.draw();

    } catch (ex) {
        console.error(ex);
    }
}

// ================== SEARCH ==================
function preventSearchAvailableStudentInputSubmit() {
    searchAvailableStudent();

    return false;
}

async function searchAvailableStudent() {
    const search = document
        .getElementById("searchAvailableStudentInput")
        .value
        .trim();

    try {

        if (!search) {
            return;
        } else {
            addStudentToStudyClassTable.search(search).draw();
        }

    } catch (ex) {
        console.error(ex);
    }

}



// ================== ADD STUDENT TO STUDY CLASS ==================

async function addStudentToStudyClass(studentId) {
    try {
        const studyClassId = document.getElementById("studyClassId").value;
        const addStudentBtn = document.getElementById(`add-student-${studentId}`);

        const addStudentToStudyClassRequest = {
            StudentId: studentId
        }
        const response = await axios.post(`https://localhost:7045/api/quan-ly-danh-sach-lop-hoc/${studyClassId}/them-hoc-vien-vao-lop-hoc`, addStudentToStudyClassRequest);
        console.log(response)
        addStudentBtn.innerText = "Đã thêm";
        addStudentBtn.disabled = true;

        console.log(studyClassId)
    } catch (ex) {
        console.log(ex);
    }
}

function enableSubmitButton() {
    const studentExcelFileInput = document.getElementById("ExcelFile");
    const uploadedExcelFileName = document.getElementById("uploadedExcelFileName");
    const submitImportingStudentBtn = document.getElementById("submitImportingStudent");

    uploadedExcelFileName.innerText = `Đã tải lên tệp excel: ${studentExcelFileInput.files[0].name}`;

    submitImportingStudentBtn.style.display = "block"
}

async function initAddStudentFields(id) {
    // Call API to get study class detail
    const classIdInput = document.getElementById("themMaLopHoc");
    console.log(id);
    classIdInput.value = id;
}

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


// ================== DELETE ==================
function initDeleteStudentInStudyClassField(studentId) {
    const removeStudentIdInput = document.getElementById("removeStudentIdInput");

    removeStudentIdInput.value = studentId;
}

