
// ============== DOM varialbles ============== 
let loadingRow = document.getElementById("loadingRow");

// ============== Data varialbles ============== 
let fiveLatestAttendances = [];
let studentBarcode = "";



// ============== Helper functions ==============
function isNumberOnly(barcode) {
    return !isNaN(barcode) && Number.isInteger(Number(barcode));
}



// ============== Async functions ============== 

async function updateStudentBarcode() {

    const studentCard = document.getElementById("student-card");

    const updateStudentBarcodeInput = document.getElementById("studentBarcodeInput");

    // Hide student card
    studentCard.style.display = "none";

    studentBarcode = updateStudentBarcodeInput.value;

    if (studentBarcode.trim().length == 10) {
        if (isNumberOnly(studentBarcode)) {
            //JsBarcode("#studentBarcode", studentBarcode, {
            //    width: 2,
            //    height: 30,
            //});

            await fakeBarcodeScannedEvent();
        } else {
            return;
        }
    } else {
        document.getElementById("studentBarcode").innerHTML = "";
    }

}

async function fetchFiveLatestAttendances() {
    try {
        // Start loading spinner
        loadingRow.style.display = "block";

        let latestAttendanceTableRows = "";
        const studyClassId = document.getElementById("studyClassIdInput").value;
        const latestAttendenceTableBody = document.getElementById("latestAttendenceTableBody");
        const response = await axios.get(`/api/lay-nam-buoi-diem-danh-moi-nhat/${studyClassId}`)

        const data = response.data

        // Convert fetch data to rendering data
        data.forEach((d, index) => {

            fiveLatestAttendances.push({
                stt: index + 1,
                student_full_name: `${d.studentLastName} ${d.studentFirstName}`,
                attendance_date_time: moment(d.attendanceDateTime).format("DD/MM/YYYY HH:mm")
            })
        })

        // rendering data
        fiveLatestAttendances.forEach((la) => {
            latestAttendanceTableRows +=
                `
                <tr>
                    <td>${la.stt}</td>
                    <td>${la.student_full_name}</td>
                    <td>${la.attendance_date_time}</td>
                </tr>
            `;
        })

        latestAttendenceTableBody.innerHTML = latestAttendanceTableRows;

    } catch (ex) {
        console.log(ex);
    } finally {
        loadingRow.style.display = "block";
    }
}

async function fakeBarcodeScannedEvent() {

    try {
        // Start loading spinner 
        loadingRow.style.display = "block";

        let latestAttendanceTableRows = "";
        const successfulToast = document.getElementById('successfulToast')
        const latestAttendenceTableBody = document.getElementById("latestAttendenceTableBody");

        const studentCard = document.getElementById("student-card");
        const avatar = document.getElementById("avatar");
        const fullNameInfo = document.getElementById("fullNameInfo");
        const dayOfBirthInfo = document.getElementById("dobInfo");
        //const phoneNumberInfo = document.getElementById("phoneNumberInfo");

        const studyClassName = document.getElementById("studyClassNameInfo").innerText;
        const classSessionId = document.getElementById("classSessionIdInput").value;
        const studentBarcodeValue = studentBarcode;

        // Hide student card
        studentCard.style.display = "none";


        const checkingAttendanceRequest = {
            StudentBarCode: studentBarcodeValue,
            StudyClassName: studyClassName,
            ClassSessionId: parseInt(classSessionId)
        }

        console.log(checkingAttendanceRequest);

        //// Call API to save checked attendance
        const response = await axios.post(`/api/diem-danh-hoc-vien`, checkingAttendanceRequest)

        // Set successful message
        checkingAttendanceSuccessfulMessage.innerText = response.data.message;
        // Enable successful toast
        bootstrap.Toast.getOrCreateInstance(successfulToast).show();

        // Set student info
        avatar.src = `https://laitsolution.id.vn/student_pictures/${response.data.studentAvatar}`
        fullNameInfo.innerText = `${response.data.studentLastName} ${response.data.studentFirstName}`;
        dayOfBirthInfo.innerText = `${moment(response.data.studentDayOfBirth).format("DD/MM/YYYY")}`
        //phoneNumberInfo.innerHTML = `<strong>SĐT:</strong>: ${response.data.studentPhoneNumber}`;

        // Generate barcode by phone number
        JsBarcode("#studentBarcode", response.data.studentPhoneNumber, {
            format: "CODE128",
            displayValue: false, // Không hiển thị số điện thoại bên dưới barcode
            width: 1.5,
            height: 50,
            margin: 5
        });


        // Remove last latest attendance
        fiveLatestAttendances.pop();

        // Reduce all previous latest attendance stt by 1
        fiveLatestAttendances.forEach((la) => {
            la.stt += 1;
        })

        // Add new latest attendance
        fiveLatestAttendances.unshift({
            stt: 1,
            student_full_name: `${response.data.studentLastName} ${response.data.studentFirstName}`,
            attendance_date_time: moment(response.data.attendanceDateTime).format("DD/MM/YYYY HH:mm")
        })

        // rendering data
        fiveLatestAttendances.forEach((la) => {
            latestAttendanceTableRows +=
                `
                <tr>
                    <td>${la.stt}</td>
                    <td>${la.student_full_name}</td>
                    <td>${la.attendance_date_time}</td>
                </tr>
            `;
        })

        studentCard.style.display = "flex";
        checkingAttendanceSuccessfulMessage.style.display = "block";
        latestAttendenceTableBody.innerHTML = latestAttendanceTableRows;


    } catch (ex) {
        const failedToast = document.getElementById('failedToast')

        console.log(ex);
        checkingAttendanceFailedMessage.innerText = ex.response.data;

        // Enable failed toast
        bootstrap.Toast.getOrCreateInstance(failedToast).show();
    } finally {
        loadingRow.style.display = "none";
    }

}


// ============== Attach Event listeners ==============
document.getElementById("studentBarcodeInput").addEventListener("paste", async (e) => {

    const studentCard = document.getElementById("student-card");

    const updateStudentBarcodeInput = document.getElementById("studentBarcodeInput");

    studentCard.style.display = "none";

    e.preventDefault();


    updateStudentBarcodeInput.value = (e.clipboardData || window.clipboardData).getData("text");

    studentBarcode = updateStudentBarcodeInput.value;

    if (studentBarcode.trim().length > 0) {
        //JsBarcode("#studentBarcode", studentBarcode, {
        //    width: 2,
        //    height: 30,
        //});

        await fakeBarcodeScannedEvent();
    } else {
        document.getElementById("studentBarcode").innerHTML = "";
    }
})



// =============== Call function ==============
fetchFiveLatestAttendances()