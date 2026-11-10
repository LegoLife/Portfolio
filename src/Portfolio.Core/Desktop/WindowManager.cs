namespace Portfolio.Core.Desktop;

public sealed class WindowState
{
    public required AppInfo App { get; init; }
    public string Id => App.Id;
    public double X { get; set; }
    public double Y { get; set; }
    public double Width { get; set; }
    public double Height { get; set; }
    public int Z { get; set; }
    public bool Minimized { get; set; }
    public bool Maximized { get; set; }
}

/// <summary>
/// Owns every open window: where it is, how big it is, and which one is on top.
/// One window per app; opening an app that is already open brings it forward.
/// </summary>
public sealed class WindowManager
{
    public const double TaskbarHeight = 56;
    public const double MinWidth = 320;
    public const double MinHeight = 220;
    private const double Margin = 12;
    private const double GrabStrip = 120;   // how much of a window must stay reachable

    private readonly List<WindowState> _windows = [];
    private int _topZ = 10;
    private int _opened;

    public double ViewportWidth { get; private set; } = 1280;
    public double ViewportHeight { get; private set; } = 800;

    public event Action? Changed;

    public IReadOnlyList<WindowState> Windows => _windows;

    /// <summary>The frontmost window that is not minimised.</summary>
    public WindowState? Active => _windows.Where(w => !w.Minimized).MaxBy(w => w.Z);

    public WindowState? Get(string id) => _windows.FirstOrDefault(w => w.Id == id);

    public void SetViewport(double width, double height)
    {
        if (width <= 0 || height <= 0) return;
        ViewportWidth = width;
        ViewportHeight = height;
        foreach (var w in _windows) Clamp(w);
        Changed?.Invoke();
    }

    public WindowState? Open(string? appId)
    {
        var app = AppCatalog.Find(appId);
        if (app is null) return null;

        var existing = Get(app.Id);
        if (existing is not null)
        {
            existing.Minimized = false;
            Raise(existing);
            Changed?.Invoke();
            return existing;
        }

        var width = Math.Min(app.Width, ViewportWidth - Margin * 2);
        var height = Math.Min(app.Height, ViewportHeight - TaskbarHeight - Margin * 2);
        var step = _opened++ % 6;
        var window = new WindowState
        {
            App = app,
            Width = width,
            Height = height,
            // Cascade from the centre, but a new window always starts fully on screen.
            X = Math.Clamp((ViewportWidth - width) / 2 + (step - 2) * 34, 0, Math.Max(0, ViewportWidth - width)),
            Y = Math.Clamp(Margin + step * 28, 0, Math.Max(0, ViewportHeight - TaskbarHeight - height)),
        };
        Clamp(window);
        _windows.Add(window);
        Raise(window);
        Changed?.Invoke();
        return window;
    }

    public void Close(string id)
    {
        if (_windows.RemoveAll(w => w.Id == id) > 0) Changed?.Invoke();
    }

    public void CloseAll()
    {
        if (_windows.Count == 0) return;
        _windows.Clear();
        Changed?.Invoke();
    }

    public void Focus(string id)
    {
        var window = Get(id);
        if (window is null || window == Active) return;
        window.Minimized = false;
        Raise(window);
        Changed?.Invoke();
    }

    public void Minimize(string id)
    {
        var window = Get(id);
        if (window is null || window.Minimized) return;
        window.Minimized = true;
        Changed?.Invoke();
    }

    public void ToggleMaximize(string id)
    {
        var window = Get(id);
        if (window is null) return;
        window.Maximized = !window.Maximized;
        window.Minimized = false;
        Raise(window);
        Changed?.Invoke();
    }

    /// <summary>Taskbar behaviour: the active window minimises, any other comes forward.</summary>
    public void Toggle(string id)
    {
        var window = Get(id);
        if (window is null) return;
        if (window == Active) Minimize(id);
        else Focus(id);
    }

    public void MoveResize(string id, double x, double y, double width, double height)
    {
        var window = Get(id);
        if (window is null) return;
        window.X = x;
        window.Y = y;
        window.Width = width;
        window.Height = height;
        Clamp(window);
        Changed?.Invoke();
    }

    private void Raise(WindowState window) => window.Z = ++_topZ;

    private void Clamp(WindowState w)
    {
        w.Width = Math.Clamp(w.Width, MinWidth, Math.Max(MinWidth, ViewportWidth));
        w.Height = Math.Clamp(w.Height, MinHeight, Math.Max(MinHeight, ViewportHeight - TaskbarHeight));
        // The title bar must stay on screen so the window can always be grabbed again.
        w.X = Math.Clamp(w.X, GrabStrip - w.Width, Math.Max(GrabStrip - w.Width, ViewportWidth - GrabStrip));
        w.Y = Math.Clamp(w.Y, 0, Math.Max(0, ViewportHeight - TaskbarHeight - 44));
    }
}
