using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.OpenApi.Models;

namespace API.Extensions
{
    public static class SwaggerServiceExtensions
    {
        public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
        {

            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(swagger =>
                {

                    swagger.SwaggerDoc("v1", new OpenApiInfo { Title = "The API", Version = "v1" });

                    var securitySchema = new OpenApiSecurityScheme
                    {
                        Description = "JWT Auth Bearer Scheme",
                        Name = "Authorisation",
                        In = ParameterLocation.Header,
                        Type = SecuritySchemeType.Http,
                        Scheme = "Bearer",
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    };
                    swagger.AddSecurityDefinition("Bearer", securitySchema);

                    var securityRequirement = new OpenApiSecurityRequirement
                    {
                        {
                            securitySchema, new [] {"Bearer"}
                        }
                    };

                    swagger.AddSecurityRequirement(securityRequirement);
                });
            return services;
        }

        public static IApplicationBuilder UseSwaggerDocumentation(this IApplicationBuilder app)
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1");
            });

            return app;
        }
    }
}