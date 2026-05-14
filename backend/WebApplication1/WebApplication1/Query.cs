using HotChocolate;
using HotChocolate.Data;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.DTOs;
using WebApplication1.Models;

namespace WebApplication1
{
    public class Query
    {
        [UseFiltering]
        [UseSorting]
        public async Task<List<ProductDto>> GetProducts([Service] IDbContextFactory<ApiDbContext> factory)
        {
            await using var context = factory.CreateDbContext();

            return await context.Products
                .Include(p => p.Category)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    Category = new CategoryDto
                    {
                        Id = p.Category.Id,
                        Name = p.Category.Name
                    }
                })
                .ToListAsync();
        }

        [UseFiltering]
        [UseSorting]
        public async Task<List<CategoryDto>> GetCategories([Service] IDbContextFactory<ApiDbContext> factory)
        {
            await using var context = factory.CreateDbContext();

            return await context.Categories
                .Include(c => c.Products)
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Products = c.Products.Select(p => new ProductDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Price = p.Price
                    }).ToList()
                })
                .ToListAsync();
        }
    }
}