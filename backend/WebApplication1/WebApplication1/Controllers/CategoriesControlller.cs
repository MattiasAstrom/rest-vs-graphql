using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.DTOs;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly IDbContextFactory<ApiDbContext> _factory;

        public CategoriesController(IDbContextFactory<ApiDbContext> factory) => _factory = factory;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories([FromQuery] int multiplier = 1)
        {
            await using var context = _factory.CreateDbContext();

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

            return Ok(result);
        }
    }
}
