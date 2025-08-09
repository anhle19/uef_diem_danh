using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using uef_diem_danh.DTOs;
using uef_diem_danh.Models;

namespace uef_diem_danh.Controllers
{
    public class AuthController : Controller
    {
        private readonly UserManager<NguoiDungUngDung> userManager;
        private readonly SignInManager<NguoiDungUngDung> signInManager;


        public AuthController(
            UserManager<NguoiDungUngDung> userManager, 
            SignInManager<NguoiDungUngDung> signInManager
        )
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
        }

        public IActionResult GetLoginPage()
        {
            return View();
        }

        public IActionResult GetRegisterPage()
        {
            return View();
        }

        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [Route("login")]
        [HttpPost]
        public async Task<IActionResult> Login( LoginRequest model)
        {
            if (!ModelState.IsValid) return View(model);

            var result = await this.signInManager.PasswordSignInAsync(model.Username, model.Password, model.RememberMe, false);
            if (result.Succeeded)
            {
                Console.WriteLine("Login successful for user: " + model.Username);
                return RedirectToAction("Index", "Home");
            }

            ModelState.AddModelError("", "Invalid login attempt");
            return View(model);
        }

        //[Route("login")]
        //[HttpPost]
        //public async Task<IActionResult> Login([FromBody] LoginRequest model)
        //{
        //    Console.WriteLine("Login request received with email: " + model.Email);
        //    if (!ModelState.IsValid)
        //    {
        //        return Json(new { success = false, message = "Dữ liệu không hợp lệ" });
        //    }

        //    var result = await this.signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, false);
        //    if (result.Succeeded)
        //    {
        //        return Json(new { success = true, email = model.Email });
        //    }

        //    return Json(new { success = false, message = "Sai email hoặc mật khẩu" });
        //}

        //[Route("register")]
        //[HttpPost]
        //public async Task<IActionResult> Register(RegisterRequest model)
        //{
        //    if (!ModelState.IsValid) return View(model);

        //    var user = new IdentityUser { UserName = model.Email, Email = model.Email };
        //    var result = await this.userManager.CreateAsync(user, model.Password);

        //    if (result.Succeeded)
        //    {
        //        await this.signInManager.SignInAsync(user, isPersistent: false);
        //        return RedirectToAction("Index", "Home");
        //    }

        //    foreach (var error in result.Errors)
        //    {
        //        ModelState.AddModelError("", error.Description);
        //    }

        //    return View(model);
        //}

        // POST: /Account/Logout
        [Route("logout")]
        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await this.signInManager.SignOutAsync();
            return RedirectToAction("Index", "Home");
        }

    }
}
