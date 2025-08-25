using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Data;
using System.Globalization;
using System.Threading.Tasks;
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

                TempData["EventSuccessMessage"] = "Thêm sự kiện thành công!";
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

        [HttpPost("them-diem-danh-su-kien")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> TakeEventAttendance([FromForm] EventAttendanceRequest request)
        {
            try
            {
                // kiểm tra trùng
                var existed = await context.DiemDanhSuKiens
                    .FirstOrDefaultAsync(dd => dd.SoDienThoai == request.PhoneNumber);

                if (existed != null)
                {
                    return BadRequest(new { message = "Số điện thoại đã điểm danh rồi!" });
                }

                // tách họ tên
                int lastSpaceIndex = request.Name.LastIndexOf(' ');
                string ho = lastSpaceIndex != -1 ? request.Name.Substring(0, lastSpaceIndex) : "";
                string ten = lastSpaceIndex != -1 ? request.Name.Substring(lastSpaceIndex + 1) : request.Name;

                var diemDanh = new DiemDanhSuKien
                {
                    EventId = request.Id,
                    DonVi = request.Unit,
                    SoDienThoai = request.PhoneNumber,
                    Ho = ho,
                    Ten = ten,
                    AttendanceDate = DateTime.Now,
                };

                context.DiemDanhSuKiens.Add(diemDanh);
                await context.SaveChangesAsync();

                return Ok(new { message = "Điểm danh sự kiện thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi: " + ex.Message });
            }
        }

        [HttpGet("tai-diem-danh-su-kien/{event_id}")]
        public async Task<IActionResult> ExportToExcel(int event_id)
        {
            List<DiemDanhSuKien> diemDanhs = context.DiemDanhSuKiens.Where(dd => dd.EventId == event_id).ToList();

            DataTable dt = new DataTable("Attendances");
            dt.Columns.AddRange(new DataColumn[6] {
                new DataColumn("STT"),
                new DataColumn("Họ Tên"),
                new DataColumn("Số điện thoại"),
                new DataColumn("Ngày sinh"),
                new DataColumn("Đơn vị"),
                new DataColumn("Ngày điểm danh")
            });

            int i = 1;
            foreach (DiemDanhSuKien diemDanh in diemDanhs)
            {
                dt.Rows.Add(i, diemDanh.Ho + " " + diemDanh.Ten, diemDanh.SoDienThoai, diemDanh.NgaySinh, diemDanh.DonVi, diemDanh.AttendanceDate);
            }

            SuKien sk = await context.SuKiens.FindAsync(event_id);
            string evtName = sk.TieuDe;

            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(dt);

                using (var stream = new MemoryStream())
                {
                    wb.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(
                        content,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "Điểm danh sự kiện " + evtName + ".xlsx");
                }
            }
        }



    }
}
