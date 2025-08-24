


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
function initTablePagination() {
    const PAGINATION_ITEM_LIMIT_RENDERING_NUMBER = 5;
    const paginationContainer = document.getElementById("paginationContainer");

    const tablePageInfo = studentTable.page.info()
    const currentPage = studentTable.page();


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
    studentTable.page(0).draw(false);

    const PAGINATION_ITEM_LIMIT_RENDERING_NUMBER = 5;

    const tablePageInfo = studentTable.page.info()
    const currentPage = studentTable.page();



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
    const tablePageInfo = studentTable.page.info()

    // Go to target page
    studentTable.page(tablePageInfo.pages - 1).draw(false);

    const PAGINATION_ITEM_LIMIT_RENDERING_NUMBER = 5;

    const currentFirstPage = (tablePageInfo.pages + 1) - PAGINATION_ITEM_LIMIT_RENDERING_NUMBER;
    const currentLastPage = tablePageInfo.pages;
    const currentPage = studentTable.page();



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
    studentTable.page(targetPage).draw(false);

    const firstPaginationItem = document.getElementsByClassName("firstPaginationItem")[0];
    const lastPaginationItem = document.getElementsByClassName("lastPaginationItem")[0];
    const currentPaginationItem = document.getElementById(`paginationItem_${targetPage}`);

    if (currentPaginationItem.classList.contains('lastPaginationItem')) {
        console.log("HERE last pagination item")


        const PAGINATION_ITEM_LIMIT_RENDERING_NUMBER = 5;

        const currentPageOfFirstPaginationItem = parseInt(firstPaginationItem.innerText);
        const currentPageOfLastPaginationItem = parseInt(lastPaginationItem.innerText);
        const paginationContainer = document.getElementById("paginationContainer");

        const tablePageInfo = studentTable.page.info()
        const currentPage = studentTable.page();

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

        const tablePageInfo = studentTable.page.info()
        const currentPage = studentTable.page();



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
        const currentPage = studentTable.page();
        currentPaginationItem.classList.add("paginationActive");
    }



}



// ================== CALL FUNCTIONS ==================

initTablePagination();

