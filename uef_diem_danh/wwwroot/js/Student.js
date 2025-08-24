


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

function preventSearchStudentSubmit() {
    searchStudent();

    return false;
}

function updateSearchOrderType() {
    const searchOrderTypeInput = document.getElementById("searchOrderType");
    searchOrderTypeInput.value = "SEARCH_ONLY";
}

async function searchStudent() {

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
    const studentPhoneNumberInput = popup.querySelector("#themSoDienThoai");
    const studentUnitInput = popup.querySelector("#themDonVi");

    const studentLastName = studentLastNameInput.value.trim();
    const studentFirstName = studentFirstNameInput.value.trim();
    const studentDob = studentDobInput.value;
    const studentAddress = studentAddressInput.value.trim();
    const studentPhoneNumber = studentPhoneNumberInput.value.trim();
    const studentUnit = studentUnitInput.value.trim();

    // Validate inputs
    if (!studentLastName || !studentFirstName || !studentDob || !studentAddress || !studentPhoneNumber || !studentUnit) {
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
        const suaHinhAnhPreview = document.getElementById("suaHinhAnhPreview");
        const studentLastNameInput = document.getElementById("suaHo");
        const studentFirstNameInput = document.getElementById("suaTen");
        const studentDobInput = document.getElementById("suaNgaySinh");
        const studentAddressInput = document.getElementById("suaDiaChi");
        const studentEmailInput = document.getElementById("suaEmail");
        const studentPhoneNumberInput = document.getElementById("suaSoDienThoai");
        const studentUnitInput = document.getElementById("suaDonVi");

        const response = await axios.get(`/api/lay-chi-tiet-hoc-vien/${id}`)
        const fetchedStudent = response.data;

        suaHinhAnhPreview.src = `${BASE_URL}/student_pictures/${fetchedStudent.tenHinhAnh}`
        studentIdInput.value = fetchedStudent.maHocVien;
        studentLastNameInput.value = fetchedStudent.ho;
        studentFirstNameInput.value = fetchedStudent.ten;
        studentDobInput.value = fetchedStudent.ngaySinh;
        studentAddressInput.value = fetchedStudent.diaChi;
        studentEmailInput.value = fetchedStudent.email;
        studentPhoneNumberInput.value = fetchedStudent.soDienThoai; 
        studentUnitInput.value = fetchedStudent.donVi;


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
    const studentPhoneNumberInput = document.getElementById("suaSoDienThoai");

    const studentAvatar = studentAvatarInput.files[0];
    const studentLastName = studentLastNameInput.value.trim();
    const studentFirstName = studentFirstNameInput.value.trim();
    const studentDob = studentDobInput.value;
    const studentAddress = studentAddressInput.value.trim();
    const studentPhoneNumber = studentPhoneNumberInput.value.trim();

    // Validate inputs
    if (!studentLastName || !studentFirstName || !studentDob || !studentAddress || !studentPhoneNumber) {
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


function getPaginationWindow(currentPage, totalPages, paginationButtonSize) {
    // curent page = 1, totalPages = 5, pagination button size = 5
    const half = Math.floor(paginationButtonSize / 2); // => half = 2
    let start = Math.max(1, currentPage - half); // => start = 1
    let end = start + paginationButtonSize - 1; // => end = 5


    if (end > totalPages) { // end == total pages (5 == 5)
        end = totalPages; // => end = 5
        start = Math.max(1, end - paginationButtonSize + 1); // => start = 1
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return pages;

}

function initTablePagination() {
    const PAGINATION_ITEM_LIMIT_RENDERING_NUMBER = 5;
    const paginationContainer = document.getElementById("paginationContainer");

    const tablePageInfo = studentTable.page.info()
    const totalPages = Math.floor(tablePageInfo.recordsDisplay / 10);


    if (totalPages >= 2) {

        const paginationWindow = getPaginationWindow(1, totalPages, PAGINATION_ITEM_LIMIT_RENDERING_NUMBER);


        paginationContainer.innerHTML +=
        `
            <ol class="paginationFirstPageItem" id="paginationItem_first_page" onclick="goToPage(1)">Trang đầu</ol>
        `;

        for (let i = 0; i < paginationWindow.length; i++) {
            paginationContainer.innerHTML +=
                `
                    <ol class="paginationItems" id="paginationItem_${paginationWindow[i]}" onclick="goToPage(${paginationWindow[i]})">${paginationWindow[i]}</ol>
                `
        }

        paginationContainer.innerHTML +=
        `
            <ol class="paginationLastPageItem" id="paginationItem_last_page" onclick="goToPage(${tablePageInfo.pages})">Trang cuối</ol>
        `;


        // Set current active page
        const currentPaginationItem = document.getElementById(`paginationItem_${1}`);
        currentPaginationItem.classList.add("paginationActive");
    }

}

function goToPage(targetPage) {

    // Go to target page
    studentTable.page(targetPage - 1).draw(false);


    const PAGINATION_ITEM_LIMIT_RENDERING_NUMBER = 5;
    const paginationContainer = document.getElementById("paginationContainer");

    const tablePageInfo = studentTable.page.info()
    const totalPages = Math.floor(tablePageInfo.recordsDisplay / 10);

    const paginationWindow = getPaginationWindow(targetPage, totalPages, PAGINATION_ITEM_LIMIT_RENDERING_NUMBER);

    paginationContainer.innerHTML = '';

    paginationContainer.innerHTML +=
        `
        <ol class="paginationFirstPageItem" id="paginationItem_first_page" onclick="goToPage(1)">Trang đầu</ol>
    `;

    for (let i = 0; i < paginationWindow.length; i++) {
        paginationContainer.innerHTML +=
            `
                <ol class="paginationItems" id="paginationItem_${paginationWindow[i]}" onclick="goToPage(${paginationWindow[i]})">${paginationWindow[i]}</ol>
            `
    }

    paginationContainer.innerHTML +=
    `
        <ol class="paginationLastPageItem" id="paginationItem_last_page" onclick="goToPage(${tablePageInfo.pages - 1})">Trang cuối</ol>
    `;



    // Clear previous pagination item active style
    const previousActivetePaginationItem = document.getElementsByClassName("paginationActive")[0];
    if (previousActivetePaginationItem != null) {
        previousActivetePaginationItem.classList.remove("paginationActive")
    }

    // Set current active page
    const currentPaginationItem = document.getElementById(`paginationItem_${targetPage}`);
    currentPaginationItem.classList.add("paginationActive");

   

}



// ================== CALL FUNCTIONS ==================

initTablePagination();
