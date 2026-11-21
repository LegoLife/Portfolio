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
        "Full-stack .NET developer with a systems administration background. I build compliance, energy-market and operations software in C#, ASP.NET Core, Angular, Blazor and SQL Server.";

    /// <summary>The numbers shown beside the headline. Each one comes from the experience listed below.</summary>
    public static IReadOnlyList<(string Value, string Label)> Facts(DateTime today) =>
    [
        ($"{YearsDeveloping(today)}+", "years building production software"),
        ("700+", "Web API endpoints in one app"),
        ("40+", "energy-market data integrations"),
        ("1,200+", "commits across 10 work repos"),
    ];

    public static IReadOnlyList<string> Summary(DateTime today) =>
    [
        $"Software developer with {YearsDeveloping(today)}+ years building production .NET systems and {YearsInIt(today)}+ years in IT, at an electric generation and transmission cooperative. " +
        "I own applications end to end, from talking with users to design, code, tests, installers and support, and my systems administration background shows in software that is reliable and easy to run.",

        "My largest project is a NERC CIP configuration change management platform. Agents on Windows, Linux and network devices collect baselines, and an Angular and ASP.NET Core app with 700+ API endpoints lets compliance staff review, approve and report on every change.",

        "I also built and maintain 40+ C# integrations that bring MISO, ICE, NGI, OATI and weather data into SQL Server for power marketing, plus internal Blazor dashboards and automation for engineering, finance and HR. " +
        "Outside of work I build things for my family and for fun. Most of them are on this site.",
    ];

    public static readonly IReadOnlyList<string> Skills =
    [
        "C# / .NET (Framework to .NET 10)", "ASP.NET Core Web API", "Angular / TypeScript", "Blazor", "SQL Server / T-SQL",
        "Entity Framework Core", "REST & SFTP integrations", "Windows services & agents", "PowerShell", "SSH / Linux",
        "NUnit / Moq / xUnit", "Serilog", "NERC CIP compliance",
    ];

    public static readonly IReadOnlyList<Job> Jobs =
    [
        new("Programmer / Analyst", "Hoosier Energy", "Bloomington, IN", "Apr 2018 – Present",
        [
            "Lead developer of a NERC CIP configuration change management platform (2018–present, 550+ commits): Windows, Linux and network-device agents track ports, services, software, patches and registry baselines, and an Angular + ASP.NET Core app with 700+ API endpoints handles review workflows, bulk approvals and audit reports.",
            "Built and maintain 40+ C# integrations for Power Marketing that load MISO market, settlement and forecast data plus ICE, NGI, OATI and weather APIs into SQL Server, giving traders and accountants accurate data every day.",
            "Rebuilt a legacy desktop system-monitoring tool as a Blazor web app with LMP charts and Excel/CSV exports, and built a Blazor engineering design dashboard with role-based permissions, session tracking and comments.",
            "Automated back-office work: a Maximo-to-Great Plains file mover with SFTP transfer, a nightly AX auto-index sync, and a UKG-to-Docebo HR sync that keeps the learning platform's users current.",
            "Back code with unit tests (NUnit, Moq, FluentAssertions); kept long-lived apps current by moving them from .NET Framework to modern .NET.",
            "Work directly with end users to gather requirements, then design, deliver, train and support the result.",
        ]),
        new("System Administrator", "Hoosier Energy", "Spencer, IN", "Mar 2015 – Apr 2018",
        [
            "Managed 70+ Windows and Linux servers and workstations in a control-center environment.",
            "Supported NERC CIP compliance, which became the domain knowledge behind the change management platform I later built.",
            "Performed maintenance on the energy management system (EMS) and SCADA support tools.",
        ]),
    ];

    public static readonly IReadOnlyList<Education> Schools =
    [
        new("B.S. Networking and Telecommunications", "University of Phoenix", "2010 – 2014"),
    ];
}
