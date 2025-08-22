


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
            return;
        } else {
            attendanceManagementTable.search(search).draw();
        }

    } catch (ex) {
        console.error(ex);
    }

}


// ================== TABLE PAGINATION ==================
function initTablePagination() {
    const paginationContainer = document.getElementById("paginationContainer");

    const tablePageInfo = attendanceManagementTable.page.info()
    const currentPage = attendanceManagementTable.page();


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


    console.log(currentPage);
}

function goToPage(targetPage) {
    // Go to target page
    attendanceManagementTable.page(targetPage).draw(false);

    // Clear previous pagination item active style
    const previousActivetePaginationItem = document.getElementsByClassName("paginationActive")[0];
    previousActivetePaginationItem.classList.remove("paginationActive")

    // Set current active page
    const currentPage = attendanceManagementTable.page();
    const currentPaginationItem = document.getElementById(`paginationItem_${currentPage}`)
    currentPaginationItem.classList.add("paginationActive");

}



// ================== CALL FUNCTIONS ==================

initTablePagination();

