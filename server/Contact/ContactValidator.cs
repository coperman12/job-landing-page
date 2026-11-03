using System.Text.RegularExpressions;

namespace LandingPage.Server.Contact;

/// <summary>Server-side validation. Mirrors the rules in scripts/src/contact-form.ts - never trust the client.</summary>
public static partial class ContactValidator
{
    [GeneratedRegex(@"^[^\s@]+@[^\s@]+\.[^\s@]{2,}$")]
    private static partial Regex EmailRegex();

    [GeneratedRegex(@"^[0-9+\-\s()]{7,30}$")]
    private static partial Regex PhoneRegex();

    // Keys are camelCase so they match the form's input names.
    // The client shows its own localized text per field; these messages are for API callers and logs
    public static Dictionary<string, string[]> Validate(ContactRequest r)
    {
        var errors = new Dictionary<string, string[]>();
        var name = r.Name?.Trim() ?? "";
        var email = r.Email?.Trim() ?? "";
        var phone = r.Phone?.Trim() ?? "";
        var company = r.Company?.Trim() ?? "";
        var message = r.Message?.Trim() ?? "";

        if (name.Length is < 2 or > 100)
            errors["name"] = ["Name must be 2-100 characters"];

        if (email.Length > 200 || !EmailRegex().IsMatch(email))
            errors["email"] = ["Invalid email"];

        if (phone.Length > 0 && !PhoneRegex().IsMatch(phone))
            errors["phone"] = ["Invalid phone number"];

        if (company.Length > 100)
            errors["company"] = ["Up to 100 characters"];

        if (message.Length is < 10 or > 2000)
            errors["message"] = ["Message must be 10-2000 characters"];

        return errors;
    }
}
