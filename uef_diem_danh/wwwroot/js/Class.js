


//$(document).ready(function () {
//    //// ================== INIT ==================
//    $.fn.dataTable.moment('DD/MM/YYYY');


//})
//let studentTable = new DataTable('#classTable', {
//    dom: 'lrtp'    // "l" = length, "r" = processing, "t" = table, "i" = info, "p" = pagination
//    // Notice no "f" here, which is the default filter/search box
//});
// ================== SEARCH ==================

//function preventSearchClassSubmit() {
//    searchClass();

//    return false;
//}

//function updateSearchOrderType() {
//    const searchOrderTypeInput = document.getElementById("searchOrderType");
//    searchOrderTypeInput.value = "SEARCH_ONLY";
//}

//async function searchStudent() {
//    const searchResultLabel = document.getElementById("searchResultLabel");
//    const studyClassesTableBody = document.getElementById("studentsTableBody");
//    const searchOrderStudyClassForm = document.getElementById("searchOrderStudentForm");
//    const studyClassSearchInputValue = document
//        .getElementById("studentSearchInput")
//        .value
//        .trim();
//    console.log(studyClassSearchInputValue);
//    try {

//        if (!studyClassSearchInputValue) {
//            return;
//        } else {

//            studentTable.search(studyClassSearchInputValue).draw();

//        }

//    } catch (ex) {
//        console.error(ex);
//    }

//    //    searchOrderStudyClassForm.requestSubmit();
//}


// ================== ADD STUDY CLASS ==================
function addClass() {
    const createClassForm = document.getElementById("createClassForm");
    const popup = document.getElementById("popupThemBuoiHoc");

    const classDayInput = popup.querySelector("#themNgayHoc");
    const classLessonNameInput = popup.querySelector("#themTenBuoiHoc");


    const classDay = classDayInput.value;
    const classLessonName = classLessonNameInput.value.trim();


    // Validate inputs
    if (!classDay || !classLessonName) {
        Swal.fire(
            "Lỗi",
            "Vui lòng nhập đầy đủ dữ liệu",
            "warning"
        );
        return;
    }


    // Submit form
    createClassForm.requestSubmit();
};

async function initAddClassFields(id) {
    // Call API to get study class detail
        const classIdInput = document.getElementById("themMaLopHoc");
        console.log(id);
        classIdInput.value = id;
}

// ================== EDIT CLASS ==================
async function initUpdateClassFields(id) {
    // Call API to get study class detail
    try {
        const studentIdInput = document.getElementById("suaMaBuoiHoc");
        const studentLastNameInput = document.getElementById("suaNgayHoc");
        const studentFirstNameInput = document.getElementById("suaTietHoc");


        const response = await axios.get(`${BASE_URL}/api/lay-chi-tiet-buoi-hoc/${id}`)
        const fetchedStudent = response.data;

        console.log(fetchedStudent.maBuoiHoc);
        studentIdInput.value = fetchedStudent.maBuoiHoc;
        studentLastNameInput.value = fetchedStudent.ngayHoc;
        studentFirstNameInput.value = fetchedStudent.tietHoc;

        console.log(response)
    } catch (ex) {
        console.log(ex);
    }

}

function updateClass() {
    const updateClassForm = document.getElementById("updateClassForm");

    const classDayInput = document.getElementById("suaNgayHoc");
    const classLessonInput = document.getElementById("suaTietHoc");


    const classDay = classDayInput.value;
    const classLesson = classLessonInput.value.trim();


    // Validate inputs
    if (!classDay || !classLesson) {
        Swal.fire(
            "Lỗi",
            "Vui lòng nhập đầy đủ dữ liệu",
            "warning"
        );
        return;
    }


    // Submit form
    updateClassForm.requestSubmit();
};


// ================== DELETE CLASS ==================
async function initDeleteClassField(studyClassId, classId) {
    const studyClassIdInput = document.getElementById("xoaMaLopHoc");
    const classIdInput = document.getElementById("xoaMaBuoiHoc");
    //console.log("Mã lớp" + studyClassId);
    //console.log("Mã buổi" + classId);
    studyClassIdInput.value = studyClassId;
    classIdInput.value = classId;
}
