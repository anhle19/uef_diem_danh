


// ================== STUDENT CARD PDF PRINT ==================

function openPrintDialog() {
    const printBtnContainer = document.getElementById("print-btn-container");

    printBtnContainer.style.display = "none";

    window.print()
}

async function downloadStudentCards(studyClassId) {

    try {
        const printBtnContainer = document.getElementById("print-btn-container");

        printBtnContainer.style.display = "none";

        const response = await axios.post(
            `${BASE_URL}/api/tai-ve-danh-sach-the-hoc-vien/${studyClassId}`,
            null,
            { responseType: 'blob' }
        );

        // Create a Blob from the response
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        // Create a temporary link to trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'danh_sach_hoc_vien.pdf'; // filename
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



// ================== TRIGGER ACTION AFTER DOM LOADED ==================

document.addEventListener('DOMContentLoaded', async (event) => {

    try {

        const generateCardsArea = document.getElementById("generateCardsArea");
        const generateCardsResultArea = document.getElementById("generateCardsResultArea");
        const studyClassId = document.getElementById("studyClassIdInput").value;
        //const studentFullNameInfo = document.getElementById("studentFullNameInfo");
        //const studentDobInfo = document.getElementById("studentDobInfo");
        //const studentPhoneNumberInfo = document.getElementById("studentPhoneNumberInfo");

        // Call API fetch students info
        const response = await axios.get(`${BASE_URL}/api/lay-danh-sach-hoc-vien-theo-lop/${studyClassId}`)
        let studentsData = response.data

        const totalSheets = Math.ceil(studentsData.length / 16);

        console.log(studentsData)

        // Create sheet elements
        for (let i = 0; i < totalSheets; i++) {
            generateCardsArea.innerHTML +=
            `
            <div class="sheet" id="sheet_${i}"></div> 
            <div style="break-after: page;"></div>
            `;
            
            // Get first 4 student
            const processingStudentsData = studentsData.splice(0, 16);


            // Create student card elements
            for (let j = 0; j < processingStudentsData.length; j++) {
                const sheet = document.getElementById(`sheet_${i}`)


                if (processingStudentsData[j].studentAvatar != null) {
                    sheet.innerHTML +=
                        `
                     <div class="card student-card text-center">
                        <div class="card-top">
                            <img src="${BASE_URL}/student_pictures/${processingStudentsData[j].studentAvatar}" class="card-img-top" alt="Ảnh đại diện">
                            <div class="card-body">
                                <h5>${processingStudentsData[j].studentLastName} ${processingStudentsData[j].studentFirstName}</h5>
                                <p><strong>Ngày sinh:</strong> ${moment(processingStudentsData[j].studentDayOfBirth).format("DD/MM/YYYY")}</p>
                                <p><strong>SĐT:</strong> ${processingStudentsData[j].studentPhoneNumber}</p>
                            </div>
                        </div>
                        <div class="barcode-section">
                            <svg class="barcode" id="barcode_${j}"></svg>
                        </div>
                    </div>
                    `;
                } else {
                    sheet.innerHTML +=
                        `
                     <div class="card student-card text-center">
                        <div class="card-top">
                            <img src="https://placehold.co/150x150/0d6efd/FFFFFF?text=AVATAR" class="card-img-top" alt="Ảnh đại diện">
                            <div class="card-body">
                                <h5>${processingStudentsData[j].studentLastName} ${processingStudentsData[j].studentFirstName}</h5>
                                <p><strong>Ngày sinh:</strong> ${moment(processingStudentsData[j].studentDayOfBirth).format("DD/MM/YYYY")}</p>
                                <p><strong>SĐT:</strong> ${processingStudentsData[j].studentPhoneNumber}</p>
                            </div>
                        </div>
                        <div class="barcode-section">
                            <svg class="barcode" id="barcode_${j}"></svg>
                        </div>
                    </div>
                    `;
                }


                // Generate Barcode
                JsBarcode(`#barcode_${j}`, processingStudentsData[j].studentPhoneNumber, {
                    format: "CODE128",
                    displayValue: false, // Không hiển thị số điện thoại bên dưới barcode
                    width: 1,
                    height: 30,
                    margin: 5
                });

            }

        }

        while (generateCardsArea.firstChild) {
            generateCardsResultArea.after(generateCardsArea.lastChild);
        }
        //generateCardsArea.innerHTML = "";

        // Move sheet to outer
        

        //// Set student info to UI
        //studentFullNameInfo.innerText = `${studentData.ho} ${studentData.ten}`;
        //studentDobInfo.innerHTML =
        //    `
        //    <strong>Ngày sinh:</strong> ${moment(studentData.ngaySinh).format("DD/MM/YYYY")}
        //`;
        //studentPhoneNumberInfo.innerHTML =
        //    `
        //    <strong>SĐT:</strong> ${studentData.soDienThoai}
        //`;

        //JsBarcode("#studentBarcode", studentData.soDienThoai, {
        //    format: "CODE128",
        //    displayValue: false, // Không hiển thị số điện thoại bên dưới barcode
        //    width: 1.5,
        //    height: 50,
        //    margin: 5
        //});

    } catch (ex) {
        console.log(ex)
    }
});


// ================== TRIGGER ACTION AFTER PRINT DIAGLOG CLOSED ==================
window.onafterprint = function () {
    const printBtnContainer = document.getElementById("print-btn-container");

    printBtnContainer.style.display = "block";
};