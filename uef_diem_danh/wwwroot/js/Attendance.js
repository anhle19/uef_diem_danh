//// ================== INIT ==================
$(document).ready(function () {
    $.fn.dataTable.moment('DD/MM/YYYY');
})


let attendanceManagementTable = new DataTable('#attendanceManagementTable', {
    dom: 'rtp'    // "l" = length, "r" = processing, "t" = table, "i" = info, "p" = pagination
    // Notice no "f" here, which is the default filter/search box
});


// ================== SEARCH ==================
function preventSearchAttendancesSubmit() {
    searchAttendances();

    return false;
}

async function searchAttendances() {
    const search = document
        .getElementById("attendanceSearchInput")
        .value
        .trim();

    try {

        if (!search) {
            return;
        } else {
            attendanceManagementTable.search(search).draw();
        }

    } catch (ex) {
        console.error(ex);
    }

}