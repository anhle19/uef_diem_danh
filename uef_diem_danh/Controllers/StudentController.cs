using ExcelDataReader;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
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
                        StudentAvatar = tg.HocVien.HinhAnh,
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
            if(context.HocViens.Any(hv => hv.SoDienThoai == request.CreateStudentPhoneNumber))
            {
                TempData["StudentErrorMessage"] = "Số điện thoại đã tồn tại trong hệ thống!";
                return Redirect("hoc-vien");
            }

            try
            {

                HocVien student = new HocVien
                {
                    HinhAnh = $"student_pictures/hv_{request.CreateStudentPhoneNumber}{Path.GetExtension(request.CreateStudentAvatar.FileName)}",
                    Ho = request.CreateStudentLastName,
                    Ten = request.CreateStudentFirstName,
                    NgaySinh = DateOnly.Parse(request.CreateStudentDob, CultureInfo.InvariantCulture),
                    DiaChi = request.CreateStudentAddress,
                    MaBarCode = request.CreateStudentPhoneNumber, 
                    Email = request.CreateStudentEmail,
                    SoDienThoai = request.CreateStudentPhoneNumber,
                };

                // Init student avatar file path
                string uploadFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "student_pictures");
                string studentAvatarPath = Path.Combine(uploadFilePath, $"hv_{student.SoDienThoai}.png");

                // Save new uploaded student avatar
                using (var stream = new FileStream(studentAvatarPath, FileMode.Create))
                {
                    await request.CreateStudentAvatar.CopyToAsync(stream);
                }

                context.HocViens.Add(student);
                await context.SaveChangesAsync();

                TempData["StudentSuccessMessage"] = "Thêm học viên thành công!";
                return Redirect("hoc-vien");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.InnerException.Message);
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
                    .FirstOrDefaultAsync(lh => lh.MaHocVien == request.StudentId);

                if (context.HocViens.Any(hv => hv.SoDienThoai == request.UpdateStudentPhoneNumber))
                {
                    TempData["StudentErrorMessage"] = "Số điện thoại cập nhật bị trùng. Vui lòng nhập số điện thoại khác";
                    return Redirect("hoc-vien");
                }

                if (request.UpdateStudentAvatar != null)
                {
                    student.HinhAnh = $"student_pictures/hv_{request.UpdateStudentPhoneNumber}.{Path.GetExtension(request.UpdateStudentAvatar.FileName)}";
                    student.Ho = request.UpdateStudentLastName;
                    student.Ten = request.UpdateStudentFirstName;
                    student.NgaySinh = DateOnly.Parse(request.UpdateStudentDob, CultureInfo.InvariantCulture);
                    student.DiaChi = request.UpdateStudentAddress;
                    student.Email = request.UpdateStudentEmail;
                    student.SoDienThoai = request.UpdateStudentPhoneNumber;
                    student.MaBarCode = request.UpdateStudentPhoneNumber;

                    // Find existing student avatar
                    string uploadFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "student_pictures");
                    string existedStudentAvatarPath = Path.Combine(uploadFilePath, $"hv_{student.SoDienThoai}.png");

                    // Delete existed student avatar
                    System.IO.File.Delete(existedStudentAvatarPath);

                    // Save new uploaded student avatar
                    using (var stream = new FileStream(existedStudentAvatarPath, FileMode.Create))
                    {
                        await request.UpdateStudentAvatar.CopyToAsync(stream);
                    }
                }
                else
                {
                    student.Ho = request.UpdateStudentLastName;
                    student.Ten = request.UpdateStudentFirstName;
                    student.NgaySinh = DateOnly.Parse(request.UpdateStudentDob, CultureInfo.InvariantCulture);
                    student.DiaChi = request.UpdateStudentAddress;
                    student.Email = request.UpdateStudentEmail;
                    student.SoDienThoai = request.UpdateStudentPhoneNumber;
                    student.MaBarCode = request.UpdateStudentPhoneNumber;
                }



                await context.SaveChangesAsync();

                TempData["StudentSuccessMessage"] = "Cập nhật học viên thành công!";
                return Redirect("hoc-vien");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                TempData["StudentErrorMessage"] = "Có lỗi xảy ra khi cập nhật học viên: " + ex.Message;
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


        [Route("api/tai-ve-mot-the-hoc-vien/{student_id}")]
        [HttpPost]
        // Later change this to get student id via path variable
        public IActionResult DownloadSingleStudentCard(int student_id)
        {

            try
            {

                var options = new ChromeOptions();
                options.AddArgument("--headless=new"); // Chrome headless mode
                options.AddArgument("--disable-gpu");
                options.AddArgument("--no-sandbox");

                using var driver = new ChromeDriver(options);
                //driver.Navigate().GoToUrl("http://127.0.0.1:5500/html/page/barcode-card-single.html");
                driver.Navigate().GoToUrl($"https://localhost:7045/in-mot-the-hoc-vien/{student_id}");


                var printOptions = new PrintOptions
                {
                    Orientation = PrintOrientation.Portrait,
                    ScaleFactor = 1.5,
                    PageMargins = new PrintOptions.Margins { Bottom = 0, Top = 0, Left = 0, Right = 0 },
                    PageDimensions = new PrintOptions.PageSize { WidthInInches = 5.83, HeightInInches = 8.27 }
                };

                // Find HTML element by id
                IWebElement element = driver.FindElement(By.Id("print-btn-container"));

                // Change element style using JavaScript
                IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
                js.ExecuteScript("arguments[0].style.display = 'none';", element);

                // Convert to PDF
                var pdf = driver.Print(printOptions);

                byte[] pdfBytes = Convert.FromBase64String(pdf.AsBase64EncodedString);
                //string pdfPath = Path.Combine(Directory.GetCurrentDirectory(), "GeneratedPdf", "localhost_report.pdf");

                //// Save PDF to disk
                //pdf.SaveAsFile(pdfPath);

                //return Ok("In 1 thẻ học viên thành công");
                return File(pdfBytes, "application/pdf", "the_hoc_vien.pdf");
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }


        }

        [Route("api/tai-ve-danh-sach-the-hoc-vien/{study_class_id}")]
        [HttpPost]
        public IActionResult DownloadMultipleStudentCards(int study_class_id)
        {

            try
            {

                var options = new ChromeOptions();
                options.AddArgument("--headless=new"); // Chrome headless mode
                options.AddArgument("--disable-gpu");
                options.AddArgument("--no-sandbox");

                using var driver = new ChromeDriver(options);
                //driver.Navigate().GoToUrl("http://127.0.0.1:5500/html/page/barcode-card-multiple.html");
                driver.Navigate().GoToUrl($"https://localhost:7045/in-danh-sach-the-hoc-vien/{study_class_id}");


                var printOptions = new PrintOptions
                {
                    Orientation = PrintOrientation.Portrait,
                    ScaleFactor = 1.1,
                    PageMargins = new PrintOptions.Margins { Bottom = 0, Top = 0, Left = 0, Right = 0 },
                    PageDimensions = new PrintOptions.PageSize { WidthInInches = 8.27, HeightInInches = 11.69 }
                };

                // Find HTML element by id
                IWebElement element = driver.FindElement(By.Id("print-btn-container"));

                // Change element style using JavaScript
                IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
                js.ExecuteScript("arguments[0].style.display = 'none';", element);

                // Convert to PDF
                var pdf = driver.Print(printOptions);

                byte[] pdfBytes = Convert.FromBase64String(pdf.AsBase64EncodedString);
                //string pdfPath = Path.Combine(Directory.GetCurrentDirectory(), "GeneratedPdf", "danh_sach_hoc_vien.pdf");

                //// Save PDF to disk
                //pdf.SaveAsFile(pdfPath);

                //return Ok("In danh sách thẻ học viên thành công");
                return File(pdfBytes, "application/pdf", "danh_sach_hoc_vien.pdf");
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }


        }

    }
}
