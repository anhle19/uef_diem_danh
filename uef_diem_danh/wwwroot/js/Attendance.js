


//// ================== INIT ==================
$(document).ready(function () {
    $.fn.dataTable.moment('DD/MM/YYYY');
})


let attendanceManagementTable = new DataTable('#attendanceManagementTable', {
    dom: 'rt',    // "l" = length, "r" = processing, "t" = table, "i" = info, "p" = pagination
    // Notice no "f" here, which is the default filter/search box
    columnDefs: [
        { orderable: false, targets: [3] } // Disable button column
    ],
    language: {
        emptyTable: "Hiện không có dữ liệu điểm danh nào",
        zeroRecords: "Không tìm thấy điểm danh nào",
    }
});


// ================== SEARCH ==================
function preventSearchAttendancesSubmit() {
    searchAttendances();

    return false;
}

async function searchAttendances() {
    const search = document
        .getElementById("attendanceSearchInput")
        .value
        .trim();

    try {

        if (!search) {
            attendanceManagementTable.search('').draw();
        } else {
            attendanceManagementTable.search(search).draw();

            const paginationContainer = document.getElementById("paginationContainer");

            paginationContainer.innerHTML = '';

            initTablePagination()
        }

    } catch (ex) {
        console.error(ex);
    }

}


// ================== TABLE PAGINATION ==================


function getPaginationWindow(currentPage, totalPages, paginationButtonSize) {
    // curent page = 5, totalPages = 10, pagination button size = 5
    const half = Math.floor(paginationButtonSize / 2); // => half = 2
    let start = Math.max(1, currentPage - half); // => start = 3
    let end = start + paginationButtonSize - 1; // => end = 7


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

    const tablePageInfo = attendanceManagementTable.page.info()
    const totalPages = Math.ceil(tablePageInfo.recordsDisplay / 10);


    if (totalPages > 1) {
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
    attendanceManagementTable.page(targetPage - 1).draw(false);


    const PAGINATION_ITEM_LIMIT_RENDERING_NUMBER = 5;
    const paginationContainer = document.getElementById("paginationContainer");

    const tablePageInfo = attendanceManagementTable.page.info()
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

