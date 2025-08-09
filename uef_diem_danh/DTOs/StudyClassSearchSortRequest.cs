namespace uef_diem_danh.DTOs
{
    public class StudyClassSearchSortRequest
    {
        public string Type { get; set; } // SEARCH_ONLY || SORT_ONLY || SEARCH_AND_SORT

        public string? StudyClassName { get; set; }

        public string? SortField { get; set; }

        public string? SortType { get; set; }
    }
}
