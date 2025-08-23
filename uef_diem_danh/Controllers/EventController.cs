using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using uef_diem_danh.Database;
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
            return View("~/Views/Events/ListView.cshtml");
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


    }
}
