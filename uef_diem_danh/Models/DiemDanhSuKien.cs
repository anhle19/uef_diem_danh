using System.ComponentModel.DataAnnotations.Schema;

namespace uef_diem_danh.Models
{
    public class DiemDanhSuKien
    {
        public int Id { get; set; }

        public string DonVi { get; set; }

        public string Ho { get; set; }
        public string Ten { get; set; }

        public string SoDienThoai { get; set; }

        public DateOnly? NgaySinh { get; set; }


        public DateTime AttendanceDate { get; set; }


        // Relationships
        [ForeignKey("SuKien")]
        public int EventId { get; set; }
        public SuKien SuKien { get; set; }

    }
}
