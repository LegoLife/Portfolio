using Microsoft.JSInterop;
using Portfolio.Core.Site;

namespace Portfolio.Web.Services;

/// <summary>
/// Knows which page the address asks for, and is the one place components go to reach the browser.
/// The rules for reading an address live in <see cref="SiteRoute"/>.
/// </summary>
public sealed class SiteService(IJSRuntime js) : IDisposable
{
    private DotNetObjectReference<SiteService>? _self;

    public SiteRoute Route { get; private set; } = new(SitePage.Home);
    public bool Ready { get; private set; }

    /// <summary>Raised when the address changes.</summary>
    public event Action? Changed;

    public async Task InitAsync()
    {
        _self = DotNetObjectReference.Create(this);
        Route = SiteRoute.Parse(await js.InvokeAsync<string>("site.init", _self));
        Ready = true;
    }

    /// <summary>Called by the browser whenever the part of the address after # changes.</summary>
    [JSInvokable]
    public void OnAddress(string hash)
    {
        Route = SiteRoute.Parse(hash);
        Changed?.Invoke();
    }

    /// <summary>Scrolls to a section of the page, or to the top when no section is named.</summary>
    public ValueTask ShowAsync(string? anchor) => js.InvokeVoidAsync("site.show", anchor);

    public ValueTask CopyAsync(string text) => js.InvokeVoidAsync("site.copy", text);
    public ValueTask DownloadAsync(string fileName, string text) => js.InvokeVoidAsync("site.download", fileName, text);
    public ValueTask PrintAsync(string selector, string title) => js.InvokeVoidAsync("site.print", selector, title);

    public void Dispose() => _self?.Dispose();
}
