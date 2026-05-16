using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.DTOs;

namespace WebApplication1
{
    public class Query
    {
        [UseFiltering]
        [UseSorting]
        public async Task<List<ProductDto>> GetProducts(int multiplier,[Service] IDbContextFactory<ApiDbContext> factory)
        {
            await using var context = factory.CreateDbContext();

            var baseProducts = await context.Products
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

            var result = new List<ProductDto>();

            for (int i = 0; i < multiplier; i++)
            {
                result.AddRange(baseProducts);
            }

            return result;
        }

        [UseFiltering]
        [UseSorting]
        public async Task<List<CategoryDto>> GetCategories(int multiplier, [Service] IDbContextFactory<ApiDbContext> factory)
        {
            await using var context = factory.CreateDbContext();

            var baseCategories = await context.Categories
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

            var result = new List<CategoryDto>();

            for (int i = 0; i < multiplier; i++)
            {
                result.AddRange(baseCategories);
            }

            return result;
        }
    }
}