using System.Threading.RateLimiting;
using LandingPage.Server;
using LandingPage.Server.Contact;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Supabase settings: appsettings.json holds empty defaults, the real values come from user-secrets or env vars
builder.Services.Configure<SupabaseOptions>(builder.Configuration.GetSection(SupabaseOptions.Section));
builder.Services.AddHttpClient<SupabaseContactStore>(c => c.Timeout = TimeSpan.FromSeconds(10));

// Contact form: a few messages per IP per window, to stop spam
var permitLimit = builder.Configuration.GetValue("RateLimit:PermitLimit", 5);
var windowMinutes = builder.Configuration.GetValue("RateLimit:WindowMinutes", 10);
builder.Services.AddRateLimiter(o =>
{
    o.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    o.AddPolicy(ContactEndpoints.RateLimitPolicy, http =>
        RateLimitPartition.GetFixedWindowLimiter(
            http.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = permitLimit,
                Window = TimeSpan.FromMinutes(windowMinutes),
            }));
});

var app = builder.Build();

// The site files sit next to the server folder: index.html, styles/, scripts/dist/, images/
var siteRoot = Path.GetFullPath(Path.Combine(app.Environment.ContentRootPath, app.Configuration["Site:Root"] ?? ".."));
var indexPath = Path.Combine(siteRoot, "index.html");

app.UseSecurityHeaders(indexPath);

// Expose only the public folders - never the server code or the database scripts
foreach (var folder in new[] { "styles", "images", "scripts/dist" })
{
    var path = Path.Combine(siteRoot, folder);
    if (!Directory.Exists(path)) continue;
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(path),
        RequestPath = "/" + folder,
    });
}

app.UseRateLimiter();

app.MapGet("/", () => Results.File(indexPath, "text/html; charset=utf-8"));
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapContactEndpoints();

app.Run();
