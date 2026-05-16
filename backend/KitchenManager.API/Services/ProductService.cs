using Microsoft.EntityFrameworkCore;
using KitchenManager.API.Data;
using KitchenManager.API.DTOs;
using KitchenManager.API.Models;

namespace KitchenManager.API.Services;

public class ProductService
{
    private readonly AppDbContext _context;

    public ProductService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProductResponseDto>> GetAll()
    {
        return await _context.Products
            .OrderBy(p => p.Name)
            .Select(p => new ProductResponseDto
            {
                Id = p.Id,
                Name = p.Name,
                Category = p.Category,
                Unit = p.Unit,
                CurrentStock = p.CurrentStock,
                UnitCost = p.UnitCost,
                MinStockLevel = p.MinStockLevel,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                IsLowStock = p.CurrentStock <= p.MinStockLevel
            })
            .ToListAsync();
    }

    public async Task<ProductResponseDto?> GetById(int id)
    {
        var p = await _context.Products.FindAsync(id);
        if (p == null) return null;

        return new ProductResponseDto
        {
            Id = p.Id,
            Name = p.Name,
            Category = p.Category,
            Unit = p.Unit,
            CurrentStock = p.CurrentStock,
            UnitCost = p.UnitCost,
            MinStockLevel = p.MinStockLevel,
            CreatedAt = p.CreatedAt,
            UpdatedAt = p.UpdatedAt,
            IsLowStock = p.CurrentStock <= p.MinStockLevel
        };
    }

    public async Task<ProductResponseDto> Create(CreateProductDto dto)
    {
        var product = new Product
        {
            Name = dto.Name,
            Category = dto.Category,
            Unit = dto.Unit,
            CurrentStock = dto.CurrentStock,
            UnitCost = dto.UnitCost,
            MinStockLevel = dto.MinStockLevel
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return new ProductResponseDto
        {
            Id = product.Id,
            Name = product.Name,
            Category = product.Category,
            Unit = product.Unit,
            CurrentStock = product.CurrentStock,
            UnitCost = product.UnitCost,
            MinStockLevel = product.MinStockLevel,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt,
            IsLowStock = product.CurrentStock <= product.MinStockLevel
        };
    }

    public async Task<ProductResponseDto?> Update(int id, UpdateProductDto dto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return null;

        product.Name = dto.Name;
        product.Category = dto.Category;
        product.Unit = dto.Unit;
        product.CurrentStock = dto.CurrentStock;
        product.UnitCost = dto.UnitCost;
        product.MinStockLevel = dto.MinStockLevel;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new ProductResponseDto
        {
            Id = product.Id,
            Name = product.Name,
            Category = product.Category,
            Unit = product.Unit,
            CurrentStock = product.CurrentStock,
            UnitCost = product.UnitCost,
            MinStockLevel = product.MinStockLevel,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt,
            IsLowStock = product.CurrentStock <= product.MinStockLevel
        };
    }

    public async Task<bool> Delete(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return false;

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<ProductResponseDto>> GetLowStock()
    {
        return await _context.Products
            .Where(p => p.CurrentStock <= p.MinStockLevel)
            .OrderBy(p => p.Name)
            .Select(p => new ProductResponseDto
            {
                Id = p.Id,
                Name = p.Name,
                Category = p.Category,
                Unit = p.Unit,
                CurrentStock = p.CurrentStock,
                UnitCost = p.UnitCost,
                MinStockLevel = p.MinStockLevel,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                IsLowStock = true
            })
            .ToListAsync();
    }
}
