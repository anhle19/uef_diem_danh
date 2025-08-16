using ExcelDataReader;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        [HttpGet("hoc-vien")]
        // Later refactor to get necessary fields
        public IActionResult StudentList()
        {
            var students = context.HocViens.ToList();
            return View(students);
        }

        [Route("api/lay-danh-sach-hoc-vien-theo-lop/{study_class_id}")]
        [HttpGet]
        public async Task<IActionResult> GetStudentsByStudyClass(int study_class_id)
        {

            try
            {
                var students = await context.ThamGias
                    .Where(tg => tg.MaLopHoc == study_class_id)
                    .Select(tg => new
                    {
                        StudentFirstName = tg.HocVien.Ten,
                        StudentLastName = tg.HocVien.Ho,
                        StudentEmail = tg.HocVien.Email,
                        StudentPhoneNumber = tg.HocVien.SoDienThoai,
                        StudentDayOfBirth = tg.HocVien.NgaySinh
                    })
                    .ToListAsync();

                return Ok(students);
            } 
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        // Later refactor to get necessary fields
        [Route("api/lay-chi-tiet-hoc-vien/{student_id}")]
        [HttpGet]
        public async Task<IActionResult> GetDetailForUpdate(int student_id)
        {
            HocVien studyClass = await context.HocViens.FindAsync(student_id);

            return Ok(studyClass);
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


        [Route("tao-hoc-vien")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([FromForm] StudentCreateRequest request)
        {
            if(context.HocViens.Any(hv => hv.SoDienThoai == request.SoDienThoai))
            {
                TempData["StudentErrorMessage"] = "Số điện thoại đã tồn tại trong hệ thống!";
                return Redirect("hoc-vien");
            }

            try
            {

                HocVien student = new HocVien
                {
                    Ho = request.Ho,
                    Ten = request.Ten,
                    NgaySinh = DateOnly.Parse(request.NgaySinh, CultureInfo.InvariantCulture),
                    DiaChi = request.DiaChi,
                    MaBarCode = request.SoDienThoai, 
                    Email = request.Email,
                    SoDienThoai = request.SoDienThoai,
                };

                context.HocViens.Add(student);
                await context.SaveChangesAsync();

                TempData["StudentSuccessMessage"] = "Thêm học viên thành công!";
                return Redirect("hoc-vien");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                TempData["StudentErrorMessage"] = "Có lỗi xảy ra khi thêm học viên: " + ex.Message;
                return Redirect("hoc-vien");
            }

        }

        [Route("cap-nhat-hoc-vien")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Update(int student_id, [FromForm] StudentUpdateRequest request)
        {

            try
            {
                HocVien student = await context.HocViens
                    .FirstOrDefaultAsync(lh => lh.MaHocVien == request.MaHocVien);

                student.Ho = request.Ho;
                student.Ten = request.Ten;
                student.NgaySinh = DateOnly.Parse(request.NgaySinh, CultureInfo.InvariantCulture);
                student.DiaChi = request.DiaChi;
                student.Email = request.Email;
                student.SoDienThoai = request.SoDienThoai;

                await context.SaveChangesAsync();

                TempData["StudentSuccessMessage"] = "Cập nhật học viên thành công!";
                return Redirect("hoc-vien");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                TempData["StudentSuccessMessage"] = "Có lỗi xảy ra khi cập nhật học viên: " + ex.Message;
                return Redirect("hoc-vien");
            }

        }


        [Route("xoa-hoc-vien")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete([FromForm] StudentDeleteRequest request)
        {
            Console.WriteLine("Delete student with ID: " + request.MaHocVien);
            try
            {
                HocVien student = await context.HocViens
                    .FirstOrDefaultAsync(lh => lh.MaHocVien == request.MaHocVien);

                context.HocViens.Remove(student);
                await context.SaveChangesAsync();

                TempData["StudentSuccessMessage"] = "Xóa học viên thành công!";
                return Redirect("hoc-vien");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                TempData["StudentSuccessMessage"] = "Có lỗi xảy ra khi xóa học viên: " + ex.Message;
                return Redirect("hoc-vien");
            }
        }

    }
}
