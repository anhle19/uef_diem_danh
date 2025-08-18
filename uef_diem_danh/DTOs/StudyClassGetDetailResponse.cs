namespace uef_diem_danh.DTOs
{
    public class StudyClassGetDetailResponse
    {
        public string TeacherPhoneNumber { get; set; }

        public int MaLopHoc { get; set; }

        public string TenLopHoc { get; set; }

        public DateOnly ThoiGianBatDau { get; set; }

        public DateOnly ThoiGianKetThuc { get; set; }
    }
}
