using Microsoft.AspNetCore.Components;

namespace Portfolio.Web.Shared;

/// <summary>One column of a <see cref="DataGrid{TItem}"/>.</summary>
/// <param name="Title">Header text.</param>
/// <param name="Value">The value rows are sorted by.</param>
/// <param name="Text">How the value is shown and searched. Defaults to the value's own text.</param>
/// <param name="Numeric">Right-align the column.</param>
/// <param name="Template">Custom cell content, for example an image.</param>
public sealed record GridColumn<TItem>(
    string Title,
    Func<TItem, IComparable?> Value,
    Func<TItem, string>? Text = null,
    bool Numeric = false,
    RenderFragment<TItem>? Template = null)
{
    public string Display(TItem item) => Text?.Invoke(item) ?? Value(item)?.ToString() ?? "";
}

public sealed record ChartSeries(string Name, string Color, IReadOnlyList<double> Values);
