


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

async function searchStudent() {
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

            studentTable.search(staffSearchInputValue).draw();

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
    console.log("Ma nhan vien: " + id);
    studyClassIdInput.value = id;
}



// ================== TABLE PAGINATION ==================

function initTablePagination() {
    const PAGINATION_ITEM_LIMIT_RENDERING_NUMBER = 5;
    const paginationContainer = document.getElementById("paginationContainer");

    const tablePageInfo = staffTable.page.info()
    const currentPage = staffTable.page();


    if (tablePageInfo.pages > 0) {

        paginationContainer.innerHTML +=
            `
            <ol class="paginationFirstPageItem" id="paginationItem_first_page" onclick="goToFirstPage()">Trang đầu</ol>
        `;


        // If total pages less than or equal to limit number of pagination items
        if (tablePageInfo.pages <= PAGINATION_ITEM_LIMIT_RENDERING_NUMBER) {
            // Init pagination items
            for (let i = 0; i < tablePageInfo.pages; i++) {
                paginationContainer.innerHTML +=
                    `
                    <ol class="paginationItems" id="paginationItem_${i}" onclick="goToPage(${i})">${i + 1}</ol>
                `;
            }
        }
        // If total pages greater than limit number of pagination items
        if (tablePageInfo.pages > PAGINATION_ITEM_LIMIT_RENDERING_NUMBER) {
            for (let i = 0; i < PAGINATION_ITEM_LIMIT_RENDERING_NUMBER; i++) {
                // First pagination item
                if (i == 0) {
                    paginationContainer.innerHTML +=
                        `
                        <ol class="firstPaginationItem paginationItems" id="paginationItem_${i}" onclick="goToPage(0)">1</ol>
                    `;
                }
                // Last pagination item
                if (i == PAGINATION_ITEM_LIMIT_RENDERING_NUMBER - 1) {
                    paginationContainer.innerHTML +=
                        `
                        <ol class="lastPaginationItem paginationItems" id="paginationItem_${i}" onclick="goToPage(${i})">${i + 1}</ol>
                    `;
                }
                // Middle pagination items
                if (i > 0 && i < PAGINATION_ITEM_LIMIT_RENDERING_NUMBER - 1) {
                    paginationContainer.innerHTML +=
                        `
                        <ol class="paginationItems" id="paginationItem_${i}" onclick="goToPage(${i})">${i + 1}</ol>
                    `;
                }
            }


        }



        paginationContainer.innerHTML +=
            `
            <ol class="paginationLastPageItem" id="paginationItem_last_page" onclick="goToLastPage()">Trang cuối</ol>
        `;

        // Set current active page
        const currentPaginationItem = document.getElementById(`paginationItem_${currentPage}`)
        currentPaginationItem.classList.add("paginationActive");
    }
    else {
        return;
    }


}

function goToFirstPage() {

    // Go to target page
    staffTable.page(0).draw(false);

    const PAGINATION_ITEM_LIMIT_RENDERING_NUMBER = 5;

    const tablePageInfo = staffTable.page.info()
    const currentPage = staffTable.page();


    if (tablePageInfo.pages > 1) {
        // Clear pagination
        paginationContainer.innerHTML = '';

        // Re-create pagination go to first
        paginationContainer.innerHTML +=
            `
            <ol class="paginationFirstPageItem" id="paginationItem_first_page" onclick="goToFirstPage()">Trang đầu</ol>
        `;

        // If total pages less than or equal to limit number of pagination items
        if (tablePageInfo.pages <= PAGINATION_ITEM_LIMIT_RENDERING_NUMBER) {
            // Re-create pagination items
            // i < tablePageInfo.pages ensures that it not render a same number of PAGINATION_ITEM_LIMIT_RENDERING_NUMBER
            for (let i = 0; i < tablePageInfo.pages; i++) {
                // First pagination item
                if (i == 0) {
                    paginationContainer.innerHTML +=
                        `
                            <ol class="firstPaginationItem paginationItems" id="paginationItem_${i}" onclick="goToPage(${i})">${i + 1}</ol>
                        `;
                }
                // Last pagination item
                if (i == tablePageInfo.pages - 1) {
                    paginationContainer.innerHTML +=
                        `
                            <ol class="lastPaginationItem paginationItems" id="paginationItem_${i}" onclick="goToPage(${i})">${i + 1}</ol>
                        `;
                }
                // Middle pagination items
                if (i > 0 && i < tablePageInfo.pages - 1) {
                    paginationContainer.innerHTML +=
                        `
                            <ol class="paginationItems" id="paginationItem_${i}" onclick="goToPage(${i})">${i + 1}</ol>
                        `;
                }
            }
        }
        // If total pages greater than limit number of pagination items
        else {
            // i < PAGINATION_ITEM_LIMIT_RENDERING_NUMBER ensures that it render a same number of PAGINATION_ITEM_LIMIT_RENDERING_NUMBER
            for (let i = 0; i < PAGINATION_ITEM_LIMIT_RENDERING_NUMBER; i++) {
                // First pagination item
                if (i == 0) {
                    paginationContainer.innerHTML +=
                        `
                            <ol class="firstPaginationItem paginationItems" id="paginationItem_${i}" onclick="goToPage(${i})">${i + 1}</ol>
                        `;
                }
                // Last pagination item
                if (i == PAGINATION_ITEM_LIMIT_RENDERING_NUMBER - 1) {
                    paginationContainer.innerHTML +=
                        `
                            <ol class="lastPaginationItem paginationItems" id="paginationItem_${i}" onclick="goToPage(${i})">${i + 1}</ol>
                        `;
                }
                // Middle pagination items
                if (i > 0 && i < PAGINATION_ITEM_LIMIT_RENDERING_NUMBER - 1) {
                    paginationContainer.innerHTML +=
                        `
                            <ol class="paginationItems" id="paginationItem_${i}" onclick="goToPage(${i})">${i + 1}</ol>
                        `;
                }
            }
        }

        // Re-create pagination go to last
        paginationContainer.innerHTML +=
            `
            <ol class="paginationLastPageItem" id="paginationItem_last_page" onclick="goToLastPage()">Trang cuối</ol>
        `;
    }

    // Set current active page
    const currentPaginationItem = document.getElementById(`paginationItem_${currentPage}`)
    currentPaginationItem.classList.add("paginationActive");

    console.log(currentPaginationItem)
}

function goToLastPage() {
    const tablePageInfo = staffTable.page.info()

    // Go to target page
    staffTable.page(tablePageInfo.pages - 1).draw(false);

    const PAGINATION_ITEM_LIMIT_RENDERING_NUMBER = 5;

    const currentFirstPage = (tablePageInfo.pages + 1) - PAGINATION_ITEM_LIMIT_RENDERING_NUMBER;
    const currentLastPage = tablePageInfo.pages;
    const currentPage = staffTable.page();



    if (tablePageInfo.pages > 1) {
        // Clear pagination
        paginationContainer.innerHTML = '';

        // Re-create pagination go to first
        paginationContainer.innerHTML +=
            `
            <ol class="paginationFirstPageItem" id="paginationItem_first_page" onclick="goToFirstPage()">Trang đầu</ol>
        `;

        // If total pages less than or equal to limit number of pagination items
        if (tablePageInfo.pages <= PAGINATION_ITEM_LIMIT_RENDERING_NUMBER) {
            // i < tablePageInfo.pages ensures that it not render a same number of PAGINATION_ITEM_LIMIT_RENDERING_NUMBER
            for (let i = 0; i < tablePageInfo.pages; i++) {
                // First pagination item
                if (i == 0) {
                    paginationContainer.innerHTML +=
                        `
                            <ol class="firstPaginationItem paginationItems" id="paginationItem_${i}" onclick="goToPage(${i})">${i + 1}</ol>
                        `;
                }
                // Last pagination item
                if (i == tablePageInfo.pages - 1) {
                    paginationContainer.innerHTML +=
                        `
                            <ol class="lastPaginationItem paginationItems" id="paginationItem_${i}" onclick="goToPage(${i})">${i + 1}</ol>
                        `;
                }
                // Middle pagination items
                if (i > 0 && i < tablePageInfo.pages - 1) {
                    paginationContainer.innerHTML +=
                        `
                            <ol class="paginationItems" id="paginationItem_${i}" onclick="goToPage(${i})">${i + 1}</ol>
                        `;
                }
            }
        }
        // If total pages greater than limit number of pagination items
        else {
            // Re-create pagination items
            // i = currentFirstPage ensure that it render a new first item = previous first last + 1
            // i <= currentLastPage ensure that it render a new last item = previewous last item + 1
            for (let i = currentFirstPage; i <= currentLastPage; i++) {
                // First pagination item
                if (i == currentFirstPage) {
                    paginationContainer.innerHTML +=
                        `
                            <ol class="firstPaginationItem paginationItems" id="paginationItem_${i - 1}" onclick="goToPage(${i - 1})">${i}</ol>
                        `;
                }
                // Last pagination item
                if (i == currentLastPage) {
                    paginationContainer.innerHTML +=
                        `
                            <ol class="lastPaginationItem paginationItems" id="paginationItem_${i - 1}" onclick="goToPage(${i - 1})">${i}</ol>
                        `;
                }
                // Middle pagination items
                if (i > currentFirstPage && i < currentLastPage) {
                    paginationContainer.innerHTML +=
                        `
                            <ol class="paginationItems" id="paginationItem_${i - 1}" onclick="goToPage(${i - 1})">${i}</ol>
                        `;
                }
            }
        }

        // Re-create pagination go to last
        paginationContainer.innerHTML +=
            `
            <ol class="paginationLastPageItem" id="paginationItem_last_page" onclick="goToLastPage()">Trang cuối</ol>
        `;
    }

    // Set current active page
    const currentPaginationItem = document.getElementById(`paginationItem_${currentPage}`)
    currentPaginationItem.classList.add("paginationActive");

}

function goToPage(targetPage) {

    // Go to target page
    staffTable.page(targetPage).draw(false);

    const firstPaginationItem = document.getElementsByClassName("firstPaginationItem")[0];
    const lastPaginationItem = document.getElementsByClassName("lastPaginationItem")[0];
    const currentPaginationItem = document.getElementById(`paginationItem_${targetPage}`);

    if (currentPaginationItem.classList.contains('lastPaginationItem')) {
        console.log("HERE last pagination item")


        const PAGINATION_ITEM_LIMIT_RENDERING_NUMBER = 5;

        const currentPageOfFirstPaginationItem = parseInt(firstPaginationItem.innerText);
        const currentPageOfLastPaginationItem = parseInt(lastPaginationItem.innerText);
        const paginationContainer = document.getElementById("paginationContainer");

        const tablePageInfo = staffTable.page.info()
        const currentPage = staffTable.page();

        // Clear pagination
        paginationContainer.innerHTML = '';

        // Re-create pagination go to first
        paginationContainer.innerHTML +=
            `
            <ol class="paginationFirstPageItem" id="paginationItem_first_page" onclick="goToFirstPage()">Trang đầu</ol>
        `;


        // Re-create pagination items

        if (tablePageInfo.pages < PAGINATION_ITEM_LIMIT_RENDERING_NUMBER) {
            for (let i = 0; i < tablePageInfo.pages; i++) {
                // First pagination item
                if (i == 0) {
                    paginationContainer.innerHTML +=
                        `
                        <ol class="firstPaginationItem paginationItems" id="paginationItem_${i}" onclick="goToPage(${i})">${i + 1}</ol>
                    `;
                }
                // Last pagination item
                if (i == tablePageInfo.pages - 1) {
                    paginationContainer.innerHTML +=
                        `
                        <ol class="lastPaginationItem paginationItems" id="paginationItem_${i}" onclick="goToPage(${i})">${i + 1}</ol>
                    `;
                }
                // Middle pagination items
                if (i > 0 && i < tablePageInfo.pages - 1) {
                    paginationContainer.innerHTML +=
                        `
                        <ol class="paginationItems" id="paginationItem_${i}" onclick="goToPage(${i})">${i + 1}</ol>
                    `;
                }
            }
        }
        else {

            if (currentPageOfLastPaginationItem < tablePageInfo.pages) {
                console.log("less than final page");
                for (let i = currentPageOfFirstPaginationItem; i <= currentPageOfLastPaginationItem; i++) {

                    // First pagination item
                    if (i == currentPageOfFirstPaginationItem) {
                        paginationContainer.innerHTML +=
                            `
                                    <ol class="firstPaginationItem paginationItems" id="paginationItem_${i}" onclick="goToPage(${i})">${i + 1}</ol>
                                `;
                    }
                    // Last pagination item
                    if (i == currentPageOfLastPaginationItem) {
                        paginationContainer.innerHTML +=
                            `
                                    <ol class="lastPaginationItem paginationItems" id="paginationItem_${i}" onclick="goToPage(${i})">${i + 1}</ol>
                                `;
                    }
                    // Middle pagination items
                    if (i > currentPageOfFirstPaginationItem && i < currentPageOfLastPaginationItem) {
                        paginationContainer.innerHTML +=
                            `
                                    <ol class="paginationItems" id="paginationItem_${i}" onclick="goToPage(${i})">${i + 1}</ol>
                                `;
                    }

                }
            }
            else {
                // Re-create pagination items
                for (let i = tablePageInfo.pages - 4; i <= tablePageInfo.pages; i++) {
                    // First pagination item
                    if (i == tablePageInfo.pages - 4) {
                        paginationContainer.innerHTML +=
                            `
                        <ol class="firstPaginationItem paginationItems" id="paginationItem_${i - 1}" onclick="goToPage(${i - 1})">${i}</ol>
                    `;
                    }
                    // Last pagination item
                    if (i == tablePageInfo.pages) {
                        paginationContainer.innerHTML +=
                            `
                        <ol class="lastPaginationItem paginationItems" id="paginationItem_${i - 1}" onclick="goToPage(${i - 1})">${i}</ol>
                    `;
                    }
                    // Middle pagination items
                    if (i > tablePageInfo.pages - 4 && i < tablePageInfo.pages) {
                        paginationContainer.innerHTML +=
                            `
                        <ol class="paginationItems" id="paginationItem_${i - 1}" onclick="goToPage(${i - 1})">${i}</ol>
                    `;
                    }
                }
            }
        }


        // Re-create pagination go to last
        paginationContainer.innerHTML +=
            `
            <ol class="paginationLastPageItem" id="paginationItem_last_page" onclick="goToLastPage()">Trang cuối</ol>
        `;

        // Set current active page
        const currentPaginationItem = document.getElementById(`paginationItem_${currentPage}`)
        currentPaginationItem.classList.add("paginationActive");
        console.log(currentPaginationItem)

        return;
    }
    if (currentPaginationItem.classList.contains('firstPaginationItem')) {
        console.log("HERE first pagination item")

        const currentPageOfFirstPaginationItem = parseInt(firstPaginationItem.innerText);
        const currentPageOfLastPaginationItem = parseInt(lastPaginationItem.innerText);

        const tablePageInfo = staffTable.page.info()
        const currentPage = staffTable.page();



        // Clear pagination
        paginationContainer.innerHTML = '';

        // Re-create pagination go to first
        paginationContainer.innerHTML +=
            `
            <ol class="paginationFirstPageItem" id="paginationItem_first_page" onclick="goToFirstPage()">Trang đầu</ol>
        `;

        if (currentPageOfFirstPaginationItem == 1) {

            for (let i = currentPageOfFirstPaginationItem; i <= currentPageOfLastPaginationItem; i++) {

                console.log(`page index: ${i - 1} - showing page: ${i}`)

                // First pagination item
                if (i == currentPageOfFirstPaginationItem) {
                    paginationContainer.innerHTML +=
                        `
                            <ol class="firstPaginationItem paginationItems" id="paginationItem_${i - 1}" onclick="goToPage(${i - 1})">${i}</ol>
                        `;
                }
                // Last pagination item
                if (i == currentPageOfLastPaginationItem) {
                    paginationContainer.innerHTML +=
                        `
                            <ol class="lastPaginationItem paginationItems" id="paginationItem_${i - 1}" onclick="goToPage(${i - 1})">${i}</ol>
                        `;
                }
                // Middle pagination items
                if (i > currentPageOfFirstPaginationItem && i < currentPageOfLastPaginationItem) {
                    paginationContainer.innerHTML +=
                        `
                            <ol class="paginationItems" id="paginationItem_${i - 1}" onclick="goToPage(${i - 1})">${i}</ol>
                        `;
                }

            }

        }
        if (currentPageOfFirstPaginationItem > 1) {

            for (let i = currentPageOfFirstPaginationItem - 1; i < currentPageOfLastPaginationItem; i++) {

                console.log(`page index: ${i - 1} - showing page: ${i}`)

                // First pagination item
                if (i == currentPageOfFirstPaginationItem - 1) {
                    paginationContainer.innerHTML +=
                        `
                            <ol class="firstPaginationItem paginationItems" id="paginationItem_${i - 1}" onclick="goToPage(${i - 1})">${i}</ol>
                        `;
                }
                // Last pagination item
                if (i == currentPageOfLastPaginationItem - 1) {
                    paginationContainer.innerHTML +=
                        `
                            <ol class="lastPaginationItem paginationItems" id="paginationItem_${i - 1}" onclick="goToPage(${i - 1})">${i}</ol>
                        `;
                }
                // Middle pagination items
                if (i > currentPageOfFirstPaginationItem - 1 && i < currentPageOfLastPaginationItem - 1) {
                    paginationContainer.innerHTML +=
                        `
                            <ol class="paginationItems" id="paginationItem_${i - 1}" onclick="goToPage(${i - 1})">${i}</ol>
                        `;
                }

            }

        }
        // Re-create pagination go to last
        paginationContainer.innerHTML +=
            `
            <ol class="paginationLastPageItem" id="paginationItem_last_page" onclick="goToLastPage()">Trang cuối</ol>
        `;

        // Set current active page
        const currentPaginationItem = document.getElementById(`paginationItem_${currentPage}`)
        currentPaginationItem.classList.add("paginationActive");

        return;
    }
    else {
        // Clear previous pagination item active style
        const previousActivetePaginationItem = document.getElementsByClassName("paginationActive")[0];
        previousActivetePaginationItem.classList.remove("paginationActive")

        // Set current active page
        const currentPage = staffTable.page();
        currentPaginationItem.classList.add("paginationActive");
    }



}


// ================== CALL FUNCTIONS ==================

initTablePagination();

