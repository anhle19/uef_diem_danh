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

        [HttpGet("hoc-vien/danh-sach")]
        public IActionResult StudentList()
        {
            var students = context.HocViens.ToList();
            return View(students);
        }

        [HttpPost]
        [Route("student/excel-import")]
        public async Task<IActionResult> ImportFromExcel([FromForm] ImportStudentExcelRequest request)
        {
            List<HocVien> students = new List<HocVien>();
            LopHoc studyClass = new LopHoc();
            string fileExtension = Path.GetExtension(request.ExcelFile.FileName);
            string excelFileName = $"student_excel_{Guid.NewGuid()}.{fileExtension}";

            // Validate file extension
            if (fileExtension != ".xlsx" && fileExtension != ".xls")
            {
                return BadRequest("File không hợp lệ. Vui lòng tải lên file Excel (.xlsx hoặc .xls).");
            }

            if (request.MaLopHoc != null)
            {
                studyClass = context.LopHocs.FirstOrDefault(x => x.MaLopHoc == request.MaLopHoc);
            }

            try
            {
                var filePath = Path.Combine("UploadExcels", excelFileName);

                // Save the uploaded excel file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    request.ExcelFile.CopyTo(stream);
                }

                // Fix Unsupported Encoding Issue
                Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
                var config = new ExcelReaderConfiguration
                {
                    FallbackEncoding = Encoding.UTF8
                };

                // Read excel file
                using (var readExcelStream = System.IO.File.Open(filePath, FileMode.Open, FileAccess.Read))
                {
                    using (var excelReader = ExcelReaderFactory.CreateReader(readExcelStream, config))
                    {

                        int currentRow = 0; // Current row (starting at first row)

                        const int LAST_NAME_COLUMN_INDEX = 1;
                        const int FIRST_NAME_COLUMN_INDEX = 2;
                        const int EMAIL_COLUMN_INDEX = 3;
                        const int PHONE_NUMBER_COLUMN_INDEX = 4;
                        const int DOB_COLUMN_INDEX = 5;
                        const int ADDRESS_COLUMN_INDEX = 6;


                        // Read each row
                        while (excelReader.Read())
                        {
                            // Jump to next row
                            currentRow++;
                            // Extract data
                            if (currentRow >= 4)
                            {
                                HocVien student = new HocVien
                                {
                                    Ho = excelReader.GetValue(LAST_NAME_COLUMN_INDEX)?.ToString()?.Trim() ?? string.Empty,
                                    Ten = excelReader.GetValue(FIRST_NAME_COLUMN_INDEX)?.ToString()?.Trim() ?? string.Empty,
                                    Email = excelReader.GetValue(EMAIL_COLUMN_INDEX)?.ToString()?.Trim() ?? string.Empty,
                                    SoDienThoai = excelReader.GetValue(PHONE_NUMBER_COLUMN_INDEX)?.ToString()?.Trim() ?? string.Empty,
                                    NgaySinh = DateOnly
                                        .ParseExact(
                                            excelReader.GetValue(DOB_COLUMN_INDEX)?.ToString() ?? "01/01/1900", 
                                            "dd/MM/yyyy", 
                                            CultureInfo.InvariantCulture
                                    ),
                                    DiaChi = excelReader.GetValue(ADDRESS_COLUMN_INDEX)?.ToString()?.Trim() ?? string.Empty,
                                    MaBarCode = excelReader.GetValue(PHONE_NUMBER_COLUMN_INDEX)?.ToString()?.Trim() ?? string.Empty,
                                    CreatedAt = DateTime.UtcNow
                                };

                                //string? lastName = excelReader.GetValue(LAST_NAME_COLUMN_INDEX)?.ToString()?.Trim();
                                //string? firstName = excelReader.GetValue(FIRST_NAME_COLUMN_INDEX)?.ToString()?.Trim();
                                //string? email = excelReader.GetValue(EMAIL_COLUMN_INDEX)?.ToString()?.Trim();
                                //string? phoneNumber = excelReader.GetValue(PHONE_NUMBER_COLUMN_INDEX)?.ToString()?.Trim();
                                //string? dob = excelReader.GetValue(DOB_COLUMN_INDEX)?.ToString()?.Trim();
                                //string? address = excelReader.GetValue(ADDRESS_COLUMN_INDEX)?.ToString()?.Trim();

                                //// Allow print UTF-8 characters in console
                                //Console.OutputEncoding = Encoding.UTF8;

                                //Console.WriteLine("Last Name: " + lastName);
                                //Console.WriteLine("First Name: " + firstName);
                                //Console.WriteLine("Email: " + email);
                                //Console.WriteLine("Phone Number: " + phoneNumber);
                                //Console.WriteLine("Date of Birth: " + dob);
                                //Console.WriteLine("Address: " + address);

                                // Check if student already exists by phone number
                                if (!context.HocViens.Any(hv => hv.SoDienThoai == student.SoDienThoai))
                                {
                                    // If study class is provided, then save student with study class
                                    if (studyClass != null)
                                    {
                                        student.ThamGias = new List<ThamGia>
                                        {
                                            new ThamGia
                                            {
                                                MaLopHoc = studyClass.MaLopHoc,
                                                CreatedAt = DateTime.UtcNow
                                            }
                                        };
                                        students.Add(student);
                                    }
                                    // If not then just save student
                                    else
                                    {
                                        students.Add(student);
                                    }
                                }

                            }
                        }
                    }
                }

                // Delete excel file after processing
                System.IO.File.Delete(filePath);

                // Save students to database
                context.HocViens.AddRange(students);
                await context.SaveChangesAsync();

                return Ok("Nhập file excel thành công");

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return BadRequest("Lỗi khi nhập file excel: " + ex.Message);
            }

        }

        [Route("tao-hoc-vien")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([FromForm] StudentCreateRequest request)
        {

            try
            {

                HocVien student = new HocVien
                {
                    Ho = request.Ho,
                    Ten = request.Ten,
                    NgaySinh = DateOnly.Parse(request.NgaySinh, CultureInfo.InvariantCulture),
                    DiaChi = request.DiaChi,
                    Email = request.Email,
                    SoDienThoai = request.SoDienThoai,
                };

                context.HocViens.Add(student);
                await context.SaveChangesAsync();

                TempData["StudentSuccessMessage"] = "Thêm học viên thành công!";
                return Redirect("hoc-vien/danh-sach");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                TempData["StudentErrorMessage"] = "Có lỗi xảy ra khi thêm học viên: " + ex.Message;
                return Redirect("hoc-vien/danh-sach");
            }

        }
    }
}
