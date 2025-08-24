


$(document).ready(function () {
    //// ================== INIT ==================
    $.fn.dataTable.moment('DD/MM/YYYY');


})


let studyClassTable = new DataTable('#studyClassTable', {
    dom: 'rt',    // "l" = length, "r" = processing, "t" = table, "i" = info, "p" = pagination
    // Notice no "f" here, which is the default filter/search box
    columnDefs: [
        { orderable: false, targets: [4, 5, 6, 7] } // Disable button column
    ],
    language: {
        emptyTable: "Hiện không có dữ liệu lớp học nào",
        zeroRecords: "Không tìm thấy lớp học nào",
    }
});

// ================== ADD STUDY CLASS ==================

function addStudyClass() {
    const createStudyClassForm = document.getElementById("createStudyClassForm");
    const popup = document.getElementById("popupThemLop");
    const teacherPhoneNumberInput = popup.querySelector("#themGiaoVien");
    const studyClassNameInput = popup.querySelector("#themTenLop");
    const studyClassStartDayInput = popup.querySelector("#themNgayBD");
    const studyClassEndDayInput = popup.querySelector("#themNgayKT");

    const teacherPhoneNumber = teacherPhoneNumberInput.value.trim();
    const studyClassName = studyClassNameInput.value.trim();
    const studyClassStartDay = studyClassStartDayInput.value;
    const studyClassEndDay = studyClassEndDayInput.value;

    // Validate inputs
    if (!studyClassName || !studyClassStartDay || !studyClassEndDay || !teacherPhoneNumber) {
        Swal.fire(
            "Lỗi",
            "Vui lòng nhập đầy đủ Số điện thoại giáo viên, Tên lớp, Ngày bắt đầu hoặc Ngày kết thúc",
            "warning"
        );
        return;
    }
    if (studyClassName && !studyClassStartDay && studyClassEndDay) {
        Swal.fire(
            "Lỗi",
            "Vui lòng nhập đầy đủ Ngày bắt đầu",
            "warning"
        );
        return;
    }
    if (studyClassName && studyClassStartDay && !studyClassEndDay) {
        Swal.fire(
            "Lỗi",
            "Vui lòng nhập đầy đủ Ngày kết thúc",
            "warning"
        );
        return;
    }
    if (new Date(studyClassStartDay) > new Date(studyClassEndDay)) {
        Swal.fire(
            "Lỗi",
            "Ngày bắt đầu phải trước hoặc bằng ngày kết thúc",
            "warning"
        );
        return;
    }

    // Submit form
    createStudyClassForm.requestSubmit();
};


// ================== EDIT CLASS ==================
async function initUpdateStudyClassFields(id) {

    // Call API to get study class detail
    try {
        const teacherPhoneNumberInput = document.getElementById("suaGiaoVien");
        const studyClassIdInput = document.getElementById("suaMaLop");
        const studyClassNameInput = document.getElementById("suaTenLop");
        const studyClassStartDayInput = document.getElementById("suaNgayBD");
        const studyClassEndDayInput = document.getElementById("suaNgayKT");

        const response = await axios.get(`${BASE_URL}/api/lay-chi-tiet-lop-hoc/${id}`)
        const fetchedStudyClass = response.data;

        console.log(fetchedStudyClass);
        teacherPhoneNumberInput.value = fetchedStudyClass.teacherPhoneNumber;
        studyClassIdInput.value = fetchedStudyClass.maLopHoc;
        studyClassNameInput.value = fetchedStudyClass.tenLopHoc;
        studyClassStartDayInput.value = fetchedStudyClass.thoiGianBatDau;
        studyClassEndDayInput.value = fetchedStudyClass.thoiGianKetThuc;

        console.log(response)
    } catch (ex) {
        console.log(ex);
    }


}

function updateStudyClass() {
    const updateStudyClassForm = document.getElementById("updateStudyClassForm");
    const teacherPhoneNumberInput = document.getElementById("suaGiaoVien");
    const studyClassNameInput = document.getElementById("suaTenLop");
    const studyClassStartDayInput = document.getElementById("suaNgayBD");
    const studyClassEndDayInput = document.getElementById("suaNgayKT");

    const teacherPhoneNumber = teacherPhoneNumberInput.value.trim();
    const studyClassName = studyClassNameInput.value.trim();
    const studyClassStartDay = studyClassStartDayInput.value;
    const studyClassEndDay = studyClassEndDayInput.value;

    // Validate inputs
    if (!studyClassName || !studyClassStartDay || !studyClassEndDay || !teacherPhoneNumber) {
        Swal.fire(
            "Lỗi",
            "Vui lòng nhập đầy đủ Số điện thoại giáo viên, Tên lớp, Ngày bắt đầu hoặc Ngày kết thúc",
            "warning"
        );
        return;
    }
    if (studyClassName && !studyClassStartDay && studyClassEndDay) {
        Swal.fire(
            "Lỗi",
            "Vui lòng nhập đầy đủ Ngày bắt đầu",
            "warning"
        );
        return;
    }
    if (studyClassName && studyClassStartDay && !studyClassEndDay) {
        Swal.fire(
            "Lỗi",
            "Vui lòng nhập đầy đủ Ngày kết thúc",
            "warning"
        );
        return;
    }
    if (new Date(studyClassStartDay) > new Date(studyClassEndDay)) {
        Swal.fire(
            "Lỗi",
            "Ngày bắt đầu phải trước hoặc bằng ngày kết thúc",
            "warning"
        );
        return;
    }


    // Submit form
    updateStudyClassForm.requestSubmit();
};


// ================== DELETE CLASS ==================
async function initDeleteStudyClassField(id) {
    const studyClassIdInput = document.getElementById("xoaMaLop");

    studyClassIdInput.value = id;
}


// ================== IMPORT STUDENTS ==================
(function setupImport() {
    const popup = document.getElementById("popupImport");
    const btnDownload = document.getElementById("btnDownloadTemplate");
    const fileInput = document.getElementById("fileImport");
    const btnImport = document.getElementById("btnThucHienImport");
    let currentClassId = null;

    popup.addEventListener("show.bs.modal", (ev) => {
        currentClassId = Number(ev.relatedTarget.getAttribute("data-id"));
        fileInput.value = "";
    });

    // Tải file mẫu
    btnDownload.addEventListener("click", () => {
        const csvHeader = "lastName,firstName,email\n";
        const csvSample =
            csvHeader + "Nguyen,An,an@example.com\nTran,Binh,binh@example.com\n";
        const blob = new Blob([csvSample], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "mau_import_hoc_vien.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    });

    btnImport.addEventListener("click", () => {
        const file = fileInput.files?.[0];
        if (!file) {
            Swal.fire("Thông báo", "Vui lòng chọn file trước khi import", "info");
            return;
        }
        if (!file.name.endsWith(".csv")) {
            Swal.fire("Thông báo", "Demo này chỉ đọc nhanh", "info");

            return;
        }
        const reader = new FileReader();
        reader.onload = function (e) {
            const text = e.target.result;
            const lines = String(text).split(/\r?\n/).filter(Boolean);
            if (lines.length <= 1) {
                Swal.fire("Lỗi", "File trống hoặc sai định dạng", "error");
                return;
            }
            const rows = lines.slice(1).map((l) => l.split(","));
            const toAdd = rows.map((r, i) => ({
                id: Date.now() + i,
                lastName: r[0]?.trim() || "",
                firstName: r[1]?.trim() || "",
                email: r[2]?.trim() || "",
            }));
            if (!studentsByClass[currentClassId])
                studentsByClass[currentClassId] = [];
            studentsByClass[currentClassId].push(...toAdd);
            Swal.fire(
                "Thành công",
                `Đã import ${toAdd.length} học viên vào lớp`,
                "success"
            );
            bootstrap.Modal.getInstance(popup)?.hide();
        };
        reader.readAsText(file, "utf-8");
    });
})();

// ================== SEARCH ==================
function preventSearchStudyClassSubmit() {
    searchStudyClass();

    return false;
}

async function searchStudyClass() {
    const searchResultLabel = document.getElementById("searchResultLabel");
    const studyClassesTableBody = document.getElementById("classesTableBody");
    const searchOrderStudyClassForm = document.getElementById("searchOrderStudyClassForm");
    const studyClassSearchInputValue = document
        .getElementById("studyClassSearchInput")
        .value
        .trim();
    console.log(studyClassSearchInputValue);
    try {

        if (!studyClassSearchInputValue) {
            return;
        } else {

            studyClassTable.search(studyClassSearchInputValue).draw();

        }

    } catch (ex) {
        console.error(ex);
    }

}


// ================== TABLE PAGINATION ==================


function initTablePagination() {
    const PAGINATION_ITEM_LIMIT_RENDERING_NUMBER = 5;
    const paginationContainer = document.getElementById("paginationContainer");

    const tablePageInfo = studyClassTable.page.info()
    const currentPage = studyClassTable.page();


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
    studyClassTable.page(0).draw(false);

    const PAGINATION_ITEM_LIMIT_RENDERING_NUMBER = 5;

    const tablePageInfo = studyClassTable.page.info()
    const currentPage = studyClassTable.page();


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
    const tablePageInfo = studyClassTable.page.info()

    // Go to target page
    studyClassTable.page(tablePageInfo.pages - 1).draw(false);

    const PAGINATION_ITEM_LIMIT_RENDERING_NUMBER = 5;

    const currentFirstPage = (tablePageInfo.pages + 1) - PAGINATION_ITEM_LIMIT_RENDERING_NUMBER;
    const currentLastPage = tablePageInfo.pages;
    const currentPage = studyClassTable.page();


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
    studyClassTable.page(targetPage).draw(false);

    const firstPaginationItem = document.getElementsByClassName("firstPaginationItem")[0];
    const lastPaginationItem = document.getElementsByClassName("lastPaginationItem")[0];
    const currentPaginationItem = document.getElementById(`paginationItem_${targetPage}`);

    if (currentPaginationItem.classList.contains('lastPaginationItem')) {
        console.log("HERE last pagination item")


        const PAGINATION_ITEM_LIMIT_RENDERING_NUMBER = 5;

        const currentPageOfFirstPaginationItem = parseInt(firstPaginationItem.innerText);
        const currentPageOfLastPaginationItem = parseInt(lastPaginationItem.innerText);
        const paginationContainer = document.getElementById("paginationContainer");

        const tablePageInfo = studyClassTable.page.info()
        const currentPage = studyClassTable.page();

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

        const tablePageInfo = studyClassTable.page.info()
        const currentPage = studyClassTable.page();



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
        const currentPage = studyClassTable.page();
        currentPaginationItem.classList.add("paginationActive");
    }



}


// ================== CALL FUNCTIONS ==================

initTablePagination();

