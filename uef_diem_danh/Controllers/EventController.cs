using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.Globalization;
using System.Security.Claims;
using System.Threading.Tasks;
using uef_diem_danh.Database;
using uef_diem_danh.DTOs;
using uef_diem_danh.Models;

namespace uef_diem_danh.Controllers
{
    public class EventController : Controller
    {

        private readonly AppDbContext context;

        private readonly UserManager<NguoiDungUngDung> _userManager;

        public EventController(AppDbContext context, UserManager<NguoiDungUngDung> _userManager)
        {
            this.context = context;
            this._userManager = _userManager;
        }


        [Authorize]
        [Route("quan-ly-danh-sach-su-kien")]
        [HttpGet]
        public async Task<IActionResult> GetListManagementPage()
        {
            //List<SuKien> suKiens = context.SuKiens.Include(sk => sk.NguoiPhuTrach).ToList();
            List<SuKien> suKiens = new List<SuKien>();

            if (User.IsInRole("Admin"))
            {
                suKiens = context.SuKiens.Include(sk => sk.NguoiPhuTrach).ToList();
            }
            else if (User.IsInRole("Staff"))
            {
                suKiens = context.SuKiens
                    .Include(sk => sk.NguoiPhuTrach)
                    .Where(sk => sk.MaNguoiPhuTrach == User.FindFirstValue(ClaimTypes.NameIdentifier))
                    .ToList();
            }
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

        [Authorize(Roles = "Admin")]
        [HttpGet("api/lay-danh-sach-ten-nguoi-phu-trach")]
        public async Task<IActionResult> GetNameAndIdOfUsers()
        {
            var users = await _userManager.GetUsersInRoleAsync("Staff");
            return Ok(users.Select(u => new UserGetNameAndIdRequest
            {
                Id = u.Id,
                Name = u.FullName,
            }));
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
                    MaNguoiPhuTrach = request.MaNguoiPhuTrach,
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
                evt.MaNguoiPhuTrach = request.MaNguoiPhuTrach;
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
                    return BadRequest(new { message = "Đã ghi nhận điểm danh!" });
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
                    NgaySinh = request.Dob.IsNullOrEmpty() ? null : DateOnly.Parse(request.Dob, CultureInfo.InvariantCulture),
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
            SuKien evt = await context.SuKiens.FindAsync(event_id);

            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Học viên");

                // Set font Times New Roman for the entire worksheet
                worksheet.Style.Font.SetFontName("Times New Roman");

                // Row 1
                worksheet.Cell("B1").Value = "ĐẢNG ỦY PHƯỜNG XUÂN HÒA";

                // Row 2
                worksheet.Cell("B2").Value = "TRUNG TÂM CHÍNH TRỊ PHƯỜNG XUÂN HÒA";

                // Row 3
                worksheet.Cell("A3").Value = "DANH SÁCH ĐIỂM DANH";

                //Row 4
                worksheet.Cell("A4").Value = $"{evt.TieuDe.ToUpper()}";


                // Row 6 - Headers
                worksheet.Cell("A6").Value = "STT";
                worksheet.Cell("B6").Value = "HỌ";
                worksheet.Cell("C6").Value = "TÊN";
                worksheet.Cell("D6").Value = "SỐ ĐIỆN THOẠI";
                worksheet.Cell("E6").Value = "ĐƠN VỊ";
                worksheet.Cell("F6").Value = "NGÀY SINH";
                worksheet.Cell("G6").Value = "NGÀY ĐIỂM DANH";

                // Add student data starting from row 7
                int row = 7, stt = 1;
                foreach (var diemDanh in diemDanhs)
                {
                    worksheet.Cell(row, 1).Value = stt; 
                    worksheet.Cell(row, 2).Value = diemDanh.Ho; 
                    worksheet.Cell(row, 3).Value = diemDanh.Ten; 
                    worksheet.Cell(row, 4).Value = diemDanh.SoDienThoai;  
                    worksheet.Cell(row, 5).Value = diemDanh.DonVi; 
                    worksheet.Cell(row, 6).Value = diemDanh.NgaySinh.ToString(); 
                    worksheet.Cell(row, 7).Value = diemDanh.AttendanceDate.ToString(); 
                    row++;
                    stt++;
                }

                worksheet.Range("A6:F6").SetAutoFilter();

                var tableRange = worksheet.Range($"A6:G{row - 1}");
                tableRange.Style
                    .Border.SetOutsideBorder(XLBorderStyleValues.Thin)
                    .Border.SetInsideBorder(XLBorderStyleValues.Thin);

                // Formatting
                worksheet.Range("A3:G3").Merge();
                worksheet.Range("A4:G4").Merge();
                worksheet.Cell("A3").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell("A4").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell("B1").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell("B2").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                worksheet.Row(6).Style.Font.Bold = true; // Bold headers
                worksheet.Cell("B1").Style.Font.Bold = true;
                worksheet.Cell("B2").Style.Font.Bold = true;
                worksheet.Cell("C2").Style.Font.Bold = true;
                worksheet.Cell("G1").Style.Font.Bold = true;
                worksheet.Cell("A3").Style.Font.Bold = true;
                worksheet.Cell("A4").Style.Font.Bold = true;
                // Adjust column widths
                worksheet.Columns().AdjustToContents();

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"Danh sách điểm danh sự kiện {evt.TieuDe}.xlsx");
                }
            }
        }



    }
}
