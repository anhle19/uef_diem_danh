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

        [Route("api/lay-chi-tiet-lop-hoc/{study_class_id}")]
        [HttpGet]
        public async Task<IActionResult> GetDetailForUpdate(int study_class_id)
        {
            LopHoc studyClass = await context.LopHocs.FindAsync(study_class_id);

            return Ok(studyClass);
        }


        [Route("quan-ly-danh-sach-lop-hoc/tim-kiem-sap-xep")]
        [HttpPost]
        public async Task<IActionResult> SearchSortStudyClass(
            [FromBody] StudyClassSearchSortRequest request, 
            [FromQuery] int pageNumber = 1
        )
        {
            int pageSize = 10;
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
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
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
                        .Skip((pageNumber - 1) * pageSize)
                        .Take(pageSize)
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
                        .Skip((pageNumber - 1) * pageSize)
                        .Take(pageSize)
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
                        .Skip((pageNumber - 1) * pageSize)
                        .Take(pageSize)
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
                        .Skip((pageNumber - 1) * pageSize)
                        .Take(pageSize)
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
                        .Skip((pageNumber - 1) * pageSize)
                        .Take(pageSize)
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
                        .Skip((pageNumber - 1) * pageSize)
                        .Take(pageSize)
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
                        .Skip((pageNumber - 1) * pageSize)
                        .Take(pageSize)
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
                        .Skip((pageNumber - 1) * pageSize)
                        .Take(pageSize)
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
                        .Skip((pageNumber - 1) * pageSize)
                        .Take(pageSize)
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
                        .Skip((pageNumber - 1) * pageSize)
                        .Take(pageSize)
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
                        .Skip((pageNumber - 1) * pageSize)
                        .Take(pageSize)
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
                        .Skip((pageNumber - 1) * pageSize)
                        .Take(pageSize)
                        .ToListAsync();
                }

            }

            return View();
        }

        [Route("quan-ly-danh-sach-lop-hoc/{study_class_id}/quan-ly-danh-sach-hoc-vien/tim-kiem-sap-xep")]
        [HttpPost]
        public async Task<IActionResult> SearchSortStudent(
            int study_class_id, 
            [FromBody] StudentSearchSortRequest request, 
            [FromQuery] int pageNumber = 1
        )
        {
            int pageSize = 10;
            List<StudyClassStudentListManagementDto> students = new List<StudyClassStudentListManagementDto>();

            if (request.Type == "SEARCH_ONLY")
            {
                if (request.FirstName != null && request.PhoneNumber != null)
                {
                    students = await context.ThamGias
                        .Where(tg => 
                                    tg.HocVien.Ten.Contains(request.FirstName) && 
                                    tg.HocVien.SoDienThoai.Contains(request.PhoneNumber) && 
                                    tg.MaLopHoc == study_class_id
                        )
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
                        .Skip((pageNumber - 1) * pageSize)
                        .Take(pageSize)
                        .ToListAsync();
                }
                if (request.FirstName != null && request.PhoneNumber == null)
                {
                    students = await context.ThamGias
                        .Where(tg => tg.HocVien.Ten.Contains(request.FirstName) && tg.MaLopHoc == study_class_id)
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
                        .Skip((pageNumber - 1) * pageSize)
                        .Take(pageSize)
                        .ToListAsync();
                }
                if (request.FirstName == null && request.PhoneNumber != null)
                {
                    students = await context.ThamGias
                        .Where(tg => tg.HocVien.SoDienThoai.Contains(request.PhoneNumber) && tg.MaLopHoc == study_class_id)
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
                        .Skip((pageNumber - 1) * pageSize)
                        .Take(pageSize)
                        .ToListAsync();
                }
                if (request.FirstName == null && request.PhoneNumber == null)
                {
                    return BadRequest("Vui lòng nhập tên hoặc số điện thoại để tìm kiếm");
                }

            }

            if (request.Type == "SORT_ONLY")
            {
                if (request.SortType == "ASC" && request.SortField == "FirstName")
                {
                    students = await context.ThamGias
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
                }
                if (request.SortType == "DESC" && request.SortField == "FirstName")
                {
                    students = await context.ThamGias
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
                        .OrderByDescending(hv => hv.Ten)
                        .Skip((pageNumber - 1) * pageSize)
                        .Take(pageSize)
                        .ToListAsync();
                }

                if (request.SortType == "ASC" && request.SortField == "DayOfBirth")
                {
                    students = await context.ThamGias
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
                        .OrderBy(hv => hv.NgaySinh)
                        .Skip((pageNumber - 1) * pageSize)
                        .Take(pageSize)
                        .ToListAsync();
                }
                if (request.SortType == "DESC" && request.SortField == "DayOfBirth")
                {
                    students = await context.ThamGias
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
                        .OrderByDescending(hv => hv.NgaySinh)
                        .Skip((pageNumber - 1) * pageSize)
                        .Take(pageSize)
                        .ToListAsync();
                }

            }

            if (request.Type == "SEARCH_AND_SORT")
            {

                if (request.SortType == "ASC" && request.SortField == "FirstName")
                {
                    if (request.FirstName != null && request.PhoneNumber != null)
                    {
                        students = await context.ThamGias
                            .Where(tg =>
                                        tg.HocVien.Ten.Contains(request.FirstName) &&
                                        tg.HocVien.SoDienThoai.Contains(request.PhoneNumber) &&
                                        tg.MaLopHoc == study_class_id
                            )
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
                    }
                    if (request.FirstName != null && request.PhoneNumber == null)
                    {
                        students = await context.ThamGias
                            .Where(tg =>
                                        tg.HocVien.Ten.Contains(request.FirstName) &&
                                        tg.MaLopHoc == study_class_id
                            )
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
                    }
                    if (request.FirstName == null && request.PhoneNumber != null)
                    {
                        students = await context.ThamGias
                            .Where(tg =>
                                        tg.HocVien.SoDienThoai.Contains(request.PhoneNumber) &&
                                        tg.MaLopHoc == study_class_id
                            )
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
                    }
                }
                if (request.SortType == "DESC" && request.SortField == "FirstName")
                {
                    if (request.FirstName != null && request.PhoneNumber != null)
                    {
                        students = await context.ThamGias
                            .Where(tg =>
                                        tg.HocVien.Ten.Contains(request.FirstName) &&
                                        tg.HocVien.SoDienThoai.Contains(request.PhoneNumber) &&
                                        tg.MaLopHoc == study_class_id
                            )
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
                            .OrderByDescending(hv => hv.Ten)
                            .Skip((pageNumber - 1) * pageSize)
                            .Take(pageSize)
                            .ToListAsync();
                    }
                    if (request.FirstName != null && request.PhoneNumber == null)
                    {
                        students = await context.ThamGias
                            .Where(tg =>
                                        tg.HocVien.Ten.Contains(request.FirstName) &&
                                        tg.MaLopHoc == study_class_id
                            )
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
                            .OrderByDescending(hv => hv.Ten)
                            .Skip((pageNumber - 1) * pageSize)
                            .Take(pageSize)
                            .ToListAsync();
                    }
                    if (request.FirstName == null && request.PhoneNumber != null)
                    {
                        students = await context.ThamGias
                            .Where(tg =>
                                        tg.HocVien.SoDienThoai.Contains(request.PhoneNumber) &&
                                        tg.MaLopHoc == study_class_id
                            )
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
                            .OrderByDescending(hv => hv.Ten)
                            .Skip((pageNumber - 1) * pageSize)
                            .Take(pageSize)
                            .ToListAsync();
                    }
                }

                if (request.SortType == "ASC" && request.SortField == "DayOfBirth")
                {
                    if (request.FirstName != null && request.PhoneNumber != null)
                    {
                        students = await context.ThamGias
                            .Where(tg =>
                                        tg.HocVien.Ten.Contains(request.FirstName) &&
                                        tg.HocVien.SoDienThoai.Contains(request.PhoneNumber) &&
                                        tg.MaLopHoc == study_class_id
                            )
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
                            .OrderBy(hv => hv.NgaySinh)
                            .Skip((pageNumber - 1) * pageSize)
                            .Take(pageSize)
                            .ToListAsync();
                    }
                    if (request.FirstName != null && request.PhoneNumber == null)
                    {
                        students = await context.ThamGias
                            .Where(tg =>
                                        tg.HocVien.Ten.Contains(request.FirstName) &&
                                        tg.MaLopHoc == study_class_id
                            )
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
                            .OrderBy(hv => hv.NgaySinh)
                            .Skip((pageNumber - 1) * pageSize)
                            .Take(pageSize)
                            .ToListAsync();
                    }
                    if (request.FirstName == null && request.PhoneNumber != null)
                    {
                        students = await context.ThamGias
                            .Where(tg =>
                                        tg.HocVien.SoDienThoai.Contains(request.PhoneNumber) &&
                                        tg.MaLopHoc == study_class_id
                            )
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
                            .OrderBy(hv => hv.NgaySinh)
                            .Skip((pageNumber - 1) * pageSize)
                            .Take(pageSize)
                            .ToListAsync();
                    }
                }
                if (request.SortType == "DESC" && request.SortField == "DayOfBirth")
                {
                    if (request.FirstName != null && request.PhoneNumber != null)
                    {
                        students = await context.ThamGias
                            .Where(tg =>
                                        tg.HocVien.Ten.Contains(request.FirstName) &&
                                        tg.HocVien.SoDienThoai.Contains(request.PhoneNumber) &&
                                        tg.MaLopHoc == study_class_id
                            )
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
                            .OrderByDescending(hv => hv.NgaySinh)
                            .Skip((pageNumber - 1) * pageSize)
                            .Take(pageSize)
                            .ToListAsync();
                    }
                    if (request.FirstName != null && request.PhoneNumber == null)
                    {
                        students = await context.ThamGias
                            .Where(tg =>
                                        tg.HocVien.Ten.Contains(request.FirstName) &&
                                        tg.MaLopHoc == study_class_id
                            )
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
                            .OrderByDescending(hv => hv.NgaySinh)
                            .Skip((pageNumber - 1) * pageSize)
                            .Take(pageSize)
                            .ToListAsync();
                    }
                    if (request.FirstName == null && request.PhoneNumber != null)
                    {
                        students = await context.ThamGias
                            .Where(tg =>
                                        tg.HocVien.SoDienThoai.Contains(request.PhoneNumber) &&
                                        tg.MaLopHoc == study_class_id
                            )
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
                            .OrderByDescending(hv => hv.NgaySinh)
                            .Skip((pageNumber - 1) * pageSize)
                            .Take(pageSize)
                            .ToListAsync();
                    }
                }

            }


            return View("", students);
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
