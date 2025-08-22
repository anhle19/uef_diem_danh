namespace uef_diem_danh.Models
{
    public class SuKien
    {
        public int Id { get; set; }

        public string TieuDe { get; set; }

        public string NguoiPhuTrach { get; set; }

        public int SoLuongDuKien { get; set; }

        public bool TrangThai { get; set; }

        public DateTime ThoiGian { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
