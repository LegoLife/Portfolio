namespace Portfolio.Web.Services;

/// <summary>Text formatting for numbers and dates. The app runs without culture data, so formats are spelled out here.</summary>
public static class Fmt
{
    public static string Money(double value, int decimals = 0) => (value < 0 ? "-$" : "$") + Math.Abs(value).ToString("N" + decimals);
    public static string Money(decimal value, int decimals = 0) => Money((double)value, decimals);
    public static string Money(int value) => Money((double)value);
    public static string Number(double value, int decimals = 0) => value.ToString("N" + decimals);
    public static string Date(DateTime date) => date.ToString("MMM d, yyyy");
    public static string ShortDate(DateTime date) => date.ToString("MMM d");
    public static string Px(double value) => value.ToString("0.##") + "px";

    /// <summary>Short money for chart axes: $950, $12K, $1.4M.</summary>
    public static string CompactMoney(double value) => "$" + Compact(value);

    public static string Compact(double value) => Math.Abs(value) switch
    {
        >= 1_000_000_000 => (value / 1_000_000_000).ToString("0.#") + "B",
        >= 1_000_000 => (value / 1_000_000).ToString("0.#") + "M",
        >= 1_000 => (value / 1_000).ToString("0.#") + "K",
        _ => value.ToString("0.#"),
    };
}
