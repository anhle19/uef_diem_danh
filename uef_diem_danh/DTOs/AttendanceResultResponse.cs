namespace uef_diem_danh.DTOs
{
    public class AttendanceResultResponse
    {
        public int StudyClassId { get; set; }
        public string StudyClassName { get; set; }

        public int ClassSessionId { get; set; }
        public string ClassSessionTitle { get; set; }
        public int ClassSessionNumber { get; set; }

        public int TotalStudents { get; set; }

        public int TotalStudentsPresent { get; set; }

        public List<StudentAttendanceResult> StudentAttendanceResults { get; set; }

    }

    public class StudentAttendanceResult
    {

        public string StudentFirstName { get; set; }

        public string StudentLastName { get; set; }

        public bool AttendanceStatus { get; set; }

        public DateTime AttendanceDateTime { get; set; }
    }
}
