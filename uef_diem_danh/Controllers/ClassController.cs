using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using uef_diem_danh.Database;
using uef_diem_danh.DTOs;
using uef_diem_danh.Models;

namespace uef_diem_danh.Controllers
{
    public class ClassController : Controller
    {
        private AppDbContext _context;

        public ClassController(AppDbContext _context)
        {
            this._context = _context;
        }

        [HttpGet("buoi-hoc")]
        public IActionResult ClassList()
        {
            return View(_context.BuoiHocs.ToList());
        }

        [HttpGet("lop-hoc/{study_class_id}/buoi-hoc")]
        public IActionResult ClassesOfStudyClass(int study_class_id)
        {
            Console.WriteLine("MA LOP: " + study_class_id);

            ClassGetRequest classes = new ClassGetRequest();
            classes.BuoiHocs = _context.BuoiHocs.Where(b => b.MaLopHoc == study_class_id).ToList();

            LopHoc lopHoc = _context.LopHocs.FirstOrDefault(l => l.MaLopHoc == study_class_id);
            classes.TenLop = lopHoc.TenLopHoc;
            classes.MaLopHoc = lopHoc.MaLopHoc;

            return View(classes);
        }

        [Route("api/lay-chi-tiet-buoi-hoc/{class_id}")]
        [HttpGet]
        public async Task<IActionResult> GetDetailForUpdate(int class_id)
        {
            return Ok(await _context.BuoiHocs.FindAsync(class_id));
        }

        [Route("tao-buoi-hoc")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([FromForm] ClassCreateRequest request)
        {
            Console.WriteLine("MaLop:" + request.MaLopHoc);
            try
            {

                BuoiHoc _class = new BuoiHoc
                {
                    NgayHoc = DateOnly.Parse(request.NgayHoc, CultureInfo.InvariantCulture),
                    TietHoc = request.TietHoc,
                    TrangThai = true,
                    MaLopHoc = request.MaLopHoc
                };

                _context.BuoiHocs.Add(_class);

                await _context.SaveChangesAsync();

                TempData["ClassSuccessMessage"] = "Thêm buổi học thành công!";
                return Redirect("buoi-hoc");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                TempData["ClassErrorMessage"] = "Có lỗi xảy ra khi thêm buổi học: " + ex.Message;
                return Redirect("lop-hoc/" + request.MaLopHoc + "/buoi-hoc");
            }

        }

        [Route("cap-nhat-buoi-hoc")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Update(int class_id, [FromForm] ClassUpdateRequest request)
        {

            try
            {
                BuoiHoc _class = await _context.BuoiHocs
                    .FirstOrDefaultAsync(lh => lh.MaBuoiHoc == request.MaBuoiHoc);

                _class.NgayHoc = DateOnly.Parse(request.NgayHoc, CultureInfo.InvariantCulture);
                _class.TietHoc = request.TietHoc;
                _class.TrangThai = request.TrangThai;
                _class.MaLopHoc = request.MaLopHoc;

                await _context.SaveChangesAsync();

                TempData["ClassSuccessMessage"] = "Cập nhật buổi học thành công!";
                return Redirect("buoi-hoc");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                TempData["ClassErrorMessage"] = "Có lỗi xảy ra khi cập nhật buổi học: " + ex.Message;
                return Redirect("buoi-hoc");
            }

        }


        [Route("xoa-hoc-vien")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete([FromForm] ClassDeleteRequest request)
        {
            try
            {
                BuoiHoc _class = await _context.BuoiHocs
                    .FirstOrDefaultAsync(lh => lh.MaBuoiHoc == request.MaBuoiHoc);

                _context.BuoiHocs.Remove(_class);
                await _context.SaveChangesAsync();

                TempData["ClassSuccessMessage"] = "Xóa buổi học thành công!";
                return Redirect("hoc-vien/danh-sach");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                TempData["ClassErrorMessage"] = "Có lỗi xảy ra khi xóa buổi học: " + ex.Message;
                return Redirect("buoi-hoc");
            }
        }
    }
}
