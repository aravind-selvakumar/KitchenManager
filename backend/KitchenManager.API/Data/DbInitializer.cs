using Microsoft.EntityFrameworkCore;
using KitchenManager.API.Models;

namespace KitchenManager.API.Data;

public static class DbInitializer
{
    public static void Seed(AppDbContext context)
    {
        context.Database.Migrate();

        if (context.Users.Any()) return;

        var users = new List<User>
        {
            new()
            {
                Username = "admin",
                Email = "admin@kitchen.local",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
                Role = "Admin",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Username = "user1",
                Email = "user1@kitchen.local",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
                Role = "User",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Username = "user2",
                Email = "user2@kitchen.local",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
                Role = "User",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }
        };
        context.Users.AddRange(users);
        context.SaveChanges();

        var products = new List<Product>
        {
            new() { Name = "Rice", Category = "Grains", Unit = "kg", CurrentStock = 50, UnitCost = 45, MinStockLevel = 10, CreatedAt = DateTime.UtcNow },
            new() { Name = "Wheat Flour", Category = "Grains", Unit = "kg", CurrentStock = 30, UnitCost = 35, MinStockLevel = 8, CreatedAt = DateTime.UtcNow },
            new() { Name = "Cooking Oil", Category = "Oil", Unit = "L", CurrentStock = 10, UnitCost = 180, MinStockLevel = 3, CreatedAt = DateTime.UtcNow },
            new() { Name = "Sugar", Category = "Spices", Unit = "kg", CurrentStock = 15, UnitCost = 42, MinStockLevel = 5, CreatedAt = DateTime.UtcNow },
            new() { Name = "Salt", Category = "Spices", Unit = "kg", CurrentStock = 5, UnitCost = 20, MinStockLevel = 2, CreatedAt = DateTime.UtcNow },
            new() { Name = "Turmeric Powder", Category = "Spices", Unit = "g", CurrentStock = 2000, UnitCost = 0.40m, MinStockLevel = 500, CreatedAt = DateTime.UtcNow },
            new() { Name = "Chili Powder", Category = "Spices", Unit = "g", CurrentStock = 3000, UnitCost = 0.60m, MinStockLevel = 500, CreatedAt = DateTime.UtcNow },
            new() { Name = "Cumin Seeds", Category = "Spices", Unit = "g", CurrentStock = 1000, UnitCost = 0.80m, MinStockLevel = 200, CreatedAt = DateTime.UtcNow },
            new() { Name = "Milk", Category = "Dairy", Unit = "L", CurrentStock = 20, UnitCost = 56, MinStockLevel = 5, CreatedAt = DateTime.UtcNow },
            new() { Name = "Butter", Category = "Dairy", Unit = "g", CurrentStock = 2000, UnitCost = 0.05m, MinStockLevel = 500, CreatedAt = DateTime.UtcNow }
        };
        context.Products.AddRange(products);
        context.SaveChanges();

        var adminUser = context.Users.First(u => u.Username == "admin");

        var ration1 = new Ration
        {
            Date = DateTime.UtcNow.AddDays(-2),
            Notes = "Standard daily usage",
            CreatedByUserId = adminUser.Id,
            CreatedAt = DateTime.UtcNow
        };
        context.Rations.Add(ration1);
        context.SaveChanges();

        context.RationItems.AddRange(new List<RationItem>
        {
            new() { RationId = ration1.Id, ProductId = products[0].Id, QuantityUsed = 5, UnitCostAtTime = 45, TotalCost = 5 * 45 },
            new() { RationId = ration1.Id, ProductId = products[1].Id, QuantityUsed = 3, UnitCostAtTime = 35, TotalCost = 3 * 35 },
            new() { RationId = ration1.Id, ProductId = products[2].Id, QuantityUsed = 1, UnitCostAtTime = 180, TotalCost = 1 * 180 },
            new() { RationId = ration1.Id, ProductId = products[8].Id, QuantityUsed = 2, UnitCostAtTime = 56, TotalCost = 2 * 56 }
        });
        context.SaveChanges();

        var rice = context.Products.First(p => p.Name == "Rice");
        rice.CurrentStock -= 5;
        var flour = context.Products.First(p => p.Name == "Wheat Flour");
        flour.CurrentStock -= 3;
        var oil = context.Products.First(p => p.Name == "Cooking Oil");
        oil.CurrentStock -= 1;
        var milk = context.Products.First(p => p.Name == "Milk");
        milk.CurrentStock -= 2;

        var ration2 = new Ration
        {
            Date = DateTime.UtcNow.AddDays(-1),
            Notes = "Special menu preparation",
            CreatedByUserId = adminUser.Id,
            CreatedAt = DateTime.UtcNow
        };
        context.Rations.Add(ration2);
        context.SaveChanges();

        context.RationItems.AddRange(new List<RationItem>
        {
            new() { RationId = ration2.Id, ProductId = products[3].Id, QuantityUsed = 2, UnitCostAtTime = 42, TotalCost = 2 * 42 },
            new() { RationId = ration2.Id, ProductId = products[5].Id, QuantityUsed = 50, UnitCostAtTime = 0.40m, TotalCost = 50 * 0.40m },
            new() { RationId = ration2.Id, ProductId = products[6].Id, QuantityUsed = 30, UnitCostAtTime = 0.60m, TotalCost = 30 * 0.60m },
            new() { RationId = ration2.Id, ProductId = products[9].Id, QuantityUsed = 200, UnitCostAtTime = 0.05m, TotalCost = 200 * 0.05m }
        });
        context.SaveChanges();

        var sugar = context.Products.First(p => p.Name == "Sugar");
        sugar.CurrentStock -= 2;
        var turmeric = context.Products.First(p => p.Name == "Turmeric Powder");
        turmeric.CurrentStock -= 50;
        var chili = context.Products.First(p => p.Name == "Chili Powder");
        chili.CurrentStock -= 30;
        var butter = context.Products.First(p => p.Name == "Butter");
        butter.CurrentStock -= 200;

        context.SaveChanges();
    }
}
