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

        [Route("quan-ly-danh-sach-lop-hoc")]
        [HttpGet]
        public async Task<IActionResult> GetListManagementPage([FromQuery] int pageNumber = 1)
        {
            int pageSize = 10;

            List<StudyClassListManagementDto> studyClasses = await context.LopHocs
                .Select(lh => new StudyClassListManagementDto
                {
                    Id = lh.MaLopHoc,
                    StudyClassName = lh.TenLopHoc,
                    StartDate = lh.ThoiGianBatDau,
                    EndDate = lh.ThoiGianKetThuc,
                    CreatedAt = lh.CreatedAt
                })
                .OrderBy(lh => lh.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();


            return View("~/Views/StudyClasses/ListView.cshtml", studyClasses);
        }


        [Route("quan-ly-danh-sach-lop-hoc/tim-kiem")]
        [HttpPost]
        public async Task<IActionResult> SearchFilterStudyClass([FromBody] SearchFilterStudyClassRequest request)
        {
            List<StudyClassListManagementDto> studyClasses = new List<StudyClassListManagementDto>();

            if (request.Type == "SEARCH_ONLY")
            {
                studyClasses = await context.LopHocs
                    .Where(lh => lh.TenLopHoc.Contains(request.TenLopHoc))
                    .Select(lh => new StudyClassListManagementDto
                    {
                        Id = lh.MaLopHoc,
                        StudyClassName = lh.TenLopHoc,
                        StartDate = lh.ThoiGianBatDau,
                        EndDate = lh.ThoiGianKetThuc,
                        CreatedAt = lh.CreatedAt
                    })
                    .ToListAsync();
            }

            if (request.Type == "FILTER_ONLY")
            {
                DateOnly startDate = DateOnly.ParseExact(request.ThoiGianBatDau, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                DateOnly endtDate = DateOnly.ParseExact(request.ThoiGianKetThuc, "dd/MM/yyyy", CultureInfo.InvariantCulture);

                studyClasses = await context.LopHocs
                    .Where(lh => 
                                lh.ThoiGianBatDau >= startDate &&
                                lh.ThoiGianKetThuc <= endtDate
                    )
                    .Select(lh => new StudyClassListManagementDto
                    {
                        Id = lh.MaLopHoc,
                        StudyClassName = lh.TenLopHoc,
                        StartDate = lh.ThoiGianBatDau,
                        EndDate = lh.ThoiGianKetThuc,
                        CreatedAt = lh.CreatedAt
                    })
                    .ToListAsync();
            }

            if (request.Type == "SEARCH_AND_FILTER")
            {
                DateOnly startDate = DateOnly.ParseExact(request.ThoiGianBatDau, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                DateOnly endtDate = DateOnly.ParseExact(request.ThoiGianKetThuc, "dd/MM/yyyy", CultureInfo.InvariantCulture);

                studyClasses = await context.LopHocs
                    .Where(lh => 
                                lh.TenLopHoc.Contains(request.TenLopHoc) &&
                                lh.ThoiGianBatDau >= startDate &&
                                lh.ThoiGianKetThuc <= endtDate
                    )
                    .Select(lh => new StudyClassListManagementDto
                    {
                        Id = lh.MaLopHoc,
                        StudyClassName = lh.TenLopHoc,
                        StartDate = lh.ThoiGianBatDau,
                        EndDate = lh.ThoiGianKetThuc,
                        CreatedAt = lh.CreatedAt
                    })
                    .ToListAsync();
            }

            return View();
        }

        [Route("tao-moi-lop-hoc")]
        [HttpPost]
        public async Task<IActionResult> Create(StudyClassCreateRequest request)
        {

            LopHoc studyClass = new LopHoc
            {
                TenLopHoc = request.StudyClassName,
                ThoiGianBatDau = DateOnly.ParseExact(request.StartDate, "dd/MM/yyyy", CultureInfo.InvariantCulture),
                ThoiGianKetThuc = DateOnly.ParseExact(request.EndDate, "dd/MM/yyyy", CultureInfo.InvariantCulture),
            };

            context.LopHocs.Add(studyClass);
            await context.SaveChangesAsync();

            return View("~/Views/StudyClasses/ListView.cshtml");

        }



        [Route("cap-nhat-lop-hoc/{study_class_id}")]
        [HttpPost]
        public async Task<IActionResult> Update(int study_class_id, StudyClassCreateRequest request)
        {

            LopHoc studyClass = await context.LopHocs
                .FirstOrDefaultAsync(lh => lh.MaLopHoc == study_class_id);

            studyClass.TenLopHoc = request.StudyClassName;
            studyClass.ThoiGianBatDau = DateOnly.ParseExact(request.StartDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);
            studyClass.ThoiGianKetThuc = DateOnly.ParseExact(request.EndDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);

            await context.SaveChangesAsync();

            return View("~/Views/StudyClasses/ListView.cshtml");
        }




    }
}
