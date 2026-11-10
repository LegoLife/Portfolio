using Portfolio.Core.Content;
using Portfolio.Core.Demos;
using Portfolio.Core.Desktop;
using Portfolio.Core.Terminal;

namespace Portfolio.Core.Tests;

public class WindowManagerTests
{
    private static WindowManager Desktop()
    {
        var manager = new WindowManager();
        manager.SetViewport(1280, 800);
        return manager;
    }

    [Fact]
    public void Opening_an_app_twice_keeps_one_window_and_brings_it_forward()
    {
        var desktop = Desktop();
        desktop.Open("about");
        desktop.Open("resume");
        desktop.Open("about");

        Assert.Equal(2, desktop.Windows.Count);
        Assert.Equal("about", desktop.Active!.Id);
    }

    [Fact]
    public void Unknown_apps_do_not_open()
    {
        var desktop = Desktop();
        Assert.Null(desktop.Open("nope"));
        Assert.Empty(desktop.Windows);
    }

    [Fact]
    public void Taskbar_toggle_minimises_the_active_window_and_restores_others()
    {
        var desktop = Desktop();
        desktop.Open("about");
        desktop.Open("resume");

        desktop.Toggle("resume");
        Assert.True(desktop.Get("resume")!.Minimized);
        Assert.Equal("about", desktop.Active!.Id);

        desktop.Toggle("resume");
        Assert.False(desktop.Get("resume")!.Minimized);
        Assert.Equal("resume", desktop.Active!.Id);
    }

    [Fact]
    public void New_windows_fit_inside_a_small_screen()
    {
        var desktop = new WindowManager();
        desktop.SetViewport(800, 600);
        var window = desktop.Open("brickforge")!;

        Assert.True(window.Width <= 800);
        Assert.True(window.Height <= 600 - WindowManager.TaskbarHeight);
        Assert.True(window.X >= 0 && window.Y >= 0);
    }

    [Fact]
    public void A_window_cannot_be_dragged_out_of_reach()
    {
        var desktop = Desktop();
        var window = desktop.Open("contact")!;

        desktop.MoveResize("contact", 5000, 5000, window.Width, window.Height);
        Assert.True(window.X < 1280);
        Assert.True(window.Y < 800 - WindowManager.TaskbarHeight);

        desktop.MoveResize("contact", -5000, -5000, 10, 10);
        Assert.True(window.X + window.Width > 0);
        Assert.Equal(0, window.Y);
        Assert.Equal(WindowManager.MinWidth, window.Width);
        Assert.Equal(WindowManager.MinHeight, window.Height);
    }

    [Fact]
    public void Changes_raise_the_changed_event()
    {
        var desktop = Desktop();
        var count = 0;
        desktop.Changed += () => count++;

        desktop.Open("about");
        desktop.Minimize("about");
        desktop.Close("about");

        Assert.Equal(3, count);
    }
}

public class InvestmentCalculatorTests
{
    [Fact]
    public void A_flat_price_returns_exactly_what_was_put_in()
    {
        var result = InvestmentCalculator.Calculate(new(1000, 50, 50, 2, 100))!;

        Assert.Equal(0, result.CagrPercent, 6);
        Assert.Equal(3400, result.TotalInvested, 6);
        Assert.Equal(3400, result.FinalValue, 6);
        Assert.Equal(0, result.Profit, 6);
    }

    [Fact]
    public void A_lump_sum_grows_by_the_price_ratio()
    {
        var result = InvestmentCalculator.Calculate(new(1000, 10, 40, 10, 0))!;

        Assert.Equal(4000, result.FinalValue, 4);
        Assert.Equal(14.8698, result.CagrPercent, 3);
    }

    [Fact]
    public void There_is_one_point_per_year_and_the_last_matches_the_total()
    {
        var result = InvestmentCalculator.Calculate(new(20000, 262.67, 12000, 10, 600))!;

        Assert.Equal(11, result.Yearly.Count);
        Assert.Equal(20000, result.Yearly[0].Value, 6);
        Assert.Equal(result.FinalValue, result.Yearly[^1].Value, 6);
        Assert.Equal(20000 + 600 * 120, result.TotalInvested, 6);
        Assert.True(result.Yearly.Zip(result.Yearly.Skip(1)).All(pair => pair.Second.Value > pair.First.Value));
    }

    [Theory]
    [InlineData(0, 100, 10)]
    [InlineData(100, 0, 10)]
    [InlineData(100, 100, 0)]
    [InlineData(100, 100, 61)]
    public void Impossible_inputs_give_no_result(double initial, double projected, int years) =>
        Assert.Null(InvestmentCalculator.Calculate(new(1000, initial, projected, years, 100)));
}

public class DataGeneratorTests
{
    private static readonly DataField[] Fields = [new("first name", "firstName"), new("age", "age"), new("joined", "recentDate")];

    [Fact]
    public void The_same_seed_gives_the_same_rows()
    {
        var today = new DateTime(2026, 1, 15);
        var a = DataGenerator.ToJson(DataGenerator.Rows(Fields, 5, new FakeData(7, today)));
        var b = DataGenerator.ToJson(DataGenerator.Rows(Fields, 5, new FakeData(7, today)));
        Assert.Equal(a, b);
    }

    [Fact]
    public void Every_type_on_offer_can_be_generated()
    {
        var fake = new FakeData(1);
        Assert.All(DataGenerator.Types, type => Assert.NotNull(DataGenerator.Sample(fake, type)));
    }

    [Fact]
    public void Row_count_is_capped()
    {
        Assert.Equal(DataGenerator.MaxRows, DataGenerator.Rows(Fields, 5000, new FakeData(1)).Count);
    }

    [Fact]
    public void Json_keeps_numbers_as_numbers_and_parses()
    {
        var json = DataGenerator.ToJson(DataGenerator.Rows(Fields, 3, new FakeData(3, new DateTime(2026, 1, 15))));
        using var document = System.Text.Json.JsonDocument.Parse(json);

        Assert.Equal(3, document.RootElement.GetArrayLength());
        var first = document.RootElement[0];
        Assert.Equal(System.Text.Json.JsonValueKind.Number, first.GetProperty("age").ValueKind);
        Assert.Matches(@"^\d{4}-\d{2}-\d{2}$", first.GetProperty("joined").GetString()!);
    }

    [Fact]
    public void CSharp_output_uses_typed_properties_with_valid_names()
    {
        var code = DataGenerator.ToCSharp(Fields, DataGenerator.Rows(Fields, 2, new FakeData(3)));

        Assert.Contains("public string FirstName { get; set; }", code);
        Assert.Contains("public int Age { get; set; }", code);
        Assert.Contains("public DateTime Joined { get; set; }", code);
        Assert.Contains("Joined = new DateTime(", code);
    }

    [Theory]
    [InlineData("first name", "FirstName")]
    [InlineData("zip-code", "ZipCode")]
    [InlineData("2nd line", "_2ndLine")]
    [InlineData("!!!", "Field")]
    public void Field_names_become_identifiers(string name, string expected) =>
        Assert.Equal(expected, DataGenerator.Identifier(name));

    [Fact]
    public void Csv_quotes_cells_that_contain_commas()
    {
        DataField[] fields = [new("a,b", "age")];
        var csv = DataGenerator.ToCsv(fields, DataGenerator.Rows(fields, 1, new FakeData(1)));
        Assert.StartsWith("\"a,b\"", csv);
    }

    [Fact]
    public void Duplicate_and_empty_fields_are_rejected()
    {
        Assert.NotNull(DataGenerator.Validate(Fields, "AGE", "age"));
        Assert.NotNull(DataGenerator.Validate(Fields, " ", "age"));
        Assert.NotNull(DataGenerator.Validate(Fields, "pet", "dragon"));
        Assert.Null(DataGenerator.Validate(Fields, "pet", "dogBreed"));
    }
}

public class ListingTests
{
    private static readonly DateTime Today = new(2026, 6, 1);

    private static Listing Home(int id, int price, int beds = 3, int baths = 2, string city = "Salem", bool trending = false, bool isNew = false) =>
        new(id, $"{id} Maple St", city, "Indiana", "47401", price, Today.AddDays(-id), beds, baths, 1500, trending, isNew, false, "x.jpg");

    [Fact]
    public void An_untouched_filter_returns_everything()
    {
        var all = ListingFactory.Create(new FakeData(5, Today));
        var filter = new ListingFilter();

        Assert.True(filter.IsDefault);
        Assert.Equal(all.Count, filter.Apply(all).Count);
    }

    [Fact]
    public void Price_rooms_and_search_narrow_the_results()
    {
        Listing[] homes = [Home(1, 100_000), Home(2, 300_000, beds: 4), Home(3, 300_000, beds: 4, city: "Madison"), Home(4, 900_000)];
        var filter = new ListingFilter { PriceMin = 200_000, PriceMax = 500_000, BedroomsMin = 4, Search = "madi" };

        Assert.Equal([3], filter.Apply(homes).Select(l => l.Id));
    }

    [Fact]
    public void A_ticked_tag_does_not_exclude_listings_with_other_tags()
    {
        Listing[] homes = [Home(1, 100_000, trending: true, isNew: true), Home(2, 100_000, trending: true), Home(3, 100_000)];
        var filter = new ListingFilter { Trending = true };

        Assert.Equal([1, 2], filter.Apply(homes).Select(l => l.Id));
    }

    [Fact]
    public void Results_can_be_sorted_by_price()
    {
        Listing[] homes = [Home(1, 300_000), Home(2, 100_000), Home(3, 200_000)];
        var filter = new ListingFilter { Sort = ListingSort.PriceLowToHigh };

        Assert.Equal([2, 3, 1], filter.Apply(homes).Select(l => l.Id));
    }

    [Fact]
    public void Generated_listings_use_the_photos_that_exist()
    {
        var all = ListingFactory.Create(new FakeData(5, Today));
        Assert.Equal(ListingFactory.PhotoCount, all.Select(l => l.Photo).Distinct().Count());
        Assert.All(all, l => Assert.InRange(l.DaysOnSite(Today), 0, 90));
    }
}

public class TerminalShellTests
{
    private readonly TerminalShell _shell = new(() => new DateTime(2026, 11, 10));

    [Fact]
    public void Open_asks_the_desktop_to_open_the_app()
    {
        Assert.Equal("resume", _shell.Execute("open resume").OpenApp);
        Assert.Equal("resume", _shell.Execute("  OPEN   Resume ").OpenApp);
    }

    [Fact]
    public void Unknown_commands_and_apps_print_an_error()
    {
        Assert.Equal(LineKind.Error, _shell.Execute("frobnicate").Lines.Single().Kind);
        Assert.Equal(LineKind.Error, _shell.Execute("open nothing").Lines.Single().Kind);
        Assert.Null(_shell.Execute("open nothing").OpenApp);
    }

    [Fact]
    public void Theme_accepts_only_known_themes()
    {
        Assert.Equal("night", _shell.Execute("theme night").Theme);
        Assert.Null(_shell.Execute("theme plaid").Theme);
    }

    [Fact]
    public void Resume_prints_every_job()
    {
        var text = string.Join('\n', _shell.Execute("resume").Lines.Select(l => l.Text));
        Assert.All(Profile.Jobs, job => Assert.Contains(job.Title, text));
    }

    [Fact]
    public void Clear_exit_and_blank_input_print_nothing()
    {
        Assert.True(_shell.Execute("clear").Clear);
        Assert.True(_shell.Execute("exit").Exit);
        Assert.Empty(_shell.Execute("   ").Lines);
    }

    [Theory]
    [InlineData("res", "resume")]
    [InlineData("op", "open ")]
    [InlineData("open bri", "open brickforge")]
    [InlineData("theme n", "theme night")]
    [InlineData("open d", "open d")]      // dashboard and datagen both match
    [InlineData("zzz", "zzz")]
    public void Tab_completes_when_there_is_exactly_one_match(string typed, string expected) =>
        Assert.Equal(expected, TerminalShell.Complete(typed));
}

public class ContentTests
{
    [Fact]
    public void Years_of_experience_count_whole_years_only()
    {
        Assert.Equal(8, Profile.YearsDeveloping(new DateTime(2026, 11, 10)));
        Assert.Equal(7, Profile.YearsDeveloping(new DateTime(2026, 3, 31)));
        Assert.Equal(11, Profile.YearsInIt(new DateTime(2026, 11, 10)));
    }

    [Fact]
    public void Every_project_that_opens_an_app_names_a_real_app()
    {
        var linked = ProjectCatalog.Apps.Concat(ProjectCatalog.Demos).Where(p => p.AppId is not null);
        Assert.All(linked, p => Assert.NotNull(AppCatalog.Find(p.AppId)));
    }

    [Fact]
    public void App_ids_are_unique()
    {
        Assert.Equal(AppCatalog.All.Count, AppCatalog.All.Select(a => a.Id).Distinct().Count());
    }
}
