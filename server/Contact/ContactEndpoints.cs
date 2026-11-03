namespace LandingPage.Server.Contact;

public static class ContactEndpoints
{
    public const string RateLimitPolicy = "contact";

    public static void MapContactEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/contact", async (ContactRequest request, HttpContext http, SupabaseContactStore store, ILogger<SupabaseContactStore> logger, CancellationToken ct) =>
        {
            // Honeypot filled - pretend success so the bot moves on, but save nothing
            if (!string.IsNullOrWhiteSpace(request.Website))
            {
                logger.LogInformation("Honeypot triggered, message dropped");
                return Results.Ok();
            }

            var errors = ContactValidator.Validate(request);
            if (errors.Count > 0)
                return Results.ValidationProblem(errors);

            if (!store.IsConfigured)
            {
                logger.LogWarning("Supabase is not configured - set Supabase:Url and Supabase:SecretKey in user-secrets");
                return Results.StatusCode(StatusCodes.Status503ServiceUnavailable);
            }

            var saved = await store.SaveAsync(request, http.Request.Headers.UserAgent.ToString(), ct);
            return saved ? Results.Ok() : Results.StatusCode(StatusCodes.Status502BadGateway);
        })
        .RequireRateLimiting(RateLimitPolicy);
    }
}
