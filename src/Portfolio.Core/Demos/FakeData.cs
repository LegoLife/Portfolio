namespace Portfolio.Core.Demos;

/// <summary>
/// A small generator of realistic-looking sample data. Pass a seed to get the same values every time.
/// </summary>
public sealed class FakeData(int? seed = null, DateTime? today = null)
{
    private readonly Random _random = seed is null ? new Random() : new Random(seed.Value);

    public DateTime Today { get; } = (today ?? DateTime.Today).Date;

    private static readonly string[] FirstNames =
    [
        "Ava", "Liam", "Maya", "Noah", "Zoe", "Ethan", "Ruby", "Owen", "Isla", "Caleb", "Nora", "Felix", "Ivy", "Jonah",
        "Clara", "Miles", "Hazel", "Silas", "Elena", "Theo", "Naomi", "Jude", "Lucia", "Reid", "Tessa", "Amos", "Priya",
        "Diego", "Mei", "Samir", "Greta", "Kofi",
    ];

    private static readonly string[] LastNames =
    [
        "Anderson", "Bennett", "Carter", "Dalton", "Ellis", "Foster", "Garcia", "Hughes", "Ingram", "Jensen", "Keller",
        "Lawson", "Mercer", "Nolan", "Ortiz", "Parker", "Quinn", "Ramsey", "Sutton", "Turner", "Underwood", "Vance",
        "Walker", "Young", "Zimmerman", "Okafor", "Nguyen", "Patel", "Kim", "Novak",
    ];

    private static readonly string[] Cities =
    [
        "Bloomington", "Cedar Falls", "Fairview", "Greenville", "Harbor Springs", "Kingston", "Lakewood", "Madison",
        "Oak Ridge", "Pinehurst", "Riverton", "Salem", "Springfield", "Westfield", "Ashland", "Clayton", "Franklin",
        "Georgetown", "Milton", "Newport",
    ];

    private static readonly string[] States =
    [
        "Alabama", "Arizona", "Colorado", "Florida", "Georgia", "Idaho", "Illinois", "Indiana", "Iowa", "Kentucky",
        "Maine", "Michigan", "Minnesota", "Missouri", "Montana", "Nevada", "New York", "North Carolina", "Ohio",
        "Oregon", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "Wisconsin",
    ];

    private static readonly string[] Countries =
    [
        "United States", "Canada", "Mexico", "Brazil", "Ireland", "France", "Germany", "Spain", "Italy", "Norway",
        "Kenya", "India", "Japan", "South Korea", "Australia", "New Zealand",
    ];

    private static readonly string[] StreetNames =
    [
        "Maple", "Oak", "Cedar", "Elm", "Walnut", "Willow", "Birch", "Hickory", "Juniper", "Magnolia", "Sycamore",
        "Chestnut", "Poplar", "Meadow", "Orchard", "Ridge", "Summit", "Prairie", "Harvest", "Quarry",
    ];

    private static readonly string[] StreetTypes = ["St", "Ave", "Rd", "Ln", "Dr", "Ct", "Way", "Blvd"];

    private static readonly string[] Dogs =
        ["Beagle", "Border Collie", "Boxer", "Corgi", "Dachshund", "Golden Retriever", "Great Dane", "Labrador", "Poodle", "Whippet"];

    private static readonly string[] Cats =
        ["Abyssinian", "Bengal", "Birman", "Burmese", "Maine Coon", "Manx", "Persian", "Ragdoll", "Siamese", "Sphynx"];

    private static readonly string[] Cows =
        ["Angus", "Ayrshire", "Brown Swiss", "Charolais", "Guernsey", "Hereford", "Highland", "Holstein", "Jersey", "Simmental"];

    private static readonly string[] Bears =
        ["Black bear", "Brown bear", "Giant panda", "Grizzly bear", "Kodiak bear", "Polar bear", "Sloth bear", "Sun bear"];

    private static readonly string[] Birds =
        ["Barn owl", "Blue jay", "Cardinal", "Chickadee", "Goldfinch", "Heron", "Kestrel", "Kingfisher", "Robin", "Wren"];

    public T Pick<T>(IReadOnlyList<T> items) => items[_random.Next(items.Count)];

    /// <summary>A whole number from <paramref name="min"/> to <paramref name="max"/>, both included.</summary>
    public int Int(int min, int max) => _random.Next(min, max + 1);

    public bool Bool() => _random.Next(2) == 0;

    public double Double(double min, double max) => min + _random.NextDouble() * (max - min);

    public string FirstName() => Pick(FirstNames);
    public string LastName() => Pick(LastNames);
    public string FullName() => $"{FirstName()} {LastName()}";
    public string City() => Pick(Cities);
    public string State() => Pick(States);
    public string Country() => Pick(Countries);
    public string ZipCode() => Int(10000, 99999).ToString();
    public string StreetAddress() => $"{Int(100, 9899)} {Pick(StreetNames)} {Pick(StreetTypes)}";
    public string Dog() => Pick(Dogs);
    public string Cat() => Pick(Cats);
    public string Cow() => Pick(Cows);
    public string Bear() => Pick(Bears);
    public string Bird() => Pick(Birds);

    public DateTime RecentDate(int days = 30) => Today.AddDays(-Int(0, days));
    public DateTime FutureDate(int days = 365) => Today.AddDays(Int(1, days));
    public DateTime Birthdate() => Today.AddYears(-Int(18, 80)).AddDays(-Int(0, 364));

    /// <summary>An id in the same short shape the original demo used, for example 3f9c21ab-77d0-4e1a-9b02.</summary>
    public string ShortGuid()
    {
        Span<byte> bytes = stackalloc byte[10];
        _random.NextBytes(bytes);
        var hex = Convert.ToHexString(bytes).ToLowerInvariant();
        return $"{hex[..8]}-{hex[8..12]}-4{hex[13..16]}-{hex[16..20]}";
    }
}
