namespace Portfolio.Core.Demos;

public sealed record Listing(
    int Id,
    string Street,
    string City,
    string State,
    string Zip,
    int Price,
    DateTime DatePosted,
    int Bedrooms,
    int Bathrooms,
    int SquareFeet,
    bool Trending,
    bool IsNew,
    bool PriceDrop,
    string Photo)
{
    public int DaysOnSite(DateTime today) => Math.Max(0, (today.Date - DatePosted.Date).Days);
}

public enum ListingSort { Newest, PriceLowToHigh, PriceHighToLow, Largest }

/// <summary>The filter panel of the Listings app. Ticked tags narrow the results; unticked tags are ignored.</summary>
public sealed class ListingFilter
{
    public static readonly IReadOnlyList<int> PriceSteps =
        [0, 50_000, 100_000, 150_000, 200_000, 250_000, 300_000, 400_000, 500_000, 1_000_000];

    public int PriceMin { get; set; }
    public int PriceMax { get; set; }
    public int BedroomsMin { get; set; }
    public int BathroomsMin { get; set; }
    public string Search { get; set; } = "";
    public bool Trending { get; set; }
    public bool PriceDrop { get; set; }
    public bool RecentlyAdded { get; set; }
    public ListingSort Sort { get; set; }

    public ListingFilter() => Reset();

    public void Reset()
    {
        PriceMin = PriceSteps[0];
        PriceMax = PriceSteps[^1];
        BedroomsMin = 0;
        BathroomsMin = 0;
        Search = "";
        Trending = PriceDrop = RecentlyAdded = false;
        Sort = ListingSort.Newest;
    }

    public bool IsDefault =>
        PriceMin == PriceSteps[0] && PriceMax == PriceSteps[^1] && BedroomsMin == 0 && BathroomsMin == 0 &&
        Search.Trim().Length == 0 && !Trending && !PriceDrop && !RecentlyAdded;

    public List<Listing> Apply(IEnumerable<Listing> listings)
    {
        var search = Search.Trim();
        var matches = listings.Where(l =>
            l.Price >= PriceMin && l.Price <= PriceMax &&
            l.Bedrooms >= BedroomsMin &&
            l.Bathrooms >= BathroomsMin &&
            (!Trending || l.Trending) &&
            (!PriceDrop || l.PriceDrop) &&
            (!RecentlyAdded || l.IsNew) &&
            (search.Length == 0 ||
             l.Street.Contains(search, StringComparison.OrdinalIgnoreCase) ||
             l.City.Contains(search, StringComparison.OrdinalIgnoreCase) ||
             l.State.Contains(search, StringComparison.OrdinalIgnoreCase)));

        return (Sort switch
        {
            ListingSort.PriceLowToHigh => matches.OrderBy(l => l.Price),
            ListingSort.PriceHighToLow => matches.OrderByDescending(l => l.Price),
            ListingSort.Largest => matches.OrderByDescending(l => l.SquareFeet),
            _ => matches.OrderByDescending(l => l.DatePosted).ThenBy(l => l.Id),
        }).ToList();
    }
}

public static class ListingFactory
{
    public const int PhotoCount = 25;

    public static List<Listing> Create(FakeData fake, int count = PhotoCount)
    {
        var listings = new List<Listing>(count);
        for (var i = 0; i < count; i++)
        {
            var posted = fake.RecentDate(90);
            listings.Add(new Listing(
                Id: i,
                Street: fake.StreetAddress(),
                City: fake.City(),
                State: fake.State(),
                Zip: fake.ZipCode(),
                Price: fake.Int(90, 990) * 1000,
                DatePosted: posted,
                Bedrooms: fake.Int(1, 5),
                Bathrooms: fake.Int(1, 4),
                SquareFeet: fake.Int(8, 52) * 100,
                Trending: fake.Int(1, 4) == 1,
                IsNew: (fake.Today - posted).Days <= 14,
                PriceDrop: fake.Int(1, 4) == 1,
                Photo: $"images/home{i % PhotoCount}.jpg"));
        }
        return listings;
    }
}
