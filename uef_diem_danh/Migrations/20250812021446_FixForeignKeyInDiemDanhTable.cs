using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace uef_diem_danh.Migrations
{
    /// <inheritdoc />
    public partial class FixForeignKeyInDiemDanhTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DiemDanh_BuoiHoc_BuoiHocMaBuoiHoc",
                table: "DiemDanh");

            migrationBuilder.DropForeignKey(
                name: "FK_DiemDanh_HocVien_HocVienMaHocVien",
                table: "DiemDanh");

            migrationBuilder.DropIndex(
                name: "IX_DiemDanh_BuoiHocMaBuoiHoc",
                table: "DiemDanh");

            migrationBuilder.DropIndex(
                name: "IX_DiemDanh_HocVienMaHocVien",
                table: "DiemDanh");

            migrationBuilder.DropColumn(
                name: "BuoiHocMaBuoiHoc",
                table: "DiemDanh");

            migrationBuilder.DropColumn(
                name: "HocVienMaHocVien",
                table: "DiemDanh");

            migrationBuilder.CreateIndex(
                name: "IX_DiemDanh_MaBuoiHoc",
                table: "DiemDanh",
                column: "MaBuoiHoc");

            migrationBuilder.CreateIndex(
                name: "IX_DiemDanh_MaHocVien",
                table: "DiemDanh",
                column: "MaHocVien");

            migrationBuilder.AddForeignKey(
                name: "FK_DiemDanh_BuoiHoc_MaBuoiHoc",
                table: "DiemDanh",
                column: "MaBuoiHoc",
                principalTable: "BuoiHoc",
                principalColumn: "MaBuoiHoc",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DiemDanh_HocVien_MaHocVien",
                table: "DiemDanh",
                column: "MaHocVien",
                principalTable: "HocVien",
                principalColumn: "MaHocVien",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DiemDanh_BuoiHoc_MaBuoiHoc",
                table: "DiemDanh");

            migrationBuilder.DropForeignKey(
                name: "FK_DiemDanh_HocVien_MaHocVien",
                table: "DiemDanh");

            migrationBuilder.DropIndex(
                name: "IX_DiemDanh_MaBuoiHoc",
                table: "DiemDanh");

            migrationBuilder.DropIndex(
                name: "IX_DiemDanh_MaHocVien",
                table: "DiemDanh");

            migrationBuilder.AddColumn<int>(
                name: "BuoiHocMaBuoiHoc",
                table: "DiemDanh",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "HocVienMaHocVien",
                table: "DiemDanh",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_DiemDanh_BuoiHocMaBuoiHoc",
                table: "DiemDanh",
                column: "BuoiHocMaBuoiHoc");

            migrationBuilder.CreateIndex(
                name: "IX_DiemDanh_HocVienMaHocVien",
                table: "DiemDanh",
                column: "HocVienMaHocVien");

            migrationBuilder.AddForeignKey(
                name: "FK_DiemDanh_BuoiHoc_BuoiHocMaBuoiHoc",
                table: "DiemDanh",
                column: "BuoiHocMaBuoiHoc",
                principalTable: "BuoiHoc",
                principalColumn: "MaBuoiHoc",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DiemDanh_HocVien_HocVienMaHocVien",
                table: "DiemDanh",
                column: "HocVienMaHocVien",
                principalTable: "HocVien",
                principalColumn: "MaHocVien",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
