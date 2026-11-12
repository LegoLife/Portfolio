namespace Portfolio.Core.Content;

public sealed record Project(
    string Id,
    string Name,
    string Tagline,
    string Description,
    IReadOnlyList<string> Tech,
    IReadOnlyList<string> Highlights,
    string Accent,
    string? Image = null,
    string? LiveUrl = null,
    string? RepoUrl = null);

public static class ProjectCatalog
{
    public static readonly IReadOnlyList<Project> Apps =
    [
        new("brickforge", "BrickForge", "A 3D brick-building sandbox that runs in the browser",
            "Snap bricks, plates and tiles onto a baseplate, copy and paste whole structures, and save builds as reusable components. " +
            "C# owns the model and every placement rule, so the logic is unit-tested without a browser; JavaScript only draws and reports input.",
            ["Blazor WebAssembly", ".NET 10", "Three.js", "xUnit", "GitHub Actions"],
            [
                "Real brick proportions on a stud grid, with collision checks and a live placement preview",
                "Select, copy, cut, paste and undo across whole structures",
                "Tested core library; CI runs the tests and deploys on every push",
            ],
            "orange", "images/projects/brickforge.jpg",
            LiveUrl: "https://legolife.github.io/BrickForge/",
            RepoUrl: "https://github.com/LegoLife/BrickForge"),

        new("jnotes", "JNotes", "A self-hosted notes app that an AI assistant can read and write",
            "A notes app that runs in Docker on a Raspberry Pi, with a rich-text editor, full-text search, version history and nightly backups. " +
            "It also exposes a Model Context Protocol (MCP) server, so Claude can search, create and edit notes with my permission.",
            ["Blazor Server", ".NET 10", "MudBlazor", "Tiptap", "SQLite FTS5", "MCP", "Docker"],
            [
                "MCP server with 11 tools behind a bearer token",
                "Full-text search with a Ctrl+K switcher, templates, attachments and drag-to-reorder folders",
                "Migrated 106 pages from a previous notes tool with a custom importer",
            ],
            "purple", "images/projects/jnotes.jpg",
            RepoUrl: "https://github.com/LegoLife/JNotes"),

        new("jtools", "JTools", "Three everyday developer tools in one Windows tray app",
            "A live log viewer that tails several files in tabs and highlights lines such as ERROR and WARN, a text expander that works in any app, and a .NET regex tester. " +
            "It ships as a single self-contained exe.",
            ["C#", ".NET 10", "Avalonia", "xUnit"],
            [
                "Tail, find and filter log files as new lines arrive",
                "System-wide text expansion from short abbreviations",
                "Regex tester showing matches and capture groups as you type",
            ],
            "blue", "images/projects/jtools.png",
            RepoUrl: "https://github.com/LegoLife/JTools"),

        new("buywindow", "BuyWindow", "Checks whether timing a monthly investment actually beats not timing it",
            "Keeps a watchlist of US stocks and ETFs. For each one it says when to buy this month, then backtests that signal against simply buying on the first trading day and gives an honest verdict. " +
            "It emails me when a buy is ready.",
            ["ASP.NET Core", ".NET 10", "EF Core", "SQLite", "Docker", "MailKit"],
            [
                "Backtests every signal against a plain baseline before recommending it",
                "Scheduled price updates from a market data API",
                "One-command ARM64 deploy to a home server, with rollback",
            ],
            "green", "images/projects/buywindow.jpg",
            RepoUrl: "https://github.com/LegoLife/BuyWindow"),

        new("giftplanner", "GiftPlanner", "Kids' gift lists where each relative sees only their part",
            "One master list per child, with each gift assigned to a group of givers. Each group gets a private share link and sees only its own gifts, with no account needed. " +
            "Paste a store link and the name, price and picture fill in automatically.",
            ["Blazor Server", ".NET 10", "MudBlazor", "EF Core", "SQLite", "Docker"],
            [
                "No-login share links that can be reset at any time",
                "Product lookup from store pages using structured data",
                "Nightly backups",
            ],
            "red", "images/projects/giftplanner.jpg",
            RepoUrl: "https://github.com/LegoLife/GiftPlanner"),
        new("menuplanner", "MenuPlanner", "Generates the family menu so nobody has to ask what's for dinner",
            "Builds the household menu. It runs in Docker on a Raspberry Pi behind a login.",
            ["Blazor Server", ".NET 10", "MudBlazor", "EF Core", "SQLite", "Docker"],
            [
                "Small, focused and quick on low-power hardware",
                "Cookie login and a containerised deploy",
            ],
            "yellow", "images/projects/menuplanner.jpg",
            RepoUrl: "https://github.com/LegoLife/MenuPlanner"),

    ];

    /// <summary>Small working apps. Most run right here in the page at #/demos/{id}; one with a LiveUrl opens its own site.</summary>
    public static readonly IReadOnlyList<Project> Demos =
    [
        new("brickforge", "BrickForge", "3D brick building in the browser",
            "Snap bricks, plates and tiles onto a baseplate, then copy, paste and save whole structures. Opens on its own site.",
            ["Blazor", "Three.js", "xUnit"], [], "orange", LiveUrl: "https://legolife.github.io/BrickForge/"),
        new("listings", "Real estate search", "Live filters over generated listings",
            "Filter generated listings by price, bedrooms, bathrooms, keyword and tags, and sort the results.",
            ["Blazor", "C#", "xUnit"], [], "green"),
        new("dashboard", "Admin dashboard", "Charts and data grids",
            "Charts drawn in SVG, plus sortable, searchable, paged grids over users, products and 1,000 orders.",
            ["Blazor", "SVG", "REST"], [], "blue"),
        new("datagen", "Data generator", "Sample data as JSON, C# or CSV",
            "Describe the fields you need and get rows of realistic sample data as JSON, C# or CSV.",
            ["Blazor", "C#", "xUnit"], [], "purple"),
        new("invest", "Investment calculator", "Compound growth, charted",
            "Projects the value of a starting balance plus monthly contributions, and charts it year by year.",
            ["Blazor", "SVG"], [], "yellow"),
    ];
}
