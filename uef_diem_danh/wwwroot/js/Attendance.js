


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
    const PAGINATION_ITEM_LIMIT_RENDERING_NUMBER = 5;
    const paginationContainer = document.getElementById("paginationContainer");

    const tablePageInfo = attendanceManagementTable.page.info()
    const currentPage = attendanceManagementTable.page();


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
    attendanceManagementTable.page(0).draw(false);

    const PAGINATION_ITEM_LIMIT_RENDERING_NUMBER = 5;

    const tablePageInfo = attendanceManagementTable.page.info()
    const currentPage = attendanceManagementTable.page();


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

}

function goToLastPage() {
    const tablePageInfo = attendanceManagementTable.page.info()

    // Go to target page
    attendanceManagementTable.page(tablePageInfo.pages - 1).draw(false);

    const PAGINATION_ITEM_LIMIT_RENDERING_NUMBER = 5;

    const currentFirstPage = (tablePageInfo.pages + 1) - PAGINATION_ITEM_LIMIT_RENDERING_NUMBER;
    const currentLastPage = tablePageInfo.pages;
    const currentPage = attendanceManagementTable.page();



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
    attendanceManagementTable.page(targetPage).draw(false);

    const firstPaginationItem = document.getElementsByClassName("firstPaginationItem")[0];
    const lastPaginationItem = document.getElementsByClassName("lastPaginationItem")[0];
    const currentPaginationItem = document.getElementById(`paginationItem_${targetPage}`);

    if (currentPaginationItem.classList.contains('lastPaginationItem')) {
        console.log("HERE last pagination item")


        const PAGINATION_ITEM_LIMIT_RENDERING_NUMBER = 5;

        const currentPageOfFirstPaginationItem = parseInt(firstPaginationItem.innerText);
        const currentPageOfLastPaginationItem = parseInt(lastPaginationItem.innerText);
        const paginationContainer = document.getElementById("paginationContainer");

        const tablePageInfo = attendanceManagementTable.page.info()
        const currentPage = attendanceManagementTable.page();

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

        const tablePageInfo = attendanceManagementTable.page.info()
        const currentPage = attendanceManagementTable.page();



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
        const currentPage = attendanceManagementTable.page();
        currentPaginationItem.classList.add("paginationActive");
    }



}



// ================== CALL FUNCTIONS ==================

initTablePagination();

