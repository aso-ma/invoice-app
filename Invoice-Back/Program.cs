using Invoice;
using Invoice.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// var configuration = builder.Configuration;
// int _httpsPort = int.Parse(configuration["iisSettings:iisExpress:sslPort"]);

var launchJsonConfig = new ConfigurationBuilder()
    .SetBasePath(builder.Environment.ContentRootPath)
    .AddJsonFile("Properties/launchSettings.json")
    .Build();
int? _httpsPort = launchJsonConfig.GetValue<int>("iisSettings:iisExpress:sslPort");

// Use an in-memory database 
builder.Services.AddDbContext<InvoiceApiContext>(opt => opt.UseInMemoryDatabase("Invoice"));

builder.Services.AddAutoMapper(typeof(Program));

// Add services to the container.
builder.Services.AddMvc(opt => {
    // Require HTTPS for all controllers
    // opt.SslPort = _httpsPort;
    // opt.Filters.Add(typeof(RequireHttpsAttribute));
    opt.EnableEndpointRouting = false;
});
builder.Services.AddRouting(opt => opt.LowercaseUrls = true);
builder.Services.AddApiVersioning (opt => {
    opt.ApiVersionReader = new MediaTypeApiVersionReader();
    opt.AssumeDefaultVersionWhenUnspecified = true;
    opt.ReportApiVersions = true;
    opt.DefaultApiVersion = new ApiVersion(1, 0);
    opt.ApiVersionSelector = new CurrentImplementationApiVersionSelector(opt);
});

builder.Services.AddTransient<JsonFileInvoiceService>(); 
builder.Services.AddTransient<DatabaseSeederService>(); 
builder.Services.AddScoped<IInvoiceService, DefaultInvoiceService>();
builder.Services.AddScoped<IProductService, DefaultProductService>();
builder.Services.AddScoped<ICustomerService, DefaultCustomerService>();

builder.Services.AddCors(opt => {
    opt.AddDefaultPolicy(builder => {
        builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();
app.UseCors();
// Configure the HTTP request pipeline.
app.UseHttpsRedirection();
// app.UseHsts(opt => {
//     opt.MaxAge(days: 180);
//     opt.IncludeSubdomains();
//     opt.Preload();
// });
app.UseMvc();
app.UseRouting();
app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.MapGet("/routes", (IEnumerable<EndpointDataSource> endpointSources) =>
        string.Join("\n", endpointSources.SelectMany(source => source.Endpoints)));

    // Seed the database
    using (var scope = app.Services.CreateScope()) {
        var databaseSeederService = scope.ServiceProvider.GetRequiredService<DatabaseSeederService>();
        databaseSeederService.Seed();
    }

}

app.Run();


