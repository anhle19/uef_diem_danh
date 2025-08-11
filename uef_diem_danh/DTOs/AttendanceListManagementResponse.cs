namespace uef_diem_danh.DTOs
{
    public class AttendanceListManagementResponse
    {
        public int Id { get; set; }

        public string StudyClassName { get; set; }

        public int ClassSessionNumber { get; set; }

        public int NumberOfStudents { get; set; }

        public int NumberOfStudentsPresent { get; set; }

        public DateOnly StudyDate { get; set; }

    }
}
