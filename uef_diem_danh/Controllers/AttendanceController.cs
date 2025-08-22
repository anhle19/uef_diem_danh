using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using uef_diem_danh.Database;
using uef_diem_danh.DTOs;
using uef_diem_danh.Models;

namespace uef_diem_danh.Controllers
{
    public class AttendanceController : Controller
    {

        private readonly AppDbContext context;

        public AttendanceController(AppDbContext context)
        {
            this.context = context;
        }


        [Authorize(Roles = "Admin")]
        [Route("quan-ly-dien-danh")]
        public async Task<IActionResult> GetListManagementPage()
        {

            List<AttendanceListManagementResponse> studySesstions = await context.BuoiHocs
                .Where(bh => bh.TrangThai == false)
                .Select(bh => new AttendanceListManagementResponse
                {
                    ClassSessionId = bh.MaBuoiHoc,
                    StudyClassId = bh.MaLopHoc,
                    StudyClassName = bh.LopHoc.TenLopHoc,
                    ClassSessionNumber = bh.TietHoc
                })
                .ToListAsync();

            studySesstions = studySesstions.Select((bh, index) => new AttendanceListManagementResponse
                {
                    ClassSessionId = bh.ClassSessionId,
                    StudyClassId = bh.StudyClassId,
                    Stt = index + 1,
                    StudyClassName = bh.StudyClassName,
                    ClassSessionNumber = bh.ClassSessionNumber
                })
                .OrderBy(ss => ss.Stt)
                .ToList();

            return View("~/Views/Attendances/ListView.cshtml", studySesstions);
        }


        [Authorize(Roles = "Admin,Staff")]
        [Route("diem-danh-hoc-vien")]
        public async Task<IActionResult> GetAttendanceCheckingPage([FromQuery] int studyClassId, [FromQuery] int classSessionId)
        {

            AttendanceCheckingViewResponse attendanceCheckingResponse = await context.BuoiHocs
                .Where(bh => bh.MaBuoiHoc == classSessionId)
                .Select(bh => new AttendanceCheckingViewResponse
                {
                    StudyClassId = studyClassId,
                    StudyClassName = bh.LopHoc.TenLopHoc,
                    ClassSessionId = bh.MaBuoiHoc,
                    ClassSessionNumber = bh.TietHoc
                })
                .FirstOrDefaultAsync();


            return View("~/Views/Attendances/CheckingView.cshtml", attendanceCheckingResponse);
        }

        
        [Authorize(Roles = "Admin,Staff")]
        [Route("api/lay-nam-buoi-diem-danh-moi-nhat/{study_class_id}")]
        public async Task<IActionResult> GetFiveLatestAttendances(int study_class_id)
        {
            List<AttendanceFiveLatestListResponse> latestAttendances = await context.DiemDanhs
                .Where(dd => dd.BuoiHoc.MaLopHoc == study_class_id)
                .Select(dd => new AttendanceFiveLatestListResponse
                {
                    StudentFirstName = dd.HocVien.Ten,
                    StudentLastName = dd.HocVien.Ho,
                    AttendanceDateTime = dd.ThoiGianDiemDanh
                })
                .OrderByDescending(dd => dd.AttendanceDateTime)
                .Take(5)
                .ToListAsync();

            return Ok(latestAttendances);
        }

        [Route("ket-qua-diem-danh")]
        public async Task<IActionResult> GetAttendanceResult([FromQuery] int studyClassId, [FromQuery] int classSessionId)
        {
            AttendanceResultResponse attendanceResult = await context.BuoiHocs
                .Where(bh => bh.MaLopHoc == studyClassId && bh.MaBuoiHoc == classSessionId)
                .Select(bh => new AttendanceResultResponse
                {
                    StudyClassId = bh.LopHoc.MaLopHoc,
                    StudyClassName = bh.LopHoc.TenLopHoc,
                    ClassSessionId = bh.MaBuoiHoc,
                    ClassSessionNumber = bh.TietHoc,
                    TotalStudents = bh.LopHoc.ThamGias.Count(),
                    TotalStudentsPresent = bh.DiemDanhs.Count(sbh => sbh.TrangThai == true),
                    StudentAttendanceResults = bh.DiemDanhs.Select((dd) => new StudentAttendanceResult
                    {
                        StudentFirstName = dd.HocVien.Ten,
                        StudentLastName = dd.HocVien.Ho,
                        AttendanceStatus = dd.TrangThai,
                        AttendanceDateTime = dd.ThoiGianDiemDanh
                    })
                    .OrderBy(dd => dd.StudentFirstName)
                    .ToList()
                })
                .FirstOrDefaultAsync();

            

            return View("~/Views/Attendances/ResultView.cshtml", attendanceResult);
        }


        [Route("xuat-ket-qua-diem-danh-excel")]
        [HttpGet]
        public async Task<IActionResult> ExportResultToExcel([FromQuery] int studyClassId, [FromQuery] int classSessionId)
        {

            // Get data
            AttendanceResultResponse attendanceResult = await context.BuoiHocs
                .Where(bh => bh.MaLopHoc == studyClassId && bh.MaBuoiHoc == classSessionId)
                .Select(bh => new AttendanceResultResponse
                {
                    StudyClassId = bh.LopHoc.MaLopHoc,
                    StudyClassName = bh.LopHoc.TenLopHoc,
                    ClassSessionId = bh.MaBuoiHoc,
                    ClassSessionNumber = bh.TietHoc,
                    TotalStudents = bh.LopHoc.ThamGias.Count(),
                    TotalStudentsPresent = bh.DiemDanhs.Count(sbh => sbh.TrangThai == true),
                    StudentAttendanceResults = bh.DiemDanhs.Select((dd) => new StudentAttendanceResult
                    {
                        StudentFirstName = dd.HocVien.Ten,
                        StudentLastName = dd.HocVien.Ho,
                        AttendanceStatus = dd.TrangThai,
                        AttendanceDateTime = dd.ThoiGianDiemDanh
                    })
                    .OrderBy(dd => dd.StudentFirstName)
                    .ToList()
                })
                .FirstOrDefaultAsync();


            // Make copy from Attendance Result sample.xlsx
            string sampleFilePath = Path.Combine(Directory.GetCurrentDirectory(), "ExportExcels", "Attendance Result sample.xlsx");

            string processingFileName = $"Attendance Result {attendanceResult.StudyClassName} - Buổi {attendanceResult.ClassSessionNumber}.xlsx";

            using (var templateStream = new MemoryStream(System.IO.File.ReadAllBytes(sampleFilePath)))

            // Process excel file
            using (var workbook = new XLWorkbook(templateStream))
            {
                const int STT_COLUMN = 1;
                const int FULL_NAME_COLUMN = 2;
                const int ATTENDANCE_STATUS_COLUMN = 3;
                const int ATTENDANCE_DAY_TIME_COLUMN = 4;

                int startStudentRow = 6;
                int endStudentRow = startStudentRow + attendanceResult.TotalStudents;
                int startStudentCol = 1;
                int endStudentCol = 4;

                // Get first worksheet
                var worksheet = workbook.Worksheet(1);

                // Set basic data
                worksheet.Cell("A2").Value = $"Buổi: {attendanceResult.ClassSessionNumber}";
                worksheet.Cell("A3").Value = $"Môn: {attendanceResult.StudyClassName}";
                worksheet.Cell("D2").Value = $"Tổng số: {attendanceResult.TotalStudents}";
                worksheet.Cell("D3").Value = $"Hiển diện: {attendanceResult.TotalStudentsPresent}";

                int currentStudentIndex = 0;
                // Set student data
                for (int row = startStudentRow; row < endStudentRow; row++)
                {
                    StudentAttendanceResult student = attendanceResult.StudentAttendanceResults[currentStudentIndex];
                    for (int col = startStudentCol; col <= endStudentCol; col++)
                    {
                        // Set font name, size, and background color
                        worksheet.Cell(row, col).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                        worksheet.Cell(row, col).Style.Font.FontName = "Arial";
                        worksheet.Cell(row, col).Style.Font.FontSize = 13;
                        worksheet.Cell(row, col).Style.Fill.BackgroundColor = XLColor.FromHtml("#F2F2F2");

                        if (col == STT_COLUMN)
                        {
                            worksheet.Cell(row, col).Value = currentStudentIndex + 1;
                        }
                        if (col == FULL_NAME_COLUMN)
                        {
                            worksheet.Cell(row, col).Value = $"{student.StudentLastName} {student.StudentFirstName}";
                        }
                        if (col == ATTENDANCE_STATUS_COLUMN)
                        {
                            if (student.AttendanceStatus == false)
                            {
                                worksheet.Cell(row, col).Style.Font.FontColor = XLColor.FromHtml("#ffc107");
                                worksheet.Cell(row, col).Value = "Vắng";
                            }
                            else
                            {
                                worksheet.Cell(row, col).Value = "";
                            }
                        }
                        if (col == ATTENDANCE_DAY_TIME_COLUMN)
                        {
                            worksheet.Cell(row, col).Value = student.AttendanceDateTime.ToString("dd/MM/yyyy HH:mm");
                        }

                    }

                    currentStudentIndex++;
                }


                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);

                    return File(
                        stream.ToArray(),
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        processingFileName
                    );
                }
            }

        }



        [Route("api/diem-danh-hoc-vien")]
        [HttpPost]
        public async Task<IActionResult> CheckAttendance([FromBody] AttendanceCheckingRequest request)
        {

            try
            {
                DiemDanh newAttendance = new DiemDanh();

                // Get student by barcode
                HocVien? student = await context.HocViens
                    .Where(hv => hv.MaBarCode == request.StudentBarCode)
                    .FirstOrDefaultAsync();

                if (student == null)
                {
                    return BadRequest("Học viên không tồn tại.");
                }

                // Check if student participated in study class
                var isParticipatedInStudyClass = context.ThamGias
                    .Any(tg => tg.MaHocVien == student.MaHocVien && tg.LopHoc.TenLopHoc == request.StudyClassName);

                // Check if student attendance already present
                var isAttendanceExisted = context.DiemDanhs
                    .Any(dd => dd.MaHocVien == student.MaHocVien && dd.MaBuoiHoc == request.ClassSessionId);

                if (!isParticipatedInStudyClass)
                {
                    return BadRequest("Học viên không có trong lớp học này.");
                }
                if (isAttendanceExisted)
                {
                    return BadRequest("Học viên đã điểm danh trong buổi học này.");
                }
                else
                {
                    // Create new attendance record
                    newAttendance = new DiemDanh
                    {
                        MaHocVien = student.MaHocVien,
                        MaBuoiHoc = request.ClassSessionId,
                        ThoiGianDiemDanh = DateTime.Now,
                        TrangThai = true
                    };

                    context.DiemDanhs.Add(newAttendance);
                    await context.SaveChangesAsync();
                }

                AttendanceCheckingResponse attendanceCheckingResponse = new AttendanceCheckingResponse
                {
                    Message = "Điểm danh học viên thành công!",
                    StudentAvatar = student.HinhAnh.Name,
                    StudyClassName = request.StudyClassName,
                    StudentFirstName = student.Ten,
                    StudentLastName = student.Ho,
                    StudentPhoneNumber = student.SoDienThoai,
                    StudentDayOfBirth = student.NgaySinh,
                    AttendanceDateTime = newAttendance.ThoiGianDiemDanh
                };

                return Ok(attendanceCheckingResponse);
            }
            catch (Exception ex)
            {
                if (ex.InnerException != null)
                {
                    Console.WriteLine(ex.InnerException.Message);
                }

                return BadRequest();
            }
        }


    }
}
