$(document).ready(function () {
    //// ================== INIT ==================
    $.fn.dataTable.moment('DD/MM/YYYY');

    initAddStudentToStudyClassTable();
})


let addStudentToStudyClassTable = new DataTable('#addStudentToStudyClassTable', {
    dom: 'rtp'    // "l" = length, "r" = processing, "t" = table, "i" = info, "p" = pagination
    // Notice no "f" here, which is the default filter/search box
});


async function initAddStudentToStudyClassTable() {
    try {
        const addStudentToStudyClassTableBody = document.getElementById("addStudentToStudyClassTableBody");

        const response = await axios.get(`https://localhost:7045/api/quan-ly-danh-sach-lop-hoc/danh-sach-hoc-vien-con-trong`)
        const data = response.data;


        addStudentToStudyClassTable.rows.add(data.map(student => [
            student.id,
            `${student.lastName} ${student.firstName}`,
            student.email,
            student.phoneNumber,
            student.barCode,
            `<button
                type="button"
                id="add-student-${student.id}"
                class="btn btn-outline-primary btn-sm"
                onclick="addStudentToStudyClass(${student.id})">
                    Thêm
            </button>`
        ]));
        addStudentToStudyClassTable.draw();

    } catch (ex) {
        console.error(ex);
    }
}

// ================== SEARCH ==================
function preventSearchAvailableStudentInputSubmit() {
    searchAvailableStudent();

    return false;
}

async function searchAvailableStudent() {
    const search = document
        .getElementById("searchAvailableStudentInput")
        .value
        .trim();

    try {

        if (!search) {
            return;
        } else {
            addStudentToStudyClassTable.search(search).draw();
        }

    } catch (ex) {
        console.error(ex);
    }

}



// ================== ADD STUDENT TO STUDY CLASS ==================

async function addStudentToStudyClass(studentId) {
    try {
        const studyClassId = document.getElementById("studyClassId").value;
        const addStudentBtn = document.getElementById(`add-student-${studentId}`);

        const addStudentToStudyClassRequest = {
            StudentId: studentId
        }
        const response = await axios.post(`https://localhost:7045/api/quan-ly-danh-sach-lop-hoc/${studyClassId}/them-hoc-vien-vao-lop-hoc`, addStudentToStudyClassRequest);
        console.log(response)
        addStudentBtn.innerText = "Đã thêm";
        addStudentBtn.disabled = true;

        console.log(studyClassId)
    } catch (ex) {
        console.log(ex);
    }
}

function enableSubmitButton() {
    const studentExcelFileInput = document.getElementById("ExcelFile");
    const uploadedExcelFileName = document.getElementById("uploadedExcelFileName");
    const submitImportingStudentBtn = document.getElementById("submitImportingStudent");

    uploadedExcelFileName.innerText = `Đã tải lên tệp excel: ${studentExcelFileInput.files[0].name}`;

    submitImportingStudentBtn.style.display = "block"
}


// ================== DELETE ==================
function initDeleteStudentInStudyClassField(studentId) {
    const removeStudentIdInput = document.getElementById("removeStudentIdInput");

    removeStudentIdInput.value = studentId;
}



// ================== STUDENT CARD PDF PRINT ==================

async function printStudentCard(id, fullName, phoneNumber, dob) {

    console.log(id)


    let studentCardHtmlContent =
    `
    <div class="sheet d-flex justify-content-center align-items-center">
        <div class="card student-card text-center">
            <div>
                <img src="https://placehold.co/150x150/0d6efd/FFFFFF?text=AVATAR" class="card-img-top mx-auto d-block" alt="Ảnh đại diện">
                    <div class="card-body">
                        <h5 class="card-title text-primary">${fullName}</h5>
                        <p class="card-text text-muted"><strong>Ngày sinh:</strong> ${dob}</p>
                        <p class="card-text text-muted"><strong>SĐT:</strong> ${phoneNumber}</p>
                    </div>
            </div>
            <div class="barcode-section">
                <svg id="studentBarcode-${id}"></svg>
            </div>
        </div>
    </div>
    `;


    const hiddenStudentCardPrintContainer = document.getElementById('hiddenStudentCardPrintContainer');

    // Overflow y hidden
    document.body.style.overflowY = 'hidden';

    // Init PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a5');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();


    // Parse into DOM nodes
    const template = document.createElement('template');
    template.innerHTML = studentCardHtmlContent.trim();
    const studentCardElement = template.content.firstChild;

    // Append to the DOM (hidden)
    hiddenStudentCardPrintContainer.appendChild(studentCardElement);

    // Generate barcode
    const studentPhoneNumber = phoneNumber; // Lấy số điện thoại từ thẻ
    JsBarcode(`#studentBarcode-${id}`, studentPhoneNumber, {
        format: "CODE128",
        displayValue: false, // Không hiển thị số điện thoại bên dưới barcode
        width: 1.5,
        height: 50,
        margin: 5
    });


    // Create image from card element
    const canvas = await html2canvas(studentCardElement, { scale: 1.1, useCORS: true });
    const imgData = canvas.toDataURL("image/png");

    // Scale image to fit page width
    let imgWidth = pageWidth;
    let imgHeight = (canvas.height * imgWidth) / canvas.width;

    // If the height is too big, scale by height instead
    if (imgHeight > pageHeight) {
        imgHeight = pageHeight;
        imgWidth = (canvas.width * imgHeight) / canvas.height;
    }

    // Center the image
    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    // Add image
    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);


    // Save PDF
    pdf.save(`the_hoc_vien_${phoneNumber}.pdf`);

    alert("In thẻ học viên thành công");

    // Reset body overflow
    document.body.style.overflowY = 'auto';

    // Clear hidden container childs
    hiddenStudentCardPrintContainer.innerHTML = '';

}

async function printStudentCards(students) {

    const hiddenStudentCardsPrintContainer = document.getElementById("hiddenStudentCardsPrintContainer");

    const totalPages = Math.ceil(students.length / 10);


    // Generate Student Card HTML
    for (let i = 0; i < totalPages; i++) {
        let processingStudentList = students.splice(0, 10);

        hiddenStudentCardsPrintContainer.innerHTML += 
        `
            <div class="multiple-student-cards-sheet" id="sheet_${i}">

            </div>
        `;

        processingStudentList.forEach((student) => {
            const currentSheet = document.getElementById(`sheet_${i}`)

            currentSheet.innerHTML +=
            `
                <div class="card multiple-student-card text-center">
                    <div class="multiple-card-top">
                        <img src="https://placehold.co/150x150/0d6efd/FFFFFF?text=AVATAR" class="multiple-card-img-top" alt="Ảnh đại diện">
                        <div class="multiple-card-body">
                            <h5>${student.LastName} ${student.FirstName}</h5>
                            <p><strong>Ngày sinh:</strong> ${moment(student.DateOfBirth).format("DD/MM/YYYY")}</p>
                            <p><strong>SĐT:</strong> ${student.PhoneNumber}</p>
                        </div>
                    </div>
                    <div class="multiple-barcode-section">
                        <svg class="barcode" id="multiple-student-barcode-${student.Id}"></svg>
                    </div>
                </div>
            `;

            // Generate Barcode
            const currentBarcodeElement = document.getElementById(`multiple-student-barcode-${student.Id}`);

            JsBarcode(currentBarcodeElement, student.PhoneNumber, {
                format: "CODE128",
                displayValue: false,
                width: 1.5,
                height: 50,
                margin: 5
            });

        })

        console.log(hiddenStudentCardsPrintContainer)
    }


    // Create PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Print PDF
    for (let i = 0; i < totalPages; i++) {
        const sheet = document.getElementById(`sheet_${i}`);


        const canvas = await html2canvas(sheet, { scale: 1.1, useCORS: true });
        const imgData = canvas.toDataURL("image/png");

        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (i > 0) {
            pdf.addPage();
        }

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    }

    pdf.save("Danh_sach_hoc_vien.pdf");

    alert("In thẻ học viên thành công");
}