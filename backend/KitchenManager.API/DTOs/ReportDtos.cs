namespace KitchenManager.API.DTOs;

public class ReportRequestDto
{
    public DateTime? Date { get; set; }
    public int? Year { get; set; }
    public int? Month { get; set; }
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
}

public class ReportResponseDto
{
    public ReportPeriodDto Period { get; set; } = new();
    public List<ReportItemDto> Items { get; set; } = new();
    public decimal GrandTotal { get; set; }
}

public class ReportPeriodDto
{
    public string Type { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public DateTime From { get; set; }
    public DateTime To { get; set; }
}

public class ReportItemDto
{
    public string ProductName { get; set; } = string.Empty;
    public string ProductUnit { get; set; } = string.Empty;
    public decimal QuantityUsed { get; set; }
    public decimal UnitCost { get; set; }
    public decimal TotalCost { get; set; }
}
