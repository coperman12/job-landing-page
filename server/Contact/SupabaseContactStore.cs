using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Options;

namespace LandingPage.Server.Contact;

/// <summary>Saves contact messages to Supabase through its REST API (PostgREST).</summary>
public sealed class SupabaseContactStore(HttpClient http, IOptions<SupabaseOptions> options, ILogger<SupabaseContactStore> logger)
{
    private readonly SupabaseOptions _options = options.Value;

    public bool IsConfigured => _options.IsConfigured;

    public async Task<bool> SaveAsync(ContactRequest r, string? userAgent, CancellationToken ct)
    {
        var row = new ContactRow(
            r.Name!.Trim(),
            r.Email!.Trim(),
            NullIfEmpty(r.Phone),
            NullIfEmpty(r.Company),
            r.Message!.Trim(),
            userAgent is { Length: > 300 } ? userAgent[..300] : userAgent);

        using var request = new HttpRequestMessage(HttpMethod.Post, $"{_options.Url.TrimEnd('/')}/rest/v1/{_options.Table}")
        {
            Content = JsonContent.Create(row),
        };
        request.Headers.Add("apikey", _options.SecretKey);
        // Legacy JWT keys (eyJ...) also need the Bearer header; new sb_secret_ keys go in apikey only
        if (_options.SecretKey.StartsWith("eyJ", StringComparison.Ordinal))
            request.Headers.Authorization = new("Bearer", _options.SecretKey);
        request.Headers.Add("Prefer", "return=minimal");

        using var response = await http.SendAsync(request, ct);
        if (response.IsSuccessStatusCode) return true;

        var body = await response.Content.ReadAsStringAsync(ct);
        logger.LogError("Supabase insert failed: {Status} {Body}", (int)response.StatusCode, body);
        return false;
    }

    private static string? NullIfEmpty(string? s) => string.IsNullOrWhiteSpace(s) ? null : s.Trim();

    private sealed record ContactRow(
        [property: JsonPropertyName("name")] string Name,
        [property: JsonPropertyName("email")] string Email,
        [property: JsonPropertyName("phone")] string? Phone,
        [property: JsonPropertyName("company")] string? Company,
        [property: JsonPropertyName("message")] string Message,
        [property: JsonPropertyName("user_agent")] string? UserAgent);
}
