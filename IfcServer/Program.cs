namespace IfcServer
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            // Configure CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("IfcServerCorsPolicy", policy =>
                {
                    var corsConfig = builder.Configuration.GetSection("Cors");
                    var allowedOrigins = corsConfig.GetSection("AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
                    var allowedMethods = corsConfig.GetSection("AllowedMethods").Get<string[]>() ?? new[] { "GET", "POST", "PUT", "DELETE", "OPTIONS" };
                    var allowedHeaders = corsConfig.GetSection("AllowedHeaders").Get<string[]>() ?? new[] { "Content-Type", "Authorization" };
                    var allowCredentials = corsConfig.GetValue<bool>("AllowCredentials");

                    if (allowedOrigins.Length > 0)
                    {
                        policy.WithOrigins(allowedOrigins);
                    }
                    else
                    {
                        // Fallback to allow any origin in development
                        if (builder.Environment.IsDevelopment())
                        {
                            policy.AllowAnyOrigin();
                        }
                    }

                    policy.WithMethods(allowedMethods)
                          .WithHeaders(allowedHeaders);

                    if (allowCredentials && !policy.Build().Origins.Contains("*"))
                    {
                        policy.AllowCredentials();
                    }
                });
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseHttpsRedirection();

            // Use CORS - Must be before UseAuthorization
            app.UseCors("IfcServerCorsPolicy");

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
