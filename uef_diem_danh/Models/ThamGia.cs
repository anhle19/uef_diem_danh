using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace uef_diem_danh.Models
{
    [Table("ThamGia")]
    public class ThamGia
    {
        [Key]
        public int MaThamGia {  get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


        // relationships
        public int MaHocVien { get; set; }
        public HocVien HocVien { get; set; }

        public int MaLopHoc {  get; set; }
        public LopHoc LopHoc { get; set; }
    }
}
