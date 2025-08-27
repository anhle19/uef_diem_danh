using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace uef_diem_danh.Models
{
    [Table("BuoiHoc")]
    public class BuoiHoc
    {
        [Key]
        public int MaBuoiHoc {  get; set; }

        public string TenBuoiHoc { get; set; }

        public int TietHoc { get; set; }

        public bool TrangThai { get; set; }

        public DateOnly NgayHoc { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // relationships
        [ForeignKey("LopHoc")]
        public int MaLopHoc { get; set; }
        public LopHoc LopHoc { get; set; }

        public ICollection<DiemDanh> DiemDanhs { get; set; }
    }
}
