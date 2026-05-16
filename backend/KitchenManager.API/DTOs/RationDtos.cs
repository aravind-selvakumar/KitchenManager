using System.ComponentModel.DataAnnotations;

namespace KitchenManager.API.DTOs;

public class CreateRationDto
{
    public DateTime Date { get; set; } = DateTime.UtcNow;

    [MaxLength(500)]
    public string? Notes { get; set; }

    [Required, MinLength(1)]
    public List<CreateRationItemDto> Items { get; set; } = new();
}

public class CreateRationItemDto
{
    public int ProductId { get; set; }

    [Range(0.01, double.MaxValue)]
    public decimal QuantityUsed { get; set; }
}

public class RationResponseDto
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public string? Notes { get; set; }
    public string CreatedByUsername { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public decimal TotalCost { get; set; }
    public List<RationItemResponseDto> Items { get; set; } = new();
}

public class RationItemResponseDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ProductUnit { get; set; } = string.Empty;
    public decimal QuantityUsed { get; set; }
    public decimal UnitCostAtTime { get; set; }
    public decimal TotalCost { get; set; }
}
