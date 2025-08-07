using System.ComponentModel.DataAnnotations;

namespace uef_diem_danh.DTOs
{
    public class LoginViewModel
    {
        public string Email { get; set; }

        public string Password { get; set; }

        public bool RememberMe { get; set; }
    }
}
