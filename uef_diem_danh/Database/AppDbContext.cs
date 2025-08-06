using Microsoft.EntityFrameworkCore;
using uef_diem_danh.Models;

namespace uef_diem_danh.Database
{
    public class AppDbContext : DbContext
    {
        private readonly IConfiguration _configuration;

        public AppDbContext(IConfiguration configuration)
        {
            _configuration = configuration;
        }

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
