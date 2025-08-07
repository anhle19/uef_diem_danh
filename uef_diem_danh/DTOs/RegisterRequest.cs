using System.ComponentModel.DataAnnotations;

namespace uef_diem_danh.DTOs
{
    public class RegisterRequest
    {
        public string Email { get; set; }

        public string Password { get; set; }

        public string ConfirmPassword { get; set; }
    }
}
