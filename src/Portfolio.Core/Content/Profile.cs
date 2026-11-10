namespace Portfolio.Core.Content;

public sealed record Job(string Title, string Company, string Location, string Dates, IReadOnlyList<string> Points);

public sealed record Education(string Degree, string School, string Dates);

/// <summary>Everything the site says about Jake. The home page and the resume both read from here.</summary>
public static class Profile
{
    public const string Name = "Jake Steffen";
    public const string Role = "Software Developer";
    public const string Location = "Indiana, USA";
    public const string Email = "jsteffen182@gmail.com";
    public const string GitHubUser = "LegoLife";
    public const string GitHubUrl = "https://github.com/LegoLife";

    private static readonly DateTime DeveloperSince = new(2018, 4, 1);
    private static readonly DateTime InItSince = new(2015, 3, 1);

    public static int YearsDeveloping(DateTime today) => WholeYears(DeveloperSince, today);
    public static int YearsInIt(DateTime today) => WholeYears(InItSince, today);

    private static int WholeYears(DateTime from, DateTime to)
    {
        var years = to.Year - from.Year;
        if (to < from.AddYears(years)) years--;
        return Math.Max(years, 0);
    }

    public const string Headline = "I build web systems that people rely on every day.";

    public const string Intro =
        "Full-stack developer working in C#, .NET, Angular, Blazor and SQL Server, with a background in systems administration.";

    /// <summary>The numbers shown beside the headline. Each one comes from the experience listed below.</summary>
    public static IReadOnlyList<(string Value, string Label)> Facts(DateTime today) =>
    [
        ($"{YearsDeveloping(today)}+", "years building web systems"),
        ("900+", "Web API endpoints in one app"),
        ("80+", "servers tracked in real time"),
        ("20+", "C# data integration apps"),
    ];

    public static IReadOnlyList<string> Summary(DateTime today) =>
    [
        $"I'm a software developer with {YearsDeveloping(today)}+ years of building web-based systems and {YearsInIt(today)}+ years in IT overall. " +
        "I started as a system administrator, so I know what it takes to keep software running after it ships.",

        "My main project at work is a real-time data collection application that tracks 80+ Windows and Linux servers and workstations. " +
        "I built it full stack: an Angular front end, a .NET Web API with 900+ endpoints, SQL Server, and Azure DevOps to ship it.",

        "I also write and maintain 20+ C# applications that pull data from outside APIs and store it reliably. " +
        "Outside of work I build things for my family and for fun. Most of them are on this site.",
    ];

    public static readonly IReadOnlyList<string> Skills =
    [
        "C# / .NET", "ASP.NET Web API", "SQL Server", "Angular", "TypeScript", "Blazor", "Azure DevOps", "Visual Studio",
    ];

    public static readonly IReadOnlyList<Job> Jobs =
    [
        new("Programmer / Analyst", "Hoosier Energy", "Bloomington, IN", "Apr 2018 – Present",
        [
            "Built and maintain a real-time data collection application that tracks 80+ Windows and Linux servers and workstations, with an Angular front end and a .NET Web API of 900+ endpoints for data input, viewing and export.",
            "Created and maintain 20+ C# applications that fetch and store data from external APIs, with checks that keep the data complete and correct.",
            "Analyze data needs with end users, then design, build and roll out web-based solutions, including training and ongoing support.",
            "Recommend operational improvements that make day-to-day work more efficient.",
        ]),
        new("System Administrator", "Hoosier Energy", "Spencer, IN", "Mar 2015 – Apr 2018",
        [
            "Managed 70+ servers and workstations.",
            "Supported NERC CIP compliance assurance.",
            "Performed maintenance on the energy management system (EMS).",
        ]),
    ];

    public static readonly IReadOnlyList<Education> Schools =
    [
        new("B.S. Networking and Telecommunications", "University of Phoenix", "2010 – 2014"),
    ];
}
