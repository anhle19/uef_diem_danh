namespace uef_diem_danh.DTOs
{
    public class StudyClassListManagementDto
    {
        public int Id { get; set; }

        public string StudyClassName { get; set; }

        public DateOnly StartDate { get; set; }

        public DateOnly EndDate { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
