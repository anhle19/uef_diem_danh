using uef_diem_danh.Models;

namespace uef_diem_danh.DTOs
{
    public class ClassGetRequest
    {
        public List<BuoiHoc> BuoiHocs { get; set; }

        public string TenLop { get; set; }

        public int MaLopHoc { get; set; }
    }
}
