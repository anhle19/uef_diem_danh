
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

    const checkingAttendanceSuccessfulMessage = document.getElementById("checkingAttendanceSuccessfulMessage");
    const checkingAttendanceFailedMessage = document.getElementById("checkingAttendanceFailedMessage");

    const updateStudentBarcodeInput = document.getElementById("studentBarcodeInput");

    // Clear style
    checkingAttendanceSuccessfulMessage.style.display = "none";
    checkingAttendanceFailedMessage.style.display = "none";

    // Clear success and fail message
    checkingAttendanceSuccessfulMessage.innerText = "";
    checkingAttendanceFailedMessage.innerText = "";

    studentBarcode = updateStudentBarcodeInput.value;

    if (studentBarcode.trim().length == 10) {
        if (isNumberOnly(studentBarcode)) {
            JsBarcode("#studentBarcode", studentBarcode, {
                width: 2,
                height: 30,
            });

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
        const latestAttendenceTableBody = document.getElementById("latestAttendenceTableBody");
        const response = await axios.get(`https://localhost:7045/api/lay-nam-buoi-diem-danh-moi-nhat`)

        const data = response.data

        // Convert fetch data to rendering data
        data.forEach((d, index) => {

            fiveLatestAttendances.push({
                stt: index + 1,
                study_class_name: d.studyClassName,
                attendance_date_time: moment(d.attendanceDateTime).format("DD/MM/YYYY HH:mm")
            })
        })

        // rendering data
        fiveLatestAttendances.forEach((la) => {
            latestAttendanceTableRows +=
                `
                <tr>
                    <td>${la.stt}</td>
                    <td>${la.study_class_name}</td>
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
        const latestAttendenceTableBody = document.getElementById("latestAttendenceTableBody");
        const fullNameInfo = document.getElementById("fullNameInfo");
        const phoneNumberInfo = document.getElementById("phoneNumberInfo");
        const attendanceCheckingSuccessInfo = document.getElementById("attendanceCheckingSuccessInfo");

        const studyClassName = document.getElementById("studyClassNameInfo").innerText;
        const classSessionId = document.getElementById("classSessionIdInput").value;
        const studentBarcodeValue = studentBarcode


        // Clear Student Attendance Info
        fullNameInfo.innerText = ``;
        phoneNumberInfo.innerText = ``;
        attendanceCheckingSuccessInfo.innerHTML = ``;

        const checkingAttendanceRequest = {
            StudentBarCode: studentBarcodeValue,
            StudyClassName: studyClassName,
            ClassSessionId: parseInt(classSessionId)
        }

        console.log(checkingAttendanceRequest);

        //// Call API to save checked attendance
        const response = await axios.post(`https://localhost:7045/api/diem-danh-hoc-vien`, checkingAttendanceRequest)

        // Set successful message
        checkingAttendanceSuccessfulMessage.innerText = response.data.message;

        // Set student info
        fullNameInfo.innerText = `${response.data.studentLastName} ${response.data.studentFirstName}`;
        phoneNumberInfo.innerText = `SĐT: ${response.data.studentPhoneNumber}`;
        attendanceCheckingSuccessInfo.innerHTML =
            `
                <span>Điểm danh thành công!</span>
                    <br />
                <span>${moment(response.data.attendanceDateTime).format("DD/MM/YYYY HH:mm") }</span>
            `;


        // Remove last latest attendance
        fiveLatestAttendances.pop();

        // Reduce all previous latest attendance stt by 1
        fiveLatestAttendances.forEach((la) => {
            la.stt += 1;
        })

        // Add new latest attendance
        fiveLatestAttendances.unshift({
            stt: 1,
            study_class_name: response.data.studyClassName,
            attendance_date_time: moment(response.data.attendanceDateTime).format("DD/MM/YYYY HH:mm")
        })

        // rendering data
        fiveLatestAttendances.forEach((la) => {
            latestAttendanceTableRows +=
                `
                <tr>
                    <td>${la.stt}</td>
                    <td>${la.study_class_name}</td>
                    <td>${la.attendance_date_time}</td>
                </tr>
            `;
        })

        checkingAttendanceSuccessfulMessage.style.display = "block";
        latestAttendenceTableBody.innerHTML = latestAttendanceTableRows;


    } catch (ex) {
        console.log(ex);
        checkingAttendanceFailedMessage.style.display = "block";
        checkingAttendanceFailedMessage.innerText = ex.response.data;
    } finally {
        loadingRow.style.display = "none";
    }

}


// ============== Attach Event listeners ==============
document.getElementById("studentBarcodeInput").addEventListener("paste", async (e) => {
    const updateStudentBarcodeInput = document.getElementById("studentBarcodeInput");

    const checkingAttendanceSuccessfulMessage = document.getElementById("checkingAttendanceSuccessfulMessage");
    const checkingAttendanceFailedMessage = document.getElementById("checkingAttendanceFailedMessage");


    e.preventDefault();

    // Clear style
    checkingAttendanceSuccessfulMessage.style.display = "none";
    checkingAttendanceFailedMessage.style.display = "none";

    // Clear success and fail message
    checkingAttendanceSuccessfulMessage.innerText = "";
    checkingAttendanceFailedMessage.innerText = "";

    updateStudentBarcodeInput.value = (e.clipboardData || window.clipboardData).getData("text");

    studentBarcode = updateStudentBarcodeInput.value;

    if (studentBarcode.trim().length > 0) {
        JsBarcode("#studentBarcode", studentBarcode, {
            width: 2,
            height: 30,
        });
        console.log("asdasdasdasd")
        await fakeBarcodeScannedEvent();
    } else {
        document.getElementById("studentBarcode").innerHTML = "";
    }
})



// =============== Call function ==============
fetchFiveLatestAttendances()