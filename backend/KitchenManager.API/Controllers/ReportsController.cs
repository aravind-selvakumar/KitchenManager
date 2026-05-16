using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using KitchenManager.API.Services;

namespace KitchenManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly ReportService _reportService;

    public ReportsController(ReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("daily")]
    public async Task<IActionResult> GetDaily([FromQuery] DateTime date)
    {
        var report = await _reportService.GetDailyReport(date);
        return Ok(report);
    }

    [HttpGet("monthly")]
    public async Task<IActionResult> GetMonthly([FromQuery] int year, [FromQuery] int month)
    {
        var report = await _reportService.GetMonthlyReport(year, month);
        return Ok(report);
    }

    [HttpGet("custom")]
    public async Task<IActionResult> GetCustom([FromQuery] DateTime from, [FromQuery] DateTime to)
    {
        var report = await _reportService.GetCustomReport(from, to);
        return Ok(report);
    }
}
