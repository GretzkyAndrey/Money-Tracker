﻿using MoneyTracker.Business.Entities;

namespace MoneyTracker.Business.Interfaces
{
    public interface ITransactionRepository
    {
        List<Transaction> GetTransactions(DateTime? dateTimeTo = null);

        List<Transaction> GetTransactionsByTransactionId(Guid transactionId, DateTime? dateTimeTo = null);
    }
}
