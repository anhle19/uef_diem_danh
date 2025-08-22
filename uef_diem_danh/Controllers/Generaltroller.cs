using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace uef_diem_danh.Controllers
{
    public class Generaltroller : Controller
    {



        [Authorize(Roles = "Admin,Staff")]
        [Route("")]
        [HttpGet]
        public IActionResult GetMainDashboardPage()
        {

            return View("~/Views/Dashboard.cshtml");
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
