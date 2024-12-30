using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using NoticesBoardAPI.Repositories.City;
using NoticesBoardAPI.Repositories.Notices;
using NoticesBoardAPI.Security;
using NoticesBoardAPI.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddOutputCache(options =>
{
    options.DefaultExpirationTimeSpan = TimeSpan.FromSeconds(10);
});

builder.Services.AddSingleton<ICityRepository,CityRepository>();
builder.Services.AddSingleton<INoticesRepository, NoticesRepository>();
builder.Services.AddScoped<NoticesService>();

// configure Cors
var allowedOrigins = builder.Configuration.GetValue<string>("AllowedOrigins")!.Split(',');

builder.Services.AddCors(options => {
    options.AddDefaultPolicy( policy => {
        //policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        policy.WithOrigins(allowedOrigins).AllowAnyMethod().AllowAnyHeader();
    });
});

builder.Services.AddHttpContextAccessor();

builder.Services.AddAutoMapper(typeof(Program));

builder.Services.AddTransient<IFileStorage, LocalFileStorage>();

// managing users

//builder.Services.AddIdentityCore<IdentityUser>()
//    .AddDefaultTokenProviders();

builder.Services.AddIdentityCore<IdentityUser>()
    .AddUserStore<JsonUserStore>() // Register your custom store
    .AddDefaultTokenProviders();

builder.Services.AddScoped<UserManager<IdentityUser>>();
builder.Services.AddScoped<SignInManager<IdentityUser>>();
builder.Services.AddAuthentication().AddJwtBearer(options =>
{
    options.MapInboundClaims = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["jwtkey"]!)),
        ClockSkew = TimeSpan.Zero
    };
});





var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// active and enable the output cache

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseCors();

app.UseOutputCache();

app.UseAuthorization();

app.MapControllers();

app.Run();
