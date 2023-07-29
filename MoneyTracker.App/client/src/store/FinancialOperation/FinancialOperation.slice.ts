import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "../../types/Transaction";

interface Operation {
  amount: number;
  categoryId: any;
  title: string;
}

interface DebitOperation extends Operation {
  toAccountId: string;
}

interface CreditOperation extends Operation {
  fromAccountId: string;
}

interface TransferOperation extends Operation {
  fromAccountId: string;
  toAccountId: string;
}

interface FetchTransactionsInfoResponse {
  transactions: Transaction[];
  incomes: number;
  expenses: number;
}

export interface FetchTransactionsInfoVariables {
  accountId: string | null;
  fromDate: string | null;
  toDate: string | null;
}

export interface CreateTransactionState {
  loading: boolean;
  cancelLoading: boolean;
  error: string | null;
  transactions: Transaction[];
  countOfElements: number;
  incomes: number;
  expenses: number;
  dateRange: { fromDate: string | null; toDate: string | null };
}

const initialState: CreateTransactionState = {
  cancelLoading: false,
  loading: false,
  transactions: [],
  countOfElements: 10,
  incomes: 0,
  expenses: 0,
  error: null,
  dateRange: { fromDate: null, toDate: null },
};

export const FinancialOperationSlice = createSlice({
  name: "FinancialOperations",
  initialState: initialState,
  reducers: {
    FETCH_TRANSACTIONS_INFO(
      state,
    ) {
      state.loading = true;
      state.error = null;
      state.transactions = [];
      state.countOfElements = 0;
    },
    FETCH_TRANSACTIONS_INFO_SUCCESS(
      state,
      action: PayloadAction<FetchTransactionsInfoResponse>
    ) {
      state.loading = false;
      state.error = null;
      state.transactions = action.payload.transactions.slice().reverse();
      state.incomes = action.payload.incomes;
      state.expenses = action.payload.expenses;
    },
    FETCH_TRANSACTIONS_INFO_ERROR(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.transactions = [];
    },
    ADD_DEBIT_OPERATION(state, action: PayloadAction<DebitOperation>) {
      state.loading = true;
      state.error = null;
    },
    ADD_CREDIT_OPERATION(state, action: PayloadAction<CreditOperation>) {
      state.loading = true;
      state.error = null;
    },
    ADD_TRANSFER_OPERATION(state, action: PayloadAction<TransferOperation>) {
      state.loading = true;
      state.error = null;
    },
    ADD_FINANCIAL_OPERATION_SUCCESS(
      state,
      action: PayloadAction<{ addTransactionSuccess: boolean }>
    ) {
      state.loading = false;
      state.error = null;
    },
    ADD_FINANCIAL_OPERATION_ERROR(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    CANCEL_FINANCIAL_OPERATION(
      state,
      action: PayloadAction<{ operationId: string }>
    ) {
      state.loading = true;
      state.error = null;
    },
    CANCEL_FINANCIAL_OPERATION_SUCCESS(
      state,
      action: PayloadAction<{ cancelTransactionSuccess: boolean }>
    ) {
      state.loading = false;
      state.error = null;
    },
    CANCEL_FINANCIAL_OPERATION_ERROR(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    SET_DATE_RANGE(
      state,
      action: PayloadAction<{ fromDate: string | null; toDate: string | null }>
    ) {
      state.dateRange = action.payload;
    },
  },
});

export const {
  FETCH_TRANSACTIONS_INFO,
  FETCH_TRANSACTIONS_INFO_ERROR,
  FETCH_TRANSACTIONS_INFO_SUCCESS,
  ADD_CREDIT_OPERATION,
  ADD_DEBIT_OPERATION,
  ADD_TRANSFER_OPERATION,
  ADD_FINANCIAL_OPERATION_ERROR,
  ADD_FINANCIAL_OPERATION_SUCCESS,
  CANCEL_FINANCIAL_OPERATION,
  CANCEL_FINANCIAL_OPERATION_ERROR,
  CANCEL_FINANCIAL_OPERATION_SUCCESS,
  SET_DATE_RANGE,
} = FinancialOperationSlice.actions;

export default FinancialOperationSlice.reducer;
