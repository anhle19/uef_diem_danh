


// ================== STUDENT CARD PDF PRINT ==================

async function downloadStudentCard(id) {

    try {
        const printBtnContainer = document.getElementById("print-btn-container");

        printBtnContainer.style.display = "none";

        const response = await axios.post(
            "https://localhost:7045/api/tai-ve-mot-the-hoc-vien",
            {
                StudentId: parseInt(id)
            },
            { responseType: 'blob' }
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

    //let studentCardHtmlContent =
    //`
    //<div class="sheet d-flex justify-content-center align-items-center">
    //    <div class="card student-card text-center">
    //        <div>
    //            <img src="https://placehold.co/150x150/0d6efd/FFFFFF?text=AVATAR" class="card-img-top mx-auto d-block" alt="Ảnh đại diện">
    //                <div class="card-body">
    //                    <h5 class="card-title text-primary">${fullName}</h5>
    //                    <p class="card-text text-muted"><strong>Ngày sinh:</strong> ${dob}</p>
    //                    <p class="card-text text-muted"><strong>SĐT:</strong> ${phoneNumber}</p>
    //                </div>
    //        </div>
    //        <div class="barcode-section">
    //            <svg id="studentBarcode-${id}"></svg>
    //        </div>
    //    </div>
    //</div>
    //`;


    //const hiddenStudentCardPrintContainer = document.getElementById('hiddenStudentCardPrintContainer');

    //// Overflow y hidden
    //document.body.style.overflowY = 'hidden';

    //// Init PDF
    //const { jsPDF } = window.jspdf;
    //const pdf = new jsPDF('p', 'mm', 'a5');
    //const pageWidth = pdf.internal.pageSize.getWidth();
    //const pageHeight = pdf.internal.pageSize.getHeight();


    //// Parse into DOM nodes
    //const template = document.createElement('template');
    //template.innerHTML = studentCardHtmlContent.trim();
    //const studentCardElement = template.content.firstChild;

    //// Append to the DOM (hidden)
    //hiddenStudentCardPrintContainer.appendChild(studentCardElement);

    //// Generate barcode
    //const studentPhoneNumber = phoneNumber; // Lấy số điện thoại từ thẻ
    //JsBarcode(`#studentBarcode-${id}`, studentPhoneNumber, {
    //    format: "CODE128",
    //    displayValue: false, // Không hiển thị số điện thoại bên dưới barcode
    //    width: 1.5,
    //    height: 50,
    //    margin: 5
    //});


    //// Create image from card element
    //const canvas = await html2canvas(studentCardElement, { scale: 1.1, useCORS: true });
    //const imgData = canvas.toDataURL("image/png");

    //// Scale image to fit page width
    //let imgWidth = pageWidth;
    //let imgHeight = (canvas.height * imgWidth) / canvas.width;

    //// If the height is too big, scale by height instead
    //if (imgHeight > pageHeight) {
    //    imgHeight = pageHeight;
    //    imgWidth = (canvas.width * imgHeight) / canvas.height;
    //}

    //// Center the image
    //const x = (pageWidth - imgWidth) / 2;
    //const y = (pageHeight - imgHeight) / 2;

    //// Add image
    //pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);


    //// Save PDF
    //pdf.save(`the_hoc_vien_${phoneNumber}.pdf`);

    //alert("In thẻ học viên thành công");

    //// Reset body overflow
    //document.body.style.overflowY = 'auto';

    //// Clear hidden container childs
    //hiddenStudentCardPrintContainer.innerHTML = '';

}

async function printStudentCards(students) {

    const hiddenStudentCardsPrintContainer = document.getElementById("hiddenStudentCardsPrintContainer");

    const totalPages = Math.ceil(students.length / 10);

    // Overflow y hidden
    document.body.style.overflowY = 'hidden';

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

    // Reset body overflow
    document.body.style.overflowY = 'auto';

    // Clear hidden container childs
    hiddenStudentCardsPrintContainer.innerHTML = '';

    alert("In thẻ học viên thành công");
}




// ================== TRIGGER ACTION AFTER DOM LOADED ==================

document.addEventListener('DOMContentLoaded', async (event) => {

    try {

        const studentId = document.getElementById("studentIdInput").value;
        const studentFullNameInfo = document.getElementById("studentFullNameInfo");
        const studentDobInfo = document.getElementById("studentDobInfo");
        const studentPhoneNumberInfo = document.getElementById("studentPhoneNumberInfo");

        // Call API fetch student info
        const response = await axios.get(`https://localhost:7045/api/lay-chi-tiet-hoc-vien/${studentId}`)
        const studentData = response.data


        // Set student info to UI
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
