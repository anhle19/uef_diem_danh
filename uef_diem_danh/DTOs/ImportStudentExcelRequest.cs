namespace uef_diem_danh.DTOs
{
    public class ImportStudentExcelRequest
    {
        public int MaLopHoc { get; set; }

        public IFormFile ExcelFile { get; set; }
    }
}
