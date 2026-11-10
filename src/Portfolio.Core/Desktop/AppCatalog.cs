namespace Portfolio.Core.Desktop;

/// <summary>One program that can be opened on the desktop.</summary>
public sealed record AppInfo(
    string Id,
    string Title,
    string Accent,
    int Width,
    int Height,
    string Group,
    string Blurb);

public static class AppCatalog
{
    public const string GroupJake = "Jake";
    public const string GroupBuilt = "Things I built";
    public const string GroupSystem = "System";

    public static readonly IReadOnlyList<AppInfo> All =
    [
        new("about", "About Jake", "yellow", 600, 640, GroupJake, "Who I am and what I do"),
        new("resume", "Resume", "blue", 760, 700, GroupJake, "Experience, skills, education"),
        new("projects", "Projects", "red", 900, 660, GroupJake, "Apps I've designed and shipped"),
        new("contact", "Contact", "green", 480, 480, GroupJake, "Get in touch"),
        new("terminal", "Terminal", "ink", 700, 460, GroupJake, "The same site, as a command line"),
        new("brickforge", "BrickForge", "orange", 1040, 700, GroupBuilt, "3D brick builder, running live"),
        new("listings", "Listings", "green", 980, 680, GroupBuilt, "Filterable real estate search"),
        new("dashboard", "Dashboard", "blue", 1000, 680, GroupBuilt, "Admin dashboard with charts and grids"),
        new("datagen", "DataGen", "purple", 860, 640, GroupBuilt, "Sample data as JSON, C# or CSV"),
        new("invest", "Invest", "yellow", 860, 640, GroupBuilt, "Investment growth calculator"),
        new("settings", "Settings", "gray", 460, 460, GroupSystem, "Themes and desktop options"),
    ];

    public static AppInfo? Find(string? id) =>
        id is null ? null : All.FirstOrDefault(a => string.Equals(a.Id, id.Trim(), StringComparison.OrdinalIgnoreCase));
}
