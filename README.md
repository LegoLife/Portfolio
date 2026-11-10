# Jake Steffen's portfolio

**Live site: https://legolife.github.io/Portfolio**

My portfolio is a small desktop that runs in the browser. Open an icon and it launches in a window you can drag, resize, minimise and stack. The resume, the project write-ups and four working demo apps are all programs on that desktop.

Built with **Blazor WebAssembly (.NET 10)**. There is no UI framework and no chart library: the window manager, data grid and SVG charts are written by hand.

## What's on the desktop

| App | What it is |
| --- | --- |
| About Jake | A short introduction |
| Resume | My resume, with a button to print it or save it as a PDF |
| Projects | Write-ups of apps I've built |
| Contact | How to reach me |
| Terminal | The same content as a command line. Try `help`, `resume` or `open projects` |
| BrickForge | My 3D brick builder, running live inside a window |
| Listings | Real estate search with live filters and sorting |
| Dashboard | An admin dashboard with charts and sortable, searchable, paged grids |
| DataGen | Generates sample data as JSON, C# or CSV |
| Invest | An investment growth calculator with a chart |
| Settings | Three themes, and a few desktop options |

Add an app's name after `#` to link straight to it, for example `https://legolife.github.io/Portfolio/#resume`.

On a phone the icons become a home-screen grid and each app fills the screen.

## Run it

You need the [.NET 10 SDK](https://dotnet.microsoft.com/download).

```sh
dotnet run --project src/Portfolio.Web     # dev server at http://localhost:5059
dotnet test                                # unit tests
dotnet publish src/Portfolio.Web -c Release -o publish
```

## How it's organised

```
src/Portfolio.Core      Plain C#: no browser, no Blazor. Everything here is unit-tested.
  Desktop/              The window manager (open, focus, stack, clamp to the screen) and the app list
  Content/              Resume and project text. The Resume app, About app and Terminal all read from here
  Demos/                Logic behind the demo apps: filters, calculator, sample-data generator
  Terminal/             The command interpreter
src/Portfolio.Web       The Blazor WebAssembly app
  Shell/                Desktop, windows, taskbar, launcher, icons
  Apps/                 One component per app
  Shared/               Data grid and chart components
  wwwroot/js/desktop.js Dragging and resizing
tests/Portfolio.Core.Tests
```

**C# owns the state and the rules; JavaScript only follows the pointer.** While you drag a window, `desktop.js` moves the element directly so it stays smooth. When you let go, it reports the new position to `WindowManager`, which applies the rules (a window can't be dragged out of reach) and sends back where the window really ends up.

To add an app: add it to `AppCatalog`, write a component in `Apps/`, map the two in `AppRegistry`, and add an icon to `AppIcon.razor`.

## Deployment

Every push to `main` runs the tests and deploys to GitHub Pages (`.github/workflows/pages.yml`). The repository's Pages source must be set to **GitHub Actions** (Settings → Pages).

The workflow rewrites the literal `<base href="/" />` in `wwwroot/index.html` to `/Portfolio/` and fails if that text is missing, so keep it exactly as it is.

## Contact

[jsteffen182@gmail.com](mailto:jsteffen182@gmail.com)
