using System.Globalization;
using System.Text;
using System.Text.Json;

namespace Portfolio.Core.Demos;

public sealed record DataField(string Name, string Type);

/// <summary>One generated row: field name and value, in the order the fields were defined.</summary>
public sealed class DataRow : List<KeyValuePair<string, object>>;

/// <summary>Turns a list of fields into rows of sample data, and rows into JSON, C# or CSV text.</summary>
public static class DataGenerator
{
    public const int MaxRows = 99;

    public static readonly IReadOnlyList<string> Types =
    [
        "firstName", "lastName", "age", "streetAddress", "city", "state", "zipCode", "country",
        "recentDate", "birthdate", "futureDate", "dogBreed", "catBreed", "cowBreed", "bearBreed", "birdBreed",
    ];

    public static readonly IReadOnlyList<string> Formats = ["JSON", "C#", "CSV"];

    public static object Sample(FakeData fake, string type) => type switch
    {
        "firstName" => fake.FirstName(),
        "lastName" => fake.LastName(),
        "age" => fake.Int(1, 99),
        "streetAddress" => fake.StreetAddress(),
        "city" => fake.City(),
        "state" => fake.State(),
        "zipCode" => fake.ZipCode(),
        "country" => fake.Country(),
        "recentDate" => fake.RecentDate(),
        "birthdate" => fake.Birthdate(),
        "futureDate" => fake.FutureDate(),
        "dogBreed" => fake.Dog(),
        "catBreed" => fake.Cat(),
        "cowBreed" => fake.Cow(),
        "bearBreed" => fake.Bear(),
        "birdBreed" => fake.Bird(),
        _ => throw new ArgumentException($"Unknown data type '{type}'.", nameof(type)),
    };

    /// <summary>Says why a new field can't be added, or null when it can.</summary>
    public static string? Validate(IEnumerable<DataField> existing, string? name, string? type)
    {
        name = name?.Trim();
        if (string.IsNullOrEmpty(name)) return "Give the field a name.";
        if (string.IsNullOrEmpty(type) || !Types.Contains(type)) return "Pick a type of data.";
        if (existing.Any(f => string.Equals(f.Name, name, StringComparison.OrdinalIgnoreCase)))
            return $"There is already a field called \"{name}\".";
        return null;
    }

    public static List<DataRow> Rows(IReadOnlyList<DataField> fields, int count, FakeData fake)
    {
        count = Math.Clamp(count, 0, MaxRows);
        var rows = new List<DataRow>(count);
        for (var i = 0; i < count; i++)
        {
            var row = new DataRow();
            foreach (var field in fields) row.Add(new(field.Name, Sample(fake, field.Type)));
            rows.Add(row);
        }
        return rows;
    }

    public static string Format(string format, IReadOnlyList<DataField> fields, IReadOnlyList<DataRow> rows) => format switch
    {
        "C#" => ToCSharp(fields, rows),
        "CSV" => ToCsv(fields, rows),
        _ => ToJson(rows),
    };

    public static string FileName(string format) => format switch
    {
        "C#" => "SampleData.cs",
        "CSV" => "sample.csv",
        _ => "sample.json",
    };

    public static string ToJson(IReadOnlyList<DataRow> rows)
    {
        using var stream = new MemoryStream();
        using (var json = new Utf8JsonWriter(stream, new JsonWriterOptions { Indented = true }))
        {
            json.WriteStartArray();
            foreach (var row in rows)
            {
                json.WriteStartObject();
                foreach (var (name, value) in row)
                {
                    switch (value)
                    {
                        case int number: json.WriteNumber(name, number); break;
                        case DateTime date: json.WriteString(name, IsoDate(date)); break;
                        default: json.WriteString(name, value.ToString()); break;
                    }
                }
                json.WriteEndObject();
            }
            json.WriteEndArray();
        }
        return Encoding.UTF8.GetString(stream.ToArray());
    }

    public static string ToCSharp(IReadOnlyList<DataField> fields, IReadOnlyList<DataRow> rows, string className = "SampleRow")
    {
        var names = fields.Select(f => Identifier(f.Name)).ToList();
        var text = new StringBuilder();

        text.AppendLine($"public class {className}");
        text.AppendLine("{");
        for (var i = 0; i < fields.Count; i++)
            text.AppendLine($"    public {ClrType(fields[i].Type)} {names[i]} {{ get; set; }}");
        text.AppendLine("}");
        text.AppendLine();
        text.AppendLine($"var list = new List<{className}>");
        text.AppendLine("{");
        foreach (var row in rows)
        {
            var values = row.Select((pair, i) => $"{names[i]} = {Literal(pair.Value)}");
            text.AppendLine($"    new() {{ {string.Join(", ", values)} }},");
        }
        text.Append("};");
        return text.ToString();
    }

    public static string ToCsv(IReadOnlyList<DataField> fields, IReadOnlyList<DataRow> rows)
    {
        var text = new StringBuilder();
        text.AppendLine(string.Join(",", fields.Select(f => CsvCell(f.Name))));
        foreach (var row in rows)
            text.AppendLine(string.Join(",", row.Select(pair => CsvCell(pair.Value is DateTime d ? IsoDate(d) : pair.Value.ToString()!))));
        return text.ToString().TrimEnd();
    }

    /// <summary>Turns any field name into a valid PascalCase C# property name: "first name" becomes FirstName.</summary>
    public static string Identifier(string name)
    {
        var result = new StringBuilder();
        var upperNext = true;
        foreach (var c in name)
        {
            if (char.IsLetterOrDigit(c) || c == '_')
            {
                result.Append(upperNext ? char.ToUpperInvariant(c) : c);
                upperNext = false;
            }
            else
            {
                upperNext = true;
            }
        }
        if (result.Length == 0) return "Field";
        if (char.IsDigit(result[0])) result.Insert(0, '_');
        return result.ToString();
    }

    private static string ClrType(string type) => type switch
    {
        "age" => "int",
        "recentDate" or "birthdate" or "futureDate" => "DateTime",
        _ => "string",
    };

    private static string Literal(object value) => value switch
    {
        int number => number.ToString(CultureInfo.InvariantCulture),
        DateTime date => $"new DateTime({date.Year}, {date.Month}, {date.Day})",
        _ => "\"" + value.ToString()!.Replace("\\", "\\\\").Replace("\"", "\\\"") + "\"",
    };

    private static string IsoDate(DateTime date) => date.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);

    private static string CsvCell(string value) =>
        value.IndexOfAny([',', '"', '\n', '\r']) >= 0 ? "\"" + value.Replace("\"", "\"\"") + "\"" : value;
}
