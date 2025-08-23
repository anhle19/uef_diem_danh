using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using uef_diem_danh.Database;
using uef_diem_danh.DTOs;

namespace uef_diem_danh.Controllers
{
    public class Generaltroller : Controller
    {

        private readonly AppDbContext context;

        public Generaltroller(AppDbContext context)
        {
            this.context = context;
        }


        [Authorize(Roles = "Admin,Staff")]
        [Route("")]
        [HttpGet]
        public async Task<IActionResult> GetMainDashboardPage()
        {

            string teahcerRoleId = context.Roles.FirstOrDefault(r => r.Name == "Staff").Id;

            DashboardResponse dashboardResponse = new DashboardResponse
            {
                NumberOfTeachers = context.UserRoles.Count(ur => ur.RoleId == teahcerRoleId),
                NumberOfStudents = context.HocViens.Count(),
                NumberOfStudyClass = context.LopHocs.Count(),
                NumberOfClassSessions = context.BuoiHocs.Count()
            };

            return View("~/Views/Dashboard.cshtml", dashboardResponse);
        }



        [Authorize(Roles = "Admin,Staff")]
        [Route("ho-tro-ky-thuat")]
        [HttpGet]
        public IActionResult GetTechnicalSupportPage()
        {

            return View("~/Views/TechnicalSupport.cshtml");
        }

    }
}
