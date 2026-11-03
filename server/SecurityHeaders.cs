using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace LandingPage.Server;

/// <summary>Security headers, including a CSP that allows only our own scripts plus the hash of the inline theme script.</summary>
public static partial class SecurityHeaders
{
    [GeneratedRegex(@"<script>(.*?)</script>", RegexOptions.Singleline)]
    private static partial Regex InlineScriptRegex();

    public static IApplicationBuilder UseSecurityHeaders(this IApplicationBuilder app, string indexHtmlPath)
    {
        var csp = BuildCsp(indexHtmlPath);

        return app.Use(async (context, next) =>
        {
            var h = context.Response.Headers;
            h["Content-Security-Policy"] = csp;
            h["X-Content-Type-Options"] = "nosniff";
            h["Referrer-Policy"] = "strict-origin-when-cross-origin";
            h["X-Frame-Options"] = "DENY";
            h["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()";
            await next();
        });
    }

    // Hashing the inline script at startup keeps the CSP correct when index.html changes
    private static string BuildCsp(string indexHtmlPath)
    {
        var html = File.Exists(indexHtmlPath) ? File.ReadAllText(indexHtmlPath) : "";
        var hashes = InlineScriptRegex().Matches(html)
            .Select(m => $"'sha256-{Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(m.Groups[1].Value)))}'");

        return string.Join("; ",
            "default-src 'self'",
            $"script-src 'self' {string.Join(' ', hashes)}".TrimEnd(),
            "style-src 'self' https://fonts.googleapis.com",
            "font-src https://fonts.gstatic.com",
            "img-src 'self' data:",
            "connect-src 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
            "base-uri 'self'");
    }
}
