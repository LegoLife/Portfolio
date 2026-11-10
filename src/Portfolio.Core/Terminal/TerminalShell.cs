using Portfolio.Core.Content;
using Portfolio.Core.Desktop;

namespace Portfolio.Core.Terminal;

public enum LineKind { Text, Input, Accent, Muted, Error }

public sealed record TermLine(string Text, LineKind Kind = LineKind.Text);

/// <summary>What a command printed, plus anything it asks the desktop to do.</summary>
public sealed record ShellResult(
    IReadOnlyList<TermLine> Lines,
    string? OpenApp = null,
    string? Theme = null,
    bool Clear = false,
    bool Exit = false);

/// <summary>The command interpreter behind the Terminal app. It has no UI of its own, so it can be tested directly.</summary>
public sealed class TerminalShell(Func<DateTime>? clock = null)
{
    public const string Prompt = "visitor@jakeos:~$";
    public static readonly IReadOnlyList<string> Themes = ["day", "night", "blueprint"];

    private static readonly (string Name, string Help)[] Commands =
    [
        ("help", "list the commands"),
        ("about", "who Jake is"),
        ("resume", "print the resume"),
        ("skills", "list core skills"),
        ("experience", "work history"),
        ("projects", "things Jake has built"),
        ("contact", "how to reach Jake"),
        ("apps", "list the apps on this desktop"),
        ("open <app>", "open an app, for example: open resume"),
        ("theme <name>", "switch theme: day, night or blueprint"),
        ("date", "today's date"),
        ("clear", "clear the screen"),
        ("exit", "close the terminal"),
    ];

    private readonly Func<DateTime> _clock = clock ?? (() => DateTime.Now);

    public static IReadOnlyList<TermLine> Banner =>
    [
        new("jakeOS terminal", LineKind.Accent),
        new("Type 'help' to see what you can do. Try 'resume' or 'open projects'.", LineKind.Muted),
    ];

    /// <summary>Completes a partly typed command or app name, or returns the input unchanged.</summary>
    public static string Complete(string input)
    {
        var parts = input.TrimStart().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length == 0) return input;

        if (parts.Length == 1 && !input.EndsWith(' '))
        {
            var names = Commands.Select(c => c.Name.Split(' ')[0]).Where(n => n.StartsWith(parts[0], StringComparison.OrdinalIgnoreCase)).ToList();
            return names.Count == 1 ? names[0] + (names[0] is "open" or "theme" ? " " : "") : input;
        }

        var options = parts[0].ToLowerInvariant() switch
        {
            "open" => AppCatalog.All.Select(a => a.Id),
            "theme" => Themes,
            _ => [],
        };
        var typed = parts.Length > 1 ? parts[1] : "";
        var matches = options.Where(o => o.StartsWith(typed, StringComparison.OrdinalIgnoreCase)).ToList();
        return matches.Count == 1 ? $"{parts[0]} {matches[0]}" : input;
    }

    public ShellResult Execute(string? input)
    {
        var parts = (input ?? "").Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length == 0) return new([]);

        var argument = string.Join(' ', parts.Skip(1));
        var today = _clock();

        switch (parts[0].ToLowerInvariant())
        {
            case "help" or "?":
                return Print(Commands.Select(c => new TermLine($"  {c.Name,-14}{c.Help}")).Prepend(new("Commands", LineKind.Accent)));

            case "about" or "whoami":
                return Print(
                [
                    new($"{Profile.Name}, {Profile.Role}", LineKind.Accent),
                    .. Profile.Summary(today).Select(p => new TermLine(p)),
                ]);

            case "skills":
                return Print([new("Skills", LineKind.Accent), new("  " + string.Join("  |  ", Profile.Skills))]);

            case "experience":
                return Print(ExperienceLines());

            case "resume":
                return Print(
                [
                    new(Profile.Name, LineKind.Accent),
                    new(Profile.Role),
                    new(""),
                    new("Skills", LineKind.Accent),
                    new("  " + string.Join("  |  ", Profile.Skills)),
                    new(""),
                    .. ExperienceLines(),
                    new(""),
                    new("Education", LineKind.Accent),
                    .. Profile.Schools.Select(s => new TermLine($"  {s.Degree}, {s.School} ({s.Dates})")),
                    new(""),
                    new("Run 'open resume' for the formatted version you can print.", LineKind.Muted),
                ]);

            case "projects" or "ls":
                return Print(
                [
                    new("Projects", LineKind.Accent),
                    .. ProjectCatalog.Apps.Select(p => new TermLine($"  {p.Name,-13}{p.Tagline}")),
                    new(""),
                    new("Running on this desktop", LineKind.Accent),
                    .. ProjectCatalog.Demos.Select(p => new TermLine($"  {p.Name,-13}{p.Tagline}")),
                    new(""),
                    new("Run 'open projects' for details, or 'open brickforge' to play with one.", LineKind.Muted),
                ]);

            case "contact" or "email":
                return Print(
                [
                    new("Contact", LineKind.Accent),
                    new($"  Email   {Profile.Email}"),
                    new($"  GitHub  {Profile.GitHubUrl}"),
                ]);

            case "apps":
                return Print(AppCatalog.All.Select(a => new TermLine($"  {a.Id,-12}{a.Blurb}")).Prepend(new("Apps", LineKind.Accent)));

            case "open" or "start" or "run":
                var app = AppCatalog.Find(argument);
                if (argument.Length == 0) return Error("Open what? Try 'apps' to see the list.");
                if (app is null) return Error($"No app called '{argument}'. Try 'apps' to see the list.");
                return new([new($"Opening {app.Title}...", LineKind.Muted)], OpenApp: app.Id);

            case "theme":
                var theme = argument.ToLowerInvariant();
                if (!Themes.Contains(theme)) return Error($"Themes: {string.Join(", ", Themes)}.");
                return new([new($"Theme set to {theme}.", LineKind.Muted)], Theme: theme);

            case "date":
                return Print([new(today.ToString("dddd, MMMM d, yyyy"))]);

            case "echo":
                return Print([new(argument)]);

            case "clear" or "cls":
                return new([], Clear: true);

            case "exit" or "quit":
                return new([], Exit: true);

            case "sudo":
                return argument.Contains("hire", StringComparison.OrdinalIgnoreCase)
                    ? new([new("Permission granted. Opening the contact form...", LineKind.Accent)], OpenApp: "contact")
                    : Error("Nice try. The only sudo command here is 'sudo hire jake'.");

            default:
                return Error($"'{parts[0]}' is not a command. Type 'help' for the list.");
        }
    }

    private static IEnumerable<TermLine> ExperienceLines()
    {
        yield return new("Experience", LineKind.Accent);
        foreach (var job in Profile.Jobs)
        {
            yield return new($"  {job.Title}, {job.Company} ({job.Dates})");
            foreach (var point in job.Points) yield return new($"    - {point}", LineKind.Muted);
        }
    }

    private static ShellResult Print(IEnumerable<TermLine> lines) => new(lines.ToList());

    private static ShellResult Error(string message) => new([new(message, LineKind.Error)]);
}
