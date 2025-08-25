using Microsoft.AspNetCore.Mvc;

namespace uef_diem_danh.DTOs
{
    public class AvatarUploadRequest
    {
        //[FromForm(Name = "PhoneNumber")]
        public string PhoneNumber { get; set; }

        //[FromForm(Name = "Avatar")]
        public IFormFile Avatar {  get; set; }
    }
}
