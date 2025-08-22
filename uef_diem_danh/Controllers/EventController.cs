using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace uef_diem_danh.Controllers
{
    public class EventController : Controller
    {


        [Authorize(Roles = "Admin")]
        [Route("quan-ly-danh-sach-su-kien")]
        [HttpGet]
        public IActionResult GetListManagementPage()
        {
            return View("~/Views/Events/ListView.cshtml");
        }
    }
}
