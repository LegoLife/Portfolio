using Portfolio.Web.Apps;

namespace Portfolio.Web.Shell;

/// <summary>Maps an app id from the catalog to the component that draws its window contents.</summary>
public static class AppRegistry
{
    private static readonly Dictionary<string, Type> Components = new()
    {
        ["about"] = typeof(AboutApp),
        ["resume"] = typeof(ResumeApp),
        ["projects"] = typeof(ProjectsApp),
        ["contact"] = typeof(ContactApp),
        ["terminal"] = typeof(TerminalApp),
        ["brickforge"] = typeof(BrickForgeApp),
        ["listings"] = typeof(ListingsApp),
        ["dashboard"] = typeof(DashboardApp),
        ["datagen"] = typeof(DataGenApp),
        ["invest"] = typeof(InvestApp),
        ["settings"] = typeof(SettingsApp),
    };

    public static Type For(string appId) => Components[appId];
}
