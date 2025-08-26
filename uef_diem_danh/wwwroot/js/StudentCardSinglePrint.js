


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
            `${BASE_URL}/api/tai-ve-mot-the-hoc-vien/${studentId}`,
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



// ================== TRIGGER ACTION AFTER DOM LOADED ==================

document.addEventListener('DOMContentLoaded', async (event) => {

    try {

        const studentId = document.getElementById("studentIdInput").value;
        const studentAvatarInfo = document.getElementById("studentAvatarInfo");
        const studentFullNameInfo = document.getElementById("studentFullNameInfo");
        const studentStudyCenterInfo = document.getElementById("studentStudyCenterInfo");

        // Call API fetch student info
        const response = await axios.get(`${BASE_URL}/api/lay-chi-tiet-hoc-vien/${studentId}`)
        const studentData = response.data


        // Set student info to UI
        studentAvatarInfo.src = `${BASE_URL}/student_pictures/${studentData.tenHinhAnh}`;
        studentFullNameInfo.innerHTML = 
        `
            <strong>Họ và tên:</strong> 
            <p>${studentData.ho} ${studentData.ten}</p>
        `;
        
        studentStudyCenterInfo.innerHTML =
            `
            <strong>Đơn vị:</strong> 
            <p>${studentData.donVi}</p>
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