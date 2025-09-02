using DocumentFormat.OpenXml.InkML;
using ExcelDataReader;
using Microsoft.AspNetCore.Authorization;
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

        

        [Authorize(Roles = "Admin")]
        [HttpGet("hoc-vien")]
        // Later refactor to get necessary fields
        public IActionResult StudentList()
        {
            var students = context.HocViens.Include(hv => hv.HinhAnh).ToList();
            return View(students);
        }


        [Authorize(Roles = "Admin")]
        [HttpGet("tai-len-anh-hoc-vien")]
        // Later refactor to get necessary fields
        public IActionResult GetUploadStudentAvatarPage()
        {

            return View("~/Views/Student/UploadStudentAvatar.cshtml");
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
                        StudyCenter = tg.HocVien.DonVi,
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

        [Route("api/lay-chi-tiet-hoc-vien/{student_id}")]
        [HttpGet]
        public async Task<IActionResult> GetDetailForUpdate(int student_id)
        {
            //HocVien studyClass = await context.HocViens.FindAsync(student_id);

            StudentDetailResponse studyClass = await context.HocViens
                .Select(hv => new StudentDetailResponse
                {
                    MaHocVien = hv.MaHocVien,
                    TenHinhAnh = hv.HinhAnh.Name,
                    Ho = hv.Ho,
                    Ten = hv.Ten,
                    Email = hv.Email,
                    DiaChi = hv.DiaChi,
                    DonVi = hv.DonVi,
                    MaBarCode = hv.MaBarCode,
                    SoDienThoai = hv.SoDienThoai,
                    NgaySinh = hv.NgaySinh
                })
                .FirstOrDefaultAsync(hv => hv.MaHocVien == student_id);


            return Ok(studyClass);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
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

        //[HttpGet("api/hoc-vien/kiem-tra-ton-tai/{phone}")]
        //public IActionResult CheckExists(string phone)
        //{
        //    var exists = context.HocViens.Any(u => u.SoDienThoai == phone);
        //    return Json(new { exists });
        //}

        [HttpGet("api/lay-the-hoc-vien")]
        public IActionResult GetUserInfoPartial(string phone)
        {
            Console.WriteLine("SO DIEN THOAI: " + phone);
            HocVien res = context.HocViens.Include(hv => hv.HinhAnh).FirstOrDefault(hv => hv.SoDienThoai == phone);
            return PartialView("~/Views/Component/StudentCard.cshtml", res);
        }

        [Authorize(Roles = "Admin")]
        [Route("tao-hoc-vien")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([FromForm] StudentCreateRequest request)
        {
            if(context.HocViens.Any(hv => hv.SoDienThoai == request.CreateStudentPhoneNumber))
            {
                TempData["StudentErrorMessage"] = "Số điện thoại của học viên đã tồn tại trong hệ thống!";
                return Redirect("hoc-vien");
            }

            try
            {

                HocVien student = new HocVien
                {
                    //HinhAnh = $"hv_{request.CreateStudentPhoneNumber}{Path.GetExtension(request.CreateStudentAvatar.FileName)}",
                    Ho = request.CreateStudentLastName,
                    Ten = request.CreateStudentFirstName,
                    NgaySinh = DateOnly.Parse(request.CreateStudentDob, CultureInfo.InvariantCulture),
                    DiaChi = request.CreateStudentAddress,
                    MaBarCode = request.CreateStudentPhoneNumber, 
                    Email = request.CreateStudentEmail,
                    SoDienThoai = request.CreateStudentPhoneNumber,
                    DonVi = request.CreateStudentUnit,
                };


                if(request.CreateStudentAvatar == null || request.CreateStudentAvatar.Length == 0)
                {
                    student.HinhAnh = new HinhAnh
                    {
                        Name = $"logo.png"
                    };

                    context.HocViens.Add(student);
                    await context.SaveChangesAsync();
                }
                else
                {
                    student.HinhAnh = new HinhAnh
                    {
                        Name = $"hv_{request.CreateStudentPhoneNumber}{Path.GetExtension(request.CreateStudentAvatar.FileName)}"
                    };

                    context.HocViens.Add(student);
                    await context.SaveChangesAsync();

                    // Init student avatar file path
                    string uploadFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "student_pictures");
                    string studentAvatarPath = Path.Combine(uploadFilePath, $"hv_{student.SoDienThoai}{Path.GetExtension(request.CreateStudentAvatar.FileName)}");

                    // Save new uploaded student avatar
                    using (var stream = new FileStream(studentAvatarPath, FileMode.Create))
                    {
                        await request.CreateStudentAvatar.CopyToAsync(stream);
                    }
                }

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

        [HttpPost]
        [Route("api/hoc-vien/tai-anh-dai-dien")]
        public async Task<IActionResult> UploadAvatarAsync([FromForm] AvatarUploadRequest request)
        {
            if(!context.HocViens.Any(hv => hv.SoDienThoai == request.PhoneNumber))
            {
                return NotFound();
            }
            var student = context.HocViens.Include(hv => hv.HinhAnh).FirstOrDefault(hv => hv.SoDienThoai == request.PhoneNumber);
            Console.WriteLine("TEN HOC VIEN: " + student.NgaySinh.ToString("dd/MMM/yyyy"));

            if (student == null) return NotFound();

            if (request.Avatar == null || request.Avatar.Length == 0)
            {
                student.HinhAnh = new HinhAnh
                {
                    Name = $"logo.png"
                };

                context.HocViens.Update(student);
                await context.SaveChangesAsync();
            }
            else
            {
                string uploadFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "student_pictures");

                if (student.HinhAnh.Name.Contains($"hv_{student.SoDienThoai}"))
                {
                    string existedStudentAvatarPath = Path.Combine(uploadFilePath, student.HinhAnh.Name);
                    if (System.IO.File.Exists(existedStudentAvatarPath))
                    {
                        // Delete existed student avatar
                        System.IO.File.Delete(existedStudentAvatarPath);
                    }
                }

                student.HinhAnh = new HinhAnh
                {
                    Name = $"hv_{request.PhoneNumber}{Path.GetExtension(request.Avatar.FileName)}"
                };

                context.HocViens.Update(student);
                await context.SaveChangesAsync();


                // New student avatar file
                string newStudentAvatarPath = Path.Combine(uploadFilePath, student.HinhAnh.Name);

                // Save new uploaded student avatar
                using (var stream = new FileStream(newStudentAvatarPath, FileMode.Create))
                {
                    await request.Avatar.CopyToAsync(stream);
                }
            }

            return Ok(new AvatarUploadResponse
            {
                AvatarName = student.HinhAnh.Name,
                Name = student.Ho + " " + student.Ten,
                PhoneNumber = student.SoDienThoai,
            });

        }





        [Authorize(Roles = "Admin")]
        [Route("cap-nhat-hoc-vien")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Update([FromForm] StudentUpdateRequest request)
        {

            try
            {
                HocVien student = await context.HocViens
                    .Include(hv => hv.HinhAnh)
                    .FirstOrDefaultAsync(lh => lh.MaHocVien == request.StudentId);


                if (context.HocViens.Any(hv => hv.SoDienThoai == request.UpdateStudentPhoneNumber && hv.MaHocVien != request.StudentId ))
                {
                    TempData["StudentErrorMessage"] = "Số điện thoại cập nhật bị trùng. Vui lòng nhập số điện thoại khác";
                    return Redirect("hoc-vien");
                }

                if (request.UpdateStudentAvatar != null)
                {

                    // Find existing student avatar
                    string uploadFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "student_pictures");

                    if (context.HocViens.Any(hv => hv.HinhAnh.Name.Contains($"hv_{student.SoDienThoai}")))
                    {
                        string existedStudentAvatarPath = Path.Combine(uploadFilePath, student.HinhAnh.Name);
                        if (System.IO.File.Exists(existedStudentAvatarPath))
                        {
                            // Delete existed student avatar
                            System.IO.File.Delete(existedStudentAvatarPath);
                        }
                    }


                    student.HinhAnh.Name = $"hv_{request.UpdateStudentPhoneNumber}{Path.GetExtension(request.UpdateStudentAvatar.FileName)}";
                    student.Ho = request.UpdateStudentLastName;
                    student.Ten = request.UpdateStudentFirstName;
                    student.NgaySinh = DateOnly.Parse(request.UpdateStudentDob, CultureInfo.InvariantCulture);
                    student.DiaChi = request.UpdateStudentAddress;
                    student.Email = request.UpdateStudentEmail;
                    student.SoDienThoai = request.UpdateStudentPhoneNumber;
                    student.MaBarCode = request.UpdateStudentPhoneNumber;
                    student.DonVi = request.UpdateStudentUnit;

                    // New student avatar file
                    string newStudentAvatarPath = Path.Combine(uploadFilePath, student.HinhAnh.Name);

                    // Save new uploaded student avatar
                    using (var stream = new FileStream(newStudentAvatarPath, FileMode.Create))
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
                    student.DonVi = request.UpdateStudentUnit;
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


        [Authorize(Roles = "Admin")]
        [Route("xoa-hoc-vien")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete([FromForm] StudentDeleteRequest request)
        {
            Console.WriteLine("Delete student with ID: " + request.MaHocVien);
            try
            {
                HocVien student = await context.HocViens
                    .Include(hv => hv.HinhAnh)
                    .FirstOrDefaultAsync(lh => lh.MaHocVien == request.MaHocVien);


                // Find existing student avatar
                string uploadFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "student_pictures");
                if (context.HocViens.Any(hv => hv.HinhAnh.Name.Contains($"hv_{student.SoDienThoai}")))
                {
                    string existedStudentAvatarPath = Path.Combine(uploadFilePath, student.HinhAnh.Name);
                    if (System.IO.File.Exists(existedStudentAvatarPath))
                    {
                        // Delete existed student avatar
                        System.IO.File.Delete(existedStudentAvatarPath);
                    }
                }


                context.HocViens.Remove(student);
                await context.SaveChangesAsync();

                TempData["StudentSuccessMessage"] = "Xóa học viên thành công!";
                return Redirect("hoc-vien");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                TempData["StudentErrorMessage"] = "Có lỗi xảy ra khi xóa học viên: " + ex.Message;
                return Redirect("hoc-vien");
            }
        }


        [Authorize(Roles = "Admin, Staff")]
        [Route("api/tai-ve-mot-the-hoc-vien/{student_id}")]
        [HttpPost]
        public IActionResult DownloadSingleStudentCard(int student_id)
        {

            try
            {

                var options = new ChromeOptions();
                options.AddArgument("--headless=new"); // Chrome headless mode
                options.AddArgument("--disable-gpu");
                options.AddArgument("--no-sandbox");

                using var driver = new ChromeDriver(options);


                //driver.Navigate().GoToUrl($"https://laitsolution.id.vn/in-mot-the-hoc-vien/{student_id}");
                driver.Navigate().GoToUrl($"https://localhost:5046/in-mot-the-hoc-vien/{student_id}");


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
                return BadRequest(ex.Message);
            }


        }

        [Authorize(Roles = "Admin, Staff")]
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

                //driver.Navigate().GoToUrl($"https://laitsolution.id.vn/in-danh-sach-the-hoc-vien/{study_class_id}");
                driver.Navigate().GoToUrl($"https://localhost:5046/in-danh-sach-the-hoc-vien/{study_class_id}");


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
