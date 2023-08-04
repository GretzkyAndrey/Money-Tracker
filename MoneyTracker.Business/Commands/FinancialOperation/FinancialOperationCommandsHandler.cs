﻿using MoneyTracker.Business.Events;
using MoneyTracker.Business.Events.FinancialOperation;
using MoneyTracker.Business.Interfaces;

namespace MoneyTracker.Business.Commands.FinancialOperation
{
    public class AddDebitOperationCommandHandler : ICommandHandler<AddDebitOperationCommand>
    {
        private readonly IEventStore eventStore;
        private readonly IAccountRepository accountRepository;

        public AddDebitOperationCommandHandler(IEventStore eventStore, IAccountRepository accountRepository)
        {
            this.eventStore = eventStore;
            this.accountRepository = accountRepository;
        }

        public bool Handle(AddDebitOperationCommand command)
        {
            var transactionId = Guid.NewGuid();

            var usersDebitAccount = accountRepository.GetUserAccounts(command.UserId, Entities.AccountType.Debit).FirstOrDefault();

            var currentTime = DateTime.UtcNow;

            var debitTransactionEvent = new DebitTransactionAddedEvent
            (
                OperationId: transactionId,
                UserId: command.UserId,
                CategoryId: command.CategoryId,
                CreatedAt: command.CreatedAt ?? currentTime,
                AccountId: command.ToAccountId,
                Title: command.Title,
                Note: command.Note,
                Amount : command.Amount
            );

            var creditTransactionEvent = new CreditTransactionAddedEvent
            (
                OperationId: transactionId,
                UserId: command.UserId,
                CategoryId: command.CategoryId,
                CreatedAt: command.CreatedAt ?? currentTime,
                AccountId: usersDebitAccount.Id,
                Title: command.Title,
                Note: command.Note,
                Amount: command.Amount
            );

            eventStore.AppendEvent(debitTransactionEvent); //TODO: implement simultaneous event append with sql transactions
            eventStore.AppendEvent(creditTransactionEvent);

            return true;
        }
    }

    public class AddCreditOperationCommandHandler : ICommandHandler<AddCreditOperationCommand>
    {
        private readonly IEventStore eventStore;
        private readonly IAccountRepository accountRepository;

        public AddCreditOperationCommandHandler(IEventStore eventStore, IAccountRepository accountRepository)
        {
            this.eventStore = eventStore;
            this.accountRepository = accountRepository;
        }

        public bool Handle(AddCreditOperationCommand command)
        {
            var transactionId = Guid.NewGuid();

            var usersCreditAccount = accountRepository.GetUserAccounts(command.UserId, Entities.AccountType.Credit).FirstOrDefault();

            var currentTime = DateTime.UtcNow;

            var debitTransactionEvent = new DebitTransactionAddedEvent
            (
                OperationId: transactionId,
                UserId: command.UserId,
                CategoryId: command.CategoryId,
                AccountId: usersCreditAccount.Id,
                CreatedAt: command.CreatedAt ?? currentTime,
                Title: command.Title,
                Note: command.Note,
                Amount: command.Amount
            );

            var creditTransactionEvent = new CreditTransactionAddedEvent
            (
                OperationId: transactionId,
                UserId: command.UserId,
                CategoryId: command.CategoryId,
                CreatedAt: command.CreatedAt ?? currentTime,
                AccountId: command.FromAccountId,
                Title: command.Title,
                Note: command.Note,
                Amount: command.Amount
            );

            eventStore.AppendEvent(debitTransactionEvent); //TODO: implement simultaneous event append with sql transactions
            eventStore.AppendEvent(creditTransactionEvent);

            return true;
        }
    }

    public class AddTransferOperationCommandHandler : ICommandHandler<AddTransferOperationCommand>
    {
        private readonly IEventStore eventStore;

        public AddTransferOperationCommandHandler(IEventStore eventStore)
        {
            this.eventStore = eventStore;
        }

        public bool Handle(AddTransferOperationCommand command)
        {
            var transactionId = Guid.NewGuid();

            var currentTime = DateTime.UtcNow;

            var debitTransactionEvent = new DebitTransactionAddedEvent
            (
                OperationId: transactionId,
                UserId: command.UserId,
                CategoryId: command.CategoryId,
                CreatedAt: command.CreatedAt ?? currentTime,
                AccountId: command.ToAccountId,
                Title: command.Title,
                Note: command.Note,
                Amount: command.Amount
            );

            var creditTransactionEvent = new CreditTransactionAddedEvent
            (
                OperationId: transactionId,
                UserId: command.UserId,
                CategoryId: command.CategoryId,
                CreatedAt: command.CreatedAt ?? currentTime,
                AccountId: command.FromAccountId,
                Title: command.Title,
                Note: command.Note,
                Amount: command.Amount
            );

            eventStore.AppendEvent(debitTransactionEvent); //TODO: implement simultaneous event append with sql transactions
            eventStore.AppendEvent(creditTransactionEvent);

            return true;
        }
    }

    public class CancelFinancialOperationCommandHandler : ICommandHandler<CancelFinancialOperationCommand>
    {
        private readonly IEventStore eventStore;
        private readonly ITransactionRepository transactionRepository;


        public CancelFinancialOperationCommandHandler(IEventStore eventStore, ITransactionRepository transactionRepository)
        {
            this.eventStore = eventStore;
            this.transactionRepository = transactionRepository;
        }

        public bool Handle(CancelFinancialOperationCommand command)
        {
            var transactions = transactionRepository.GetTransactionsByOperationId(command.TransactionId);
            if (transactions.Count < 2)
            {
                return false;
            }

            var cancelEvent = new FinancialOperationCanceledEvent
            (
                OperationId: command.TransactionId
            );

            eventStore.AppendEvent(cancelEvent);

            return true;
        }
    }

    public class UpdateFinancialOperationCommandHandler : ICommandHandler<UpdateFinancialOperationCommand>
    {
        private readonly IEventStore eventStore;
        private readonly ITransactionRepository transactionRepository;


        public UpdateFinancialOperationCommandHandler(IEventStore eventStore, ITransactionRepository transactionRepository)
        {
            this.eventStore = eventStore;
            this.transactionRepository = transactionRepository;
        }

        public bool Handle(UpdateFinancialOperationCommand command)
        {
            var existingTransaction = transactionRepository.GetTransactionsByOperationId(command.OperationId)[0];

            var eventsToAppend = new List<Event>();

            if (Math.Abs(command.Amount) != Math.Abs(existingTransaction.Amount))
            {
                eventsToAppend.Add(new FinancialOperationAmountUpdatedEvent(command.OperationId, command.Amount));
            }

            if (command.Title != existingTransaction.Title)
            {
                eventsToAppend.Add(new FinancialOperationTitleUpdatedEvent(command.OperationId, command.Title));
            }

            if (command.CategoryId != existingTransaction.CategoryId)
            {
                eventsToAppend.Add(new FinancialOperationCategoryIdUpdatedEvent(command.OperationId, command.CategoryId));
            }

            if (command.Note != existingTransaction.Note)
            {
                eventsToAppend.Add(new FinancialOperationNoteUpdatedEvent(command.OperationId, command.Note));
            }

            if (command.CreatedAt != existingTransaction.CreatedAt)
            {
                eventsToAppend.Add(new FinancialOperationCreatedAtUpdatedEvent(command.OperationId, command.CreatedAt));
            }

            foreach (var @event in eventsToAppend)
            {
                eventStore.AppendEvent(@event);
            }

            return true;
        }
    }
}
