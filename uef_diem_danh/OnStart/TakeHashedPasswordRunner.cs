using Microsoft.AspNetCore.Identity;
using uef_diem_danh.Models;

namespace uef_diem_danh.OnStart
{
    public class TakeHashedPasswordRunner
    {

        public async Task ExecuteGeneration()
        {

            var hasher = new PasswordHasher<NguoiDungUngDung>();
            var user = new NguoiDungUngDung();
            var passwordHash = hasher.HashPassword(user, "123456");
            Console.WriteLine("HASHED PASSWORD 1: " + passwordHash);

        }
    }
}
