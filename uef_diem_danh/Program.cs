using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using uef_diem_danh.Database;
using uef_diem_danh.Models;
using uef_diem_danh.OnStart;

var builder = WebApplication.CreateBuilder(args);

// Add Db Context
builder.Services.AddDbContext<AppDbContext>();

//builder.Services.AddScoped<TakeHashedPasswordRunner>();
//builder.Services.AddHostedService<TakeHashedPasswordService>();

// Add Identity
builder.Services.AddIdentity<NguoiDungUngDung, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();
builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 4; 
    options.Password.RequiredUniqueChars = 0;

    options.User.RequireUniqueEmail = true;
});
// Add services to the container.
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
