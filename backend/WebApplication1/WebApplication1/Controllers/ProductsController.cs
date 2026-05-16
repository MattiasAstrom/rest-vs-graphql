using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.DTOs;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IDbContextFactory<ApiDbContext> _factory;

        public ProductsController(IDbContextFactory<ApiDbContext> factory) => _factory = factory;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts([FromQuery] int multiplier = 1)
        {
            await using var context = _factory.CreateDbContext();

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

            return Ok(result);
        }
    }

}