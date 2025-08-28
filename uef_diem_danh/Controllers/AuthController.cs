using DocumentFormat.OpenXml.InkML;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OpenQA.Selenium.Interactions;
using System.Globalization;
using System.Threading.Tasks;
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

        // Quản lí tài khoản nhân viên
        [Authorize(Roles = "Admin")]
        [HttpGet("nhan-vien")]
        public async Task<IActionResult> StaffList()
        {
            var staffs = await _userManager.GetUsersInRoleAsync("Staff");

            return View(
                staffs.Select(s => new StaffGetRequest
                {
                    Id = s.Id,
                    FullName = s.FullName,
                    Address = s.Address,
                    PhoneNumber = s.PhoneNumber,
                }).ToList()
             );
        }

        [Authorize(Roles = "Admin")]
        [Route("api/lay-chi-tiet-nhan-vien/{staff_id}")]
        [HttpGet]
        public async Task<IActionResult> GetDetailForUpdate(string staff_id)
        {
            var staff = await _userManager.Users
                            .Where(u => u.Id == staff_id)
                            .Select(u => new StaffGetRequest
                            {
                                Id = u.Id,
                                FullName = u.FullName,
                                Address = u.Address,
                                PhoneNumber = u.PhoneNumber,
                            })
                            .FirstOrDefaultAsync();

            return Ok(staff);
        }

        [Authorize(Roles = "Admin")]
        [Route("tao-nhan-vien")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([FromForm] StaffCreateRequest request)
        {
            if (_userManager.Users.Any(hv => hv.PhoneNumber == request.PhoneNumber))
            {
                TempData["StaffErrorMessage"] = "Số điện thoại đã tồn tại trong hệ thống!";
                return Redirect("nhan-vien");
            }

            try
            {
                var staff = new NguoiDungUngDung
                {
                    UserName = request.PhoneNumber,
                    FullName = request.FullName,
                    Address = request.Address,
                    PhoneNumber = request.PhoneNumber
                };

                await _userManager.CreateAsync(staff, request.PhoneNumber);
                await _userManager.AddToRoleAsync(staff, "Staff");

                TempData["StaffSuccessMessage"] = "Thêm nhân viên thành công!";
                return Redirect("nhan-vien");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                TempData["StaffErrorMessage"] = "Có lỗi xảy ra khi thêm học viên: " + ex.Message;
                return Redirect("nhan-vien");
            }
        }

        [Authorize(Roles = "Admin")]
        [Route("cap-nhat-nhan-vien")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Update(int staff_id, [FromForm] StaffUpdateRequest request)
        {

            try
            {
                var staff = await _userManager.FindByIdAsync(request.Id);

                if (staff == null)
                {
                    TempData["StaffErrorMessage"] = "Không tìm thấy nhân viên.";
                    return Redirect("nhan-vien");
                }

                staff.FullName = request.FullName;
                staff.Address = request.Address;
                staff.PhoneNumber = request.PhoneNumber;

                await _userManager.UpdateAsync(staff);

                TempData["StaffSuccessMessage"] = "Cập nhật nhân viên thành công!";
                return Redirect("nhan-vien");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                TempData["StaffErrorMessage"] = "Có lỗi xảy ra khi cập nhật nhân viên: " + ex.Message;
                return Redirect("nhan-vien");
            }

        }

        [Authorize(Roles = "Admin")]
        [HttpPost("dat-lai-mat-khau")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ResetPassword(StaffResetPasswordRequest request)
        {
            var staff = await _userManager.FindByIdAsync(request.Id);

            if (staff == null)
            {
                TempData["StaffErrorMessage"] = "Không tìm thấy nhân viên này!";
                return Redirect("nhan-vien");
            }

            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(staff);

            var res = await _userManager.ResetPasswordAsync(staff, resetToken, staff.PhoneNumber??"boiduongchinhtri");

            if (res.Succeeded)
            {
                TempData["StaffSuccessMessage"] = "Đặt lại mật khẩu thành công!";
                return Redirect("nhan-vien");
            }
            else
            {
                TempData["StaffErrorMessage"] = "Đã xảy ra lỗi!";
                return Redirect("nhan-vien");
            }
        }


        [Authorize(Roles = "Admin")]
        [Route("xoa-nhan-vien")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete([FromForm] StaffDeleteRequest request)
        {
            Console.WriteLine("Delete staff with ID: " + request.Id);
            try
            {
                var staff = await _userManager.FindByIdAsync(request.Id);

                if (staff == null)
                {
                    TempData["StaffErrorMessage"] = "Không tìm thấy nhân viên.";
                    return Redirect("nhan-vien");
                }

                await _userManager.DeleteAsync(staff);

                TempData["StaffSuccessMessage"] = "Xóa nhân viên thành công!";
                return Redirect("nhan-vien");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                TempData["StaffErrorMessage"] = "Có lỗi xảy ra khi xóa nhân viên: " + ex.Message;
                return Redirect("nhan-vien");
            }
        }

        public IActionResult AccessDenied()
        {
            return View();
        }
    }
}
