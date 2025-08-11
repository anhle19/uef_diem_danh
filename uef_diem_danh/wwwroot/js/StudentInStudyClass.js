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



// ================== DELETE ==================
function initDeleteStudentInStudyClassField(studentId) {
    const removeStudentIdInput = document.getElementById("removeStudentIdInput");

    removeStudentIdInput.value = studentId;
}