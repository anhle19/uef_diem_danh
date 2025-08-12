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
                    Id = bh.MaBuoiHoc,
                    StudyClassName = bh.LopHoc.TenLopHoc,
                    ClassSessionNumber = bh.TietHoc
                })
                .ToListAsync();

            studySesstions = studySesstions.Select((item, index) => new AttendanceListManagementResponse
                {
                    Id = item.Id,
                    Stt = index + 1,
                    StudyClassName = item.StudyClassName,
                    ClassSessionNumber = item.ClassSessionNumber
                })
                .OrderBy(ss => ss.Stt)
                .ToList();

            return View("~/Views/Attendances/ListView.cshtml", studySesstions);
        }

    }
}
