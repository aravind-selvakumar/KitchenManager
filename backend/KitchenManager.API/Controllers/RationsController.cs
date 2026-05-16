using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using KitchenManager.API.DTOs;
using KitchenManager.API.Services;

namespace KitchenManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RationsController : ControllerBase
{
    private readonly RationService _rationService;

    public RationsController(RationService rationService)
    {
        _rationService = rationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] DateTime? from, [FromQuery] DateTime? to)
    {
        var rations = await _rationService.GetAll(from, to);
        return Ok(rations);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var ration = await _rationService.GetById(id);
        if (ration == null) return NotFound();
        return Ok(ration);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateRationDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var ration = await _rationService.Create(dto, userId);
        if (ration == null)
            return BadRequest(new { message = "Insufficient stock for one or more items" });

        return CreatedAtAction(nameof(GetById), new { id = ration.Id }, ration);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _rationService.Delete(id);
        if (!result) return NotFound();
        return NoContent();
    }
}
