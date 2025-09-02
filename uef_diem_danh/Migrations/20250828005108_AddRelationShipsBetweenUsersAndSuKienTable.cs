using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace uef_diem_danh.Migrations
{
    /// <inheritdoc />
    public partial class AddRelationShipsBetweenUsersAndSuKienTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NguoiPhuTrach",
                table: "SuKiens");

            migrationBuilder.AddColumn<string>(
                name: "MaNguoiPhuTrach",
                table: "SuKiens",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_SuKiens_MaNguoiPhuTrach",
                table: "SuKiens",
                column: "MaNguoiPhuTrach");

            migrationBuilder.AddForeignKey(
                name: "FK_SuKiens_AspNetUsers_MaNguoiPhuTrach",
                table: "SuKiens",
                column: "MaNguoiPhuTrach",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SuKiens_AspNetUsers_MaNguoiPhuTrach",
                table: "SuKiens");

            migrationBuilder.DropIndex(
                name: "IX_SuKiens_MaNguoiPhuTrach",
                table: "SuKiens");

            migrationBuilder.DropColumn(
                name: "MaNguoiPhuTrach",
                table: "SuKiens");

            migrationBuilder.AddColumn<string>(
                name: "NguoiPhuTrach",
                table: "SuKiens",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
