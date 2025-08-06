using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace uef_diem_danh.Models
{
    [Table("LopHoc")]
    public class LopHoc
    {
        [Key]
        public int MaLopHoc { get; set; }

        public string TenLopHoc { get; set;}

        public DateOnly ThoiGianBatDau {  get; set;}

        public DateOnly ThoiGianKetThuc {  get; set;}

        public DateTime CreatedAt { get; set;} = DateTime.UtcNow;

        // relationships
        public ICollection<ThamGia> ThamGias { get; set; }
        public ICollection<BuoiHoc> BuoiHocs { get; set; }

    }
}
