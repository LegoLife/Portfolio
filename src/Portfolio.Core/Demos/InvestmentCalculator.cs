namespace Portfolio.Core.Demos;

public sealed record InvestmentInput(
    double StartingBalance,
    double InitialPrice,
    double ProjectedPrice,
    int Years,
    double MonthlyInvestment);

public sealed record InvestmentPoint(int Year, double Invested, double Value);

public sealed record InvestmentResult(
    double CagrPercent,
    double TotalShares,
    double TotalInvested,
    double FinalValue,
    IReadOnlyList<InvestmentPoint> Yearly)
{
    public double Profit => FinalValue - TotalInvested;
}

/// <summary>
/// Projects a starting balance plus a fixed monthly purchase of one stock whose price
/// grows smoothly from the initial price to the projected price.
/// </summary>
public static class InvestmentCalculator
{
    public const int MaxYears = 60;

    public static InvestmentResult? Calculate(InvestmentInput input)
    {
        if (input.InitialPrice <= 0 || input.ProjectedPrice <= 0 || input.Years <= 0 || input.Years > MaxYears ||
            input.StartingBalance < 0 || input.MonthlyInvestment < 0)
            return null;

        var cagr = Math.Pow(input.ProjectedPrice / input.InitialPrice, 1.0 / input.Years) - 1;
        var monthlyGrowth = Math.Pow(1 + cagr, 1.0 / 12) - 1;

        var shares = input.StartingBalance / input.InitialPrice;
        var price = input.InitialPrice;
        var invested = input.StartingBalance;
        var yearly = new List<InvestmentPoint> { new(0, invested, shares * price) };

        for (var month = 1; month <= input.Years * 12; month++)
        {
            // Buy at this month's price, then the price moves.
            shares += input.MonthlyInvestment / price;
            invested += input.MonthlyInvestment;
            price *= 1 + monthlyGrowth;

            if (month % 12 == 0) yearly.Add(new(month / 12, invested, shares * price));
        }

        return new InvestmentResult(cagr * 100, shares, invested, shares * price, yearly);
    }
}
