using ExcelDataReader;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Text;
using uef_diem_danh.Database;
using uef_diem_danh.DTOs;
using uef_diem_danh.Models;

namespace uef_diem_danh.Controllers
{
    public class StudentController : Controller
    {

        private readonly AppDbContext context;

        public StudentController(AppDbContext context)
        {
            this.context = context;
        }


        [HttpGet]
        [Route("download-excel-file-importing-student-to-study-class")]
        public IActionResult DownloadExcelFileImportingStudentToStudyClass()
        {
            try
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "UploadExcels", "Student import sample.xlsx");

                // Use FileStreamResult to avoid loading the entire file into memory
                var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);

                // Excel MIME type
                string contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

                // Ensure safe filename in headers
                return File(stream, contentType, "Student import sample.xlsx");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);

                return BadRequest("Lỗi khi tải file mẫu: " + ex.Message);
            }
        }


       
    }
}
