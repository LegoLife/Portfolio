using System.Text.Json.Serialization;

namespace Portfolio.Core.Demos;

public sealed record Order(string FirstName, string LastName, string OrderNumber, int Quantity, decimal UnitPrice)
{
    public decimal Total => Quantity * UnitPrice;
}

public sealed record DailySales(DateTime Day, int Sales, int Profit, int Orders);

public sealed record DashUser(int Id, string FirstName, string LastName, string Email, DateTime BirthDate, string City);

public sealed record DashProduct(int Id, string Title, string Brand, string Category, decimal Price, int Stock, string? Thumbnail);

/// <summary>Sample data for the Dashboard app, used as-is for orders and as a fallback when the public API is unreachable.</summary>
public static class DashboardData
{
    public static List<Order> Orders(FakeData fake, int count = 1000)
    {
        var orders = new List<Order>(count);
        for (var i = 0; i < count; i++)
            orders.Add(new Order(fake.FirstName(), fake.LastName(), fake.ShortGuid(), fake.Int(1, 500), fake.Int(10000, 20000) / 100m));
        return orders;
    }

    public static List<DailySales> Week(FakeData fake, int days = 8)
    {
        var result = new List<DailySales>(days);
        for (var i = days - 1; i >= 0; i--)
        {
            var sales = fake.Int(240, 760);
            result.Add(new DailySales(fake.Today.AddDays(-i), sales, (int)(sales * fake.Double(0.18, 0.62)), fake.Int(38, 92)));
        }
        return result;
    }

    public static List<DashUser> Users(FakeData fake, int count = 30)
    {
        var users = new List<DashUser>(count);
        for (var i = 1; i <= count; i++)
        {
            var first = fake.FirstName();
            var last = fake.LastName();
            users.Add(new DashUser(i, first, last, $"{first}.{last}@example.com".ToLowerInvariant(), fake.Birthdate(), fake.City()));
        }
        return users;
    }

    private static readonly (string Title, string Brand, string Category)[] Catalog =
    [
        ("Trail Running Shoes", "Northpath", "footwear"), ("Ceramic Pour-Over Set", "Kettle & Co", "kitchen"),
        ("Wireless Earbuds", "Sonara", "audio"), ("Canvas Weekender Bag", "Harbor", "bags"),
        ("Standing Desk Mat", "Uplift Works", "office"), ("Cast Iron Skillet", "Forgewell", "kitchen"),
        ("Insulated Water Bottle", "Northpath", "outdoors"), ("Mechanical Keyboard", "Keystone", "office"),
        ("Wool Throw Blanket", "Hearthside", "home"), ("LED Desk Lamp", "Lumen", "office"),
        ("Bluetooth Speaker", "Sonara", "audio"), ("Chef's Knife", "Forgewell", "kitchen"),
        ("Rain Jacket", "Northpath", "apparel"), ("Notebook 3-Pack", "Paperline", "office"),
        ("Yoga Mat", "Stillwater", "fitness"), ("Espresso Grinder", "Kettle & Co", "kitchen"),
    ];

    public static List<DashProduct> Products(FakeData fake) =>
        Catalog.Select((p, i) => new DashProduct(i + 1, p.Title, p.Brand, p.Category, fake.Int(900, 24900) / 100m, fake.Int(0, 180), null)).ToList();
}

// The shape of https://dummyjson.com responses. Only the fields the dashboard shows are mapped.
public sealed record ApiUserPage(List<ApiUser>? Users);

public sealed record ApiUser(int Id, string? FirstName, string? LastName, string? Email, string? BirthDate, ApiAddress? Address)
{
    public DashUser ToUser() => new(
        Id, FirstName ?? "", LastName ?? "", Email ?? "",
        DateTime.TryParse(BirthDate, System.Globalization.CultureInfo.InvariantCulture, out var born) ? born : default,
        Address?.City ?? "");
}

public sealed record ApiAddress(string? City);

public sealed record ApiProductPage(List<ApiProduct>? Products);

public sealed record ApiProduct(int Id, string? Title, string? Brand, string? Category, decimal Price, int Stock, string? Thumbnail)
{
    public DashProduct ToProduct() => new(Id, Title ?? "", Brand ?? "—", Category ?? "", Price, Stock, Thumbnail);
}

[JsonSourceGenerationOptions(PropertyNamingPolicy = JsonKnownNamingPolicy.CamelCase)]
[JsonSerializable(typeof(ApiUserPage))]
[JsonSerializable(typeof(ApiProductPage))]
public sealed partial class DummyJsonContext : JsonSerializerContext;
