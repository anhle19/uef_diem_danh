namespace uef_diem_danh.DTOs
{
    public class StudyClassListManagementResponse
    {
        public int Id { get; set; }

        public int NumberOfAttendaces { get; set; }

        public string StudyClassName { get; set; }

        public string TeacherFullName { get; set; }

        public DateOnly StartDate { get; set; }

        public DateOnly EndDate { get; set; }

        public DateTime CreatedAt { get; set; }

    }

}
