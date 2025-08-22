using System.ComponentModel.DataAnnotations.Schema;

namespace uef_diem_danh.Models
{
    [Table("HinhAnh")]
    public class HinhAnh
    {
        public int Id { get; set; }

        public string Name { get; set; }


        //relationships
        public int MaHocVien { get; set; }
        public HocVien HocVien { get; set; }
    }
}
