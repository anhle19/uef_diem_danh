using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using uef_diem_danh.Models;

namespace uef_diem_danh.Database
{
    public class AppDbContext : IdentityDbContext<NguoiDungUngDung>
    {
        private readonly IConfiguration _configuration;

        public AppDbContext(DbContextOptions<AppDbContext> options, IConfiguration configuration) : base(options)
        {
            _configuration = configuration;
        }

        public DbSet<NguoiDungUngDung> NguoiDungUngDungs { get; set; }
        public DbSet<HocVien> HocViens { get; set; }
        public DbSet<LopHoc> LopHocs { get; set; }
        public DbSet<ThamGia> ThamGias { get; set; }
        public DbSet<BuoiHoc> BuoiHocs { get; set; }
        public DbSet<DiemDanh> DiemDanhs { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {

            optionsBuilder.UseSqlServer(_configuration.GetConnectionString("DefaultConnection"));

            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
