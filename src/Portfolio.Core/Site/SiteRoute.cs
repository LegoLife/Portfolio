using Portfolio.Core.Content;

namespace Portfolio.Core.Site;

public enum SitePage { Home, Resume, Demo }

/// <summary>
/// Which page the part of the address after # asks for.
/// <c>#/resume</c> and <c>#/demos/{id}</c> are pages; a plain word such as <c>#work</c> is a section of the home page.
/// Demos that live on their own site (they have a LiveUrl) open there instead and have no page here.
/// </summary>
public sealed record SiteRoute(SitePage Page, string? DemoId = null, string? Anchor = null)
{
    public const string ResumeHref = "#/resume";

    public static string ForDemo(string demoId) => $"#/demos/{demoId}";

    public static SiteRoute Parse(string? hash)
    {
        var text = (hash ?? "").TrimStart('#').Trim().ToLowerInvariant();

        if (text.StartsWith('/'))
        {
            var parts = text.Split('/', StringSplitOptions.RemoveEmptyEntries);
            return parts switch
            {
                ["resume"] => new(SitePage.Resume),
                ["demos", var id] when IsDemo(id) => new(SitePage.Demo, id),
                _ => new(SitePage.Home),
            };
        }

        // The earlier version of the site used #resume, #listings and so on. Keep those links working.
        if (text == "resume") return new(SitePage.Resume);
        if (IsDemo(text)) return new(SitePage.Demo, text);

        var isSectionName = text.Length > 0 && text.All(c => c is >= 'a' and <= 'z' or '-');
        return new(SitePage.Home, Anchor: isSectionName ? text : null);
    }

    private static bool IsDemo(string id) => ProjectCatalog.Demos.Any(d => d.Id == id && d.LiveUrl is null);
}
