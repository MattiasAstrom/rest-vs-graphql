using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using WebApplication1.Data;

namespace WebApplication1
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Pooled DbContextFactory
            builder.Services.AddPooledDbContextFactory<ApiDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("MyAllowSpecificOrigins", policy =>
                    policy.WithOrigins("http://localhost:5173")
                          .AllowAnyHeader()
                          .AllowAnyMethod());
            });

            // GraphQL
            builder.Services
                .AddGraphQLServer()
                .AddQueryType<Query>()
                .AddProjections()
                .AddFiltering()
                .AddSorting();

            // Controllers
            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                    options.JsonSerializerOptions.WriteIndented = true;
                });

            var app = builder.Build();

            // Ensure DB
            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<ApiDbContext>();
                db.Database.EnsureCreated();
            }

            app.UseCors("MyAllowSpecificOrigins");

            app.UseHttpsRedirection();
            app.UseAuthorization();

            app.MapControllers();
            app.MapGraphQL("/graphql");

            app.Run();
        }
    }
}
