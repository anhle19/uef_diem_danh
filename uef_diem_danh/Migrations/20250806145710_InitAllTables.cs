using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace uef_diem_danh.Migrations
{
    /// <inheritdoc />
    public partial class InitAllTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HocVien",
                columns: table => new
                {
                    MaHocVien = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ho = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Ten = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MaBarCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NgaySinh = table.Column<DateOnly>(type: "date", nullable: false),
                    DiaChi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SoDienThoai = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HocVien", x => x.MaHocVien);
                });

            migrationBuilder.CreateTable(
                name: "LopHoc",
                columns: table => new
                {
                    MaLopHoc = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenLopHoc = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ThoiGianBatDau = table.Column<DateOnly>(type: "date", nullable: false),
                    ThoiGianKetThuc = table.Column<DateOnly>(type: "date", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LopHoc", x => x.MaLopHoc);
                });

            migrationBuilder.CreateTable(
                name: "BuoiHoc",
                columns: table => new
                {
                    MaBuoiHoc = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NgayHoc = table.Column<DateOnly>(type: "date", nullable: false),
                    TietHoc = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MaLopHoc = table.Column<int>(type: "int", nullable: false),
                    LopHocMaLopHoc = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BuoiHoc", x => x.MaBuoiHoc);
                    table.ForeignKey(
                        name: "FK_BuoiHoc_LopHoc_LopHocMaLopHoc",
                        column: x => x.LopHocMaLopHoc,
                        principalTable: "LopHoc",
                        principalColumn: "MaLopHoc",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ThamGia",
                columns: table => new
                {
                    MaThamGia = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MaHocVien = table.Column<int>(type: "int", nullable: false),
                    HocVienMaHocVien = table.Column<int>(type: "int", nullable: false),
                    MaLopHoc = table.Column<int>(type: "int", nullable: false),
                    LopHocMaLopHoc = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThamGia", x => x.MaThamGia);
                    table.ForeignKey(
                        name: "FK_ThamGia_HocVien_HocVienMaHocVien",
                        column: x => x.HocVienMaHocVien,
                        principalTable: "HocVien",
                        principalColumn: "MaHocVien",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ThamGia_LopHoc_LopHocMaLopHoc",
                        column: x => x.LopHocMaLopHoc,
                        principalTable: "LopHoc",
                        principalColumn: "MaLopHoc",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DiemDanh",
                columns: table => new
                {
                    MaDiemDanh = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ThoiGianDiemDanh = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TrangThai = table.Column<bool>(type: "bit", nullable: false),
                    MaHocVien = table.Column<int>(type: "int", nullable: false),
                    HocVienMaHocVien = table.Column<int>(type: "int", nullable: false),
                    MaBuoiHoc = table.Column<int>(type: "int", nullable: false),
                    BuoiHocMaBuoiHoc = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiemDanh", x => x.MaDiemDanh);
                    table.ForeignKey(
                        name: "FK_DiemDanh_BuoiHoc_BuoiHocMaBuoiHoc",
                        column: x => x.BuoiHocMaBuoiHoc,
                        principalTable: "BuoiHoc",
                        principalColumn: "MaBuoiHoc",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DiemDanh_HocVien_HocVienMaHocVien",
                        column: x => x.HocVienMaHocVien,
                        principalTable: "HocVien",
                        principalColumn: "MaHocVien",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BuoiHoc_LopHocMaLopHoc",
                table: "BuoiHoc",
                column: "LopHocMaLopHoc");

            migrationBuilder.CreateIndex(
                name: "IX_DiemDanh_BuoiHocMaBuoiHoc",
                table: "DiemDanh",
                column: "BuoiHocMaBuoiHoc");

            migrationBuilder.CreateIndex(
                name: "IX_DiemDanh_HocVienMaHocVien",
                table: "DiemDanh",
                column: "HocVienMaHocVien");

            migrationBuilder.CreateIndex(
                name: "IX_ThamGia_HocVienMaHocVien",
                table: "ThamGia",
                column: "HocVienMaHocVien");

            migrationBuilder.CreateIndex(
                name: "IX_ThamGia_LopHocMaLopHoc",
                table: "ThamGia",
                column: "LopHocMaLopHoc");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DiemDanh");

            migrationBuilder.DropTable(
                name: "ThamGia");

            migrationBuilder.DropTable(
                name: "BuoiHoc");

            migrationBuilder.DropTable(
                name: "HocVien");

            migrationBuilder.DropTable(
                name: "LopHoc");
        }
    }
}
