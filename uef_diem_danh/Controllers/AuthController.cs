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
            Console.WriteLine("Login for user: " + model.Username);

            var result = await this.signInManager.PasswordSignInAsync(model.Username, model.Password, model.RememberMe, false);
            if (result.Succeeded)
            {
                Console.WriteLine("Login successful for user: " + model.Username);
                return Redirect("/");
            }

            ModelState.AddModelError("", "Invalid login attempt");
            return View(model);
        }


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
