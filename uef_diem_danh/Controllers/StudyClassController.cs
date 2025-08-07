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

        [Route("quan-ly-danh-sach-lop-hoc/{study_class_id}/quan-ly-danh-sach-hoc-vien")]
        [HttpGet]
        public async Task<IActionResult> GetListOfStudentsManagementPage(int study_class_id, [FromQuery] int pageNumber = 1)
        {
            int pageSize = 10;

            List<StudyClassStudentListManagementDto> students = await context.ThamGias
                .Where(tg => tg.MaLopHoc == study_class_id)
                .Select(tg => new StudyClassStudentListManagementDto
                {
                    MaHocVien = tg.HocVien.MaHocVien,
                    Ho = tg.HocVien.Ho,
                    Ten = tg.HocVien.Ten,
                    Email = tg.HocVien.Email,
                    SoDienThoai = tg.HocVien.SoDienThoai,
                    MaBarCode = tg.HocVien.MaBarCode,
                    DiaChi = tg.HocVien.DiaChi,
                    NgaySinh = tg.HocVien.NgaySinh,
                    CreatedAt = tg.HocVien.CreatedAt
                })
                .OrderBy(hv => hv.Ten)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();


            return View("", students);
        }



        [Route("quan-ly-danh-sach-lop-hoc/tim-kiem-sap-xep")]
        [HttpPost]
        public async Task<IActionResult> SearchSortStudyClass([FromBody] StudyClassSearchSortRequest request)
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

            if (request.Type == "SORT_ONLY")
            {
                if (request.SortType == "ASC" && request.SortField == "CreatedAt")
                {
                    studyClasses = await context.LopHocs
                        .Select(lh => new StudyClassListManagementDto
                        {
                            Id = lh.MaLopHoc,
                            StudyClassName = lh.TenLopHoc,
                            StartDate = lh.ThoiGianBatDau,
                            EndDate = lh.ThoiGianKetThuc,
                            CreatedAt = lh.CreatedAt
                        })
                        .OrderBy(lh => lh.CreatedAt)
                        .ToListAsync();
                }
                if (request.SortType == "DESC" && request.SortField == "CreatedAt")
                {
                    studyClasses = await context.LopHocs
                        .Select(lh => new StudyClassListManagementDto
                        {
                            Id = lh.MaLopHoc,
                            StudyClassName = lh.TenLopHoc,
                            StartDate = lh.ThoiGianBatDau,
                            EndDate = lh.ThoiGianKetThuc,
                            CreatedAt = lh.CreatedAt
                        })
                        .OrderByDescending(lh => lh.CreatedAt)
                        .ToListAsync();
                }

                if (request.SortType == "ASC" && request.SortField == "StartDate")
                {
                    studyClasses = await context.LopHocs
                        .Select(lh => new StudyClassListManagementDto
                        {
                            Id = lh.MaLopHoc,
                            StudyClassName = lh.TenLopHoc,
                            StartDate = lh.ThoiGianBatDau,
                            EndDate = lh.ThoiGianKetThuc,
                            CreatedAt = lh.CreatedAt
                        })
                        .OrderBy(lh => lh.StartDate)
                        .ToListAsync();
                }
                if (request.SortType == "DESC" && request.SortField == "StartDate")
                {
                    studyClasses = await context.LopHocs
                        .Select(lh => new StudyClassListManagementDto
                        {
                            Id = lh.MaLopHoc,
                            StudyClassName = lh.TenLopHoc,
                            StartDate = lh.ThoiGianBatDau,
                            EndDate = lh.ThoiGianKetThuc,
                            CreatedAt = lh.CreatedAt
                        })
                        .OrderByDescending(lh => lh.StartDate)
                        .ToListAsync();
                }

                if (request.SortType == "ASC" && request.SortField == "EndDate")
                {
                    studyClasses = await context.LopHocs
                        .Select(lh => new StudyClassListManagementDto
                        {
                            Id = lh.MaLopHoc,
                            StudyClassName = lh.TenLopHoc,
                            StartDate = lh.ThoiGianBatDau,
                            EndDate = lh.ThoiGianKetThuc,
                            CreatedAt = lh.CreatedAt
                        })
                        .OrderBy(lh => lh.EndDate)
                        .ToListAsync();
                }
                if (request.SortType == "DESC" && request.SortField == "EndDate")
                {
                    studyClasses = await context.LopHocs
                        .Select(lh => new StudyClassListManagementDto
                        {
                            Id = lh.MaLopHoc,
                            StudyClassName = lh.TenLopHoc,
                            StartDate = lh.ThoiGianBatDau,
                            EndDate = lh.ThoiGianKetThuc,
                            CreatedAt = lh.CreatedAt
                        })
                        .OrderByDescending(lh => lh.EndDate)
                        .ToListAsync();
                }

            }

            if (request.Type == "SEARCH_AND_SORT")
            {

                if (request.SortType == "ASC" && request.SortField == "CreatedAt")
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
                        .OrderBy(lh => lh.CreatedAt)
                        .ToListAsync();
                }
                if (request.SortType == "DESC" && request.SortField == "CreatedAt")
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
                        .OrderByDescending(lh => lh.CreatedAt)
                        .ToListAsync();
                }

                if (request.SortType == "ASC" && request.SortField == "StartDate")
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
                        .OrderBy(lh => lh.StartDate)
                        .ToListAsync();
                }
                if (request.SortType == "DESC" && request.SortField == "StartDate")
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
                        .OrderByDescending(lh => lh.StartDate)
                        .ToListAsync();
                }

                if (request.SortType == "ASC" && request.SortField == "EndDate")
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
                        .OrderBy(lh => lh.EndDate)
                        .ToListAsync();
                }
                if (request.SortType == "DESC" && request.SortField == "EndDate")
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
                        .OrderByDescending(lh => lh.EndDate)
                        .ToListAsync();
                }

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


        [Route("xoa-lop-hoc/{study_class_id}")]
        [HttpDelete]
        public async Task<IActionResult> Delete(int study_class_id)
        {

            LopHoc studyClass = await context.LopHocs
                .FirstOrDefaultAsync(lh => lh.MaLopHoc == study_class_id);

            context.LopHocs.Remove(studyClass);
            await context.SaveChangesAsync();

            return Ok("Xóa một lớp học thành công");
        }

    }
}
