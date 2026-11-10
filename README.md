# Jake Steffen's portfolio

**Live site: https://legolife.github.io/Portfolio**

My portfolio is a single page: an introduction, the projects I've built, my experience, and four working demo apps you can try in the browser.

Built with **Blazor WebAssembly (.NET 10)**. There is no UI framework and no chart library: the data grid and SVG charts are written by hand.

## What's on it

| Section | What it is |
| --- | --- |
| Selected work | Write-ups and screenshots of apps I've built |
| Experience | Jobs, education and skills |
| Live demos | Real estate search, an admin dashboard, a sample-data generator and an investment calculator |
| Resume | My resume, with a button to print it or save it as a PDF |

The part of the address after `#` picks the page:

| Address | Shows |
| --- | --- |
| `#work`, `#experience`, `#demos`, `#contact` | That section of the home page |
| `#/resume` | The resume |
| `#/demos/listings`, `#/demos/dashboard`, `#/demos/datagen`, `#/demos/invest` | A demo |

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
  Content/              Resume and project text. The home page and the resume both read from here
  Demos/                Logic behind the demos: filters, calculator, sample-data generator
  Site/                 Reads the address and decides which page it means
src/Portfolio.Web       The Blazor WebAssembly app
  Layout/               Header, footer and the switch between pages
  Pages/                Home, resume and the page that hosts a demo
  Demos/                One component per demo
  Shared/               Data grid and chart components
  wwwroot/js/site.js    The few things only the browser can do: scrolling, clipboard, downloads, printing
tests/Portfolio.Core.Tests
```

To change what the site says, edit `Content/Profile.cs` and `Content/ProjectCatalog.cs`. A project's screenshot goes in `wwwroot/images/projects/` and is named in its catalog entry.

To add a demo: add it to `ProjectCatalog.Demos`, write a component in `Demos/`, and map the two in `Pages/DemoPage.razor`.

## Deployment

Every push to `main` runs the tests and deploys to GitHub Pages (`.github/workflows/pages.yml`). The repository's Pages source must be set to **GitHub Actions** (Settings → Pages).

The workflow rewrites the literal `<base href="/" />` in `wwwroot/index.html` to `/Portfolio/` and fails if that text is missing, so keep it exactly as it is.

## Contact

[jsteffen182@gmail.com](mailto:jsteffen182@gmail.com)
