using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using uef_diem_danh.Database;
using uef_diem_danh.Models;
using uef_diem_danh.OnStart;

var builder = WebApplication.CreateBuilder(args);

// Add Db Context
builder.Services.AddDbContext<AppDbContext>();



// Add Identity
builder.Services.AddIdentity<NguoiDungUngDung, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();
builder.Services.ConfigureApplicationCookie(options =>
{
    options.ExpireTimeSpan = TimeSpan.FromDays(14);
    options.SlidingExpiration = true;
    options.LoginPath = "/login"; 
    options.LogoutPath = "/logout";
    options.AccessDeniedPath = "/Auth/AccessDenied";
});

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 3; 
    options.Password.RequiredUniqueChars = 0;

    options.User.RequireUniqueEmail = false;
});

//builder.Services.AddScoped<TakeHashedPasswordRunner>();
//builder.Services.AddHostedService<TakeHashedPasswordService>();

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
app.UseStaticFiles(new StaticFileOptions
{
    // Later remove this when in Production for faster load page
    OnPrepareResponse = ctx =>
    {
        ctx.Context.Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
        ctx.Context.Response.Headers["Pragma"] = "no-cache";
        ctx.Context.Response.Headers["Expires"] = "0";
    }
});

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

//using (var scope = app.Services.CreateScope())
//{
//    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

//    db.Database.ExecuteSqlRaw(@"
//        INSERT INTO AspNetUsers (
//            Id, UserName, NormalizedUserName, Email, NormalizedEmail,
//            EmailConfirmed, PasswordHash, SecurityStamp, ConcurrencyStamp,
//            PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnabled, AccessFailedCount
//        )
//        VALUES (
//            '1a2b3c4d-5e6f-7g8h-9i10-jklmnopqrst',
//            'admin',
//            'ADMIN',
//            'admin123@example.com',
//            'ADMIN@EXAMPLE.COM',
//            1,
//            'AQAAAAIAAYagAAAAEKYwINzjoiKUhpJH3zwc5EjfOkMrLxnORIS+wDj64CI3RQsyIX5rEh1VMNJZ/1aCgQ==',
//            NEWID(),
//            NEWID(),
//            0,
//            0,
//            1,
//            0
//        )
//    ");

//    Console.WriteLine("ADMIN ACCOUNT CREATED !!!");
//}

using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<NguoiDungUngDung>>();

    string[] roles = { "Admin", "Staff" };

    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }

    string adminEmail = "admin@example.com";
    //List<object> staffInfos = new List<object>
    //{   new
    //    {
    //        UserName = "GiaoVien1",
    //        FullName = "Nguyễn Thành Công",
    //        Address = "88/1 Phường Nguyễn Công Mèo, Quận 1",
    //        Email = "giaovien1@gmail.com",
    //        PhoneNumber = "0909113112"
    //    },
    //    new
    //    {
    //        UserName = "GiaoVien2",
    //        FullName = "Nguyễn Thành Tài",
    //        Address = "88/1 Phường Nguyễn Công Mèo, Quận Ba Đình",
    //        Email = "giaovien2@gmail.com",
    //        PhoneNumber = "0909113114"
    //    },
    //};


    var adminUser = await userManager.FindByEmailAsync(adminEmail);

    if (adminUser == null)
    {
        adminUser = new NguoiDungUngDung
        {
            UserName = "admin",
            Email = adminEmail,
            EmailConfirmed = true
        };

        var result = await userManager.CreateAsync(adminUser, "123");  
        if (result.Succeeded)
        {

            var createdAdminUser = await userManager.FindByEmailAsync(adminEmail);

            await userManager.AddToRoleAsync(createdAdminUser, "Admin");
            Console.WriteLine("ADMIN ACCOUNT CREATED !!!");
        }
        else
        {
            Console.WriteLine("Error creating ADMIN: " + string.Join(", ", result.Errors.Select(e => e.Description)));
        }
    }

    //foreach (dynamic staffInfo in staffInfos)
    //{
    //   NguoiDungUngDung staffUser = new NguoiDungUngDung
    //   {
    //       UserName = staffInfo.PhoneNumber,
    //       FullName = staffInfo.FullName,
    //       Address = staffInfo.Address,
    //       PhoneNumber = staffInfo.PhoneNumber,
    //       Email = staffInfo.Email,
    //       EmailConfirmed = true
    //   };

    //   var result = await userManager.CreateAsync(staffUser, staffInfo.PhoneNumber);

    //   if (result.Succeeded)
    //   {

    //       var createdStaffUser = await userManager.FindByEmailAsync(staffInfo.Email);

    //       await userManager.AddToRoleAsync(createdStaffUser, "Staff");
    //       Console.WriteLine("STAFF ACCOUNT CREATED !!!");
    //   }
    //   else
    //   {
    //       Console.WriteLine("Error creating STAFF: " + string.Join(", ", result.Errors.Select(e => e.Description)));
    //   }
    //}
}


app.Run();
