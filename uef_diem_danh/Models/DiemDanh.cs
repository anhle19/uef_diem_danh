using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace uef_diem_danh.Models
{
    [Table("DiemDanh")]
    public class DiemDanh
    {
        [Key]
        public int MaDiemDanh { get; set; }

        public DateTime ThoiGianDiemDanh { get; set; }

        public bool TrangThai { get; set;}


        // relationships
        public int MaHocVien {  get; set; }
        public HocVien HocVien { get; set; }

        public int MaBuoiHoc {  get; set; }
        public BuoiHoc BuoiHoc { get; set; }
        
    }
}
