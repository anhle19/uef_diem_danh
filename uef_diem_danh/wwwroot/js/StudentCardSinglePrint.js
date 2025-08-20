


// ================== STUDENT CARD PDF PRINT ==================

function openPrintDialog() {
    const printBtnContainer = document.getElementById("print-btn-container");

    printBtnContainer.style.display = "none";

    window.print()
}

async function downloadStudentCard(studentId) {

    try {
        const printBtnContainer = document.getElementById("print-btn-container");

        printBtnContainer.style.display = "none";

        const response = await axios.post(
            `/api/tai-ve-mot-the-hoc-vien/${studentId}`,
            null,
            { responseType: 'blob', withCredentials: true }
        );

        // Create a Blob from the response
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        // Create a temporary link to trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'the_hoc_vien.pdf'; // filename
        document.body.appendChild(a);
        a.click();

        // Clean up
        a.remove();
        window.URL.revokeObjectURL(url);

    } catch (ex) {
        console.log(ex)
    } finally {
        const printBtnContainer = document.getElementById("print-btn-container");

        printBtnContainer.style.display = "block";
    }


}

//async function printStudentCards(students) {

//    const hiddenStudentCardsPrintContainer = document.getElementById("hiddenStudentCardsPrintContainer");

//    const totalPages = Math.ceil(students.length / 10);

//    // Overflow y hidden
//    document.body.style.overflowY = 'hidden';

//    // Generate Student Card HTML
//    for (let i = 0; i < totalPages; i++) {
//        let processingStudentList = students.splice(0, 10);

//        hiddenStudentCardsPrintContainer.innerHTML +=
//            `
//            <div class="multiple-student-cards-sheet" id="sheet_${i}">

//            </div>
//        `;

//        processingStudentList.forEach((student) => {
//            const currentSheet = document.getElementById(`sheet_${i}`)

//            currentSheet.innerHTML +=
//                `
//                <div class="card multiple-student-card text-center">
//                    <div class="multiple-card-top">
//                        <img src="https://placehold.co/150x150/0d6efd/FFFFFF?text=AVATAR" class="multiple-card-img-top" alt="Ảnh đại diện">
//                        <div class="multiple-card-body">
//                            <h5>${student.LastName} ${student.FirstName}</h5>
//                            <p><strong>Ngày sinh:</strong> ${moment(student.DateOfBirth).format("DD/MM/YYYY")}</p>
//                            <p><strong>SĐT:</strong> ${student.PhoneNumber}</p>
//                        </div>
//                    </div>
//                    <div class="multiple-barcode-section">
//                        <svg class="barcode" id="multiple-student-barcode-${student.Id}"></svg>
//                    </div>
//                </div>
//            `;

//            // Generate Barcode
//            const currentBarcodeElement = document.getElementById(`multiple-student-barcode-${student.Id}`);

//            JsBarcode(currentBarcodeElement, student.PhoneNumber, {
//                format: "CODE128",
//                displayValue: false,
//                width: 1.5,
//                height: 50,
//                margin: 5
//            });

//        })

//    }


//    // Create PDF
//    const { jsPDF } = window.jspdf;
//    const pdf = new jsPDF('p', 'mm', 'a4');
//    const pageWidth = pdf.internal.pageSize.getWidth();

//    // Print PDF
//    for (let i = 0; i < totalPages; i++) {
//        const sheet = document.getElementById(`sheet_${i}`);


//        const canvas = await html2canvas(sheet, { scale: 1.1, useCORS: true });
//        const imgData = canvas.toDataURL("image/png");

//        const imgWidth = pageWidth;
//        const imgHeight = (canvas.height * imgWidth) / canvas.width;

//        if (i > 0) {
//            pdf.addPage();
//        }

//        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

//    }

//    pdf.save("Danh_sach_hoc_vien.pdf");

//    // Reset body overflow
//    document.body.style.overflowY = 'auto';

//    // Clear hidden container childs
//    hiddenStudentCardsPrintContainer.innerHTML = '';

//    alert("In thẻ học viên thành công");
//}




// ================== TRIGGER ACTION AFTER DOM LOADED ==================

document.addEventListener('DOMContentLoaded', async (event) => {

    try {

        const studentId = document.getElementById("studentIdInput").value;
        const studentAvatarInfo = document.getElementById("studentAvatarInfo");
        const studentFullNameInfo = document.getElementById("studentFullNameInfo");
        const studentDobInfo = document.getElementById("studentDobInfo");
        const studentPhoneNumberInfo = document.getElementById("studentPhoneNumberInfo");

        // Call API fetch student info
        const response = await axios.get(`/api/lay-chi-tiet-hoc-vien/${studentId}`)
        const studentData = response.data


        // Set student info to UI
        studentAvatarInfo.src = `https://laitsolution.id.vn/student_pictures/${studentData.hinhAnh}`;
        studentFullNameInfo.innerText = `${studentData.ho} ${studentData.ten}`;
        studentDobInfo.innerHTML =
        `
            <strong>Ngày sinh:</strong> ${moment(studentData.ngaySinh).format("DD/MM/YYYY")}
        `;
        studentPhoneNumberInfo.innerHTML =
            `
            <strong>SĐT:</strong> ${studentData.soDienThoai}
        `;

        JsBarcode("#studentBarcode", studentData.soDienThoai, {
            format: "CODE128",
            displayValue: false, // Không hiển thị số điện thoại bên dưới barcode
            width: 1.5,
            height: 50,
            margin: 5
        });

    } catch (ex) {
        console.log(ex)
    }
});


// ================== TRIGGER ACTION AFTER PRINT DIAGLOG CLOSED ==================
window.onafterprint = function () {
    const printBtnContainer = document.getElementById("print-btn-container");

    printBtnContainer.style.display = "block";
};