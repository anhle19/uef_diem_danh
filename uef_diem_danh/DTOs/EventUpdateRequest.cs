namespace uef_diem_danh.DTOs
{
    public class EventUpdateRequest
    {
        public int Id { get; set; }

        public string TieuDe { get; set; }

        public string NguoiPhuTrach { get; set; }

        public int SoLuongDuKien { get; set; }

        public bool TrangThai { get; set; }

        public string ThoiGian { get; set; }
    }
}
