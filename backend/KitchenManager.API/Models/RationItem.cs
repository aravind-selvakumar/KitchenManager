using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KitchenManager.API.Models;

public class RationItem
{
    public int Id { get; set; }

    public int RationId { get; set; }

    [ForeignKey(nameof(RationId))]
    public Ration? Ration { get; set; }

    public int ProductId { get; set; }

    [ForeignKey(nameof(ProductId))]
    public Product? Product { get; set; }

    public decimal QuantityUsed { get; set; }

    public decimal UnitCostAtTime { get; set; }

    public decimal TotalCost { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
