using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using uef_diem_danh.Database;
using uef_diem_danh.DTOs;
using uef_diem_danh.Models;

namespace uef_diem_danh.Controllers
{
    public class EventController : Controller
    {

        private readonly AppDbContext context;

        public EventController(AppDbContext context)
        {
            this.context = context;
        }


        [Authorize(Roles = "Admin")]
        [Route("quan-ly-danh-sach-su-kien")]
        [HttpGet]
        public IActionResult GetListManagementPage()
        {
            List<SuKien> suKiens = context.SuKiens.ToList();
            return View("~/Views/Events/ListView.cshtml", suKiens);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("api/lay-chi-tiet-su-kien/{event_id}")]
        public async Task<IActionResult> GetDetailForUpdate(int event_id)
        {
            return Ok(await context.SuKiens.FindAsync(event_id));
        }


        [Route("diem-danh-su-kien/{event_id}")]
        [HttpGet]
        public async Task<IActionResult> GetAttendanceEventPage(int event_id)
        {

            SuKien classEvent = await context.SuKiens.FirstOrDefaultAsync(sk => sk.Id == event_id);

            //if (await context.SuKiens.AnyAsync(sk => sk.Id == event_id))
            //{
            //    return View();
            //}

            ViewBag.EventId = event_id;

            return View("~/Views/Events/AttendanceEvent.cshtml", classEvent);
        }

        [Route("ket-qua-diem-danh-su-kien/{event_id}")]
        public async Task<IActionResult> GetAttendanceEventResultPage(int event_id)
        {

            List<EventAttendanceResultParticipant> presentParticipants = await context.DiemDanhSuKiens
                .Where(ddsk => ddsk.EventId == event_id)
                .Select(ddsk => new EventAttendanceResultParticipant
                {
                    ParticipantFirstName = ddsk.Ten,
                    ParticipantLastName = ddsk.Ho,
                    StudyCenter = ddsk.DonVi,
                    AttendanceDayTime = ddsk.AttendanceDate
                })
                .ToListAsync();

            EventAttendanceResultResponse attendanceResult = await context.SuKiens
                .Where(sk => sk.Id == event_id)
                .Select(sk => new EventAttendanceResultResponse
                {
                    EventId = event_id,
                    EventTitle = sk.TieuDe,
                    ExpectedNumberOfParticipants = sk.SoLuongDuKien,
                    PresentParticipants = presentParticipants
                })
                .FirstOrDefaultAsync();

            ViewBag.EventId = event_id;

            return View("~/Views/Events/ResultView.cshtml", attendanceResult);
        }

        [Authorize(Roles = "Admin")]
        [Route("tao-su-kien")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([FromForm] EventCreateRequest request)
        {

            try
            {

                SuKien evt = new SuKien
                {
                    TieuDe = request.TieuDe,
                    NguoiPhuTrach = request.NguoiPhuTrach,
                    SoLuongDuKien = request.SoLuongDuKien,
                    ThoiGian = DateTime.Parse(request.ThoiGian, CultureInfo.InvariantCulture),
                    TrangThai = true,
                };

                context.SuKiens.Add(evt);
                await context.SaveChangesAsync();

                TempData["EventSuccessMessage"] = "Thêm lớp học thành công!";
                return Redirect("quan-ly-danh-sach-su-kien");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                TempData["EventErrorMessage"] = "Có lỗi xảy ra khi thêm sự kiện: " + ex.Message;
                return Redirect("quan-ly-danh-sach-su-kien");
            }

        }


        [Authorize(Roles = "Admin")]
        [Route("cap-nhat-su-kien")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Update([FromForm] EventUpdateRequest request)
        {

            try
            {
                SuKien evt = await context.SuKiens
                    .FirstOrDefaultAsync(lh => lh.Id == request.Id);

                evt.TieuDe = request.TieuDe;
                evt.NguoiPhuTrach = request.NguoiPhuTrach;
                evt.SoLuongDuKien = request.SoLuongDuKien;
                evt.ThoiGian = DateTime.Parse(request.ThoiGian, CultureInfo.InvariantCulture);

                await context.SaveChangesAsync();

                TempData["EventSuccessMessage"] = "Cập nhật sự kiện thành công!";
                return Redirect("quan-ly-danh-sach-su-kien");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                TempData["EventErrorMessage"] = "Có lỗi xảy ra khi cập nhật sự kiện: " + ex.Message;
                return Redirect("quan-ly-danh-sach-su-kien");
            }

        }

        [Authorize(Roles = "Admin")]
        [Route("khoa-su-kien")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> LockEvent([FromForm] EventDeleteRequest request)
        {

            try
            {
                SuKien evt = await context.SuKiens
                    .FirstOrDefaultAsync(lh => lh.Id == request.Id);

                evt.TrangThai = false;

                await context.SaveChangesAsync();

                TempData["EventSuccessMessage"] = "Khóa sự kiện thành công!";
                return Redirect("quan-ly-danh-sach-su-kien");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                TempData["EventErrorMessage"] = "Có lỗi xảy ra khi khóa sự kiện: " + ex.Message;
                return Redirect("quan-ly-danh-sach-su-kien");
            }

        }

        [Authorize(Roles = "Admin")]
        [Route("xoa-su-kien")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete([FromForm] EventDeleteRequest request)
        {
            try
            {
                SuKien evt = await context.SuKiens
                    .FirstOrDefaultAsync(lh => lh.Id == request.Id);

                context.SuKiens.Remove(evt);
                await context.SaveChangesAsync();

                TempData["EventSuccessMessage"] = "Xóa sự kiện thành công!";
                return Redirect("quan-ly-danh-sach-su-kien");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                TempData["EventErrorMessage"] = "Có lỗi xảy ra khi xóa sự kiện: " + ex.Message;
                return Redirect("quan-ly-danh-sach-su-kien");
            }
        }

    }
}
