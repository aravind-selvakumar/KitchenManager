using Microsoft.EntityFrameworkCore;
using KitchenManager.API.Models;

namespace KitchenManager.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Ration> Rations => Set<Ration>();
    public DbSet<RationItem> RationItems => Set<RationItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Username).IsUnique();
            e.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<Product>(e =>
        {
            e.HasIndex(p => p.Name).IsUnique();
        });

        modelBuilder.Entity<Ration>(e =>
        {
            e.HasMany(r => r.Items)
             .WithOne(ri => ri.Ration)
             .HasForeignKey(ri => ri.RationId)
             .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
