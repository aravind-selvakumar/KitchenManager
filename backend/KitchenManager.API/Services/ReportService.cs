using Microsoft.EntityFrameworkCore;
using KitchenManager.API.Data;
using KitchenManager.API.DTOs;

namespace KitchenManager.API.Services;

public class ReportService
{
    private readonly AppDbContext _context;

    public ReportService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ReportResponseDto> GetDailyReport(DateTime date)
    {
        var from = date.Date;
        var to = from.AddDays(1);

        var items = await GetItemsInRange(from, to);

        return new ReportResponseDto
        {
            Period = new ReportPeriodDto
            {
                Type = "daily",
                Label = date.ToString("dd MMM yyyy"),
                From = from,
                To = to
            },
            Items = items,
            GrandTotal = items.Sum(i => i.TotalCost)
        };
    }

    public async Task<ReportResponseDto> GetMonthlyReport(int year, int month)
    {
        var from = new DateTime(year, month, 1);
        var to = from.AddMonths(1);

        var items = await GetItemsInRange(from, to);

        var monthName = new DateTime(year, month, 1).ToString("MMMM yyyy");

        return new ReportResponseDto
        {
            Period = new ReportPeriodDto
            {
                Type = "monthly",
                Label = monthName,
                From = from,
                To = to
            },
            Items = items,
            GrandTotal = items.Sum(i => i.TotalCost)
        };
    }

    public async Task<ReportResponseDto> GetCustomReport(DateTime from, DateTime to)
    {
        var items = await GetItemsInRange(from.Date, to.Date.AddDays(1));

        return new ReportResponseDto
        {
            Period = new ReportPeriodDto
            {
                Type = "custom",
                Label = $"{from:dd MMM yyyy} - {to:dd MMM yyyy}",
                From = from.Date,
                To = to.Date
            },
            Items = items,
            GrandTotal = items.Sum(i => i.TotalCost)
        };
    }

    private async Task<List<ReportItemDto>> GetItemsInRange(DateTime from, DateTime to)
    {
        var items = await _context.RationItems
            .Include(ri => ri.Product)
            .Include(ri => ri.Ration)
            .Where(ri => ri.Ration!.Date >= from && ri.Ration.Date < to)
            .ToListAsync();

        return items
            .GroupBy(ri => new { ri.ProductId, ri.Product!.Name, ri.Product.Unit })
            .Select(g => new ReportItemDto
            {
                ProductName = g.Key.Name,
                ProductUnit = g.Key.Unit,
                QuantityUsed = g.Sum(ri => ri.QuantityUsed),
                UnitCost = g.Average(ri => ri.UnitCostAtTime),
                TotalCost = g.Sum(ri => ri.TotalCost)
            })
            .OrderBy(r => r.ProductName)
            .ToList();
    }
}
