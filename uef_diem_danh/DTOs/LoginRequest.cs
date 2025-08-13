using System.ComponentModel.DataAnnotations;

namespace uef_diem_danh.DTOs
{
    public class LoginRequest
    {
        public string Username { get; set; }

        public string Password { get; set; }

        //public bool RememberMe { get; set; }
    }
}
