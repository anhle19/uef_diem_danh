namespace uef_diem_danh.DTOs
{
    public class SearchFilterStudyClassRequest
    {
        public string Type { get; set; }

        public string? TenLopHoc { get; set; }

        public string? ThoiGianBatDau { get; set; }

        public string? ThoiGianKetThuc { get; set; }
    }
}
