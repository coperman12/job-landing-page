namespace LandingPage.Server.Contact;

public sealed class SupabaseOptions
{
    public const string Section = "Supabase";

    /// <summary>Project URL, e.g. https://xxxx.supabase.co</summary>
    public string Url { get; set; } = "";

    /// <summary>Secret key (sb_secret_...) or legacy service_role key. Server-side only - never sent to the browser.</summary>
    public string SecretKey { get; set; } = "";

    public string Table { get; set; } = "contact_messages";

    public bool IsConfigured => !string.IsNullOrWhiteSpace(Url) && !string.IsNullOrWhiteSpace(SecretKey);
}
