namespace uef_diem_danh.DTOs
{
    public class StudyClassListManagementResponse
    {
        public int TotalPages { get; set; }

        public List<StudyClassListData> StudyClasses { get; set; }

    }

    public class StudyClassListData
    {
        public int Id { get; set; }

        public string StudyClassName { get; set; }

        public DateOnly StartDate { get; set; }

        public DateOnly EndDate { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
