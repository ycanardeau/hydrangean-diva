using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

namespace HydrangeanDiva.EntityFrameworkCore.Shared.Extensions;

// https://stackoverflow.com/a/55514664
public static class ModelBuilderExtension
{
	public static void ApplyGlobalFilters<TInterface>(this ModelBuilder modelBuilder, Expression<Func<TInterface, bool>> expression)
	{
		var entities = modelBuilder.Model
			.GetEntityTypes()
			.Where(x => x.ClrType.GetInterface(typeof(TInterface).Name) is not null && x.BaseType is null)
			.Select(x => x.ClrType);

		foreach (var entity in entities)
		{
			var newParam = Expression.Parameter(entity);
			var newBody = ReplacingExpressionVisitor.Replace(expression.Parameters.Single(), newParam, expression.Body);
			modelBuilder.Entity(entity).HasQueryFilter(Expression.Lambda(newBody, newParam));
		}
	}
}
