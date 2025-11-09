using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;

// https://learn.microsoft.com/en-us/aspnet/core/web-api/?view=aspnetcore-8.0#attribute-on-an-assembly
[assembly: ApiController]
var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

// Add services to the container.

builder.Services.AddControllers()
	.AddJsonOptions(x => x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase)));

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
	// https://github.com/domaindrivendev/Swashbuckle.AspNetCore/issues/1607#issuecomment-607170559
	options.CustomSchemaIds(type => type.ToString());

	// https://github.com/domaindrivendev/Swashbuckle.AspNetCore/issues/2343#issuecomment-1061233608
	options.DescribeAllParametersInCamelCase();

	// https://github.com/domaindrivendev/Swashbuckle.AspNetCore/issues/2036
	options.SupportNonNullableReferenceTypes();
	options.NonNullableReferenceTypesAsRequired();

	// https://github.com/kimbell/Kiota.Testing/blob/c52a2bf282eae50da36b221f263cd239f8f9dbf7/Bob.Kiota.Web/Program.cs#L15
	options.UseAllOfForInheritance();
	options.UseOneOfForPolymorphism();
	options.SelectDiscriminatorNameUsing(type =>
	{
		// see if the code has been annotated
		var attribute = type
			.GetCustomAttributes(true)
			.OfType<JsonPolymorphicAttribute>()
			.FirstOrDefault();

		// if nothing has been found, use default name. This is the same for both STJ and Newtonsoft
		return attribute?.TypeDiscriminatorPropertyName ?? "$type";
	});
	options.SelectDiscriminatorValueUsing(type =>
	{
		// figures out the value of the discriminator
		if (type.BaseType is null)
		{
			return null;
		}

		var attribute = type
			.BaseType
			.GetCustomAttributes(true)
			.OfType<JsonDerivedTypeAttribute>()
			.FirstOrDefault(x => x.DerivedType == type);

		return attribute?.TypeDiscriminator?.ToString();
	});
});

HydrangeanDiva.MediaPlayer.Module.ServiceExtensions.AddModule(builder);

var app = builder.Build();

app.MapDefaultEndpoints();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
