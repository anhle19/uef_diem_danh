using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace uef_diem_danh.Migrations
{
    /// <inheritdoc />
    public partial class AddDonViColumnAndChangeHinhAnhToNullableInHocVienTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "HinhAnh",
                table: "HocVien",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "DonVi",
                table: "HocVien",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DonVi",
                table: "HocVien");

            migrationBuilder.AlterColumn<string>(
                name: "HinhAnh",
                table: "HocVien",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
