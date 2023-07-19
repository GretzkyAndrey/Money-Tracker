﻿using GraphQL.Types;

namespace MoneyTracker.App.GraphQl.Budget.Types
{
    public class BudgetType : ObjectGraphType<Business.Entities.Budget>
    {
        public BudgetType()
        {
            Field(x => x.Id);
            Field(x => x.Limit);
            Field(x => x.IsActive);
            Field(x => x.CategoryId);
            Field(x => x.EndDate, nullable: true);
            Field(x => x.StartDate, nullable: true);
        }
    }
}
