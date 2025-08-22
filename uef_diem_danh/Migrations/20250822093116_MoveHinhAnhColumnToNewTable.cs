using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace uef_diem_danh.Migrations
{
    /// <inheritdoc />
    public partial class MoveHinhAnhColumnToNewTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HinhAnh",
                table: "HocVien");

            migrationBuilder.CreateTable(
                name: "HinhAnh",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MaHocVien = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HinhAnh", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HinhAnh_HocVien_MaHocVien",
                        column: x => x.MaHocVien,
                        principalTable: "HocVien",
                        principalColumn: "MaHocVien",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HinhAnh_MaHocVien",
                table: "HinhAnh",
                column: "MaHocVien",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HinhAnh");

            migrationBuilder.AddColumn<string>(
                name: "HinhAnh",
                table: "HocVien",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
