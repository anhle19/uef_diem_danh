


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
        const studentDobInfo = document.getElementById("studentDobInfo");
        const studentPhoneNumberInfo = document.getElementById("studentPhoneNumberInfo");

        // Call API fetch student info
        const response = await axios.get(`${BASE_URL}/api/lay-chi-tiet-hoc-vien/${studentId}`)
        const studentData = response.data


        // Set student info to UI
        if (studentData.hinhAnh != null) {
            studentAvatarInfo.src = `${BASE_URL}/student_pictures/${studentData.hinhAnh}`;
        } else {
            studentAvatarInfo.src = `https://placehold.co/150x150/0d6efd/FFFFFF?text=AVATAR`;
        }
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