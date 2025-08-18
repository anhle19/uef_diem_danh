using Microsoft.AspNetCore.Identity;

namespace uef_diem_danh.Models
{
    public class NguoiDungUngDung : IdentityUser
    {
        public string? FullName { get; set; }

        public string? Address { get; set; }



        // Relationships

        public ICollection<LopHoc>? LopHocs { get; set; }

    }
}
