namespace LandingPage.Server.Contact;

/// <summary>Body of POST /api/contact. Website is a honeypot - real people leave it empty.</summary>
public sealed record ContactRequest(
    string? Name,
    string? Email,
    string? Phone,
    string? Company,
    string? Message,
    string? Website);
