using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using uef_diem_danh.Database;
using uef_diem_danh.DTOs;

namespace uef_diem_danh.Controllers
{
    public class AttendanceController : Controller
    {

        private readonly AppDbContext context;

        public AttendanceController(AppDbContext context)
        {
            this.context = context;
        }


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


        [Route("ket-qua-diem-danh")]
        public async Task<IActionResult> GetAttendanceResult([FromQuery] int studyClassId, [FromQuery] int classSessionId)
        {
            AttendanceResultResponse attendanceResult = await context.BuoiHocs
                .Where(bh => bh.MaLopHoc == studyClassId && bh.MaBuoiHoc == classSessionId)
                .Select(bh => new AttendanceResultResponse
                {
                    StudyClassName = bh.LopHoc.TenLopHoc,
                    ClassSessionNumber = bh.TietHoc,
                    TotalStudents = bh.LopHoc.ThamGias.Count(),
                    TotalStudentsPresent = bh.DiemDanhs.Count(sbh => sbh.TrangThai == true),
                    StudentAttendanceResults = bh.DiemDanhs.Select((dd) => new StudentAttendanceResult
                    {
                        StudentFirstName = dd.HocVien.Ten,
                        StudentLastName = dd.HocVien.Ho,
                        AttendanceDateTime = dd.ThoiGianDiemDanh
                    })
                    .OrderBy(dd => dd.StudentFirstName)
                    .ToList()
                })
                .FirstOrDefaultAsync();


            return View("~/Views/Attendances/ResultView.cshtml", attendanceResult);
        }

    }
}
