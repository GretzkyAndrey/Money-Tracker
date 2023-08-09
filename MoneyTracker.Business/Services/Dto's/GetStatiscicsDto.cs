﻿using MoneyTracker.Business.Entities;
using System.Collections.Generic;

namespace MoneyTracker.Business.Services.Dto_s
{
    public class GetStatiscicsDto
    {
        public string CategoryName { get; set; }
        public Guid CategoryId { get; set; }
        public decimal Sum { get; set; }
        public decimal Percentage { get; set; }

        public string Color { get; set; }

    }
}
