


$(document).ready(function () {
    //// ================== INIT ==================
    $.fn.dataTable.moment('DD/MM/YYYY');

})

const colCount = document.querySelectorAll('#eventTable thead th').length;
let disableCols = [];

// Luôn disable cột "Kết quả" (cuối cùng)
disableCols.push(colCount - 1);

// Nếu có thêm cột thao tác + điểm danh (admin)
if (colCount > 6) {
    disableCols.push(colCount - 2, colCount - 3);
}

let eventTable = new DataTable('#eventTable', {
    dom: 'rt',
    columnDefs: [
        { orderable: false, targets: disableCols }
    ],
    language: {
        emptyTable: "Hiện không có sự kiện nào",
        zeroRecords: "Không tìm thấy sự kiện nào",
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
function addEvent() {
    const createEventForm = document.getElementById("createEventForm");
    const popup = document.getElementById("popupThemSuKien");

    const eventTitleInput = popup.querySelector("#themTieuDe");
    const eventCoordinatorInput = popup.querySelector("#themNguoiPhuTrach");
    const eventExpectedQuantityInput = popup.querySelector("#themSoLuongDuKien");

    const eventTitle = eventTitleInput.value.trim();
    const eventCoordinator = eventCoordinatorInput.value;
    const eventExpectedQuantity = eventExpectedQuantityInput.value.trim();

    // Validate inputs
    if (!eventExpectedQuantity || !eventCoordinator || !eventTitle) {
        Swal.fire(
            "Lỗi",
            "Vui lòng nhập đầy đủ dữ liệu",
            "warning"
        );
        return;
    }


    // Submit form
    createEventForm.requestSubmit();
};


// ================== EDIT CLASS ==================


async function initUpdateEventFields(id) {
    // Call API to get study class detail
    try {
        const eventIdInput = document.getElementById("suaMaSuKien");
        const eventTitleInput = document.getElementById("suaTieuDe");
        const eventExpectedQuantityInput = document.getElementById("suaSoLuongDuKien");
        const eventDateTime = document.getElementById("suaThoiGian");

        const response = await axios.get(`/api/lay-chi-tiet-su-kien/${id}`)
        const fetchedEvent = response.data;

        eventIdInput.value = id;
        eventTitleInput.value = fetchedEvent.tieuDe;
        eventExpectedQuantityInput.value = fetchedEvent.soLuongDuKien;
        eventDateTime.value = fetchedEvent.thoiGian;

        // Đổ danh sách người phụ trách
        const responseStaff = await axios.get(`api/lay-danh-sach-ten-nguoi-phu-trach`);
        const fetchedStaff = responseStaff.data;

        const dropdown = document.getElementById("suaMaNguoiPhuTrach");
        dropdown.innerHTML = ""; // clear cũ nếu có
        
        console.log("Mã người phụ trách: " + fetchedEvent);
        fetchedStaff.forEach(item => {
            const option = document.createElement("option");
            option.value = item.id;
            option.textContent = item.name;
            if (item.id == fetchedEvent.maNguoiPhuTrach) {
                option.selected = true;
            }
            dropdown.appendChild(option);
        });


        console.log(response)
    } catch (ex) {
        console.log(ex);
    }

}


function updateEvent() {
    const updateEventForm = document.getElementById("updateEventForm");

    const eventTitleInput = document.getElementById("suaTieuDe");
    const eventCoordinatorInput = document.getElementById("suaMaNguoiPhuTrach");
    const eventExpectedQuantityInput = document.getElementById("suaSoLuongDuKien");

    const eventTitle = eventTitleInput.value.trim();
    const eventCoordinator = eventCoordinatorInput.value.trim();
    const eventExpectedQuantity = eventExpectedQuantityInput.value;

    // Validate inputs
    if (!eventTitle || !eventCoordinator || !eventExpectedQuantity) {
        Swal.fire(
            "Lỗi",
            "Vui lòng nhập đầy đủ dữ liệu",
            "warning"
        );
        return;
    }

    // Submit form
    updateEventForm.requestSubmit();
};


// ================== DELETE CLASS ==================
async function initDeleteEventField(id) {
    const eventIdInput = document.getElementById("xoaMaSuKien");
    console.log("Mã sự kiện: " + id);
    eventIdInput.value = id;
}



// ================== LOCK EVENT ==================
async function initLockEvent(id) {
    const eventIdInput = document.getElementById("khoaMaSuKien");
    eventIdInput.value = id;
}

function genQrCode(id) {
    console.log("Gen QR");

    const link = "https://localhost:5046/diem-danh-su-kien/" + id;
    // Gán link vào input
    const attendanceLink = document.getElementById('attendanceLink');
    attendanceLink.value = "https://localhost:5046/diem-danh-su-kien/" + id;

    const olink = document.getElementById("attendanceLinkClick");
    // Gán link YouTube động
    olink.href = link;
    olink.target = "_blank"; // mở tab mới

    // Clear QR cũ
    document.getElementById("qrcode").innerHTML = "";

    // Sinh QR mới
    qr = new QRCode(document.getElementById("qrcode"), {
        text: link,
        width: 200,
        height: 200,
    });

    // Gán sự kiện copy
    document.getElementById("copyBtn").onclick = function () {
        navigator.clipboard.writeText(link).then(() => {
            Swal.fire({
                icon: "success",
                title: "Đã copy link!",
                showConfirmButton: false,
                timer: 1200
            });

            // Hiệu ứng đổi text nút Copy
            const copyBtn = document.getElementById("copyBtn");
            const oldText = copyBtn.textContent;
            copyBtn.textContent = "Copied";
            setTimeout(() => (copyBtn.textContent = oldText), 1500);
        });
    };
}

// ================== TABLE PAGINATION ==================
function initTablePagination() {
    const paginationContainer = document.getElementById("paginationContainer");

    const tablePageInfo = eventTable.page.info()
    const currentPage = eventTable.page();


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
    eventTable.page(targetPage).draw(false);

    // Clear previous pagination item active style
    const previousActivetePaginationItem = document.getElementsByClassName("paginationActive")[0];
    previousActivetePaginationItem.classList.remove("paginationActive")

    // Set current active page
    const currentPage = eventTable.page();
    const currentPaginationItem = document.getElementById(`paginationItem_${currentPage}`)
    currentPaginationItem.classList.add("paginationActive");


}

async function initStaffList() {
    try {
        const response = await axios.get(`api/lay-danh-sach-ten-nguoi-phu-trach`);
        const fetchedStaff = response.data;

        const dropdown = document.getElementById("themNguoiPhuTrach");
        dropdown.innerHTML = ""; // clear cũ nếu có

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Chọn người phụ trách"
        defaultOption.disabled = true;
        defaultOption.selected = true;
        dropdown.appendChild(defaultOption);


        fetchedStaff.forEach(item => {
            const option = document.createElement("option");
            option.value = item.id;
            option.textContent = item.name;
            dropdown.appendChild(option);
        });

    } catch (ex) {
        console.log(ex);
    }
}



// ================== CALL FUNCTIONS ==================

initTablePagination();
