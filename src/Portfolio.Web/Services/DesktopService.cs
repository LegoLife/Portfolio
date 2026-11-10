using Microsoft.JSInterop;
using Portfolio.Core.Desktop;
using Portfolio.Core.Terminal;

namespace Portfolio.Web.Services;

/// <summary>
/// The one place components go to open windows, change the theme, or reach the browser.
/// Window rules live in <see cref="WindowManager"/>; this adds the parts that need JavaScript.
/// </summary>
public sealed class DesktopService(IJSRuntime js) : IDisposable
{
    private DotNetObjectReference<DesktopService>? _self;

    public WindowManager Windows { get; } = new();
    public string Theme { get; private set; } = "day";
    public bool Stickers { get; private set; } = true;
    public bool Ready { get; private set; }

    /// <summary>Raised when windows, theme or settings change.</summary>
    public event Action? Changed;

    /// <summary>Connects to the browser. Returns the app named after # in the address, if any.</summary>
    public async Task<string> InitAsync()
    {
        _self = DotNetObjectReference.Create(this);
        var info = await js.InvokeAsync<string[]>("desktop.init", _self);
        Windows.SetViewport(double.Parse(info[0]), double.Parse(info[1]));
        Theme = TerminalShell.Themes.Contains(info[2]) ? info[2] : "day";
        Stickers = info[3] != "off";
        Windows.Changed += Notify;
        Ready = true;
        return info[4];
    }

    public void Open(string appId) => Windows.Open(appId);

    public async Task SetThemeAsync(string theme)
    {
        if (!TerminalShell.Themes.Contains(theme)) return;
        Theme = theme;
        await js.InvokeVoidAsync("desktop.setTheme", theme);
        Notify();
    }

    public Task NextThemeAsync()
    {
        var themes = TerminalShell.Themes;
        var index = (themes.ToList().IndexOf(Theme) + 1) % themes.Count;
        return SetThemeAsync(themes[index]);
    }

    public async Task SetStickersAsync(bool on)
    {
        Stickers = on;
        await js.InvokeVoidAsync("desktop.store", "stickers", on ? "on" : "off");
        Notify();
    }

    public ValueTask CopyAsync(string text) => js.InvokeVoidAsync("desktop.copy", text);
    public ValueTask DownloadAsync(string fileName, string text) => js.InvokeVoidAsync("desktop.download", fileName, text);
    public ValueTask PrintAsync(string selector, string title) => js.InvokeVoidAsync("desktop.print", selector, title);
    public ValueTask ScrollToEndAsync(string selector) => js.InvokeVoidAsync("desktop.scrollToEnd", selector);
    public ValueTask TerminalKeysAsync(string selector) => js.InvokeVoidAsync("desktop.terminalKeys", selector);

    [JSInvokable]
    public void OnViewport(double width, double height) => Windows.SetViewport(width, height);

    /// <summary>Called when a drag or resize ends. Returns where the window actually ended up after the rules were applied.</summary>
    [JSInvokable]
    public double[] OnWindowMoved(string id, double x, double y, double width, double height)
    {
        Windows.MoveResize(id, x, y, width, height);
        var window = Windows.Get(id);
        return window is null ? [x, y, width, height] : [window.X, window.Y, window.Width, window.Height];
    }

    private void Notify() => Changed?.Invoke();

    public void Dispose()
    {
        Windows.Changed -= Notify;
        _self?.Dispose();
    }
}
