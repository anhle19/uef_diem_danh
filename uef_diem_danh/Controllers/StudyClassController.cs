using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using uef_diem_danh.Database;
using uef_diem_danh.DTOs;

namespace uef_diem_danh.Controllers
{
    public class StudyClassController : Controller
    {

        private readonly AppDbContext context;


        public StudyClassController(AppDbContext context)
        {
            this.context = context;
        }

        [Route("list-of-study-classes")]
        public async Task<IActionResult> GetListManagementPage([FromQuery] int pageNumber)
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


            return View();
        }


        [Route("study-classes/search")]
        [HttpPost]
        public async Task<IActionResult> SearchFilterStudyClass([FromBody] StudyClassSearchFilterRequest request)
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

    }
}
