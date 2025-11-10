using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HydrangeanDiva.MediaPlayer.MigrationService.Migrations
{
    /// <inheritdoc />
    public partial class CreateUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "OwnerId",
                schema: "MediaPlayer",
                table: "Playlists",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "Users",
                schema: "MediaPlayer",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Playlists_OwnerId",
                schema: "MediaPlayer",
                table: "Playlists",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Playlists_Users_OwnerId",
                schema: "MediaPlayer",
                table: "Playlists",
                column: "OwnerId",
                principalSchema: "MediaPlayer",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Playlists_Users_OwnerId",
                schema: "MediaPlayer",
                table: "Playlists");

            migrationBuilder.DropTable(
                name: "Users",
                schema: "MediaPlayer");

            migrationBuilder.DropIndex(
                name: "IX_Playlists_OwnerId",
                schema: "MediaPlayer",
                table: "Playlists");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                schema: "MediaPlayer",
                table: "Playlists");
        }
    }
}
