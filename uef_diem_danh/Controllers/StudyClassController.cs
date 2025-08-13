using ClosedXML.Excel;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using ExcelDataReader;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Drawing.Imaging;
using System.Globalization;
using System.Text;
using uef_diem_danh.Database;
using uef_diem_danh.DTOs;
using uef_diem_danh.Models;

namespace uef_diem_danh.Controllers
{
    public class StudyClassController : Controller
    {

        private readonly AppDbContext context;


        public StudyClassController(AppDbContext context)
        {
            this.context = context;
        }

        [Route("")]
        [HttpGet]
        public async Task<IActionResult> GetListManagementPage()
        {

            List<StudyClassListManagementResponse> studyClasses = await context.LopHocs
                .Select(lh => new StudyClassListManagementResponse
                {
                    Id = lh.MaLopHoc,
                    StudyClassName = lh.TenLopHoc,
                    StartDate = lh.ThoiGianBatDau,
                    EndDate = lh.ThoiGianKetThuc,
                    CreatedAt = lh.CreatedAt
                })
                .OrderBy(lh => lh.CreatedAt)
                .ToListAsync();


            return View("~/Views/StudyClasses/ListView.cshtml", studyClasses);
        }

        [Route("quan-ly-danh-sach-lop-hoc/{study_class_id}/quan-ly-danh-sach-hoc-vien")]
        [HttpGet]
        public async Task<IActionResult> GetListOfStudentsManagementPage(int study_class_id)
        {

            List<StudyClassStudentListManagementResponse> students = await context.ThamGias
                .Where(tg => tg.MaLopHoc == study_class_id)
                .Select(tg => new StudyClassStudentListManagementResponse
                {
                    Id = tg.HocVien.MaHocVien,
                    LastName = tg.HocVien.Ho,
                    FirstName = tg.HocVien.Ten,
                    PhoneNumber = tg.HocVien.SoDienThoai,
                    Address = tg.HocVien.DiaChi,
                    DateOfBirth = tg.HocVien.NgaySinh,
                })
                .OrderBy(hv => hv.FirstName)
                .ToListAsync();

            // Set study_class_id in View
            ViewBag.StudyClassId = study_class_id;

            return View("~/Views/StudyClasses/StudentListView.cshtml", students);
        }

        [Route("api/quan-ly-danh-sach-lop-hoc/danh-sach-hoc-vien-con-trong")]
        [HttpGet]
        public async Task<IActionResult> GetListOfAvailableStudents()
        {

            List<StudyClassAvailableStudentListResponse> students = await context.HocViens
                .GroupJoin(
                    context.ThamGias,
                    hv => hv.MaHocVien,
                    tg => tg.MaHocVien,
                    (hv, tg) => new
                    {
                        hv,
                        tg
                    }
                )
                .Where(joined => joined.tg.Count() == 0) // Filter out students who are already in the study class
                .Select(joined => new StudyClassAvailableStudentListResponse
                {
                    Id = joined.hv.MaHocVien,
                    LastName = joined.hv.Ho,
                    FirstName = joined.hv.Ten,
                    Email = joined.hv.Email,
                    PhoneNumber = joined.hv.SoDienThoai,
                    BarCode = joined.hv.MaBarCode,
                    Address = joined.hv.DiaChi,
                    DateOfBirth = joined.hv.NgaySinh
                })
                .ToListAsync();

            return Ok(students);
        }

        [Route("api/lay-chi-tiet-lop-hoc/{study_class_id}")]
        [HttpGet]
        public async Task<IActionResult> GetDetailForUpdate(int study_class_id)
        {
            LopHoc studyClass = await context.LopHocs.FindAsync(study_class_id);

            return Ok(studyClass);
        }


        
        [Route("tao-moi-lop-hoc")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([FromForm] StudyClassCreateRequest request)
        {

            try
            {
                Console.WriteLine($"StudyClassName: {request.StudyClassName}");
                Console.WriteLine($"StartDate: {request.StartDate}");
                Console.WriteLine($"EndDate: {request.EndDate}");

                LopHoc studyClass = new LopHoc
                {
                    TenLopHoc = request.StudyClassName,
                    ThoiGianBatDau = DateOnly.Parse(request.StartDate, CultureInfo.InvariantCulture),
                    ThoiGianKetThuc = DateOnly.Parse(request.EndDate, CultureInfo.InvariantCulture),
                };

                context.LopHocs.Add(studyClass);
                await context.SaveChangesAsync();

                TempData["StudyClassSuccessMessage"] = "Thêm lớp học thành công!";
                return RedirectToAction("GetListManagementPage");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                TempData["StudyClassErrorMessage"] = "Có lỗi xảy ra khi thêm lớp học: " + ex.Message;
                return RedirectToAction("GetListManagementPage");
            }

        }

        [Route("api/quan-ly-danh-sach-lop-hoc/{study_class_id}/them-hoc-vien-vao-lop-hoc")]
        [HttpPost]
        public async Task<IActionResult> AddStudent(int study_class_id, [FromBody] StudyClassAddStudentRequest request)
        {
            try
            {
                LopHoc studyClass = await context.LopHocs
                    .Include(lh => lh.ThamGias)
                    .FirstOrDefaultAsync(lh => lh.MaLopHoc == study_class_id);

                ThamGia studentParticipateStudyClass = new ThamGia
                {
                    LopHoc = studyClass,
                    MaHocVien = request.StudentId,
                    CreatedAt = DateTime.UtcNow
                };

                studyClass.ThamGias.Add(studentParticipateStudyClass);

                await context.SaveChangesAsync();

                return Ok("Thêm học viên vào lớp học thành công");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest("Thêm học viên vào lớp học thất bại");
            }

        }

        [Route("quan-ly-danh-sach-lop-hoc/{study_class_id}/them-hoc-vien-vao-lop-hoc-bang-excel")]
        [HttpPost]
        public async Task<IActionResult> ImportStudentsFromExcel(int study_class_id, [FromForm] ImportStudentToStudyClassByExcelRequest request)
        {
            List<HocVien> creatingStudents = new List<HocVien>();
            List<HocVien> existedStudents = new List<HocVien>();

            LopHoc studyClass = new LopHoc();
            string fileExtension = Path.GetExtension(request.ExcelFile.FileName);
            string excelFileName = $"student_excel_{Guid.NewGuid()}.{fileExtension}";

            // Validate file extension
            if (fileExtension != ".xlsx" && fileExtension != ".xls")
            {
                return BadRequest("File không hợp lệ. Vui lòng tải lên file Excel (.xlsx hoặc .xls).");
            }

            studyClass = context.LopHocs.FirstOrDefault(lh => lh.MaLopHoc == study_class_id);

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

                                string lastName = excelReader.GetValue(LAST_NAME_COLUMN_INDEX)?.ToString()?.Trim() ?? string.Empty;
                                string firstName = excelReader.GetValue(FIRST_NAME_COLUMN_INDEX)?.ToString()?.Trim() ?? string.Empty;
                                string email = excelReader.GetValue(EMAIL_COLUMN_INDEX)?.ToString()?.Trim() ?? string.Empty;
                                string phoneNumber = excelReader.GetValue(PHONE_NUMBER_COLUMN_INDEX)?.ToString()?.Trim() ?? string.Empty;
                                string address = excelReader.GetValue(ADDRESS_COLUMN_INDEX)?.ToString()?.Trim() ?? string.Empty;
                                string dateOfBirth = excelReader.GetValue(DOB_COLUMN_INDEX)?.ToString() ?? string.Empty;

                                // Validate if row is empty
                                if (string.IsNullOrEmpty(lastName))
                                {
                                    TempData["StudentInStudyClassErrorMessage"] = $"Không được để trống Họ học viên ở dòng: {currentRow}";
                                    return RedirectToAction("GetListOfStudentsManagementPage", new { study_class_id = study_class_id });
                                }
                                if (string.IsNullOrEmpty(firstName))
                                {
                                    TempData["StudentInStudyClassErrorMessage"] = $"Không được để trống Tên học viên ở dòng: {currentRow}";
                                    return RedirectToAction("GetListOfStudentsManagementPage", new { study_class_id = study_class_id });
                                }
                                if (string.IsNullOrEmpty(phoneNumber))
                                {
                                    TempData["StudentInStudyClassErrorMessage"] = $"Không được để trống Số điện thoại học viên ở dòng: {currentRow}";
                                    return RedirectToAction("GetListOfStudentsManagementPage", new { study_class_id = study_class_id });
                                }
                                if (string.IsNullOrEmpty(address))
                                {
                                    TempData["StudentInStudyClassErrorMessage"] = $"Không được để trống Địa chỉ học viên ở dòng: {currentRow}";
                                    return RedirectToAction("GetListOfStudentsManagementPage", new { study_class_id = study_class_id });
                                }
                                if (string.IsNullOrEmpty(dateOfBirth))
                                {
                                    TempData["StudentInStudyClassErrorMessage"] = $"Không được để trống Ngày sinh học viên ở dòng: {currentRow}";
                                    return RedirectToAction("GetListOfStudentsManagementPage", new { study_class_id = study_class_id });
                                }

                                try
                                {
                                    DateOnly
                                        .ParseExact(
                                            excelReader.GetValue(DOB_COLUMN_INDEX)?.ToString() ?? "01/01/1900",
                                            "dd/MM/yyyy",
                                            CultureInfo.InvariantCulture);
                                } 
                                catch (FormatException)
                                {
                                    TempData["StudentInStudyClassErrorMessage"] = $"Ngày sinh học viên không hợp lệ ở dòng: {currentRow}. Vui lòng nhập đúng định dạng dd/MM/yyyy";
                                    return RedirectToAction("GetListOfStudentsManagementPage", new { study_class_id = study_class_id });
                                }

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


                                // If student not exists by phone number
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
                                        creatingStudents.Add(student);
                                    }
                                    // If study class is not provided, then just save student
                                    else
                                    {
                                        creatingStudents.Add(student);
                                    }
                                }
                                // If student already existed by phone number
                                else
                                {
                                    if (studyClass != null)
                                    {
                                        // If student not participated in study class yet
                                        if (!context.ThamGias.Any(tg => tg.MaHocVien == student.MaHocVien && tg.MaLopHoc == studyClass.MaLopHoc)) {
                                            student.ThamGias = new List<ThamGia>
                                            {
                                                new ThamGia
                                                {
                                                    MaLopHoc = studyClass.MaLopHoc,
                                                    CreatedAt = DateTime.UtcNow
                                                }
                                            };

                                            await context.SaveChangesAsync();
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // Extract image 
                var workbook = new XLWorkbook(filePath);
                var worksheet = workbook.Worksheet(1); // Assuming the first worksheet contains the data

                foreach (var picture in worksheet.Pictures)
                {
                    var imageBytes = picture.ImageStream.ToArray();

                    var fileName = $"{picture.Name}.png";

                    Console.WriteLine($"Picture Name: {picture.Name}");

                    var imageFilePath = Path.Combine(Directory.GetCurrentDirectory(), "UploadAvatars", fileName);

                    await System.IO.File.WriteAllBytesAsync(imageFilePath, imageBytes);

                }

                // Delete excel file after processing
                System.IO.File.Delete(filePath);

                // Save students to database
                context.HocViens.AddRange(creatingStudents);
                await context.SaveChangesAsync();

                TempData["StudentInStudyClassSuccessMessage"] = "Nhập học viên vào lớp học từ file excel thành công!";
                return RedirectToAction("GetListOfStudentsManagementPage", new { study_class_id = study_class_id });

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                TempData["StudentInStudyClassErrorMessage"] = "Nhập học viên vào lớp học từ file excel không thành công " + ex.Message;
                return RedirectToAction("GetListOfStudentsManagementPage", new { study_class_id = study_class_id });
            }

        }

        

        [Route("cap-nhat-lop-hoc")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Update(int study_class_id, [FromForm] StudyClassUpdateRequest request)
        {

            try
            {
                LopHoc studyClass = await context.LopHocs
                    .FirstOrDefaultAsync(lh => lh.MaLopHoc == request.Id);

                studyClass.TenLopHoc = request.StudyClassName;
                studyClass.ThoiGianBatDau = DateOnly.Parse(request.StartDate, CultureInfo.InvariantCulture);
                studyClass.ThoiGianKetThuc = DateOnly.Parse(request.EndDate, CultureInfo.InvariantCulture);

                await context.SaveChangesAsync();

                TempData["StudyClassSuccessMessage"] = "Cập nhật lớp học thành công!";
                return RedirectToAction("GetListManagementPage");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                TempData["StudyClassErrorMessage"] = "Có lỗi xảy ra khi cập nhật lớp học: " + ex.Message;
                return RedirectToAction("GetListManagementPage");
            }

        }


        [Route("xoa-lop-hoc")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete([FromForm] StudyClassDeleteRequest request)
        {
            try
            {
                LopHoc studyClass = await context.LopHocs
                    .FirstOrDefaultAsync(lh => lh.MaLopHoc == request.Id);

                context.LopHocs.Remove(studyClass);
                await context.SaveChangesAsync();

                TempData["StudyClassSuccessMessage"] = "Xóa lớp học thành công!";
                return RedirectToAction("GetListManagementPage");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                TempData["StudyClassErrorMessage"] = "Có lỗi xảy ra khi xóa lớp học: " + ex.Message;
                return RedirectToAction("GetListManagementPage");
            }
        }

        [Route("quan-ly-danh-sach-lop-hoc/{study_class_id}/xoa-hoc-vien-khoi-lop-hoc")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteStudent(int study_class_id, [FromForm] StudyClassRemoveStudentRequest request)
        {
            try
            {
                Console.WriteLine("REMOVE STUDENT FROM STUDY CLASSS");
                Console.WriteLine(request.StudentId);
                ThamGia studentParticipateStudyClass = await context.ThamGias
                    .FirstOrDefaultAsync(tg => tg.MaLopHoc == study_class_id && tg.MaHocVien == request.StudentId);

                context.ThamGias.Remove(studentParticipateStudyClass);
                await context.SaveChangesAsync();

                TempData["StudentInStudyClassSuccessMessage"] = "Xóa học viên khỏi lớp học thành công!";
                return RedirectToAction("GetListOfStudentsManagementPage", new { study_class_id = study_class_id });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                TempData["StudentInStudyClassErrorMessage"] = "Có lỗi xảy ra khi xóa học viên khỏi lớp học: " + ex.Message;
                return RedirectToAction("GetListOfStudentsManagementPage", new { study_class_id = study_class_id });
            }
        }

    }
}
