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
        public DbSet<HinhAnh> HinhAnhs { get; set; }

        public DbSet<SuKien> SuKiens { get; set; }
        public DbSet<DiemDanhSuKien> DiemDanhSuKiens { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {

            optionsBuilder.UseSqlServer(_configuration.GetConnectionString("DefaultConnection"));

            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {


            modelBuilder.Entity<ThamGia>()
                .HasOne<HocVien>(tg => tg.HocVien)
                .WithMany(hv => hv.ThamGias)
                .HasForeignKey(tg => tg.MaHocVien);


            modelBuilder.Entity<ThamGia>()
                .HasOne<LopHoc>(tg => tg.LopHoc)
                .WithMany(lh => lh.ThamGias)
                .HasForeignKey(tg => tg.MaLopHoc);


            modelBuilder.Entity<DiemDanh>()
                .HasOne<HocVien>(dd => dd.HocVien)
                .WithMany(hv => hv.DiemDanhs)
                .HasForeignKey(dd => dd.MaHocVien);

            modelBuilder.Entity<DiemDanh>()
                .HasOne<BuoiHoc>(dd => dd.BuoiHoc)
                .WithMany(bh => bh.DiemDanhs)
                .HasForeignKey(dd => dd.MaBuoiHoc);

            modelBuilder.Entity<HocVien>()
               .HasOne(hs => hs.HinhAnh)
               .WithOne(ha => ha.HocVien)
               .HasForeignKey<HinhAnh>(ha => ha.MaHocVien);

            base.OnModelCreating(modelBuilder);
        }
    }
}
