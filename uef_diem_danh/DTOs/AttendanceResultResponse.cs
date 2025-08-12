namespace uef_diem_danh.DTOs
{
    public class AttendanceResultResponse
    {
        public int StudyClassId { get; set; }
        public string StudyClassName { get; set; }

        public int ClassSessionId { get; set; }
        public int ClassSessionNumber { get; set; }

        public int TotalStudents { get; set; }

        public int TotalStudentsPresent { get; set; }

        public List<StudentAttendanceResult> StudentAttendanceResults { get; set; }

    }

    public class StudentAttendanceResult
    {
        public int Stt { get; set; }

        public string StudentFirstName { get; set; }

        public string StudentLastName { get; set; }

        public DateTime AttendanceDateTime { get; set; }
    }
}
