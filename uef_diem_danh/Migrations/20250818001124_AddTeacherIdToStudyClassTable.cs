using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace uef_diem_danh.Migrations
{
    /// <inheritdoc />
    public partial class AddTeacherIdToStudyClassTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MaGiaoVien",
                table: "LopHoc",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_LopHoc_MaGiaoVien",
                table: "LopHoc",
                column: "MaGiaoVien");

            migrationBuilder.AddForeignKey(
                name: "FK_LopHoc_AspNetUsers_MaGiaoVien",
                table: "LopHoc",
                column: "MaGiaoVien",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LopHoc_AspNetUsers_MaGiaoVien",
                table: "LopHoc");

            migrationBuilder.DropIndex(
                name: "IX_LopHoc_MaGiaoVien",
                table: "LopHoc");

            migrationBuilder.DropColumn(
                name: "MaGiaoVien",
                table: "LopHoc");
        }
    }
}
