using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
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
                    Email = tg.HocVien.Email,
                    PhoneNumber = tg.HocVien.SoDienThoai,
                    BarCode = tg.HocVien.MaBarCode,
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
