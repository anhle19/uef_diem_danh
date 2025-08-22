using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace uef_diem_danh.Models
{
    [Table("HocVien")]
    public class HocVien
    {
        [Key]
        public int MaHocVien {  get; set; }

        public string Ho {  get; set; }

        public string Ten { get; set; }

        public string MaBarCode { get; set; }

        //public string? HinhAnh { get; set; }

        public string DonVi { get; set; }

        public string DiaChi { get; set; }

        public string Email { get; set; }

        public string SoDienThoai { get; set; }

        public DateOnly NgaySinh { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


        // Relationships
        public ICollection<DiemDanh> DiemDanhs { get; set; }
        public ICollection<ThamGia> ThamGias { get; set; }

        public HinhAnh HinhAnh { get; set; }
    }
}
