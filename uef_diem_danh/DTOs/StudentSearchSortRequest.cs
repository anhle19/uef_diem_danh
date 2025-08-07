namespace uef_diem_danh.DTOs
{
    public class StudentSearchSortRequest
    {
        public string Type { get; set; }

        public string? FirstName { get; set; }

        public string? PhoneNumber { get; set; }

        public string? SortField { get; set; }

        public string? SortType { get; set; }
    }
}
