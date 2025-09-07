


$(document).ready(function () {
    //// ================== INIT ==================
    $.fn.dataTable.moment('DD/MM/YYYY');

})

document.querySelectorAll(".btn-edit").forEach(btn => {
    btn.addEventListener("click", function () {
        const staffId = this.getAttribute("data-id");
        initUpdateStaffFields(staffId);
    });
});
document.querySelectorAll(".btn-delete").forEach(btn => {
    btn.addEventListener("click", function () {
        const staffId = this.getAttribute("data-id");
        initDeleteStaffField(staffId);
    });
});
document.querySelectorAll(".btn-reset").forEach(btn => {
    btn.addEventListener("click", function () {
        const staffId = this.getAttribute("data-id");
        initStaffResetPasswordField(staffId);
    });
});

let staffTable = new DataTable('#staffTable', {
    'dom': 'rt',    // "l" = length, "r" = processing, "t" = table, "p" = pagination
    columnDefs: [
        // Disable button column
        //{ orderable: false, targets: [6, 7] } 
    ]
});



// ================== SEARCH ==================

function preventSearchStaffSubmit() {
    searchStudyClass();

    return false;
}

function updateSearchOrderType() {
    const searchOrderTypeInput = document.getElementById("searchOrderType");
    searchOrderTypeInput.value = "SEARCH_ONLY";
}

async function searchStaff() {
    const searchResultLabel = document.getElementById("searchResultLabel");
    const staffsTableBody = document.getElementById("staffsTableBody");
    const searchOrderStaffForm = document.getElementById("searchOrderStaffForm");
    const staffSearchInputValue = document
        .getElementById("staffSearchInput")
        .value
        .trim();
    console.log(staffSearchInputValue);
    try {

        if (!staffSearchInputValue) {
            return;
        } else {

            staffTable.search(staffSearchInputValue).draw();

        }

    } catch (ex) {
        console.error(ex);
    }

    //    searchOrderStudyClassForm.requestSubmit();
}



// ================== ADD STUDY CLASS ==================
function addStaff() {
    const createStudentForm = document.getElementById("createStaffForm");
    const popup = document.getElementById("popupThemNhanVien");

    const staffFullNameInput = popup.querySelector("#themHoTen");
    //const staffDobInput = popup.querySelector("#themNgaySinh");
    const staffAddressInput = popup.querySelector("#themDiaChi");
    const staffPhoneNumberInput = popup.querySelector("#themSoDienThoai");


    const staffLastName = staffFullNameInput.value.trim();
    //const staffDob = staffDobInput.value;
    const staffAddress = staffAddressInput.value.trim();
    const staffPhoneNumber = staffPhoneNumberInput.value.trim();


    // Validate inputs
    if (!staffLastName || !staffAddress || !staffPhoneNumber) {
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


async function initUpdateStaffFields(id) {
    // Call API to get study class detail
    try {
        const staffIdInput = document.getElementById("suaMaNhanVien");
        const staffLastNameInput = document.getElementById("suaHoTen");
        //const staffDobInput = document.getElementById("suaNgaySinh");
        const staffAddressInput = document.getElementById("suaDiaChi");
        const staffPhoneNumberInput = document.getElementById("suaSoDienThoai");


        const response = await axios.get(`${BASE_URL}/api/lay-chi-tiet-nhan-vien/${id}`)
        const fetchedStudent = response.data;

        console.log(fetchedStudent);
        staffIdInput.value = fetchedStudent.id;
        staffLastNameInput.value = fetchedStudent.fullName;
        //staffDobInput.value = fetchedStudent.ngaySinh;
        staffAddressInput.value = fetchedStudent.address;
        staffPhoneNumberInput.value = fetchedStudent.phoneNumber;


        console.log(response)
    } catch (ex) {
        console.log(ex);
    }
}

function updateStaff() {
    const updateStudyClassForm = document.getElementById("updateStaffForm");

    const staffFullNameInput = document.getElementById("suaHoTen");
    //const staffDobInput = document.getElementById("suaNgaySinh");
    const staffAddressInput = document.getElementById("suaDiaChi");
    const staffPhoneNumberInput = document.getElementById("suaSoDienThoai");

    const staffFullName = staffFullNameInput.value.trim();
    //const staffDob = studentDobInput.value;
    const staffAddress = staffAddressInput.value.trim();
    const staffPhoneNumber = staffPhoneNumberInput.value.trim();

    // Validate inputs
    if (!staffFullName || !staffAddress || !staffPhoneNumber) {
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
async function initDeleteStaffField(id) {
    const studyClassIdInput = document.getElementById("xoaMaNhanVien");
    console.log("Ma nhan vien: " + id);
    studyClassIdInput.value = id;
}


//=================== RESET PASSWORD ==================
async function initStaffResetPasswordField(id) {
    const studyClassIdInput = document.getElementById("maNhanVien");
    studyClassIdInput.value = id;
}



// ================== TABLE PAGINATION ==================


function getPaginationWindow(currentPage, totalPages, paginationButtonSize) {
    // curent page = 5, totalPages = 10, pagination button size = 5
    const half = Math.floor(paginationButtonSize / 2); // => half = 2
    let start = Math.max(1, currentPage - half); // => start = 3
    let end = start + paginationButtonSize - 1; // => end = 7

    // 1 2 3 4 5 6 7 8 9 10

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

    const tablePageInfo = staffTable.page.info()
    const totalPages = Math.ceil(tablePageInfo.recordsDisplay / 10);


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
            <ol class="paginationLastPageItem" id="paginationItem_last_page" onclick="goToPage(${totalPages})">Trang cuối</ol>
        `;


        // Set current active page
        const currentPaginationItem = document.getElementById(`paginationItem_${1}`);
        currentPaginationItem.classList.add("paginationActive");
    }


}


function goToPage(targetPage) {

    // Go to target page
    staffTable.page(targetPage - 1).draw(false);


    const PAGINATION_ITEM_LIMIT_RENDERING_NUMBER = 5;
    const paginationContainer = document.getElementById("paginationContainer");

    const tablePageInfo = staffTable.page.info()
    const totalPages = Math.ceil(tablePageInfo.recordsDisplay / 10);

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
        <ol class="paginationLastPageItem" id="paginationItem_last_page" onclick="goToPage(${totalPages})">Trang cuối</ol>
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

