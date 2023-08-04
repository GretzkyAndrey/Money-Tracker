﻿using MoneyTracker.App.Helpers;
using System.ComponentModel.DataAnnotations;

namespace MoneyTracker.App.GraphQl.FinancialOperation.Types.Inputs
{
    public class DebitOperationInput
    {
        [Required(ErrorMessage = "Title is required")]
        public string? Title { get; set; }

        public string? Note { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }

        [GuidValidationAttribute(ErrorMessage = "CategoryId is invalid")]
        public string CategoryId { get; set; }

        [GuidValidationAttribute(ErrorMessage = "ToAccountId is invalid")]
        public string ToAccountId { get; set; }

        public DateTime? CreatedAt { get; set; }
    }
}
