namespace uef_diem_danh.DTOs
{
    public class StudyClassUpdateRequest
    {
        public string TeacherPhoneNumber { get; set; }

        public int Id { get; set; }

        public string StudyClassName { get; set; }

        public string StartDate { get; set; }

        public string EndDate { get; set; }
    }
}
