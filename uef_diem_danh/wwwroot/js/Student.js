$(document).ready(function () {
    //// ================== INIT ==================
    $.fn.dataTable.moment('DD/MM/YYYY');
   
})

let studentTable = new DataTable('#studentTable', {
    'dom': 'rt',    // "l" = length, "r" = processing, "t" = table, "p" = pagination
    columnDefs: [
        { orderable: false, targets: [6, 7] } // Disable button column
    ],
    language: {
        emptyTable: "Hiện không có dữ liệu học viên nào",
        zeroRecords: "Không tìm thấy học viên nào",
    }
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

function changeCreatePreviewStudentAvatar() {
    const MAX_AVATAR_FILE_SIZE = 10 * 1024 * 1024;

    const studentAvatarFile = document.getElementById("themHinhAnh").files[0];

    if (
        studentAvatarFile.type === "image/png" ||
        studentAvatarFile.type === "image/jpg" || 
        studentAvatarFile.type === "image/jpeg"
    ) {
        const themHinhAnhPreview = document.getElementById("themHinhAnhPreview");

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


function addStudent() {
    const createStudentForm = document.getElementById("createStudentForm");
    const popup = document.getElementById("popupThemHocVien");

    const studentLastNameInput = popup.querySelector("#themHo");
    const studentFirstNameInput = popup.querySelector("#themTen");
    const studentDobInput = popup.querySelector("#themNgaySinh");
    const studentAddressInput = popup.querySelector("#themDiaChi");
    const studentEmailInput = popup.querySelector("#themEmail");
    const studentPhoneNumberInput = popup.querySelector("#themSoDienThoai");


    const studentAvatarFile = document.getElementById("themHinhAnh").files;
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
    if (studentAvatarFile.length == 0) {
        Swal.fire(
            "Lỗi",
            "Vui lòng tải lên hình ảnh học viên",
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
        const suaHinhAnhPreview = document.getElementById("suaHinhAnhPreview");
        const studentLastNameInput = document.getElementById("suaHo");
        const studentFirstNameInput = document.getElementById("suaTen");
        const studentDobInput = document.getElementById("suaNgaySinh");
        const studentAddressInput = document.getElementById("suaDiaChi");
        const studentEmailInput = document.getElementById("suaEmail");
        const studentPhoneNumberInput = document.getElementById("suaSoDienThoai");


        const response = await axios.get(`https://localhost:7045/api/lay-chi-tiet-hoc-vien/${id}`)
        const fetchedStudent = response.data;

        console.log(fetchedStudent);
        suaHinhAnhPreview.src = `https://localhost:7045/${fetchedStudent.hinhAnh}`
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

function changeUpdatePreviewStudentAvatar() {
    const MAX_AVATAR_FILE_SIZE = 10 * 1024 * 1024;

    const studentAvatarFile = document.getElementById("suaHinhAnh").files[0];

    if (
        studentAvatarFile.type === "image/png" ||
        studentAvatarFile.type === "image/jpg" ||
        studentAvatarFile.type === "image/jpeg"
    ) {
        const suaHinhAnhPreview = document.getElementById("suaHinhAnhPreview");

        suaHinhAnhPreview.src = URL.createObjectURL(studentAvatarFile);

        // Clean up object URL when student avatar is loaded
        // Prevent too much object URL => Lead to use more memory
        suaHinhAnhPreview.onload = function () {
            URL.revokeObjectURL(suaHinhAnhPreview.src);
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

function updateStudent() {
    const updateStudyClassForm = document.getElementById("updateStudentForm");

    const studentAvatarInput = document.getElementById("suaHinhAnh");
    const studentLastNameInput = document.getElementById("suaHo");
    const studentFirstNameInput = document.getElementById("suaTen");
    const studentDobInput = document.getElementById("suaNgaySinh");
    const studentAddressInput = document.getElementById("suaDiaChi");
    const studentEmailInput = document.getElementById("suaEmail");
    const studentPhoneNumberInput = document.getElementById("suaSoDienThoai");

    const studentAvatar = studentAvatarInput.files[0];
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



// ================== TABLE PAGINATION ==================
function initTablePagination() {
    const paginationContainer = document.getElementById("paginationContainer");

    const tablePageInfo = studentTable.page.info()
    const currentPage = studentTable.page();


    if (tablePageInfo.pages > 0) {
        // Init pagination items
        for (let i = 0; i < tablePageInfo.pages; i++) {
            paginationContainer.innerHTML +=
                `
                <ol class="paginationItems" id="paginationItem_${i}" onclick="goToPage(${i})">${i + 1}</ol>
            `;
        }

        // Set current active page
        const currentPaginationItem = document.getElementById(`paginationItem_${currentPage}`)
        currentPaginationItem.classList.add("paginationActive");
    } else {
        return;
    }


}

function goToPage(targetPage) {
    // Go to target page
    studentTable.page(targetPage).draw(false);

    // Clear previous pagination item active style
    const previousActivetePaginationItem = document.getElementsByClassName("paginationActive")[0];
    previousActivetePaginationItem.classList.remove("paginationActive")

    // Set current active page
    const currentPage = studentTable.page();
    const currentPaginationItem = document.getElementById(`paginationItem_${currentPage}`)
    currentPaginationItem.classList.add("paginationActive");


}



// ================== CALL FUNCTIONS ==================

initTablePagination();

