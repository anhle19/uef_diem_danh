$(document).ready(function () {
    //// ================== INIT ==================
    $.fn.dataTable.moment('DD/MM/YYYY');

})


let studentManagementInStudyClassTable = new DataTable('#studentManagementInStudyClassTable', {
    dom: 'rt',    // "l" = length, "r" = processing, "t" = table, "i" = info, "p" = pagination
    // Notice no "f" here, which is the default filter/search box
    paging: false,
    columnDefs: [
        {
            targets: 4,
            render: function (data, type) {
                if (type === 'sort' || type === 'type') {
                    return moment(data, "DD/MM/YYYY").year();
                }
                return data;
            }
        }, // Sort NgaySinh column based on Year
        { orderable: false, targets: [5] } // Disable button column
    ],
    language: {
        emptyTable: "Hiện không có dữ liệu học viên nào của lớp học",
        zeroRecords: "Không tìm thấy học viên nào của lớp học",
    }
});
let addStudentToStudyClassTable = new DataTable('#addStudentToStudyClassTable', {
    dom: 'rtp'    // "l" = length, "r" = processing, "t" = table, "i" = info, "p" = pagination
    // Notice no "f" here, which is the default filter/search box
});




// ================== SEARCH ==================
function preventSearchStudentManagementInStudyClassSubmit() {
    searchStudentManagementInStudyClass();

    return false;
}

async function searchStudentManagementInStudyClass() {

    const studentManagementInStudyClassSearchInputValue = document
        .getElementById("studentManagementInStudyClassSearchInput")
        .value
        .trim();

    try {

        if (!studentManagementInStudyClassSearchInputValue) {
            return;
        } else {
            studentManagementInStudyClassTable.search(studentManagementInStudyClassSearchInputValue).draw();
        }

    } catch (ex) {
        console.error(ex);
    }

}

function preventSearchAvailableStudentInputSubmit() {
    searchAvailableStudent();

    return false;
}

function searchAvailableStudent() {
    const phone = document.getElementById("timSdt").value;

    const messageBox = document.getElementById("searchMessage");

    // Xóa thông báo cũ
    messageBox.innerHTML = "";

    if (!phone) {
        messageBox.innerHTML = `<div class="alert alert-warning p-2 mb-2">
            Vui lòng nhập số điện thoại
        </div>`;
        return;
    }

    axios.get(`/hoc-vien/tim-theo-so-dien-thoai?phoneNumber=${phone}`)
        .then(res => {
            const data = res.data;
            // Đổ dữ liệu vào form
            document.getElementById("themHo").value = data.ho;
            document.getElementById("themTen").value = data.ten;
            document.getElementById("themNgaySinh").value = data.ngaySinh;
            document.getElementById("themDiaChi").value = data.diaChi;
            document.getElementById("themEmail").value = data.email;
            document.getElementById("themSoDienThoai").value = data.soDienThoai;
        })
        .catch(err => {
            if (err.response && err.response.status === 404) {
                messageBox.innerHTML = `<div class="alert alert-danger p-2 mb-2">
                    Không tìm thấy học viên này!
                </div>`;
            } else {
                messageBox.innerHTML = `<div class="alert alert-danger p-2 mb-2">
                    Có lỗi xảy ra khi tìm học viên
                </div>`;
            }
        });
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

