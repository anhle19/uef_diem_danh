


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

    axios.get(`${BASE_URL}/hoc-vien/tim-theo-so-dien-thoai?phoneNumber=${phone}`)
        .then(res => {
            const data = res.data;

            // Đổ dữ liệu vào form
            if (data.studentAvatar == null) {
                document.getElementById("hinhAnhHocVienLopHocPreview").src = `${BASE_URL}/student_pictures/logo.png`
                document.getElementById("themHo").value = data.studentLastName;
                document.getElementById("themTen").value = data.studentFirstName;
                document.getElementById("themNgaySinh").value = data.studentDayOfBirth;
                document.getElementById("themDiaChi").value = data.studentAddress;
                document.getElementById("themEmail").value = data.studentEmail;
                document.getElementById("themSoDienThoai").value = data.studentPhoneNumber;
                document.getElementById("themDonVi").value = data.studyCenter;
            }
            else {
                document.getElementById("hinhAnhHocVienLopHocPreview").src = `${BASE_URL}/student_pictures/${data.studentAvatar}`
                document.getElementById("themHo").value = data.studentLastName;
                document.getElementById("themTen").value = data.studentFirstName;
                document.getElementById("themNgaySinh").value = data.studentDayOfBirth;
                document.getElementById("themDiaChi").value = data.studentAddress;
                document.getElementById("themEmail").value = data.studentEmail;
                document.getElementById("themSoDienThoai").value = data.studentPhoneNumber;
                document.getElementById("themDonVi").value = data.studyCenter;
            }
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

//async function addStudentToStudyClass(studentId) {
//    try {
//        const studyClassId = document.getElementById("studyClassId").value;
//        const addStudentBtn = document.getElementById(`add-student-${studentId}`);

//        const addStudentToStudyClassRequest = {
//            StudentId: studentId
//        }
//        const response = await axios.post(`https://laitsolution.id.vn/api/quan-ly-danh-sach-lop-hoc/${studyClassId}/them-hoc-vien-vao-lop-hoc`, addStudentToStudyClassRequest);
//        console.log(response)
//        addStudentBtn.innerText = "Đã thêm";
//        addStudentBtn.disabled = true;

//        console.log(studyClassId)
//    } catch (ex) {
//        console.log(ex);
//    }
//}

function changeAddStudentToStudyClassPreviewAvatar() {
    const MAX_AVATAR_FILE_SIZE = 10 * 1024 * 1024;

    const studentAvatarFile = document.getElementById("hinhAnhHocVienLopHoc").files[0];

    if (
        studentAvatarFile.type === "image/png" ||
        studentAvatarFile.type === "image/jpg" ||
        studentAvatarFile.type === "image/jpeg"
    ) {
        const themHinhAnhPreview = document.getElementById("hinhAnhHocVienLopHocPreview");

        themHinhAnhPreview.src = URL.createObjectURL(studentAvatarFile);

        // Clean up object URL when student avatar is loaded
        // Prevent too much object URL => Lead to use more memory
        themHinhAnhPreview.onload = function () {
            URL.revokeObjectURL(themHinhAnhPreview.src);
        };

    } else {
        Swal.fire(
            "Lỗi",
            "Định dạng file không hợp lệ. Phải là PNG hoặc JPG / JPEG",
            "warning"
        );
        return;
    }

    if (studentAvatarFile.size > MAX_AVATAR_FILE_SIZE) {
        Swal.fire(
            "Lỗi",
            "Hình ảnh học viên không được vượt quá 10MB",
            "warning"
        );
        return;
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
    const studentUnitInput = popup.querySelector("#themDonVi");


    const studentLastName = studentLastNameInput.value.trim();
    const studentFirstName = studentFirstNameInput.value.trim();
    const studentDob = studentDobInput.value;
    const studentAddress = studentAddressInput.value.trim();
    const studentEmail = studentEmailInput.value.trim();
    const studentPhoneNumber = studentPhoneNumberInput.value.trim();
    const studentUnit = studentUnitInput.value.trim();

    // Validate inputs
    if (!studentLastName || !studentFirstName || !studentDob || !studentAddress || !studentEmail || !studentPhoneNumber || !studentUnit) {
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

