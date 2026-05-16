using Microsoft.EntityFrameworkCore;
using KitchenManager.API.Data;
using KitchenManager.API.DTOs;
using KitchenManager.API.Models;

namespace KitchenManager.API.Services;

public class RationService
{
    private readonly AppDbContext _context;

    public RationService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<RationResponseDto>> GetAll(DateTime? from = null, DateTime? to = null)
    {
        var query = _context.Rations
            .Include(r => r.CreatedBy)
            .Include(r => r.Items).ThenInclude(ri => ri.Product)
            .AsQueryable();

        if (from.HasValue)
            query = query.Where(r => r.Date >= from.Value.Date);
        if (to.HasValue)
            query = query.Where(r => r.Date <= to.Value.Date.AddDays(1));

        var rations = await query
            .OrderByDescending(r => r.Date)
            .ThenByDescending(r => r.CreatedAt)
            .ToListAsync();

        return rations.Select(MapToDto).ToList();
    }

    public async Task<RationResponseDto?> GetById(int id)
    {
        var ration = await _context.Rations
            .Include(r => r.CreatedBy)
            .Include(r => r.Items).ThenInclude(ri => ri.Product)
            .FirstOrDefaultAsync(r => r.Id == id);

        return ration == null ? null : MapToDto(ration);
    }

    public async Task<RationResponseDto?> Create(CreateRationDto dto, int userId)
    {
        var ration = new Ration
        {
            Date = dto.Date.Date,
            Notes = dto.Notes,
            CreatedByUserId = userId
        };

        _context.Rations.Add(ration);
        await _context.SaveChangesAsync();

        foreach (var itemDto in dto.Items)
        {
            var product = await _context.Products.FindAsync(itemDto.ProductId);
            if (product == null) continue;

            if (product.CurrentStock < itemDto.QuantityUsed) continue;

            var unitCost = product.UnitCost;
            var totalCost = itemDto.QuantityUsed * unitCost;

            var item = new RationItem
            {
                RationId = ration.Id,
                ProductId = itemDto.ProductId,
                QuantityUsed = itemDto.QuantityUsed,
                UnitCostAtTime = unitCost,
                TotalCost = totalCost
            };
            _context.RationItems.Add(item);

            product.CurrentStock -= itemDto.QuantityUsed;
            product.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return await GetById(ration.Id);
    }

    public async Task<bool> Delete(int id)
    {
        var ration = await _context.Rations
            .Include(r => r.Items)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (ration == null) return false;

        foreach (var item in ration.Items)
        {
            var product = await _context.Products.FindAsync(item.ProductId);
            if (product != null)
            {
                product.CurrentStock += item.QuantityUsed;
                product.UpdatedAt = DateTime.UtcNow;
            }
        }

        _context.Rations.Remove(ration);
        await _context.SaveChangesAsync();
        return true;
    }

    private static RationResponseDto MapToDto(Ration r)
    {
        return new RationResponseDto
        {
            Id = r.Id,
            Date = r.Date,
            Notes = r.Notes,
            CreatedByUsername = r.CreatedBy?.Username ?? "Unknown",
            CreatedAt = r.CreatedAt,
            TotalCost = r.Items.Sum(i => i.TotalCost),
            Items = r.Items.Select(i => new RationItemResponseDto
            {
                Id = i.Id,
                ProductId = i.ProductId,
                ProductName = i.Product?.Name ?? "Unknown",
                ProductUnit = i.Product?.Unit ?? "",
                QuantityUsed = i.QuantityUsed,
                UnitCostAtTime = i.UnitCostAtTime,
                TotalCost = i.TotalCost
            }).ToList()
        };
    }
}
