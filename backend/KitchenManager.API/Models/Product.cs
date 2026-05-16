using System.ComponentModel.DataAnnotations;

namespace KitchenManager.API.Models;

public class Product
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [Required, MaxLength(10)]
    public string Unit { get; set; } = "kg";

    public decimal CurrentStock { get; set; }

    public decimal UnitCost { get; set; }

    public decimal MinStockLevel { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
