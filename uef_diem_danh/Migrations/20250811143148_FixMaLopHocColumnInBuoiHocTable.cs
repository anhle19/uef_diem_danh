using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace uef_diem_danh.Migrations
{
    /// <inheritdoc />
    public partial class FixMaLopHocColumnInBuoiHocTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BuoiHoc_LopHoc_LopHocMaLopHoc",
                table: "BuoiHoc");

            migrationBuilder.DropIndex(
                name: "IX_BuoiHoc_LopHocMaLopHoc",
                table: "BuoiHoc");

            migrationBuilder.DropColumn(
                name: "LopHocMaLopHoc",
                table: "BuoiHoc");

            migrationBuilder.CreateIndex(
                name: "IX_BuoiHoc_MaLopHoc",
                table: "BuoiHoc",
                column: "MaLopHoc");

            migrationBuilder.AddForeignKey(
                name: "FK_BuoiHoc_LopHoc_MaLopHoc",
                table: "BuoiHoc",
                column: "MaLopHoc",
                principalTable: "LopHoc",
                principalColumn: "MaLopHoc",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BuoiHoc_LopHoc_MaLopHoc",
                table: "BuoiHoc");

            migrationBuilder.DropIndex(
                name: "IX_BuoiHoc_MaLopHoc",
                table: "BuoiHoc");

            migrationBuilder.AddColumn<int>(
                name: "LopHocMaLopHoc",
                table: "BuoiHoc",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_BuoiHoc_LopHocMaLopHoc",
                table: "BuoiHoc",
                column: "LopHocMaLopHoc");

            migrationBuilder.AddForeignKey(
                name: "FK_BuoiHoc_LopHoc_LopHocMaLopHoc",
                table: "BuoiHoc",
                column: "LopHocMaLopHoc",
                principalTable: "LopHoc",
                principalColumn: "MaLopHoc",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
