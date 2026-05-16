using System.ComponentModel.DataAnnotations;

namespace KitchenManager.API.DTOs;

public class CreateProductDto
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [Required, MaxLength(10)]
    public string Unit { get; set; } = "kg";

    [Range(0, double.MaxValue)]
    public decimal CurrentStock { get; set; }

    [Range(0, double.MaxValue)]
    public decimal UnitCost { get; set; }

    [Range(0, double.MaxValue)]
    public decimal MinStockLevel { get; set; }
}

public class UpdateProductDto
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [Required, MaxLength(10)]
    public string Unit { get; set; } = "kg";

    [Range(0, double.MaxValue)]
    public decimal CurrentStock { get; set; }

    [Range(0, double.MaxValue)]
    public decimal UnitCost { get; set; }

    [Range(0, double.MaxValue)]
    public decimal MinStockLevel { get; set; }
}

public class ProductResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public decimal CurrentStock { get; set; }
    public decimal UnitCost { get; set; }
    public decimal MinStockLevel { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsLowStock { get; set; }
}
