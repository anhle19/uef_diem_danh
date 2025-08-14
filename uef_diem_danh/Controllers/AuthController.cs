using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using uef_diem_danh.DTOs;
using uef_diem_danh.Models;

namespace uef_diem_danh.Controllers
{
    public class AuthController : Controller
    {
        private readonly SignInManager<NguoiDungUngDung> _signInManager;
        private readonly UserManager<NguoiDungUngDung> _userManager;

        public AuthController(SignInManager<NguoiDungUngDung> signInManager,
                                  UserManager<NguoiDungUngDung> userManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
        }

       
        [HttpGet("login")]
        public IActionResult Login(string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            Console.WriteLine("ĐĂNG NHẬP 1");
            return View();
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest model, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;

            if (ModelState.IsValid)
            {
                // Tìm user theo username   
                var user = await _userManager.FindByNameAsync(model.Username);
                if (user != null)
                {
                    var result = await _signInManager.PasswordSignInAsync(
                        model.Username,
                        model.Password,
                        true,
                        lockoutOnFailure: false);

                    if (result.Succeeded)
                    {
                        return RedirectToAction("GetListManagementPage", "StudyClass");
                    }
                }

                ModelState.AddModelError(string.Empty, "Sai tên đăng nhập hoặc mật khẩu.");
            }

            TempData["LoginErrorMessage"] = "Tên đăng nhập hoặc mật khẩu không đúng";
            return View(model);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return RedirectToAction("GetListManagementPage", "StudyClass");
        }

        [HttpPost("/doi-mat-khau")]
        public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
        {
            Console.WriteLine("Mật khẩu cũ: " + request.OldPassword);
            Console.WriteLine("Mật khẩu mới: " + request.NewPassword);
            Console.WriteLine("Mật khẩu xác nhận: " + request.ConfirmPassword);

            if (request.NewPassword != request.ConfirmPassword)
            {
                ModelState.AddModelError(string.Empty, "Mật khẩu mới và xác nhận mật khẩu mới không khớp");
                TempData["StudyClassErrorMessage"] = "Mật khẩu mới và xác nhận mật khẩu mới không khớp";
                return RedirectToAction("GetListManagementPage", "StudyClass");
            }

            var user = await _userManager.GetUserAsync(User);
            Console.WriteLine("User: " + User.Identity?.Name);

            if (user == null)
            {
                TempData["StudyClassErrorMessage"] = "Đã hết phiên đăng nhập !";
                return RedirectToAction("GetListManagementPage", "StudyClass");
            } 

            var res = await _userManager.ChangePasswordAsync(user, request.OldPassword, request.NewPassword);

            if (res.Succeeded)
            {
                await _signInManager.RefreshSignInAsync(user);
                await _signInManager.SignOutAsync();
                Console.WriteLine("Đổi mật khẩu thành công!");
                return RedirectToAction("GetListManagementPage", "StudyClass");
            }
            else
            {
                TempData["StudyClassErrorMessage"] = "Mật khẩu hiện tại không đúng!";
            }

            foreach (var error in res.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            
            return RedirectToAction("GetListManagementPage", "StudyClass");
        }
    }
}
