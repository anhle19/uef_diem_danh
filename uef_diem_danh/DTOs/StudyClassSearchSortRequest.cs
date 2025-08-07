namespace uef_diem_danh.DTOs
{
    public class StudyClassSearchSortRequest
    {
        public string Type { get; set; }

        public string? TenLopHoc { get; set; }

        public string? SortField { get; set; }

        public string? SortType { get; set; }
    }
}
